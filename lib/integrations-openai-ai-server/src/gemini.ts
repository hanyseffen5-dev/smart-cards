import {
  GoogleGenerativeAI,
  type GenerativeModel,
  type GenerationConfig,
} from "@google/generative-ai";

/** Override with GEMINI_MODEL in .env if needed (e.g. gemini-2.5-flash) */
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash-lite";

/** Model used for speech-to-text — needs audio input support and available quota */
export const GEMINI_STT_MODEL =
  process.env.GEMINI_STT_MODEL?.trim() || "gemini-2.5-flash";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY must be set. Get an API key at https://aistudio.google.com/apikey",
    );
  }
  return key;
}

let genAI: GoogleGenerativeAI | null = null;

export function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(getApiKey());
  }
  return genAI;
}

export function getGeminiModel(
  generationConfig?: GenerationConfig,
): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig,
  });
}

export function getSttGeminiModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({ model: GEMINI_STT_MODEL });
}

export async function generateText(options: {
  systemPrompt?: string;
  userPrompt: string;
  json?: boolean;
  maxOutputTokens?: number;
}): Promise<string> {
  const generationConfig: GenerationConfig = {
    maxOutputTokens: options.maxOutputTokens ?? 8192,
    ...(options.json ? { responseMimeType: "application/json" } : {}),
  };

  const model = getGeminiModel(generationConfig);
  const prompt = options.systemPrompt
    ? `${options.systemPrompt}\n\n---\n\n${options.userPrompt}`
    : options.userPrompt;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }
  return text;
}

export async function extractTextFromImage(
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent([
    {
      inlineData: { mimeType, data: imageBase64 },
    },
    {
      text: "Please extract ALL readable text from this image. Return only the extracted text exactly as it appears, preserving paragraphs and line breaks. Do not add commentary or descriptions.",
    },
  ]);
  return result.response.text().trim();
}

export async function extractTextFromPdf(pdfBase64: string): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent([
    {
      inlineData: { mimeType: "application/pdf", data: pdfBase64 },
    },
    {
      text: "Extract ALL readable text from this PDF document. Return only the extracted text, preserving paragraphs and line breaks. Do not add commentary or descriptions.",
    },
  ]);
  return result.response.text().trim();
}

export async function translateToArabic(englishText: string): Promise<string> {
  return generateText({
    systemPrompt:
      "You are an Arabic translator. Translate the given English sentence into natural, clear Arabic. Return ONLY the Arabic translation — no explanation, no extra text.",
    userPrompt: englishText,
    maxOutputTokens: 512,
  });
}
