/**
 * Apply grade2_<word>.png assets for specific words.
 * Usage: node scripts/apply-grade2-words.mjs thirteen fourteen
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade2-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const words = process.argv.slice(2);
if (words.length === 0) {
  console.error("Usage: node scripts/apply-grade2-words.mjs word1 word2 ...");
  process.exit(1);
}

assertServerNotRunning();
assertGrade123WriteAllowed("apply-grade2-words");

const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found.`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

for (const word of words) {
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing asset: ${src}`);
    continue;
  }
  const buf = await makeSquare(src);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
     RETURNING id, word`,
    [dataUrl, lessonId, word],
  );
  if (res.rows.length === 0) console.error(`Word not in DB: "${word}"`);
  else console.log(`Updated id=${res.rows[0].id} "${res.rows[0].word}"`);
}

await client.close();
