/**
 * Fix Arabic number translations in seed data and database (all lessons).
 * Usage: node scripts/apply-number-translation-fixes.mjs [--dry-run]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { arabicTranslationForWord } from "./lib/grade5-number-words.mjs";
import { GRADE5_CHUNK_NUMBERS } from "./seed-data/grade5-chunk-numbers.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

function fixExampleTranslation(text, oldAr, newAr) {
  if (!text || !oldAr || oldAr === newAr) return text;
  if (text.includes(oldAr)) return text.replace(oldAr, newAr);
  return text;
}

function patchCard(card) {
  let expected;
  try {
    expected = arabicTranslationForWord(card.word);
  } catch {
    return null;
  }
  const old = card.translation;
  if (old === expected) return null;
  const exampleTranslation = fixExampleTranslation(card.exampleTranslation, old, expected);
  return { old, expected, exampleTranslation };
}

// --- Fix grade 5 chunk seed file ---
let seedFixed = 0;
for (const card of GRADE5_CHUNK_NUMBERS) {
  const patch = patchCard(card);
  if (!patch) continue;
  card.translation = patch.expected;
  card.exampleTranslation = patch.exampleTranslation;
  seedFixed++;
}

if (!dryRun && seedFixed > 0) {
  const body = `/** Auto-generated number cards for grade 5 (157+). */\nexport const GRADE5_CHUNK_NUMBERS = ${JSON.stringify(GRADE5_CHUNK_NUMBERS, null, 2)};\n`;
  writeFileSync(join(rootDir, "scripts/seed-data/grade5-chunk-numbers.mjs"), body);
}
console.log(`Seed (grade5-chunk-numbers): ${seedFixed} cards ${dryRun ? "would be " : ""}fixed`);

// --- Fix database across all lessons ---
if (!dryRun) {
  assertServerNotRunning();
  assertGrade123WriteAllowed("apply-number-translation-fixes");
}

const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = dryRun ? null : new PGlite(join(rootDir, ".data", "flashcards"));

let dbFixed = 0;
let dbSkipped = 0;
let dbChecked = 0;

if (client) {
  const rows = await client.query(
    `SELECT w.id, w.word, w.translation, w.example_translation, l.title AS lesson
     FROM words w
     JOIN lessons l ON l.id = w.lesson_id
     WHERE w.part_of_speech = 'number'
     ORDER BY l.title, w.id`,
  );

  for (const row of rows.rows) {
    dbChecked++;
    let expected;
    try {
      expected = arabicTranslationForWord(row.word);
    } catch {
      dbSkipped++;
      continue;
    }
    if (row.translation === expected) continue;

    const exampleTranslation = fixExampleTranslation(
      row.example_translation,
      row.translation,
      expected,
    );

    await client.query(
      `UPDATE words SET translation = $1, example_translation = $2 WHERE id = $3`,
      [expected, exampleTranslation, row.id],
    );
    dbFixed++;
    if (dbFixed <= 5) {
      console.log(`  [${row.lesson}] ${row.word}: ${row.translation} → ${expected}`);
    }
  }
  await client.close();
}

console.log(`Database: checked ${dbChecked} number cards, ${dbFixed} ${dryRun ? "would be " : ""}fixed, ${dbSkipped} skipped`);
if (dbFixed > 5) console.log(`  … and ${dbFixed - 5} more`);
