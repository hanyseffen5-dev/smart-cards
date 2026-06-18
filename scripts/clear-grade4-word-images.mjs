/**
 * Clear image_url for grade 4 words (forces asset fallback on next view).
 * Usage: node scripts/clear-grade4-word-images.mjs simile ...
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { LESSON_TITLE } from "./lib/grade4-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const words = process.argv.slice(2);
if (!words.length) {
  console.error("Usage: node scripts/clear-grade4-word-images.mjs <word> ...");
  process.exit(1);
}

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
assertServerNotRunning();
assertGrade123WriteAllowed("clear-grade4-word-images");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  LESSON_TITLE,
]);
const lessonId = lessonRes.rows[0].id;

for (const word of words) {
  await client.query(
    `UPDATE words SET image_url = NULL
     WHERE lesson_id = $1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))`,
    [lessonId, word],
  );
  console.log(`Cleared image_url: ${word}`);
}

await client.close();
