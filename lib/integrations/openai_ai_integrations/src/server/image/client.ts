import fs from "node:fs";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";

const DEFAULT_IMAGE_API =
  "https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&nologo=true&model=flux";

export async function generateImageBuffer(
  prompt: string,
  size: "1024x1024" | "512x512" | "256x256" = "1024x1024",
): Promise<Buffer> {
  const [width, height] = size.split("x").map(Number);
  const seed = createHash("sha256").update(prompt).digest("hex").slice(0, 8);
  const template =
    process.env.IMAGE_GENERATION_URL?.trim() || DEFAULT_IMAGE_API;

  const url = template
    .replace("{prompt}", encodeURIComponent(prompt))
    .replace("{width}", String(width))
    .replace("{height}", String(height))
    .replace("{seed}", seed);

  const response = await fetch(url, {
    headers: { Accept: "image/*" },
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) {
    throw new Error(`Image generation failed (${response.status})`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function editImages(
  _imageFiles: string[],
  _prompt: string,
  outputPath?: string,
): Promise<Buffer> {
  throw new Error(
    "editImages is not supported with the free image provider.",
  );
}
