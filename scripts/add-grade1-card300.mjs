/**
 * Add missing grade 1 card(s) so lesson reaches 300 words with images.
 * Usage: node scripts/add-grade1-card300.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE1_CARDS, GRADE1_LESSON_TITLE } from "./seed-data/grade1-cards.mjs";
import { assetPath, makeSquare } from "./lib/grade1-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

/** Cards required for a full 300-card lesson (missing farmer + ensure card 300 nice has image). */
const TARGET_WORDS = ["farmer", "nice"];

loadEnvFile(join(rootDir, ".env"));
assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  GRADE1_LESSON_TITLE,
]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${GRADE1_LESSON_TITLE}" not found.`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

async function applyImage(word) {
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing asset: ${src}`);
    return false;
  }
  const buf = await makeSquare(src);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
     RETURNING id, word`,
    [dataUrl, lessonId, word],
  );
  if (res.rows.length === 0) {
    console.error(`Word not found for image: "${word}"`);
    return false;
  }
  console.log(`Image applied id=${res.rows[0].id} "${res.rows[0].word}"`);
  return true;
}

for (const word of TARGET_WORDS) {
  const card = GRADE1_CARDS.find((c) => c.word.toLowerCase() === word.toLowerCase());
  if (!card) {
    console.error(`Not in seed: ${word}`);
    continue;
  }

  const existing = await client.query(
    `SELECT id, image_url FROM words WHERE lesson_id = $1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))`,
    [lessonId, word],
  );

  if (existing.rows.length === 0) {
    await client.query(
      `INSERT INTO words (
        lesson_id, word, translation, image_url, example, example_translation,
        difficulty, part_of_speech, is_favorite
      ) VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, false)`,
      [
        lessonId,
        card.word,
        card.translation,
        card.example,
        card.exampleTranslation,
        card.difficulty,
        card.partOfSpeech,
      ],
    );
    console.log(`Inserted "${card.word}" — ${card.example}`);
  } else {
    await client.query(
      `UPDATE words SET
        translation = $1, example = $2, example_translation = $3,
        difficulty = $4, part_of_speech = $5
       WHERE id = $6`,
      [
        card.translation,
        card.example,
        card.exampleTranslation,
        card.difficulty,
        card.partOfSpeech,
        existing.rows[0].id,
      ],
    );
    console.log(`Updated text id=${existing.rows[0].id} "${card.word}"`);
  }

  await applyImage(word);
}

const count = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [
  lessonId,
]);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [
  count.rows[0].n,
  lessonId,
]);

const ordered = await client.query(
  `SELECT id, word, example FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
  [lessonId],
);
const last = ordered.rows[ordered.rows.length - 1];
console.log(`\nLesson total: ${count.rows[0].n} words`);
console.log(`Card 300: id=${last.id} word="${last.word}" — ${last.example}`);

await client.close();
