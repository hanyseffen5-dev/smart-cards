/**
 * Apply multiple Miscellaneous Words illustrations in one DB session.
 * Usage: node scripts/apply-misc-batch.mjs word1 word2 ...
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import { ASSETS_DIR, makeSquare } from "./lib/daniel-image-style.mjs";

const LESSON_TITLE = "Miscellaneous Words";
const words = process.argv.slice(2);
if (words.length === 0) {
  console.error("Usage: node scripts/apply-misc-batch.mjs <word1> <word2> ...");
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
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("apply-misc-batch");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(
  `SELECT id FROM lessons WHERE title = $1 LIMIT 1`,
  [LESSON_TITLE],
);
const lessonId = lessonRes.rows[0]?.id;
if (!lessonId) {
  console.error(`Lesson not found: "${LESSON_TITLE}"`);
  process.exit(1);
}

let ok = 0;
for (const word of words) {
  const srcPath = join(ASSETS_DIR, `misc_${word.replace(/\s+/g, "_")}.png`);
  if (!existsSync(srcPath)) {
    console.error(`SKIP missing asset: ${srcPath}`);
    continue;
  }
  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
     RETURNING id, word, example`,
    [dataUrl, lessonId, word],
  );
  if (res.rows.length === 0) {
    console.error(`SKIP word not found: "${word}"`);
    continue;
  }
  const w = res.rows[0];
  console.log(`Updated id=${w.id} "${w.word}" — ${w.example}`);
  ok++;
}

await client.close();
console.log(`\nDone: ${ok}/${words.length} updated`);
if (ok === 0) process.exit(1);
