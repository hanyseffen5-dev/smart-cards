/**
 * Read-only audit: grade 6 word/example uniqueness within the lesson and vs all others.
 * Usage: node scripts/audit-grade6-uniqueness.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { normWord, normExample } from "./lib/normalize.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessons = await client.query(`SELECT id, title FROM lessons ORDER BY id`);
const g6 = lessons.rows.find((l) => normWord(l.title) === "grade 6");
if (!g6) {
  console.error("grade 6 not found");
  await client.close();
  process.exit(1);
}

const otherWords = new Map();
const otherExamples = new Map();
const g6rows = [];

for (const lesson of lessons.rows) {
  const rows = await client.query(
    `SELECT id, word, example FROM words WHERE lesson_id = $1 ORDER BY id`,
    [lesson.id],
  );
  if (lesson.id === g6.id) {
    g6rows.push(...rows.rows);
    continue;
  }
  for (const r of rows.rows) {
    const w = normWord(r.word);
    const e = normExample(r.example);
    if (w) {
      if (!otherWords.has(w)) otherWords.set(w, new Set());
      otherWords.get(w).add(lesson.title);
    }
    if (e) {
      if (!otherExamples.has(e)) otherExamples.set(e, new Set());
      otherExamples.get(e).add(lesson.title);
    }
  }
}

const wordCross = [];
const exCross = [];
const internalWord = [];
const internalEx = [];
const seenW = new Map();
const seenE = new Map();

for (const r of g6rows) {
  const w = normWord(r.word);
  const e = normExample(r.example);
  if (otherWords.has(w)) wordCross.push({ id: r.id, word: r.word, lessons: [...otherWords.get(w)] });
  if (otherExamples.has(e)) exCross.push({ id: r.id, word: r.word, example: r.example, lessons: [...otherExamples.get(e)] });
  if (seenW.has(w)) internalWord.push({ id: r.id, word: r.word, firstId: seenW.get(w) });
  else seenW.set(w, r.id);
  if (seenE.has(e)) internalEx.push({ id: r.id, word: r.word, example: r.example, firstId: seenE.get(e) });
  else seenE.set(e, r.id);
}

const deleteIds = new Set();
for (const h of wordCross) deleteIds.add(h.id);
for (const h of exCross) deleteIds.add(h.id);
for (const h of internalWord) deleteIds.add(h.id);
for (const h of internalEx) deleteIds.add(h.id);

const report = {
  g6Total: g6rows.length,
  wordCrossCount: wordCross.length,
  exampleCrossCount: exCross.length,
  internalWordDup: internalWord.length,
  internalExDup: internalEx.length,
  toRemove: deleteIds.size,
  remainingUnique: g6rows.length - deleteIds.size,
  ok: wordCross.length === 0 && exCross.length === 0 && internalWord.length === 0 && internalEx.length === 0,
};

writeFileSync(join(rootDir, ".data", "grade6-uniqueness-audit.json"), JSON.stringify(report, null, 2));

await client.close();

if (report.ok) {
  console.log(`OK grade 6: ${report.g6Total} cards — all words and examples are unique across the app.`);
  process.exit(0);
}

console.log(`FAIL grade 6 uniqueness audit:`);
console.log(`  total: ${report.g6Total}`);
console.log(`  word collisions with other lessons: ${report.wordCrossCount}`);
console.log(`  example collisions with other lessons: ${report.exampleCrossCount}`);
console.log(`  internal duplicate words: ${report.internalWordDup}`);
console.log(`  internal duplicate examples: ${report.internalExDup}`);
console.log(`  cards to remove from grade 6: ${report.toRemove}`);
console.log(`  would remain: ${report.remainingUnique}`);
process.exit(1);
