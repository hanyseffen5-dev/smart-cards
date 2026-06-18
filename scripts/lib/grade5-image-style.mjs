/**
 * Grade 5 lesson flashcard images — same cream 640×640 technique as Daniel.
 */
import { join } from "node:path";
import {
  ASSETS_DIR as DEFAULT_ASSETS_DIR,
  CREAM,
  TARGET_SIZE,
  STYLE,
  GENERATE_IMAGE_STYLE,
  makeSquare,
} from "./daniel-image-style.mjs";

export { CREAM, TARGET_SIZE, STYLE, GENERATE_IMAGE_STYLE, makeSquare };

export const LESSON_TITLE = "grade 5";

export const ASSETS_DIR = process.env.GRADE5_ASSETS_DIR || DEFAULT_ASSETS_DIR;

export function assetFileName(word) {
  return `grade5_${word.replace(/\s+/g, "_")}.png`;
}

export function assetPath(word, assetsDir = ASSETS_DIR) {
  return join(assetsDir, assetFileName(word));
}

export function buildPrompt({ word, example, sceneHint = "" }) {
  const ex = (example || "").trim();
  const hint = (sceneHint || "").trim();
  const scene =
    hint ||
    `Clear friendly children's scene for the English word "${word}" suitable for grade 5 learners.`;
  const sentence = ex ? ` Scene from sentence: ${ex}` : "";
  return `${GENERATE_IMAGE_STYLE} ${scene}${sentence}`;
}
