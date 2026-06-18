/**
 * Apply grade5_<word>.png assets for words listed in a batch JSON (export-grade5-next-words output).
 * Usage: node scripts/apply-grade5-from-json.mjs [.data/grade5-batch10-words.json]
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = process.argv[2] || join(rootDir, ".data", "grade5-batch10-words.json");
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
assertGrade123WriteAllowed("apply-grade5-from-json");

const { assetPath, makeSquare, LESSON_TITLE } = await import("./lib/grade5-image-style.mjs");

const { picks } = JSON.parse(readFileSync(jsonPath, "utf8"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

let updated = 0;
let missing = 0;
for (const { word } of picks) {
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing asset: ${src}`);
    missing++;
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
  if (res.rows.length === 0) {
    console.error(`Word not found: "${word}"`);
    missing++;
  } else {
    updated++;
    if (updated % 25 === 0) console.log(`  ...${updated} applied`);
  }
}

const stats = await client.query(
  `SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_image
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
console.log(`Batch applied: ${updated}/${picks.length}, missing: ${missing}`);
console.log(`Grade 5: ${stats.rows[0].with_image}/${stats.rows[0].total} with images`);
await client.close();
