/**
 * Generate grade5 vocabulary chunks A–D (250 cards each).
 * Usage: node scripts/generate-grade5-chunks-250.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE5_CARDS_RAW } from "./seed-data/grade5-cards.mjs";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";
import { GRADE3_CARDS } from "./seed-data/grade3-cards.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";
import { BANK_A, BANK_B, BANK_C, BANK_D } from "./lib/grade5-vocab-banks.mjs";
import { makeGrade5Example } from "./lib/grade5-example-patterns.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = 250;

function normWord(w) {
  return String(w ?? "").toLowerCase().trim();
}
function normExample(e) {
  return String(e ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

const blockedWords = new Set();
const blockedExamples = new Set();
for (const c of [...GRADE1_CARDS, ...GRADE2_CARDS, ...GRADE3_CARDS, ...GRADE4_CARDS, ...GRADE5_CARDS_RAW]) {
  blockedWords.add(normWord(c.word));
  blockedExamples.add(normExample(c.example));
}
try {
  const exp = JSON.parse(readFileSync(join(root, ".data", "curriculum-words-export.json"), "utf8"));
  for (const w of exp.words) blockedWords.add(normWord(w));
  for (const e of exp.examples) blockedExamples.add(normExample(e));
} catch {
  console.warn("curriculum-words-export.json not found");
}

function makeExample(word, translation, idx, chunkIdx) {
  return makeGrade5Example(word, translation, idx + chunkIdx * TARGET, blockedExamples, normExample);
}

const CHUNKS = [
  { export: "GRADE5_CHUNK_A", file: "grade5-chunk-a.mjs", bank: BANK_A, topic: "STEM (math, physics, chemistry, biology, engineering)" },
  { export: "GRADE5_CHUNK_B", file: "grade5-chunk-b.mjs", bank: BANK_B, topic: "history, geography, civics, cultures" },
  { export: "GRADE5_CHUNK_C", file: "grade5-chunk-c.mjs", bank: BANK_C, topic: "literature, writing, grammar, debate, journalism" },
  { export: "GRADE5_CHUNK_D", file: "grade5-chunk-d.mjs", bank: BANK_D, topic: "technology, arts, music, sports, health, character, logic" },
];

const usedWords = new Set(blockedWords);
const usedExamples = new Set(blockedExamples);
const counts = {};

for (let ci = 0; ci < CHUNKS.length; ci++) {
  const { export: exp, file, bank, topic } = CHUNKS[ci];
  const cards = [];
  for (const entry of bank) {
    if (cards.length >= TARGET) break;
    const [word, translation, partOfSpeech, difficulty] = entry;
    const w = normWord(word);
    if (usedWords.has(w)) continue;
    const { example, exampleTranslation } = makeExample(word, translation, cards.length, ci);
    const ex = normExample(example);
    if (usedExamples.has(ex)) continue;
    usedWords.add(w);
    usedExamples.add(ex);
    cards.push({ word, translation, partOfSpeech, difficulty, example, exampleTranslation });
  }
  if (cards.length !== TARGET) {
    console.error(`${exp}: only ${cards.length}/${TARGET} cards — expand word bank`);
    process.exit(1);
  }
  const lines = cards.map(
    (c) =>
      `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`,
  );
  const body = `/** Grade 5 chunk ${String.fromCharCode(65 + ci)} — ${topic} (${cards.length} cards). */\nexport const ${exp} = [\n${lines.join("\n")}\n];\n`;
  writeFileSync(join(root, "scripts/seed-data", file), body);
  counts[exp] = cards.length;
  console.log(`Wrote ${file}: ${cards.length} cards (${cards[0].word} … ${cards.at(-1).word})`);
}

console.log("\nCounts:", counts);
console.log("Total:", Object.values(counts).reduce((a, b) => a + b, 0));
