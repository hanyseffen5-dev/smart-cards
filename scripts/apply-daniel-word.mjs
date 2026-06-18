/**
 * Apply one Daniel illustration from assets. Usage: node scripts/apply-daniel-word.mjs <word>
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";

const word = process.argv[2];
if (!word) {
  console.error("Usage: node scripts/apply-daniel-word.mjs <word>");
  process.exit(1);
}

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const ASSETS_DIR =
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

const srcPath = join(ASSETS_DIR, `daniel_${word.replace(/\s+/g, "_")}.png`);
if (!existsSync(srcPath)) {
  console.error(`Missing asset: ${srcPath}`);
  process.exit(1);
}

async function makeSquare(src) {
  const img = sharp(src);
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
const buf = await makeSquare(srcPath);
const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
const res = await client.query(
  `UPDATE words SET image_url = $1
   WHERE lesson_id = 1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))
   RETURNING id, word, example`,
  [dataUrl, word],
);
if (res.rows.length === 0) {
  console.error(`Word not found: "${word}"`);
  process.exit(1);
}
const w = res.rows[0];
console.log(`Updated id=${w.id} "${w.word}" — ${w.example}`);
await client.close();
