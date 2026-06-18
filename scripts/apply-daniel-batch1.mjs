/**
 * Apply newly generated cartoon illustrations to the first 10 Daniel lesson words.
 *
 * - Reads PNG files from assets/daniel_*.png
 * - Smart-pads to a centered square on cream background if needed
 * - Stores as base64 data URL on the matching word
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

// Cream off-white background matching the lesson style
const CREAM = { r: 252, g: 245, b: 230, alpha: 1 };
const TARGET_SIZE = 800;

const ASSETS_DIR = "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const MAPPING = [
  { word: "quiet", file: "daniel_quiet.png" },
  { word: "courage", file: "daniel_courage.png" },
  { word: "god", file: "daniel_god.png" },
  { word: "servant", file: "daniel_servant.png" },
  { word: "compare", file: "daniel_compare.png" },
  { word: "appearance", file: "daniel_appearance.png" },
  { word: "day", file: "daniel_day.png" },
  { word: "vegetable", file: "daniel_vegetable.png" },
  { word: "pass", file: "daniel_pass.png" },
  { word: "friend", file: "daniel_friend.png" },
];

async function makeSquare(srcPath) {
  const img = sharp(srcPath);
  const meta = await img.metadata();
  const size = Math.max(meta.width, meta.height);
  // resize the longer side to TARGET_SIZE while preserving aspect
  const scale = TARGET_SIZE / size;
  const newW = Math.round(meta.width * scale);
  const newH = Math.round(meta.height * scale);
  const left = Math.floor((TARGET_SIZE - newW) / 2);
  const top = Math.floor((TARGET_SIZE - newH) / 2);

  const resized = await img.resize({ width: newW, height: newH, fit: "contain" }).png().toBuffer();

  const squared = await sharp({
    create: {
      width: TARGET_SIZE,
      height: TARGET_SIZE,
      channels: 4,
      background: CREAM,
    },
  })
    .composite([{ input: resized, left, top }])
    .png({ quality: 90 })
    .toBuffer();

  return squared;
}

let updated = 0;
let missing = 0;
let notFound = 0;

for (const { word, file } of MAPPING) {
  const srcPath = join(ASSETS_DIR, file);
  if (!existsSync(srcPath)) {
    console.error(`Missing file: ${srcPath}`);
    missing++;
    continue;
  }

  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

  let res;
  try {
    res = await client.query(
      `UPDATE words SET image_url = $1
       WHERE lesson_id = 1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))
       RETURNING id, word`,
      [dataUrl, word],
    );
  } catch (err) {
    console.error(`SQL error for "${word}":`, err.message);
    continue;
  }

  if (res.rows.length === 0) {
    console.error(`Word not found in Daniel lesson: "${word}"`);
    notFound++;
  } else {
    console.log(`Updated id=${res.rows[0].id} "${res.rows[0].word}" (${(buf.length / 1024).toFixed(1)} KB)`);
    updated++;
  }
}

console.log(`\nDone. updated=${updated}, missing=${missing}, notFound=${notFound}`);
await client.close();
