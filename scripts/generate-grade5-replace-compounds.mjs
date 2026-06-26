/**
 * Replace hyphenated compound words in grade 5 chunks A, B, C with simple
 * daily-life vocabulary and image-friendly example sentences.
 *
 * Usage: node scripts/generate-grade5-replace-compounds.mjs
 *        node scripts/generate-grade5-replace-compounds.mjs --dry-run
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";
import { GRADE3_CARDS } from "./seed-data/grade3-cards.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";
import { GRADE5_CARDS } from "./seed-data/grade5-cards.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { GRADE5_REPLACEMENT_BANK } from "./lib/grade5-replacement-bank.mjs";
import { GRADE5_COMPOUND_REPLACE_INDICES } from "./build-grade5-replacement-word-list.mjs";
import { makeSimpleExample } from "./lib/grade5-simple-examples.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const dryRun = process.argv.includes("--dry-run");

const BOUNDS = {
  base: 90,
  chunkE: 410,
  chunkA: 250,
  chunkB: 250,
  chunkC: 250,
  chunkD: 250,
};

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

function normWord(w) {
  return String(w ?? "").toLowerCase().trim();
}

function normExample(e) {
  return String(e ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

function isSimpleWord(w) {
  const s = String(w ?? "").trim();
  return s.length >= 3 && s.length <= 14 && /^[a-zA-Z]+$/.test(s);
}

function cardLine(c) {
  return `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`;
}

function writeChunk(filePath, exportName, title, cards) {
  const body = `/** ${title} (${cards.length} cards). */\nexport const ${exportName} = [\n${cards.map(cardLine).join("\n")}\n];\n`;
  writeFileSync(filePath, body);
}

function buildWordPool(blockedWords) {
  const pool = [];
  for (const row of GRADE5_REPLACEMENT_BANK) {
    const w = normWord(row[0]);
    if (!isSimpleWord(w) || blockedWords.has(w)) continue;
    pool.push(row);
  }
  return pool;
}

loadEnvFile(join(root, ".env"));
process.env.PROJECT_ROOT ??= root;
if (!dryRun) {
  assertServerNotRunning();
  assertGrade123WriteAllowed("generate-grade5-replace-compounds");
}

const blockedWords = new Set();
const blockedExamples = new Set();
const replaceSet = new Set(GRADE5_COMPOUND_REPLACE_INDICES);
for (const c of [...GRADE1_CARDS, ...GRADE2_CARDS, ...GRADE3_CARDS, ...GRADE4_CARDS, ...GRADE6_CARDS]) {
  blockedWords.add(normWord(c.word));
  blockedExamples.add(normExample(c.example));
}
for (let i = 0; i < GRADE5_CARDS.length; i++) {
  if (replaceSet.has(i)) continue;
  const c = GRADE5_CARDS[i];
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

const replaceIdx = [...GRADE5_COMPOUND_REPLACE_INDICES];
console.log(`Replacing ${replaceIdx.length} compound cards in chunks A/B/C.`);

const candidates = buildWordPool(blockedWords);
if (candidates.length < replaceIdx.length) {
  console.error(`Need ${replaceIdx.length} words but only ${candidates.length} candidates available.`);
  process.exit(1);
}

const newCards = [...GRADE5_CARDS];
let ci = 0;
for (const idx of replaceIdx) {
  const [word, translation, partOfSpeech, difficulty] = candidates[ci++];
  blockedWords.add(normWord(word));
  const { example, exampleTranslation } = makeSimpleExample(
    word,
    translation,
    idx,
    blockedExamples,
    normExample,
  );
  blockedExamples.add(normExample(example));
  newCards[idx] = { word, translation, partOfSpeech, difficulty, example, exampleTranslation };
}

const seenW = new Set();
const seenE = new Set();
const errors = [];
for (let i = 0; i < newCards.length; i++) {
  const c = newCards[i];
  const w = normWord(c.word);
  const ex = normExample(c.example);
  if (seenW.has(w)) errors.push(`duplicate word: ${c.word}`);
  if (seenE.has(ex)) errors.push(`duplicate example: ${c.example}`);
  if (replaceSet.has(i) && (c.word.includes("-") || c.word.includes(" "))) {
    errors.push(`still compound: ${c.word}`);
  }
  seenW.add(w);
  seenE.add(ex);
}
if (errors.length) {
  console.error("Validation failed:\n" + errors.slice(0, 25).join("\n"));
  process.exit(1);
}

const aStart = BOUNDS.base + BOUNDS.chunkE;
const bStart = aStart + BOUNDS.chunkA;
const cStart = bStart + BOUNDS.chunkB;
const cEnd = cStart + BOUNDS.chunkC;

const newChunkA = newCards.slice(aStart, bStart);
const newChunkB = newCards.slice(bStart, cStart);
const newChunkC = newCards.slice(cStart, cEnd);

const seedDir = join(root, "scripts/seed-data");
if (!dryRun) {
  writeChunk(
    join(seedDir, "grade5-chunk-a.mjs"),
    "GRADE5_CHUNK_A",
    "Grade 5 chunk A — STEM (simple daily vocabulary)",
    newChunkA,
  );
  writeChunk(
    join(seedDir, "grade5-chunk-b.mjs"),
    "GRADE5_CHUNK_B",
    "Grade 5 chunk B — history, geography, civics (simple daily vocabulary)",
    newChunkB,
  );
  writeChunk(
    join(seedDir, "grade5-chunk-c.mjs"),
    "GRADE5_CHUNK_C",
    "Grade 5 chunk C — literature, writing (simple daily vocabulary)",
    newChunkC,
  );
  console.log(`Wrote chunk A (${newChunkA.length}), B (${newChunkB.length}), C (${newChunkC.length}).`);
}

if (!dryRun) {
  const { PGlite } = require("@electric-sql/pglite");
  const client = new PGlite(join(root, ".data", "flashcards"));
  const lid = (await client.query(`SELECT id FROM lessons WHERE title = 'grade 5' LIMIT 1`)).rows[0].id;
  const rows = await client.query(`SELECT id FROM words WHERE lesson_id = $1 ORDER BY id`, [lid]);
  if (rows.rows.length !== newCards.length) {
    console.warn(`DB has ${rows.rows.length} rows, seed has ${newCards.length} cards.`);
  }
  let updated = 0;
  for (const idx of replaceIdx) {
    const card = newCards[idx];
    const id = rows.rows[idx].id;
    await client.query(
      `UPDATE words SET
         word = $2, translation = $3, example = $4, example_translation = $5,
         difficulty = $6, part_of_speech = $7, image_url = NULL
       WHERE id = $1`,
      [
        id,
        card.word,
        card.translation,
        card.example,
        card.exampleTranslation,
        card.difficulty,
        card.partOfSpeech,
      ],
    );
    updated++;
  }
  console.log(`Updated ${updated} rows in database (images cleared).`);
  await client.close();
}

console.log("Sample replacements:");
for (const idx of replaceIdx.slice(0, 5)) {
  console.log(`  ${GRADE5_CARDS[idx].word} → ${newCards[idx].word}`);
}
console.log(dryRun ? "Dry run complete (no files/DB changed)." : "Done.");
