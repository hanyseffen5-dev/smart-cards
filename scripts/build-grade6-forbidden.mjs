/**
 * Build forbidden word/example sets from every lesson except grade 6.
 * Writes scripts/seed-data/grade6-forbidden.mjs for seed-time filtering.
 * Usage: node scripts/build-grade6-forbidden.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");

import { normWord, normExample } from "./lib/normalize.mjs";

const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lessons = await client.query(`SELECT id, title FROM lessons ORDER BY id`);
const g6 = lessons.rows.find((l) => normWord(l.title) === "grade 6");
if (!g6) {
  console.error("grade 6 lesson not found in database");
  await client.close();
  process.exit(1);
}

const forbiddenWords = new Set();
const forbiddenExamples = new Set();

for (const lesson of lessons.rows) {
  if (lesson.id === g6.id) continue;
  const rows = await client.query(`SELECT word, example FROM words WHERE lesson_id = $1`, [lesson.id]);
  for (const r of rows.rows) {
    const w = normWord(r.word);
    const e = normExample(r.example);
    if (w) forbiddenWords.add(w);
    if (e) forbiddenExamples.add(e);
  }
}

await client.close();

const wordsArr = [...forbiddenWords].sort();
const examplesArr = [...forbiddenExamples].sort();

const body = `/** Forbidden words/examples from every lesson except grade 6. Auto-generated — run scripts/build-grade6-forbidden.mjs */
export const GRADE6_FORBIDDEN_WORDS = new Set(${JSON.stringify(wordsArr, null, 2).replace(/\n/g, "\n")});

export const GRADE6_FORBIDDEN_EXAMPLES = new Set(${JSON.stringify(examplesArr, null, 2).replace(/\n/g, "\n")});
`;

writeFileSync(join(rootDir, "scripts", "seed-data", "grade6-forbidden.mjs"), body);
console.log(`Wrote ${wordsArr.length} forbidden words and ${examplesArr.length} forbidden examples.`);
