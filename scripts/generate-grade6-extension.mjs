/**
 * Generate grade 6 extension cards to reach GRADE6_TARGET (2000).
 * Simple school-friendly example sentences; no number words.
 * Usage: node scripts/generate-grade6-extension.mjs [--translate-missing]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord, normExample } from "./lib/normalize.mjs";
import { makeSimpleExample } from "./lib/grade5-simple-examples.mjs";
import { SIMPLE_BANK } from "./lib/grade5-simple-word-bank.mjs";
import { GRADE6_SUPPLEMENT_BANK } from "./lib/grade6-supplement-bank.mjs";
import { GRADE6_FORBIDDEN_WORDS, GRADE6_FORBIDDEN_EXAMPLES } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS, GRADE6_TARGET_TOTAL } from "./seed-data/grade6-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "scripts/seed-data");
const candidatesPath = join(root, "scripts/data/grade6-candidate-words.txt");
const cachePath = join(root, ".data/grade6-word-ar.json");
const CHUNK_SIZE = 200;
const NEED = GRADE6_TARGET_TOTAL - GRADE6_CARDS.length;
const translateMissing = process.argv.includes("--translate-missing");

const NUMBER_WORDS = new Set([
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  "hundred", "thousand", "million", "first", "second", "third", "fourth", "fifth",
]);

function guessPos(word) {
  const w = normWord(word);
  if (w.endsWith("ly") && w.length > 4) return "adverb";
  if (/(ful|ous|ive|able|ible|less|ish|al|ic|ed|ing)$/.test(w) && w.length > 5) return "adjective";
  if (/(ate|ify|ize|en|er|ish)$/.test(w) && w.length > 4) return "verb";
  return "noun";
}

function difficultyFor(word, pos) {
  if (word.length >= 10) return "hard";
  if (word.length <= 5 && pos === "noun") return "easy";
  return "medium";
}

function loadCache() {
  if (!existsSync(cachePath)) return {};
  return JSON.parse(readFileSync(cachePath, "utf8"));
}

function saveCache(cache) {
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
}

async function translateWord(word, cache) {
  const key = normWord(word);
  if (cache[key]) return cache[key];
  if (!translateMissing) return null;
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", word);
  url.searchParams.set("langpair", "en|ar");
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  const json = await res.json();
  const out = json.responseData?.translatedText?.trim() ?? "";
  if (!out || out.toUpperCase().includes("MYMEMORY WARNING") || out.toLowerCase() === key) return null;
  cache[key] = out;
  return out;
}

function cardLine(c) {
  return `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`;
}

const blockedWords = new Set(GRADE6_FORBIDDEN_WORDS);
const blockedExamples = new Set(GRADE6_FORBIDDEN_EXAMPLES);
for (const c of GRADE6_CARDS) {
  blockedWords.add(normWord(c.word));
  blockedExamples.add(normExample(c.example));
}

const translationMap = new Map();
for (const [word, translation, partOfSpeech, difficulty] of [
  ...GRADE6_SUPPLEMENT_BANK,
  ...SIMPLE_BANK,
]) {
  translationMap.set(normWord(word), { translation, partOfSpeech, difficulty });
}
const cache = loadCache();
for (const [w, t] of Object.entries(cache)) {
  if (!translationMap.has(normWord(w))) {
    translationMap.set(normWord(w), { translation: t, partOfSpeech: guessPos(w), difficulty: difficultyFor(w, guessPos(w)) });
  }
}

const pool = readFileSync(candidatesPath, "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean);

/** Prefer supplement bank order, then pool, then rest. */
const ordered = [];
const seenOrder = new Set();
for (const [word] of GRADE6_SUPPLEMENT_BANK) {
  const w = normWord(word);
  if (!seenOrder.has(w)) {
    seenOrder.add(w);
    ordered.push(w);
  }
}
for (const w of pool) {
  const n = normWord(w);
  if (!seenOrder.has(n)) {
    seenOrder.add(n);
    ordered.push(n);
  }
}

const cards = [];
for (const w of ordered) {
  if (cards.length >= NEED) break;
  if (!w || blockedWords.has(w) || NUMBER_WORDS.has(w) || /\d/.test(w)) continue;

  const meta = translationMap.get(w);
  if (!meta) continue;

  const { translation, partOfSpeech } = meta;
  const difficulty = meta.difficulty || difficultyFor(w, partOfSpeech);
  const { example, exampleTranslation } = makeSimpleExample(
    w,
    translation,
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
    difficulty: difficultyFor(w, partOfSpeech),
    example,
    exampleTranslation,
  });
}

if (cards.length < NEED) {
  console.warn(`Target ${NEED} extension cards; generated ${cards.length} (short by ${NEED - cards.length}).`);
}
if (cards.length === 0) {
  console.error("No extension cards generated.");
  process.exit(1);
}

const chunkFiles = [];
for (let i = 0; i < cards.length; i += CHUNK_SIZE) {
  const chunk = cards.slice(i, i + CHUNK_SIZE);
  const label = String.fromCharCode(65 + Math.floor(i / CHUNK_SIZE));
  const exportName = `GRADE6_EXT_${label}`;
  const fileName = `grade6-ext-${label.toLowerCase()}.mjs`;
  writeFileSync(
    join(outDir, fileName),
    `/** Grade 6 extension batch ${label} — simple examples (${chunk.length} cards). Auto-generated. */\nexport const ${exportName} = [\n${chunk.map(cardLine).join("\n")}\n];\n`,
    "utf8",
  );
  chunkFiles.push({ exportName, fileName, count: chunk.length });
}

writeFileSync(
  join(outDir, "grade6-extension.mjs"),
  `/** Grade 6 extension — ${cards.length} cards toward ${GRADE6_TARGET_TOTAL} total. */
${chunkFiles.map((c) => `import { ${c.exportName} } from "./${c.fileName}";`).join("\n")}

export const GRADE6_EXTENSION = [
${chunkFiles.map((c) => `  ...${c.exportName},`).join("\n")}
];
`,
  "utf8",
);

console.log(`Generated ${cards.length} extension cards in ${chunkFiles.length} files.`);
