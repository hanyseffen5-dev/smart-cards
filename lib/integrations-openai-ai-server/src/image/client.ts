import { createHash } from "node:crypto";

/** Free Pollinations only — paid providers (Together, OpenAI images, etc.) are blocked. */
const POLLINATIONS_TEMPLATE =
  process.env.IMAGE_GENERATION_URL?.trim() ||
  "https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&nologo=true&model=flux&seed={seed}";

const BLOCKED_IMAGE_HOSTS = [
  "together.xyz",
  "api.openai.com",
  "replicate.com",
  "stability.ai",
];

/** Exact cartoon template — example sentence replaces [INSERT_EXAMPLE_SENTENCE]. */
const PROMPT_STYLE_TEMPLATE =
  "Premium 2D vector flat illustration for kids, educational flashcard style, cute friendly characters, " +
  "vibrant pastel colors, simple clean background, minimal details, safe for toddlers, NO text, NO words, " +
  "NO realistic hands, NO distorted faces. Scene to draw: ";

/** Strong text bans at end of prompt sent to Pollinations. */
const PROMPT_NEGATIVE_SUFFIX =
  ". NO text, NO typography, NO words, NO letters, NO numbers, NO symbols, NO captions, NO labels, " +
  "NO watermarks, NO logos, NO speech bubbles, NO subtitles, NO writing in any language";

const POLLINATIONS_NEGATIVE_PARAM =
  "text, words, letters, numbers, symbols, typography, caption, watermark, logo, speech bubble, " +
  "subtitle, label, sign with text, alphabet, writing, english text, arabic text, " +
  "photorealistic, photograph, 3d render, realistic hands, detailed fingers, extra fingers, " +
  "deformed hands, distorted face, mutated limbs, blurry, low quality, horror, gore, nsfw, ui panel";

export type ImageSize =
  | "1024x1024"
  | "768x768"
  | "512x512"
  | "500x500"
  | "256x256";

export type GeneratedImage = {
  buffer: Buffer;
  url?: string;
};

function assertFreePollinationsOnly(): void {
  const url = POLLINATIONS_TEMPLATE.toLowerCase();
  for (const host of BLOCKED_IMAGE_HOSTS) {
    if (url.includes(host)) {
      throw new Error(
        `Paid image API blocked (${host}). Use Pollinations only — unset IMAGE_GENERATION_URL or use the default.`,
      );
    }
  }
  if (!url.includes("pollinations.ai")) {
    throw new Error(
      "IMAGE_GENERATION_URL must point to Pollinations (image.pollinations.ai). Paid APIs are disabled.",
    );
  }
}

/**
 * Builds the final Pollinations prompt.
 * @param visualScene — concrete picture description (from example sentence), not the raw sentence.
 */
export function formatKidsEducationalPrompt(visualScene: string): string {
  const scene = visualScene.trim();
  return `${PROMPT_STYLE_TEMPLATE}${scene}${PROMPT_NEGATIVE_SUFFIX}`;
}

function dimensionsForSize(size: ImageSize): { width: number; height: number } {
  const [w, h] = size.split("x").map(Number);
  return {
    width: Math.min(1024, Math.max(512, w || 1024)),
    height: Math.min(1024, Math.max(512, h || 1024)),
  };
}

function buildPollinationsUrl(prompt: string, width: number, height: number): string {
  assertFreePollinationsOnly();
  const seed = createHash("sha256").update(prompt).digest("hex").slice(0, 8);
  let url = POLLINATIONS_TEMPLATE.replace("{prompt}", encodeURIComponent(prompt))
    .replace("{width}", String(width))
    .replace("{height}", String(height))
    .replace("{seed}", seed);

  const separator = url.includes("?") ? "&" : "?";
  if (!url.includes("negative=")) {
    url += `${separator}negative=${encodeURIComponent(POLLINATIONS_NEGATIVE_PARAM)}`;
  }
  return url;
}

/** Pollinations AI (free) — visual scene description drives the illustration. */
export async function generateWordImage(
  visualScene: string,
  size: ImageSize = "1024x1024",
): Promise<GeneratedImage> {
  const scene = visualScene.trim();
  if (!scene) {
    throw new Error("Visual scene description is required to generate an educational flashcard image.");
  }

  const { width, height } = dimensionsForSize(size);
  const prompt = formatKidsEducationalPrompt(scene);
  const url = buildPollinationsUrl(prompt, width, height);

  const response = await fetch(url, {
    headers: { Accept: "image/*" },
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Pollinations image generation failed (${response.status}): ${text.slice(0, 200) || response.statusText}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 500) {
    throw new Error("Pollinations returned an empty or invalid image");
  }

  return { buffer, url };
}

export async function generateImageBuffer(
  prompt: string,
  size: ImageSize = "1024x1024",
): Promise<Buffer> {
  const { buffer } = await generateWordImage(prompt, size);
  return buffer;
}

export async function editImages(
  _imageFiles: string[],
  _prompt: string,
  _outputPath?: string,
): Promise<Buffer> {
  throw new Error(
    "editImages is not supported. Use generateWordImage with a new prompt instead.",
  );
}
