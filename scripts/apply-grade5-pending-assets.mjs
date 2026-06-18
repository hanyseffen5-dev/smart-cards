/**
 * Apply grade5 assets that exist on disk but have no image_url in DB yet.
 * Usage: node scripts/apply-grade5-pending-assets.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { ASSETS_DIR, LESSON_TITLE, makeSquare } from "./lib/grade5-image-style.mjs";
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

function fileNameToWord(baseName) {
  return baseName.replace(/^grade5_/i, "").replace(/_/g, " ");
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("apply-grade5-pending-assets");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

const noImage = await client.query(
  `SELECT id, word FROM words
   WHERE lesson_id = $1 AND (image_url IS NULL OR image_url = '')`,
  [lessonId],
);
const needImage = new Map(
  noImage.rows.map((r) => [r.word.toLowerCase().trim(), { id: r.id, word: r.word }]),
);

const files = readdirSync(ASSETS_DIR).filter((f) => /^grade5_.+\.png$/i.test(f));
let updated = 0;
let skipped = 0;

for (const file of files.sort()) {
  const word = fileNameToWord(file.replace(/\.png$/i, ""));
  const key = word.toLowerCase().trim();
  if (!needImage.has(key)) {
    skipped++;
    continue;
  }
  const srcPath = join(ASSETS_DIR, file);
  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
     RETURNING id, word`,
    [dataUrl, lessonId, word],
  );
  if (res.rows.length > 0) {
    updated++;
    needImage.delete(key);
    if (updated % 25 === 0) console.log(`  ...${updated} applied`);
  }
}

const stats = await client.query(
  `SELECT COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_image,
          COUNT(*)::int AS total
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
console.log(`Pending applied: ${updated}, assets already in DB: ${skipped}`);
console.log(`Grade 5: ${stats.rows[0].with_image}/${stats.rows[0].total} with images`);
await client.close();
