/**
 * Applies batch 4 Daniel illustrations (words id 200–249) from assets/daniel_*.png
 * Usage: node scripts/apply-daniel-batch4.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";
import { BATCH4_WORDS } from "./daniel-batch4-prompts.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const ASSETS_DIR =
  process.env.DANIEL_ASSETS_DIR ||
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const CREAM = { r: 252, g: 245, b: 230, alpha: 1 };
const TARGET_SIZE = 640;

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

function assetFile(word) {
  return join(ASSETS_DIR, `daniel_${word.replace(/\s+/g, "_")}.png`);
}

async function makeSquare(srcPath) {
  const img = sharp(srcPath);
  const meta = await img.metadata();
  const size = Math.max(meta.width, meta.height);
  const scale = TARGET_SIZE / size;
  const newW = Math.round(meta.width * scale);
  const newH = Math.round(meta.height * scale);
  const left = Math.floor((TARGET_SIZE - newW) / 2);
  const top = Math.floor((TARGET_SIZE - newH) / 2);
  const resized = await img.resize({ width: newW, height: newH, fit: "contain" }).png().toBuffer();
  return sharp({
    create: { width: TARGET_SIZE, height: TARGET_SIZE, channels: 4, background: CREAM },
  })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9, quality: 80 })
    .toBuffer();
}

loadEnvFile(join(rootDir, ".env"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

let updated = 0;
for (const word of BATCH4_WORDS) {
  const srcPath = assetFile(word);
  if (!existsSync(srcPath)) {
    console.error(`Missing: ${srcPath}`);
    continue;
  }
  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = 1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))
     RETURNING id, word`,
    [dataUrl, word],
  );
  if (res.rows.length === 0) console.error(`Not found: "${word}"`);
  else {
    console.log(`Updated id=${res.rows[0].id} "${res.rows[0].word}"`);
    updated++;
  }
}

const stats = await client.query(
  `SELECT SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END)::int AS with_image
   FROM words WHERE lesson_id = 1`,
);
console.log(`\nBatch 4 applied: ${updated}/${BATCH4_WORDS.length}. Daniel lesson now has ${stats.rows[0].with_image} images.`);
await client.close();
