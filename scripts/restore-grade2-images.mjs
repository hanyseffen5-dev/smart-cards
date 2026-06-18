/**
 * Restore grade 2 images from assets/grade2_<word>.png (all matching files).
 * Usage: node scripts/restore-grade2-images.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { ASSETS_DIR, LESSON_TITLE, makeSquare } from "./lib/grade2-image-style.mjs";

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
  return baseName.replace(/^grade2_/, "").replace(/_/g, " ");
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("restore-grade2-images");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found. Run: node scripts/seed-grade2-lesson.mjs`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

const files = readdirSync(ASSETS_DIR).filter((f) => /^grade2_.+\.png$/i.test(f));
let updated = 0;
let notFound = 0;

for (const file of files.sort()) {
  const word = fileNameToWord(file.replace(/\.png$/i, ""));
  const srcPath = join(ASSETS_DIR, file);
  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
     RETURNING id, word`,
    [dataUrl, lessonId, word],
  );
  if (res.rows.length === 0) {
    notFound++;
  } else {
    updated++;
  }
}

const stats = await client.query(
  `SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_image
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
console.log(`Done. Applied ${updated} images, ${notFound} files unmatched.`);
console.log(`Grade 2: ${stats.rows[0].with_image}/${stats.rows[0].total} with images`);
await client.close();
