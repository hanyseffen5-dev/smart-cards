/**
 * Replace grade 5 cards without images with simple single-word vocabulary.
 * Updates seed-data chunks E, C (tail), D and the live database.
 *
 * Usage: node scripts/generate-grade5-simple-replacements.mjs
 *        node scripts/generate-grade5-simple-replacements.mjs --dry-run
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
import { SIMPLE_BANK } from "./lib/grade5-simple-word-bank.mjs";
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
const CHUNK_C_KEEP_WITH_IMAGE = 110;

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

function replacementIndices(hasImageFlags) {
  const indices = [];
  let i = 0;
  i += BOUNDS.base;
  for (let j = 0; j < BOUNDS.chunkE; j++) indices.push(i + j);
  i += BOUNDS.chunkE;
  i += BOUNDS.chunkA + BOUNDS.chunkB;
  for (let j = CHUNK_C_KEEP_WITH_IMAGE; j < BOUNDS.chunkC; j++) indices.push(i + j);
  i += BOUNDS.chunkC;
  for (let j = 0; j < BOUNDS.chunkD; j++) indices.push(i + j);
  return indices;
}

loadEnvFile(join(root, ".env"));
process.env.PROJECT_ROOT ??= root;
if (!dryRun) {
  assertServerNotRunning();
  assertGrade123WriteAllowed("generate-grade5-simple-replacements");
}

const blockedWords = new Set();
const blockedExamples = new Set();
for (const c of [...GRADE1_CARDS, ...GRADE2_CARDS, ...GRADE3_CARDS, ...GRADE4_CARDS]) {
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

let hasImageFlags = [];
if (!dryRun) {
  const { PGlite } = require("@electric-sql/pglite");
  const client = new PGlite(join(root, ".data", "flashcards"));
  const lesson = await client.query(`SELECT id FROM lessons WHERE title = 'grade 5' LIMIT 1`);
  if (lesson.rows.length === 0) {
    console.error('Lesson "grade 5" not found.');
    process.exit(1);
  }
  const lid = lesson.rows[0].id;
  const db = await client.query(
    `SELECT word, example,
       CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has
     FROM words WHERE lesson_id = $1 ORDER BY id`,
    [lid],
  );
  hasImageFlags = db.rows.map((r) => r.has);
  for (const row of db.rows) {
    if (row.has) {
      blockedWords.add(normWord(row.word));
      blockedExamples.add(normExample(row.example));
    }
  }
  await client.close();
} else {
  hasImageFlags = GRADE5_CARDS.map((_, idx) => {
    if (idx < BOUNDS.base) return 1;
    if (idx < BOUNDS.base + BOUNDS.chunkE) return 0;
    if (idx < BOUNDS.base + BOUNDS.chunkE + BOUNDS.chunkA + BOUNDS.chunkB) return 1;
    const cIdx = idx - (BOUNDS.base + BOUNDS.chunkE + BOUNDS.chunkA + BOUNDS.chunkB);
    if (cIdx < CHUNK_C_KEEP_WITH_IMAGE) return 1;
    if (idx < BOUNDS.base + BOUNDS.chunkE + BOUNDS.chunkA + BOUNDS.chunkB + BOUNDS.chunkC) return 0;
    return 0;
  });
}

const replaceIdx = replacementIndices(hasImageFlags);
console.log(`Replacing ${replaceIdx.length} cards with simple vocabulary.`);

const candidates = SIMPLE_BANK.filter(
  ([word]) => isSimpleWord(word) && !blockedWords.has(normWord(word)),
);
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

const replaceSet = new Set(replaceIdx);
const seenW = new Set();
const seenE = new Set();
const errors = [];
for (let i = 0; i < newCards.length; i++) {
  const c = newCards[i];
  const w = normWord(c.word);
  const ex = normExample(c.example);
  if (seenW.has(w)) errors.push(`duplicate: ${c.word}`);
  if (seenE.has(ex)) errors.push(`duplicate example: ${c.example}`);
  if (replaceSet.has(i) && (c.word.includes("-") || c.word.includes(" "))) {
    errors.push(`compound: ${c.word}`);
  }
  seenW.add(w);
  seenE.add(ex);
}
if (errors.length) {
  console.error("Validation failed:\n" + errors.slice(0, 20).join("\n"));
  process.exit(1);
}

const baseEnd = BOUNDS.base;
const eEnd = baseEnd + BOUNDS.chunkE;
const bEnd = eEnd + BOUNDS.chunkA + BOUNDS.chunkB;
const cEnd = bEnd + BOUNDS.chunkC;

const newChunkE = newCards.slice(baseEnd, eEnd);
const newChunkC = newCards.slice(bEnd, cEnd);
const newChunkD = newCards.slice(cEnd, cEnd + BOUNDS.chunkD);

const seedDir = join(root, "scripts/seed-data");
if (!dryRun) {
  writeChunk(
    join(seedDir, "grade5-chunk-e.mjs"),
    "GRADE5_CHUNK_E",
    "Grade 5 chunk E — simple vocabulary (earth, civics, health, nature)",
    newChunkE,
  );
  writeChunk(
    join(seedDir, "grade5-chunk-c.mjs"),
    "GRADE5_CHUNK_C",
    "Grade 5 chunk C — literature, writing, debate (simple tail)",
    newChunkC,
  );
  writeChunk(
    join(seedDir, "grade5-chunk-d.mjs"),
    "GRADE5_CHUNK_D",
    "Grade 5 chunk D — technology, arts, sports, health (simple)",
    newChunkD,
  );
  console.log(`Wrote chunk E (${newChunkE.length}), C (${newChunkC.length}), D (${newChunkD.length}).`);
}

if (!dryRun) {
  const { PGlite } = require("@electric-sql/pglite");
  const client = new PGlite(join(root, ".data", "flashcards"));
  const lid = (await client.query(`SELECT id FROM lessons WHERE title = 'grade 5' LIMIT 1`)).rows[0].id;
  const rows = await client.query(`SELECT id FROM words WHERE lesson_id = $1 ORDER BY id`, [lid]);
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
  console.log(`Updated ${updated} rows in database.`);
  await client.close();
}

console.log("Sample replacements:");
for (const idx of replaceIdx.slice(0, 5)) {
  console.log(`  ${GRADE5_CARDS[idx].word} → ${newCards[idx].word}`);
}
console.log(dryRun ? "Dry run complete (no files/DB changed)." : "Done.");
