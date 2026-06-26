/**
 * Generate grade-6 replacement cards that are unique across the whole app.
 * Writes scripts/seed-data/grade6-rep-{1..6}.mjs
 * Usage: node scripts/generate-grade6-replacements.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE6_FORBIDDEN_WORDS, GRADE6_FORBIDDEN_EXAMPLES } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_INTRO, GRADE6_INTRO2, GRADE6_INTRO3 } from "./seed-data/grade6-cards.mjs";
import { GRADE6_CHUNK_A } from "./seed-data/grade6-chunk-a.mjs";
import { GRADE6_CHUNK_B } from "./seed-data/grade6-chunk-b.mjs";
import { GRADE6_CHUNK_C } from "./seed-data/grade6-chunk-c.mjs";
import { GRADE6_CHUNK_D } from "./seed-data/grade6-chunk-d.mjs";
import { GRADE6_CHUNK_E } from "./seed-data/grade6-chunk-e.mjs";
import { GRADE6_CHUNK_F } from "./seed-data/grade6-chunk-f.mjs";
import { GRADE6_CHUNK_G } from "./seed-data/grade6-chunk-g.mjs";
import { GRADE6_CHUNK_H } from "./seed-data/grade6-chunk-h.mjs";
import { GRADE6_CHUNK_I } from "./seed-data/grade6-chunk-i.mjs";
import { normWord, normExample } from "./lib/normalize.mjs";

const GRADE6_BASE_RAW = [
  ...GRADE6_INTRO,
  ...GRADE6_CHUNK_A,
  ...GRADE6_CHUNK_B,
  ...GRADE6_CHUNK_C,
  ...GRADE6_INTRO2,
  ...GRADE6_CHUNK_D,
  ...GRADE6_CHUNK_E,
  ...GRADE6_CHUNK_F,
  ...GRADE6_INTRO3,
  ...GRADE6_CHUNK_G,
  ...GRADE6_CHUNK_H,
  ...GRADE6_CHUNK_I,
];

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = 1500;
const POOL_PATH = join(rootDir, "scripts", "seed-data", "grade6-replacement-pool.json");

const pool = JSON.parse(readFileSync(POOL_PATH, "utf8"));
const usedWords = new Set(GRADE6_FORBIDDEN_WORDS);
const usedExamples = new Set(GRADE6_FORBIDDEN_EXAMPLES);

for (const c of GRADE6_BASE_RAW) {
  if (!usedWords.has(normWord(c.word)) && !usedExamples.has(normExample(c.example))) {
    usedWords.add(normWord(c.word));
    usedExamples.add(normExample(c.example));
  }
}

const need = TARGET - [...GRADE6_BASE_RAW].filter(
  (c) => !usedWords.has(normWord(c.word)) && !usedExamples.has(normExample(c.example)),
).length;

// Recompute need: surviving base cards
let surviving = 0;
for (const c of GRADE6_BASE_RAW) {
  const w = normWord(c.word);
  const e = normExample(c.example);
  if (GRADE6_FORBIDDEN_WORDS.has(w) || GRADE6_FORBIDDEN_EXAMPLES.has(e)) continue;
  surviving++;
}
const replacementsNeeded = TARGET - surviving;

const picked = [];
for (const card of pool) {
  if (picked.length >= replacementsNeeded) break;
  const w = normWord(card.word);
  const e = normExample(card.example);
  if (!w || !e || !card.translation || !card.exampleTranslation) continue;
  if (usedWords.has(w) || usedExamples.has(e)) continue;
  usedWords.add(w);
  usedExamples.add(e);
  picked.push({
    word: card.word,
    translation: card.translation,
    partOfSpeech: card.partOfSpeech || "noun",
    difficulty: card.difficulty || "hard",
    example: card.example,
    exampleTranslation: card.exampleTranslation,
  });
}

if (picked.length < replacementsNeeded) {
  console.error(`Only found ${picked.length} replacements; need ${replacementsNeeded}.`);
  process.exit(1);
}

const chunkSize = Math.ceil(picked.length / 6);
const labels = ["R1", "R2", "R3", "R4", "R5", "R6"];

for (let i = 0; i < 6; i++) {
  const chunk = picked.slice(i * chunkSize, (i + 1) * chunkSize);
  const lines = chunk.map(
    (c) =>
      `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`,
  );
  const body =
    `/** Grade 6 replacement cards — batch ${labels[i]}. Unique across the whole app. Auto-generated. */\n` +
    `export const GRADE6_${labels[i]} = [\n${lines.join("\n")}\n];\n`;
  writeFileSync(join(rootDir, "scripts", "seed-data", `grade6-rep-${i + 1}.mjs`), body);
}

console.log(`Wrote ${picked.length} replacements across 6 files (surviving base: ${surviving}).`);
