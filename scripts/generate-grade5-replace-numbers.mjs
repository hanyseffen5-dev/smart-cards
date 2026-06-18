/**
 * Replace grade 5 number cards with vocabulary from unused bank words.
 * Output: scripts/seed-data/grade5-chunk-e.mjs
 * Usage: node scripts/generate-grade5-replace-numbers.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";
import { GRADE3_CARDS } from "./seed-data/grade3-cards.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";
import { GRADE5_CHUNK_A } from "./seed-data/grade5-chunk-a.mjs";
import { GRADE5_CHUNK_B } from "./seed-data/grade5-chunk-b.mjs";
import { GRADE5_CHUNK_C } from "./seed-data/grade5-chunk-c.mjs";
import { GRADE5_CHUNK_D } from "./seed-data/grade5-chunk-d.mjs";
import { BANK_A, BANK_B, BANK_C, BANK_D } from "./lib/grade5-vocab-banks.mjs";
import { makeGrade5Example } from "./lib/grade5-example-patterns.mjs";
import { readFileSync as readBaseCards } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = 410;

function normWord(w) {
  return String(w ?? "").toLowerCase().trim();
}
function normExample(e) {
  return String(e ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

/** Base 90 vocabulary cards from grade5-cards.mjs (geometry through literary analysis). */
function loadBaseGrade5Cards() {
  const src = readBaseCards(join(root, "scripts/seed-data/grade5-cards.mjs"), "utf8");
  const cards = [];
  const re =
    /\{\s*word:\s*"([^"]+)",\s*translation:\s*"([^"]+)",\s*partOfSpeech:\s*"([^"]+)",\s*difficulty:\s*"([^"]+)",\s*example:\s*"([^"]+)",\s*exampleTranslation:\s*"([^"]+)"\s*\}/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[3] === "number") continue;
    cards.push({
      word: m[1],
      translation: m[2],
      partOfSpeech: m[3],
      difficulty: m[4],
      example: m[5],
      exampleTranslation: m[6],
    });
  }
  return cards;
}

const blockedWords = new Set();
const blockedExamples = new Set();
for (const c of [
  ...GRADE1_CARDS,
  ...GRADE2_CARDS,
  ...GRADE3_CARDS,
  ...GRADE4_CARDS,
  ...loadBaseGrade5Cards(),
  ...GRADE5_CHUNK_A,
  ...GRADE5_CHUNK_B,
  ...GRADE5_CHUNK_C,
  ...GRADE5_CHUNK_D,
]) {
  blockedWords.add(normWord(c.word));
  blockedExamples.add(normExample(c.example));
}
try {
  const exp = JSON.parse(readFileSync(join(root, ".data", "curriculum-words-export.json"), "utf8"));
  for (const w of exp.words) blockedWords.add(normWord(w));
  for (const e of exp.examples) blockedExamples.add(normExample(e));
} catch {
  console.warn("curriculum-words-export.json not found — skipping export blocklist");
}

const BANKS = [
  { name: "STEM", bank: BANK_A },
  { name: "history & civics", bank: BANK_B },
  { name: "literature & writing", bank: BANK_C },
  { name: "technology & arts", bank: BANK_D },
];

const pools = BANKS.map(({ name, bank }) => ({
  name,
  entries: bank.filter(([w]) => !blockedWords.has(normWord(w))),
}));

function makeExample(word, translation, idx) {
  return makeGrade5Example(word, translation, idx, blockedExamples, normExample);
}

const cards = [];
let bankIdx = 0;
const indices = pools.map(() => 0);

while (cards.length < TARGET) {
  const pool = pools[bankIdx % pools.length];
  const entry = pool.entries[indices[bankIdx % pools.length]];
  if (!entry) {
    bankIdx++;
    if (bankIdx > pools.length * 2000) break;
    continue;
  }
  indices[bankIdx % pools.length]++;
  const [word, translation, partOfSpeech, difficulty] = entry;
  const w = normWord(word);
  if (blockedWords.has(w)) {
    bankIdx++;
    continue;
  }
  const { example, exampleTranslation } = makeExample(word, translation, cards.length);
  const ex = normExample(example);
  if (blockedExamples.has(ex)) {
    bankIdx++;
    continue;
  }
  blockedWords.add(w);
  blockedExamples.add(ex);
  cards.push({ word, translation, partOfSpeech, difficulty, example, exampleTranslation });
  bankIdx++;
}

if (cards.length !== TARGET) {
  console.error(`Only generated ${cards.length}/${TARGET} cards — expand word banks`);
  process.exit(1);
}

const lines = cards.map(
  (c) =>
    `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`,
);
const body = `/** Grade 5 chunk E — vocabulary replacing number cards (${cards.length} cards). */\nexport const GRADE5_CHUNK_E = [\n${lines.join("\n")}\n];\n`;
writeFileSync(join(root, "scripts/seed-data", "grade5-chunk-e.mjs"), body);

const jsonPicks = cards.map((c, i) => ({
  id: 1091 + i,
  word: c.word,
  translation: c.translation,
  example: c.example,
}));
writeFileSync(
  join(root, ".data", "grade5-replace-numbers-words.json"),
  JSON.stringify({ picks: jsonPicks }, null, 2),
);

console.log(`Wrote grade5-chunk-e.mjs: ${cards.length} cards (${cards[0].word} … ${cards.at(-1).word})`);
console.log(`Wrote .data/grade5-replace-numbers-words.json for image generation`);
