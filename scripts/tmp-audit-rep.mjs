/** Audit grade-6 replacement cards against the whole-app forbidden sets. */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE6_CARDS_RAW, GRADE6_REPLACEMENTS } from "./seed-data/grade6-cards.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(rootDir, ".data", "g6-forbidden.json"), "utf8"));
const forbiddenWords = new Set(data.allWords);
const forbiddenExamples = new Set(data.allExamples);

const normWord = (w) => (w || "").toLowerCase().trim();
const normEx = (e) =>
  (e || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const wordHits = [];
const exHits = [];
const dupWordInRep = [];
const dupExInRep = [];
const seenW = new Set();
const seenE = new Set();

for (const c of GRADE6_REPLACEMENTS) {
  const w = normWord(c.word);
  const e = normEx(c.example);
  if (forbiddenWords.has(w)) wordHits.push(c.word);
  if (forbiddenExamples.has(e)) exHits.push(c.example);
  if (seenW.has(w)) dupWordInRep.push(c.word);
  else seenW.add(w);
  if (seenE.has(e)) dupExInRep.push(c.example);
  else seenE.add(e);
}

console.log(JSON.stringify({
  totalRaw: GRADE6_CARDS_RAW.length,
  replacements: GRADE6_REPLACEMENTS.length,
  wordCollisions: wordHits.length,
  exampleCollisions: exHits.length,
  dupWordInRep: dupWordInRep.length,
  dupExInRep: dupExInRep.length,
  wordHits: wordHits.slice(0, 80),
  exHits: exHits.slice(0, 40),
  dupWords: dupWordInRep.slice(0, 80),
}, null, 2));
