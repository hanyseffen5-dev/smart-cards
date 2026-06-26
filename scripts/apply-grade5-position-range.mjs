/**
 * Apply grade5_<word>.png assets for a 1-based card position range.
 * Usage: node scripts/apply-grade5-position-range.mjs 584 700
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade5-image-style.mjs";
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

const from = Number(process.argv[2] || 584);
const to = Number(process.argv[3] || 700);
if (!from || !to || from > to) {
  console.error("Usage: node scripts/apply-grade5-position-range.mjs 584 700");
  process.exit(1);
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("apply-grade5-position-range");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
const lessonId = lessonRes.rows[0].id;
const rows = await client.query(
  `SELECT id, word FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
  [lessonId],
);
const slice = rows.rows.slice(from - 1, to);

let ok = 0;
let miss = 0;
for (let i = 0; i < slice.length; i++) {
  const { id, word } = slice[i];
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.warn(`Missing pos ${from + i}: ${src}`);
    miss++;
    continue;
  }
  const buf = await makeSquare(src);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [dataUrl, id]);
  ok++;
  console.log(`  pos=${from + i} id=${id} ${word}`);
}

const stats = await client.query(
  `SELECT COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_image,
          COUNT(*)::int AS total FROM words WHERE lesson_id = $1`,
  [lessonId],
);
console.log(`Applied ${ok}, missing ${miss}. Grade 5: ${stats.rows[0].with_image}/${stats.rows[0].total}`);
await client.close();
