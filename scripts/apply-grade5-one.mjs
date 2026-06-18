/**
 * Apply one grade5 asset to DB (for incremental chat workflow).
 * Usage: node scripts/apply-grade5-one.mjs <word>
 * Set GRADE5_SKIP_DEV_CHECK=1 only if API is stopped.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade5-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const word = process.argv[2];
if (!word) {
  console.error("Usage: node scripts/apply-grade5-one.mjs <word>");
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
if (!process.env.GRADE5_SKIP_DEV_CHECK) assertServerNotRunning();
assertGrade123WriteAllowed("apply-grade5-one");

const src = assetPath(word);
if (!existsSync(src)) {
  console.error(`Missing asset: ${src}`);
  process.exit(1);
}

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

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
  process.exit(1);
}
const w = res.rows[0];
const stats = await client.query(
  `SELECT COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_image,
          COUNT(*)::int AS total
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
console.log(`OK id=${w.id} "${w.word}" → Grade 5: ${stats.rows[0].with_image}/${stats.rows[0].total}`);
await client.close();
