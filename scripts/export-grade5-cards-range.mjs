/** Export grade 5 cards by position range. Usage: node scripts/export-grade5-cards-range.mjs 101 200 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { LESSON_TITLE } from "./lib/grade5-image-style.mjs";

const start = Number(process.argv[2] || 1);
const end = Number(process.argv[3] || start);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));

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
const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lesson.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found`);
  process.exit(1);
}
const res = await client.query(
  `SELECT id, word, translation, example, example_translation,
    CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
   FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lesson.rows[0].id],
);
const cards = [];
for (let pos = start; pos <= end; pos++) {
  const w = res.rows[pos - 1];
  if (!w) break;
  cards.push({
    pos,
    id: w.id,
    word: w.word,
    translation: w.translation,
    example: w.example,
    example_translation: w.example_translation,
    has_img: w.has_img,
  });
}
const out = join(root, ".data", `grade5-cards-${start}-${end}.json`);
writeFileSync(out, JSON.stringify({ cards, total: res.rows.length }, null, 2));
console.log(`Wrote ${cards.length} cards → ${out}`);
for (const c of cards) {
  console.log(`${c.pos}. "${c.word}" img=${c.has_img} | ${c.example}`);
}
await client.close();
