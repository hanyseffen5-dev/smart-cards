/**
 * Apply redo Daniel images (batch-4 style, 640px) from assets/daniel_*.png
 * Usage: node scripts/apply-daniel-redo.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { REDO_IDS } from "./daniel-redo-ids.mjs";
import { openFlashcardsClient, loadRedoEntries } from "./lib/load-redo-entries.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS_DIR =
  process.env.DANIEL_ASSETS_DIR ||
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const CREAM = { r: 252, g: 245, b: 230, alpha: 1 };
/** Match compare/appearance (ids 98–99) batch-1 card size on cream. */
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
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
}

async function main() {
  loadEnvFile(join(rootDir, ".env"));
  process.env.PROJECT_ROOT ??= rootDir;
  assertServerNotRunning();
  const client = await openFlashcardsClient();
  const entries = await loadRedoEntries(client);

  let updated = 0;
  for (const { id, word } of entries) {
    const srcPath = assetFile(word);
    if (!existsSync(srcPath)) {
      console.error(`Missing: ${srcPath} (id=${id})`);
      continue;
    }
    const buf = await makeSquare(srcPath);
    const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
    const res = await client.query(
      `UPDATE words SET image_url = $1 WHERE id = $2 RETURNING id, word`,
      [dataUrl, id],
    );
    if (res.rows.length === 0) console.error(`Not found id=${id} "${word}"`);
    else {
      console.log(`Updated id=${res.rows[0].id} "${res.rows[0].word}"`);
      updated++;
    }
  }

  const stats = await client.query(
    `SELECT SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END)::int AS with_image
     FROM words WHERE lesson_id = 1`,
  );
  console.log(`\nRedo applied: ${updated}/${REDO_IDS.length}. Daniel lesson has ${stats.rows[0].with_image} images.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
