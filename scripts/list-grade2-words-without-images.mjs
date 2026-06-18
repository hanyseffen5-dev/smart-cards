import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { LESSON_TITLE } from "./lib/grade2-image-style.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const ASSETS =
  process.env.GRADE2_ASSETS_DIR ||
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";
const LIMIT = Number(process.argv[2] || 50);

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
loadEnv(join(root, ".env"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));

const existing = new Set(
  readdirSync(ASSETS)
    .filter((f) => /^grade2_.+\.png$/i.test(f))
    .map((f) =>
      f
        .replace(/^grade2_/i, "")
        .replace(/\.png$/i, "")
        .replace(/_/g, " ")
        .toLowerCase(),
    ),
);

const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  LESSON_TITLE,
]);
if (lesson.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found`);
  process.exit(1);
}
const lessonId = lesson.rows[0].id;

const cnt = await client.query(
  `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1 AND image_url IS NOT NULL AND image_url != ''`,
  [lessonId],
);

const res = await client.query(
  `SELECT id, word, translation, example
   FROM words
   WHERE lesson_id = $1
     AND (image_url IS NULL OR image_url = '')
     AND example IS NOT NULL AND TRIM(example) != ''
   ORDER BY id`,
  [lessonId],
);

const picks = [];
for (const row of res.rows) {
  const key = row.word.toLowerCase().trim();
  if (existing.has(key)) continue;
  picks.push(row);
  if (picks.length >= LIMIT) break;
}

console.log(
  `DB images: ${cnt.rows[0].n}, assets: ${existing.size}, next without image: ${picks.length}`,
);
console.log(JSON.stringify(picks, null, 2));
await client.close();
