import { Router, type IRouter } from "express";
import {
  generateText,
  extractTextFromImage,
  extractTextFromPdf,
} from "@workspace/integrations-openai-ai-server";
import { textToSpeech, speechToText } from "@workspace/integrations-openai-ai-server/audio";
import { AnalyzeTextBody, AnalyzeTextResponse, ExtractTextFromImageBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/** Cap output so the model's JSON fits within the token limit (avoids truncated/invalid JSON). */
const MAX_WORDS = 60;
/** Cap input so a huge paste doesn't bloat the prompt; keeps the most relevant beginning. */
const MAX_INPUT_CHARS = 16000;

interface ExtractedWordRaw {
  word: string;
  translation: string;
  example: string;
  exampleTranslation?: string | null;
  difficulty: string;
  partOfSpeech: string;
  imageUrl?: string | null;
}

/**
 * Parse the model's JSON, salvaging complete word objects if the response was
 * truncated (large texts can cut the JSON mid-array → JSON.parse would throw).
 */
function parseWordsResponse(content: string): { lessonTitle?: string; words: ExtractedWordRaw[] } {
  try {
    return JSON.parse(content) as { lessonTitle?: string; words: ExtractedWordRaw[] };
  } catch {
    // Salvage: pull the lessonTitle and every fully-formed object in the words array.
    const titleMatch = content.match(/"lessonTitle"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const lessonTitle = titleMatch ? titleMatch[1] : undefined;
    const words: ExtractedWordRaw[] = [];
    const objectRegex = /\{[^{}]*"word"[^{}]*\}/g;
    let m: RegExpExecArray | null;
    while ((m = objectRegex.exec(content)) !== null) {
      try {
        words.push(JSON.parse(m[0]) as ExtractedWordRaw);
      } catch {
        // skip a malformed fragment
      }
    }
    return { lessonTitle, words };
  }
}

router.post("/ai/analyze-text", async (req, res): Promise<void> => {
  const existingWords: string[] = Array.isArray(req.body?.existingWords)
    ? req.body.existingWords.map((w: unknown) => String(w).toLowerCase())
    : [];

  const parsed = AnalyzeTextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { level, lessonTitle } = parsed.data;
  const text =
    parsed.data.text.length > MAX_INPUT_CHARS
      ? parsed.data.text.slice(0, MAX_INPUT_CHARS)
      : parsed.data.text;

  const existingWordsNote = existingWords.length > 0
    ? `\n\nIMPORTANT: These words ALREADY EXIST in the system — do NOT include them again: ${existingWords.join(", ")}.`
    : "";

  const systemPrompt = `You are an English vocabulary educator. Your task is to analyze English text and extract as many useful and educational vocabulary words as possible, suitable for ${level} level students.

For each word, provide:
1. The word in its base form
2. Arabic translation
3. An example sentence using the word
4. Arabic translation of that example sentence
5. Difficulty level (easy/medium/hard) based on ${level} student level
6. Part of speech (noun/verb/adjective/adverb/etc.)

QUANTITY RULES:
- Extract the most useful and educational vocabulary words — aim for about 20 words per 100 words of source text.
- IMPORTANT: Return AT MOST ${MAX_WORDS} words total. If the text is long, pick only the ${MAX_WORDS} most useful and varied vocabulary words.
- Do not be conservative within that limit. Include educational words: nouns, verbs, adjectives, adverbs, phrases.
- Only skip extremely basic words like: the, is, in, at, to, a, an, and, or, but, of, on, for, with, I, you, he, she, it, we, they.

DEDUPLICATION RULES:${existingWordsNote}
- Never include a word that is a duplicate of an excluded word (same root or obvious variant).${existingWords.length === 0 ? "" : "\n- You MUST skip all the listed existing words and find alternative vocabulary instead."}

Return ONLY a JSON object with the words array.`;

  const userPrompt = `Text: "${text}"

Lesson title suggestion: ${lessonTitle || "Auto-detect from text"}

Return JSON in this exact format:
{
  "lessonTitle": "suggested title for this lesson",
  "words": [
    {
      "word": "camel",
      "translation": "جمل",
      "example": "The camel lives in the desert.",
      "exampleTranslation": "يعيش الجمل في الصحراء.",
      "difficulty": "medium",
      "partOfSpeech": "noun",
      "imageUrl": null
    }
  ]
}`;

  try {
    const content = await generateText({
      systemPrompt,
      userPrompt,
      json: true,
      maxOutputTokens: 8192,
    });

    const parsed_result = parseWordsResponse(content);
    const normalizedWords = (parsed_result.words ?? [])
      .filter((w) => w && w.word && w.translation && w.example)
      .map((w) => {
        const diff = String(w.difficulty || "").toLowerCase();
        return {
          word: String(w.word).trim(),
          translation: String(w.translation).trim(),
          example: String(w.example).trim(),
          exampleTranslation: w.exampleTranslation ?? null,
          difficulty: (diff === "easy" || diff === "hard" ? diff : "medium") as
            | "easy"
            | "medium"
            | "hard",
          partOfSpeech: String(w.partOfSpeech || "word").trim(),
          imageUrl: null,
        };
      })
      .slice(0, MAX_WORDS);

    if (normalizedWords.length === 0) {
      logger.warn({ contentPreview: content.slice(0, 300) }, "[Analyze] no words parsed from model output");
      res.status(422).json({ error: "Could not extract words from this text." });
      return;
    }

    const validated = AnalyzeTextResponse.parse({
      lessonTitle: parsed_result.lessonTitle ?? lessonTitle ?? "New Lesson",
      words: normalizedWords,
    });
    res.json(validated);
  } catch (err) {
    logger.error({ err }, "[Analyze] text analysis failed");
    res.status(500).json({ error: "Failed to analyze text" });
  }
});

router.post("/ai/extract-text-from-image", async (req, res): Promise<void> => {
  const parsed = ExtractTextFromImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "imageBase64 and mimeType are required" });
    return;
  }

  const { imageBase64, mimeType } = parsed.data;

  const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (!supportedTypes.includes(mimeType)) {
    res.status(400).json({ error: `Unsupported file type: ${mimeType}` });
    return;
  }

  if (mimeType === "application/pdf") {
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = Buffer.from(imageBase64, "base64");
      if (pdfBuffer.length < 5 || pdfBuffer.slice(0, 5).toString() !== "%PDF-") {
        res.status(400).json({ error: "Invalid PDF file: not a valid PDF document" });
        return;
      }
    } catch {
      res.status(400).json({ error: "Invalid base64 encoding for PDF" });
      return;
    }

    try {
      const extractedText = await extractTextFromPdf(imageBase64);
      res.json({ text: extractedText });
    } catch {
      res.status(422).json({
        error: "Could not extract text from this PDF. The file may be corrupted, password-protected, or too large.",
      });
    }
    return;
  }

  const validMimeType = mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  try {
    const content = await extractTextFromImage(imageBase64, validMimeType);
    res.json({ text: content });
  } catch (err) {
    logger.warn({ err, mimeType }, "[OCR] image text extraction failed");
    res.status(422).json({ error: "Could not extract text from this image." });
  }
});

router.post("/ai/tts", async (req, res): Promise<void> => {
  const { word, example, plain } = req.body as {
    word?: string;
    example?: string;
    plain?: boolean;
  };
  if (!word) {
    res.status(400).json({ error: "word is required" });
    return;
  }
  // `plain` → speak the single word once (used as a clean pronunciation
  // reference for acoustic scoring). Otherwise repeat + optional example sentence.
  const textToSpeak = plain
    ? word
    : example
      ? `${word}... ${word}... ${example}`
      : `${word}... ${word}...`;
  const buffer = await textToSpeech(textToSpeak, "nova", "mp3");
  res.set("Content-Type", "audio/mpeg");
  res.send(buffer);
});

router.post("/ai/stt", async (req, res): Promise<void> => {
  const { audioBase64, mimeType } = req.body as {
    audioBase64?: string;
    mimeType?: string;
  };
  if (!audioBase64?.trim()) {
    res.status(400).json({ error: "audioBase64 is required" });
    return;
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(audioBase64, "base64");
  } catch {
    res.status(400).json({ error: "Invalid audioBase64" });
    return;
  }

  if (buffer.length < 200) {
    res.status(400).json({ error: "Recording too short" });
    return;
  }

  const format: "wav" | "mp3" | "webm" =
    mimeType?.includes("webm") ? "webm"
    : mimeType?.includes("mp3") || mimeType?.includes("mpeg") ? "mp3"
    : "wav";

  try {
    const text = await speechToText(buffer, format);
    res.json({ text });
  } catch (err: unknown) {
    console.error("[stt] transcription failed:", err);
    const e = err as { status?: number; message?: string };
    const msg = String(e?.message ?? "");
    if (e?.status === 429 || msg.includes("429") || /quota/i.test(msg)) {
      res.status(429).json({
        error: "quota_exceeded",
        message: "Gemini API quota exceeded. Wait a minute or use a different model.",
      });
      return;
    }
    if (
      e?.status === 401 ||
      e?.status === 403 ||
      /API key|API_KEY|invalid.*key/i.test(msg)
    ) {
      res.status(401).json({ error: "invalid_api_key" });
      return;
    }
    res.status(500).json({ error: "transcription_failed" });
  }
});

export default router;
