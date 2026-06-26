/**
 * Generate final grade 6 cards (420) — simple daily-life words (no compounds).
 * Usage: node scripts/build-grade6-daily-final-bank.mjs && node scripts/generate-grade6-final.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord, normExample } from "./lib/normalize.mjs";
import { makeDailyExample } from "./lib/grade6-daily-examples.mjs";
import { GRADE6_DAILY_FINAL_BANK } from "./lib/grade6-daily-final-bank.mjs";
import { GRADE6_FORBIDDEN_WORDS, GRADE6_FORBIDDEN_EXAMPLES } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS, GRADE6_TARGET_TOTAL } from "./seed-data/grade6-cards.mjs";
import { GRADE6_FINAL } from "./seed-data/grade6-final.mjs";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "seed-data");
const CHUNK_SIZE = 210;

const NUMBER_WORDS = new Set([
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  "hundred", "thousand", "million", "first", "second", "third", "fourth", "fifth",
]);

const DIFF_RANK = { easy: 0, medium: 1, hard: 2 };

function isSimpleWord(w) {
  return w && !w.includes("-") && !w.includes("_") && !/\d/.test(w) && w.length <= 14;
}

function difficultyFor(word, pos) {
  if (word.length >= 10) return "hard";
  if (word.length <= 5 && pos === "noun") return "easy";
  return "medium";
}

function cardLine(c) {
  return `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`;
}

const finalWordSet = new Set(GRADE6_FINAL.map((c) => normWord(c.word)));
const baseCards = GRADE6_CARDS.filter((c) => !finalWordSet.has(normWord(c.word)));
const NEED = GRADE6_TARGET_TOTAL - baseCards.length;

const blockedWords = new Set(GRADE6_FORBIDDEN_WORDS);
const blockedExamples = new Set(GRADE6_FORBIDDEN_EXAMPLES);
for (const c of baseCards) {
  blockedWords.add(normWord(c.word));
  blockedExamples.add(normExample(c.example));
}

/** Daily-life bank only — simple single words, no compounds. */
const candidates = GRADE6_DAILY_FINAL_BANK.map(([word, translation, partOfSpeech, difficulty]) => ({
  word: normWord(word),
  translation,
  partOfSpeech,
  difficulty: difficulty || difficultyFor(normWord(word), partOfSpeech),
})).filter(
  (c) => c.word && isSimpleWord(c.word) && !blockedWords.has(c.word) && !NUMBER_WORDS.has(c.word),
);

candidates.sort((a, b) => {
  const da = DIFF_RANK[a.difficulty] ?? 2;
  const db = DIFF_RANK[b.difficulty] ?? 2;
  if (da !== db) return da - db;
  return a.word.length - b.word.length;
});

const cards = [];
for (const entry of candidates) {
  if (cards.length >= NEED) break;
  const w = entry.word;
  const { translation, partOfSpeech } = entry;
  const difficulty = entry.difficulty || difficultyFor(w, partOfSpeech);

  const { example, exampleTranslation } = makeDailyExample(
    w,
    translation,
    partOfSpeech,
    cards.length,
    blockedExamples,
    normExample,
  );
  const ex = normExample(example);
  if (blockedExamples.has(ex)) continue;

  blockedExamples.add(ex);
  blockedWords.add(w);
  cards.push({
    word: w,
    translation,
    partOfSpeech,
    difficulty,
    example,
    exampleTranslation,
  });
}

if (cards.length < NEED) {
  console.error(`Need ${NEED} final cards, got ${cards.length}.`);
  process.exit(1);
}

const chunkFiles = [];
for (let i = 0; i < cards.length; i += CHUNK_SIZE) {
  const chunk = cards.slice(i, i + CHUNK_SIZE);
  const label = String.fromCharCode(65 + Math.floor(i / CHUNK_SIZE));
  const exportName = `GRADE6_FINAL_${label}`;
  const fileName = `grade6-final-${label.toLowerCase()}.mjs`;
  writeFileSync(
    join(outDir, fileName),
    `/** Grade 6 final batch ${label} — daily-life vocabulary (${chunk.length} cards). Auto-generated. */\nexport const ${exportName} = [\n${chunk.map(cardLine).join("\n")}\n];\n`,
    "utf8",
  );
  chunkFiles.push({ exportName, fileName, count: chunk.length });
}

writeFileSync(
  join(outDir, "grade6-final.mjs"),
  `/** Grade 6 final — ${cards.length} simple daily-life cards to reach ${GRADE6_TARGET_TOTAL} total. */
${chunkFiles.map((c) => `import { ${c.exportName} } from "./${c.fileName}";`).join("\n")}

export const GRADE6_FINAL = [
${chunkFiles.map((c) => `  ...${c.exportName},`).join("\n")}
];
`,
  "utf8",
);

console.log(`Generated ${cards.length} final cards (simple words, no compounds).`);
console.log(`Sample: ${cards.slice(0, 8).map((c) => c.word).join(", ")}`);
