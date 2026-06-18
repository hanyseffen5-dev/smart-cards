/** Read-only: show one grade 5 card by position or word. Usage: node scripts/show-grade5-card.mjs 120 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE5_LESSON_TITLE } from "./seed-data/grade5-cards.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const arg = process.argv[2] || "1";
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lesson = await client.query(
  `SELECT id FROM lessons WHERE title = $1 LIMIT 1`,
  [GRADE5_LESSON_TITLE],
);
const lessonId = lesson.rows[0]?.id;
if (!lessonId) {
  console.error(`Lesson "${GRADE5_LESSON_TITLE}" not found`);
  process.exit(1);
}
const res = await client.query(
  `SELECT id, word, example, example_translation,
    CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
  FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
  [lessonId],
);
const byWord = res.rows.find((r) => r.word.toLowerCase() === arg.toLowerCase());
const pos = byWord ? res.rows.indexOf(byWord) + 1 : Number(arg);
const w = byWord ?? res.rows[pos - 1];
if (!w) {
  console.error(`No card at position ${pos}`);
  process.exit(1);
}
console.log(`Card ${pos}/${res.rows.length}: id=${w.id} word="${w.word}" has_img=${w.has_img}`);
console.log(`EN: ${w.example}`);
console.log(`AR: ${w.example_translation}`);
await client.close();
