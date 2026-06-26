/** Read-only audit: find grade 6 cards whose word or example collides with
 * another lesson, or duplicates within grade 6 itself. */
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
if (!g6) {
  console.log("grade 6 not found");
  await client.close();
  process.exit(1);
}

const otherWords = new Map(); // normWord -> Set(lesson titles)
const otherExamples = new Map(); // normEx -> Set(lesson titles)
const g6rows = [];

for (const lesson of lessons.rows) {
  const rows = await client.query(
    `SELECT id, word, example FROM words WHERE lesson_id = $1 ORDER BY id`,
    [lesson.id],
  );
  if (lesson.id === g6.id) {
    for (const r of rows.rows) g6rows.push(r);
    continue;
  }
  for (const r of rows.rows) {
    const w = normWord(r.word);
    const e = normEx(r.example);
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

// Internal grade-6 duplicates
const seenWord = new Map();
const seenEx = new Map();
const wordCrossHits = [];
const exCrossHits = [];
const internalWordDup = [];
const internalExDup = [];

for (const r of g6rows) {
  const w = normWord(r.word);
  const e = normEx(r.example);
  if (otherWords.has(w)) {
    wordCrossHits.push({ id: r.id, word: r.word, lessons: [...otherWords.get(w)] });
  }
  if (otherExamples.has(e)) {
    exCrossHits.push({ id: r.id, word: r.word, example: r.example, lessons: [...otherExamples.get(e)] });
  }
  if (seenWord.has(w)) internalWordDup.push({ id: r.id, word: r.word, firstId: seenWord.get(w) });
  else seenWord.set(w, r.id);
  if (seenEx.has(e)) internalExDup.push({ id: r.id, word: r.word, example: r.example, firstId: seenEx.get(e) });
  else seenEx.set(e, r.id);
}

// Cards to delete: any g6 card with a cross word hit OR cross example hit OR internal dup.
const deleteIds = new Set();
for (const h of wordCrossHits) deleteIds.add(h.id);
for (const h of exCrossHits) deleteIds.add(h.id);
for (const h of internalWordDup) deleteIds.add(h.id);
for (const h of internalExDup) deleteIds.add(h.id);

writeFileSync(
  join(rootDir, ".data", "g6-cross-audit.json"),
  JSON.stringify(
    {
      g6Total: g6rows.length,
      wordCrossCount: wordCrossHits.length,
      exampleCrossCount: exCrossHits.length,
      internalWordDup: internalWordDup.length,
      internalExDup: internalExDup.length,
      uniqueDeleteCount: deleteIds.size,
      remainingAfter: g6rows.length - deleteIds.size,
      wordCrossSample: wordCrossHits.slice(0, 60),
      exampleCrossSample: exCrossHits.slice(0, 60),
    },
    null,
    2,
  ),
);
console.log("audit-done");
await client.close();
