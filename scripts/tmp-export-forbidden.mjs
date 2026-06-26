/** Read-only: export every distinct word & example in the DB (to avoid),
 * plus the list of grade-6 colliding words (to remove by filter). */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const normWord = (w) => (w || "").toLowerCase().trim();
const normEx = (e) =>
  (e || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const lessons = await client.query(`SELECT id, title FROM lessons ORDER BY id`);
const g6 = lessons.rows.find((l) => l.title.toLowerCase().trim() === "grade 6");

const allWords = new Set();
const allExamples = new Set();
const otherWords = new Set();
const g6rows = [];

for (const lesson of lessons.rows) {
  const rows = await client.query(`SELECT word, example FROM words WHERE lesson_id = $1`, [lesson.id]);
  for (const r of rows.rows) {
    allWords.add(normWord(r.word));
    allExamples.add(normEx(r.example));
    if (lesson.id !== g6.id) otherWords.add(normWord(r.word));
    if (lesson.id === g6.id) g6rows.push(r);
  }
}

const collidingWords = [...new Set(g6rows.map((r) => normWord(r.word)).filter((w) => otherWords.has(w)))];

writeFileSync(join(rootDir, ".data", "g6-forbidden.json"), JSON.stringify({
  allWordsCount: allWords.size,
  allExamplesCount: allExamples.size,
  collidingCount: collidingWords.length,
  allWords: [...allWords].sort(),
  allExamples: [...allExamples],
  collidingWords: collidingWords.sort(),
}));
console.log("export-done", allWords.size, allExamples.size, collidingWords.length);
await client.close();
