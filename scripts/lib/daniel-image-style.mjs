/**
 * Shared Daniel lesson flashcard image style (batch 3 / chat technique).
 * Used by apply scripts and generate-daniel-images.mjs.
 */
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptsRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** Override with env DANIEL_ASSETS_DIR if assets live elsewhere */
export const ASSETS_DIR =
  process.env.DANIEL_ASSETS_DIR ||
  process.env.GRADE5_ASSETS_DIR ||
  join(process.env.PROJECT_ROOT || scriptsRoot, "assets");

/** Cream canvas — matches batch 1–3 Daniel cards */
export const CREAM = { r: 252, g: 245, b: 230, alpha: 1 };

/** Stored image size in DB (keep all batches consistent) */
export const TARGET_SIZE = 640;

/** Pollinations / manual prompt suffix */
export const STYLE =
  "Flat minimalist 2D vector children's flashcard illustration, 1:1 square, soft warm cream off-white background, muted warm pastels (beige, soft orange, pale blue), simple dot eyes and curved mouths, rounded friendly shapes, cozy hand-drawn feel, centered composition, NO text NO letters NO words NO numbers.";

/** Cursor GenerateImage tool — same look as batch 3 chat */
export const GENERATE_IMAGE_STYLE =
  "Flat children's storybook cartoon, 1:1 square, soft warm cream off-white background, soft warm pastels, rounded friendly outlines, big eyes, NO text NO letters NO words NO numbers. Centered composition.";

export function assetFileName(word) {
  return `daniel_${word.replace(/\s+/g, "_")}.png`;
}

export function assetPath(word, assetsDir = ASSETS_DIR) {
  return join(assetsDir, assetFileName(word));
}

/**
 * Build a sentence-aligned prompt. The example sentence on the card back is the source of truth.
 */
export function buildPrompt({ word, example, sceneHint = "" }) {
  const ex = (example || "").trim();
  const hint = (sceneHint || "").trim();
  const scene = hint || `Illustrate the English word "${word}" in one clear friendly scene.`;
  const sentence = ex ? ` Scene from sentence: ${ex}` : "";
  return `${GENERATE_IMAGE_STYLE} ${scene}${sentence}`;
}

export async function makeSquare(srcPath, { targetSize = TARGET_SIZE, cream = CREAM } = {}) {
  const img = sharp(srcPath);
  const meta = await img.metadata();
  const size = Math.max(meta.width || 1, meta.height || 1);
  const scale = targetSize / size;
  const newW = Math.round((meta.width || size) * scale);
  const newH = Math.round((meta.height || size) * scale);
  const left = Math.floor((targetSize - newW) / 2);
  const top = Math.floor((targetSize - newH) / 2);
  const resized = await img.resize({ width: newW, height: newH, fit: "contain" }).png().toBuffer();
  return sharp({
    create: { width: targetSize, height: targetSize, channels: 4, background: cream },
  })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9, quality: 80 })
    .toBuffer();
}
