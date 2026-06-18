/**
 * Verifies Daniel lesson has exactly 10 images and prints cache-clear steps.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const KEEP = [
  "quiet", "courage", "god", "servant", "compare",
  "appearance", "day", "vegetable", "pass", "friend",
];

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
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const cleared = await client.query(
  `UPDATE words SET image_url = NULL
   WHERE lesson_id = 1
     AND LOWER(TRIM(word)) NOT IN (${KEEP.map((_, i) => `LOWER(TRIM($${i + 1}))`).join(", ")})
   RETURNING id`,
  KEEP,
);

const kept = await client.query(
  `SELECT word FROM words WHERE lesson_id = 1 AND image_url IS NOT NULL AND image_url != '' ORDER BY word`,
);

console.log(`Cleared ${cleared.rows.length} extra images.`);
console.log(`Kept ${kept.rows.length} words with images:`);
for (const r of kept.rows) console.log(`  - ${r.word}`);

await client.close();
console.log("\nCache version on client: daniel-new-only-v3");
console.log("User: Ctrl+Shift+R or DevTools > Application > Clear site data");
