/**
 * Re-apply corrected images for specific Daniel lesson words.
 * Usage: node apply-daniel-fix.mjs word1=file1.png word2=file2.png ...
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

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

const CREAM = { r: 252, g: 245, b: 230, alpha: 1 };
const TARGET_SIZE = 800;
const ASSETS_DIR = "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node apply-daniel-fix.mjs word=file.png ...");
  process.exit(1);
}

const mapping = args.map((a) => {
  const [word, file] = a.split("=");
  return { word, file };
});

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
  return sharp({ create: { width: TARGET_SIZE, height: TARGET_SIZE, channels: 4, background: CREAM } })
    .composite([{ input: resized, left, top }])
    .png({ quality: 90 })
    .toBuffer();
}

for (const { word, file } of mapping) {
  const srcPath = join(ASSETS_DIR, file);
  if (!existsSync(srcPath)) {
    console.error(`Missing file: ${srcPath}`);
    continue;
  }
  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  try {
    const res = await client.query(
      `UPDATE words SET image_url = $1
       WHERE lesson_id = 1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))
       RETURNING id, word`,
      [dataUrl, word],
    );
    if (res.rows.length === 0) console.error(`Not found: "${word}"`);
    else console.log(`Updated id=${res.rows[0].id} "${res.rows[0].word}" (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`SQL error for "${word}":`, err.message);
  }
}

await client.close();
