/**
 * Smart-crop composite flashcard images in the database.
 * Detects the exact boundary between the illustration and the orange text panel
 * by scanning pixel columns for the dominant orange color transition.
 *
 * Usage: node scripts/smart-crop-images.mjs [lessonTitle]
 * Default: processes "Miscellaneous Words Part 1"
 */
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  cropIllustrationFromBuffer,
  bufferToDataUrl,
} from "./lib/illustration-crop.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const sharp = require("sharp");

const LESSON_TITLE = process.argv[2] || "Miscellaneous Words Part 1";

async function smartCropIllustration(imageBuffer) {
  const meta = await sharp(imageBuffer).metadata();
  const cropped = await cropIllustrationFromBuffer(imageBuffer);
  if (cropped.length === imageBuffer.length) return null;
  const cropMeta = await sharp(cropped).metadata();
  return {
    cropped,
    originalWidth: meta.width,
    cropWidth: cropMeta.width,
    height: cropMeta.height,
  };
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

function parseDataUrl(dataUrl) {
  const m = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/s);
  if (!m) return null;
  return { mime: m[1], buffer: Buffer.from(m[2], "base64") };
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT = rootDir;

const dir = join(rootDir, ".data", "flashcards");
mkdirSync(dirname(dir), { recursive: true });

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1`, [LESSON_TITLE]);
if (lesson.rows.length === 0) {
  console.error(`Lesson not found: ${LESSON_TITLE}`);
  await client.close();
  process.exit(1);
}
const lessonId = lesson.rows[0].id;

const words = await client.query(
  `SELECT id, word, image_url FROM words WHERE lesson_id = $1 AND image_url IS NOT NULL ORDER BY id`,
  [lessonId],
);

let updated = 0;
let skipped = 0;

for (const row of words.rows) {
  const parsed = parseDataUrl(row.image_url);
  if (!parsed) { skipped++; continue; }

  const result = await smartCropIllustration(parsed.buffer);
  if (!result) {
    console.log(`  SKIP (not composite): ${row.word}`);
    skipped++;
    continue;
  }

  const newUrl = bufferToDataUrl(result.cropped);
  await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [newUrl, row.id]);
  updated++;
  console.log(`  CROP: ${row.word} (${result.originalWidth}x${result.height} → ${result.cropWidth}x${result.height})`);
}

await client.close();
console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
console.log("Restart pnpm dev and hard-refresh (Ctrl+Shift+R) the browser.");
