/**
 * Daniel - The Movie (lesson_id=1): remove all old images,
 * keep only the 10 newly designed cartoon illustrations.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

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

const KEEP_WORDS = [
  "quiet",
  "courage",
  "god",
  "servant",
  "compare",
  "appearance",
  "day",
  "vegetable",
  "pass",
  "friend",
];

const before = await client.query(
  `SELECT
     COUNT(*) AS total,
     SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) AS with_image
   FROM words WHERE lesson_id = 1`,
);
console.log("Before:", before.rows[0]);

const cleared = await client.query(
  `UPDATE words SET image_url = NULL
   WHERE lesson_id = 1
     AND LOWER(TRIM(word)) NOT IN (${KEEP_WORDS.map((_, i) => `LOWER(TRIM($${i + 1}))`).join(", ")})
   RETURNING id, word`,
  KEEP_WORDS,
);
console.log(`\nCleared images from ${cleared.rows.length} words:`);
for (const r of cleared.rows.slice(0, 20)) {
  console.log(`  id=${r.id}: "${r.word}"`);
}
if (cleared.rows.length > 20) {
  console.log(`  ... and ${cleared.rows.length - 20} more`);
}

const kept = await client.query(
  `SELECT id, word, LENGTH(image_url) AS img_len
   FROM words
   WHERE lesson_id = 1
     AND image_url IS NOT NULL AND image_url != ''
   ORDER BY word`,
);
console.log(`\nKept ${kept.rows.length} words with new images:`);
for (const r of kept.rows) {
  console.log(`  id=${r.id}: "${r.word}" (${(r.img_len / 1024).toFixed(1)} KB)`);
}

const after = await client.query(
  `SELECT
     COUNT(*) AS total,
     SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) AS with_image
   FROM words WHERE lesson_id = 1`,
);
console.log("\nAfter:", after.rows[0]);

await client.close();
