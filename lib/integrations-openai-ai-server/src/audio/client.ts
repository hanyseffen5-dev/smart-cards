import { Buffer } from "node:buffer";
import { spawn } from "child_process";
import { writeFile, unlink, readFile } from "fs/promises";
import { randomUUID } from "crypto";
import { tmpdir } from "os";
import { join } from "path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { getSttGeminiModel } from "../gemini";

export type AudioFormat = "wav" | "mp3" | "webm" | "mp4" | "ogg" | "unknown";

const VOICE_MAP: Record<string, string> = {
  alloy: "en-US-GuyNeural",
  echo: "en-US-EricNeural",
  fable: "en-GB-RyanNeural",
  onyx: "en-US-DavisNeural",
  nova: "en-US-JennyNeural",
  shimmer: "en-US-AriaNeural",
};

export function detectAudioFormat(buffer: Buffer): AudioFormat {
  if (buffer.length < 12) return "unknown";

  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    return "wav";
  }
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return "webm";
  }
  if (
    (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xfa || buffer[1] === 0xf3)) ||
    (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33)
  ) {
    return "mp3";
  }
  if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    return "mp4";
  }
  if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
    return "ogg";
  }
  return "unknown";
}

export async function convertToWav(audioBuffer: Buffer): Promise<Buffer> {
  const inputPath = join(tmpdir(), `input-${randomUUID()}`);
  const outputPath = join(tmpdir(), `output-${randomUUID()}.wav`);

  try {
    await writeFile(inputPath, audioBuffer);

    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i",
        inputPath,
        "-vn",
        "-f",
        "wav",
        "-ar",
        "16000",
        "-ac",
        "1",
        "-acodec",
        "pcm_s16le",
        "-y",
        outputPath,
      ]);

      ffmpeg.stderr.on("data", () => {});
      ffmpeg.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });
      ffmpeg.on("error", reject);
    });

    return await readFile(outputPath);
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

export async function ensureCompatibleFormat(
  audioBuffer: Buffer,
): Promise<{ buffer: Buffer; format: "wav" | "mp3" }> {
  const detected = detectAudioFormat(audioBuffer);
  if (detected === "wav") return { buffer: audioBuffer, format: "wav" };
  if (detected === "mp3") return { buffer: audioBuffer, format: "mp3" };
  const wavBuffer = await convertToWav(audioBuffer);
  return { buffer: wavBuffer, format: "wav" };
}

async function streamToBuffer(
  stream: AsyncIterable<Buffer | Uint8Array | string>,
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function resolveEdgeVoice(
  voice: keyof typeof VOICE_MAP | string,
): string {
  return VOICE_MAP[voice] ?? voice;
}

/** Text-to-Speech via Microsoft Edge TTS (free, no API key). */
export async function textToSpeech(
  text: string,
  voice: keyof typeof VOICE_MAP | string = "nova",
  format: "wav" | "mp3" | "flac" | "opus" | "pcm16" = "mp3",
): Promise<Buffer> {
  if (format !== "mp3" && format !== "wav") {
    throw new Error(`Unsupported TTS format "${format}". Use mp3 or wav.`);
  }

  const tts = new MsEdgeTTS();
  const edgeVoice = resolveEdgeVoice(voice);
  const outputFormat =
    format === "wav"
      ? OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
      : OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3;

  await tts.setMetadata(edgeVoice, outputFormat);
  const { audioStream } = await tts.toStream(text);
  return streamToBuffer(audioStream);
}

export async function textToSpeechStream(
  text: string,
  voice: keyof typeof VOICE_MAP | string = "nova",
): Promise<AsyncIterable<string>> {
  const buffer = await textToSpeech(text, voice, "mp3");
  const base64 = buffer.toString("base64");
  return (async function* () {
    yield base64;
  })();
}

export async function speechToText(
  audioBuffer: Buffer,
  format: "wav" | "mp3" | "webm" = "wav",
): Promise<string> {
  const mimeType =
    format === "mp3"
      ? "audio/mpeg"
      : format === "webm"
        ? "audio/webm"
        : "audio/wav";

  const model = getSttGeminiModel();
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: audioBuffer.toString("base64"),
      },
    },
    {
      text: "Transcribe this English speech. Return only the spoken word or short phrase in English, no punctuation or commentary.",
    },
  ]);
  return result.response.text().trim();
}

export async function speechToTextStream(
  audioBuffer: Buffer,
  format: "wav" | "mp3" | "webm" = "wav",
): Promise<AsyncIterable<string>> {
  const text = await speechToText(audioBuffer, format);
  return (async function* () {
    yield text;
  })();
}

export async function voiceChat(): Promise<never> {
  throw new Error(
    "voiceChat is not available after migrating from Replit OpenAI. Use speechToText + generateText + textToSpeech instead.",
  );
}

export async function voiceChatStream(): Promise<never> {
  throw new Error(
    "voiceChatStream is not available after migrating from Replit OpenAI. Use speechToText + generateText + textToSpeech instead.",
  );
}
