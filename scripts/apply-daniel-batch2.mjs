/**
 * Applies batch 2 Daniel illustrations (20 new words) from assets/daniel_*.png
 * Usage: node scripts/apply-daniel-batch2.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const BATCH2 = [
  "over",
  "approach",
  "merely",
  "night",
  "third",
  "year",
  "reign",
  "horizon",
  "beyond",
  "hill",
  "ancient",
  "wall",
  "something",
  "greater",
  "shadow",
  "advance",
  "storm",
  "iron",
  "march",
  "relentlessly",
];

const CREAM = { r: 252, g: 245, b: 230, alpha: 1 };
const TARGET_SIZE = 800;

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

function assetFile(word) {
  const base = `daniel_${word.replace(/\s+/g, "_")}.png`;
  return join(ASSETS_DIR, base);
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
    .png({ quality: 90 })
    .toBuffer();
}

loadEnvFile(join(rootDir, ".env"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

let updated = 0;
for (const word of BATCH2) {
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
console.log(`\nBatch 2 applied: ${updated}/20. Daniel lesson now has ${stats.rows[0].with_image} images.`);
await client.close();
