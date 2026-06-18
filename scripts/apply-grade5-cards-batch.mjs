/**
 * Apply grade 5 images for cards in a JSON range file.
 * Usage: node scripts/apply-grade5-cards-batch.mjs .data/grade5-cards-101-200.json
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade5-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("Usage: node scripts/apply-grade5-cards-batch.mjs <json>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const { cards } = JSON.parse(readFileSync(jsonPath, "utf8"));

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
loadEnv(join(root, ".env"));
process.env.PROJECT_ROOT ??= root;
assertServerNotRunning();
assertGrade123WriteAllowed("apply-grade5-cards-batch");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));
const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

let updated = 0;
let missing = 0;
for (const { pos, word } of cards) {
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing pos ${pos}: ${src}`);
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
    console.error(`Word not found pos ${pos}: "${word}"`);
    missing++;
  } else {
    updated++;
    console.log(`✓ ${pos}. ${word}`);
  }
}
console.log(`Done: ${updated} updated, ${missing} missing/failed`);
await client.close();
