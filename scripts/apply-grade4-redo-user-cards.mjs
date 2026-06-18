/**
 * Apply grade4 redo images for user-requested card positions.
 * Usage: node scripts/apply-grade4-redo-user-cards.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { REDO_USER_CARDS_WORDS } from "./grade4-redo-user-cards-prompts.mjs";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade4-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

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
assertGrade123WriteAllowed("apply-grade4-redo-user-cards");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  LESSON_TITLE,
]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found.`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

let ok = 0;
let miss = 0;
const failed = [];
for (const word of REDO_USER_CARDS_WORDS) {
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing asset: ${src}`);
    miss++;
    failed.push(word);
    continue;
  }
  try {
    const buf = await makeSquare(src);
    const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
    const res = await client.query(
      `UPDATE words SET image_url = $1
       WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
       RETURNING id, word`,
      [dataUrl, lessonId, word],
    );
    if (res.rows.length === 0) {
      console.error(`Word not in DB: "${word}"`);
      miss++;
      failed.push(word);
    } else {
      console.log(`Updated id=${res.rows[0].id} "${res.rows[0].word}"`);
      ok++;
    }
  } catch (err) {
    console.error(`Failed "${word}": ${err instanceof Error ? err.message : err}`);
    miss++;
    failed.push(word);
  }
}
if (failed.length) console.error(`\nFailed words (${failed.length}): ${failed.join(", ")}`);

const count = await client.query(
  `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1 AND image_url IS NOT NULL AND image_url != ''`,
  [lessonId],
);
await client.close();
console.log(`\nRedo user cards: ${ok} applied, ${miss} missing/failed. Lesson images total: ${count.rows[0].n}`);
