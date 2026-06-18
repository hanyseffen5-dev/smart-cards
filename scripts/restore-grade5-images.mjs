/**
 * Restore grade 5 images from assets/grade5_<word>.png (fuzzy name matching).
 * Usage: node scripts/restore-grade5-images.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { grade5WordKey } from "./lib/grade5-word-key.mjs";

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
assertGrade123WriteAllowed("restore-grade5-images");

const { ASSETS_DIR, LESSON_TITLE, makeSquare } = await import("./lib/grade5-image-style.mjs");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found. Run: node scripts/seed-grade5-lesson.mjs`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

const wordRows = await client.query(`SELECT id, word FROM words WHERE lesson_id = $1`, [lessonId]);
const byKey = new Map();
for (const row of wordRows.rows) {
  const key = grade5WordKey(row.word);
  if (!byKey.has(key)) byKey.set(key, row);
}

const files = readdirSync(ASSETS_DIR).filter((f) => /^grade5_.+\.png$/i.test(f));
let updated = 0;
let notFound = 0;

for (const file of files.sort()) {
  const key = grade5WordKey(file);
  const row = byKey.get(key);
  if (!row) {
    notFound++;
    continue;
  }
  const srcPath = join(ASSETS_DIR, file);
  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [dataUrl, row.id]);
  updated++;
  if (updated % 50 === 0) console.log(`  ...${updated} applied`);
}

const stats = await client.query(
  `SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_image
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
console.log(`Assets dir: ${ASSETS_DIR}`);
console.log(`PNG files: ${files.length}`);
console.log(`Done. Applied ${updated} images, ${notFound} files unmatched.`);
console.log(`Grade 5: ${stats.rows[0].with_image}/${stats.rows[0].total} with images`);
await client.close();
