/**
 * Applies batch 5 Daniel illustrations (10 words) from assets/daniel_*.png
 * Usage: node scripts/apply-daniel-batch5.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BATCH5_WORDS } from "./daniel-batch5-prompts.mjs";
import { ASSETS_DIR, CREAM, TARGET_SIZE, makeSquare } from "./lib/daniel-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

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

function assetFile(word) {
  return join(ASSETS_DIR, `daniel_${word.replace(/\s+/g, "_")}.png`);
}

loadEnvFile(join(rootDir, ".env"));
assertServerNotRunning();
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

let updated = 0;
for (const word of BATCH5_WORDS) {
  const srcPath = assetFile(word);
  if (!existsSync(srcPath)) {
    console.error(`Missing: ${srcPath}`);
    continue;
  }
  const buf = await makeSquare(srcPath, { targetSize: TARGET_SIZE, cream: CREAM });
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
console.log(`\nBatch 5 applied: ${updated}/${BATCH5_WORDS.length}. Daniel lesson now has ${stats.rows[0].with_image} images.`);
await client.close();
