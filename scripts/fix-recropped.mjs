/**
 * Fixes images that were double-cropped by smart-crop-images.mjs.
 * Restores from original assets then applies one smart crop.
 * Usage: node scripts/fix-recropped.mjs
 */
import { readFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const sharp = require("sharp");
const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const AFFECTED = [
  { word: "effusive",   imageKey: "images_39", imageUuid: "47fdd1d5" },
  { word: "ridiculous", imageKey: "images_50", imageUuid: "83d86d46" },
  { word: "remark",     imageKey: "images_41", imageUuid: "4aa2beb1" },
  { word: "trifle",     imageKey: "images_42", imageUuid: "bcc423e8" },
  { word: "bulge",      imageKey: "images_48", imageUuid: "c715853c" },
];

function findAssetFile(imageKey, uuid) {
  const files = readdirSync(ASSETS_DIR);
  const match = files.find(
    (f) => f.includes(imageKey) && f.includes(uuid) && f.endsWith(".png"),
  );
  return match ? join(ASSETS_DIR, match) : null;
}

function isOrangePixel(r, g, b) {
  return r > 190 && g > 100 && g < 200 && b < 140 && (r - b) > 80;
}

async function smartCropOnce(buffer) {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const { width, height } = meta;
  const raw = await image.raw().toBuffer();
  const channels = meta.channels || 3;

  function columnOrangeRatio(x) {
    let orangeCount = 0;
    const sampleStep = Math.max(1, Math.floor(height / 60));
    let samples = 0;
    for (let y = Math.floor(height * 0.1); y < Math.floor(height * 0.9); y += sampleStep) {
      const idx = (y * width + x) * channels;
      if (isOrangePixel(raw[idx], raw[idx + 1], raw[idx + 2])) orangeCount++;
      samples++;
    }
    return orangeCount / samples;
  }

  let boundary = null;
  for (let x = Math.floor(width * 0.3); x < Math.floor(width * 0.75); x++) {
    if (columnOrangeRatio(x) > 0.5) { boundary = x; break; }
  }
  if (boundary === null) return { buffer, width, height, cropped: false };

  const cropWidth = Math.max(10, boundary - 2);
  const croppedBuf = await sharp(buffer)
    .extract({ left: 0, top: 0, width: cropWidth, height })
    .png()
    .toBuffer();
  return { buffer: croppedBuf, width: cropWidth, height, cropped: true, originalWidth: width };
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

let fixed = 0;
for (const item of AFFECTED) {
  const filePath = findAssetFile(item.imageKey, item.imageUuid);
  if (!filePath) { console.error(`  NOT FOUND: ${item.word}`); continue; }

  const originalBuf = readFileSync(filePath);
  const result = await smartCropOnce(originalBuf);

  const dataUrl = `data:image/png;base64,${result.buffer.toString("base64")}`;
  const res = await client.query(`UPDATE words SET image_url = $1 WHERE LOWER(TRIM(word)) = LOWER(TRIM($2))`, [dataUrl, item.word]);

  if (result.cropped) {
    console.log(`  FIXED: "${item.word}" (${result.originalWidth}→${result.width}x${result.height})`);
  } else {
    console.log(`  RESTORED (no crop needed): "${item.word}"`);
  }
  fixed++;
}

await client.close();
console.log(`\nDone. Fixed ${fixed} images.`);
