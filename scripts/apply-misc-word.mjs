/**
 * Apply one Miscellaneous Words illustration from assets.
 * Usage: node scripts/apply-misc-word.mjs <word>
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import { ASSETS_DIR, makeSquare } from "./lib/daniel-image-style.mjs";

const LESSON_TITLE = "Miscellaneous Words";

const word = process.argv[2];
if (!word) {
  console.error("Usage: node scripts/apply-misc-word.mjs <word>");
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

const srcPath = join(ASSETS_DIR, `misc_${word.replace(/\s+/g, "_")}.png`);
if (!existsSync(srcPath)) {
  console.error(`Missing asset: ${srcPath}`);
  process.exit(1);
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("apply-misc-word");

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

const buf = await makeSquare(srcPath);
const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
const res = await client.query(
  `UPDATE words SET image_url = $1
   WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
   RETURNING id, word, example`,
  [dataUrl, lessonId, word],
);
if (res.rows.length === 0) {
  console.error(`Word not found in "${LESSON_TITLE}": "${word}"`);
  process.exit(1);
}
const w = res.rows[0];
console.log(`Updated id=${w.id} "${w.word}" — ${w.example}`);
await client.close();
