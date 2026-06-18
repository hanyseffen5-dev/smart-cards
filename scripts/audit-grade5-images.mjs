/** Read-only: count grade 5 DB images vs asset files vs serve failures. */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { ASSETS_DIR, LESSON_TITLE } from "./lib/grade5-image-style.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
loadEnv(join(rootDir, ".env"));

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
const lessonId = lesson.rows[0]?.id;
if (!lessonId) {
  console.error("grade 5 lesson missing");
  process.exit(1);
}

const assetWords = new Set(
  readdirSync(ASSETS_DIR)
    .filter((f) => /^grade5_.+\.png$/i.test(f))
    .map((f) => f.replace(/^grade5_/i, "").replace(/\.png$/i, "").replace(/_/g, " ").toLowerCase()),
);

const rows = await client.query(
  `SELECT id, word, image_url IS NOT NULL AND image_url != '' AS has_flag,
          CASE WHEN image_url IS NOT NULL AND length(image_url) > 100 THEN true ELSE false END AS has_blob
   FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lessonId],
);

let hasFlag = 0;
let hasBlob = 0;
let readableBlob = 0;
let hasAsset = 0;
let broken = [];

for (const row of rows.rows) {
  if (row.has_flag) hasFlag++;
  if (row.has_blob) hasBlob++;
  const key = row.word.toLowerCase().trim();
  if (assetWords.has(key)) hasAsset++;

  if (row.has_flag) {
    try {
      const img = await client.query(`SELECT length(image_url)::int AS len FROM words WHERE id = $1`, [row.id]);
      if ((img.rows[0]?.len ?? 0) > 100) readableBlob++;
      else broken.push({ id: row.id, word: row.word, reason: "flag set but blob too short" });
    } catch (err) {
      broken.push({ id: row.id, word: row.word, reason: String(err?.message ?? err) });
    }
  }
}

console.log({
  total: rows.rows.length,
  hasImageFlag: hasFlag,
  hasBlobLen100: hasBlob,
  readableBlob,
  assetFiles: assetWords.size,
  wordsWithMatchingAsset: hasAsset,
  brokenCount: broken.length,
});

const range = await client.query(
  `SELECT MIN(id) AS min_id, MAX(id) AS max_id FROM words
   WHERE lesson_id = $1 AND image_url IS NOT NULL AND image_url != ''`,
  [lessonId],
);
console.log("image id range:", range.rows[0]);

const sample404 = await client.query(
  `SELECT id, word FROM words WHERE id = ANY($1::int[])`,
  [[3345, 3346, 3945, 3946]],
);
console.log("sample words:", sample404.rows);
await client.close();
