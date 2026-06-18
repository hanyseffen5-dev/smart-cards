/**
 * Merge cards (with images only) from Daniel - The Movie and Miscellaneous Words Part 1
 * into a new lesson "Miscellaneous Words".
 * Skips words already in grade 1–5 and deduplicates within the merge.
 *
 * Usage: node scripts/create-miscellaneous-words-lesson.mjs
 * Stop pnpm dev before running.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import {
  assertGrade123WriteAllowed,
  GRADE_CURRICULUM_TITLES,
  wordHasStoredImage,
} from "./lib/protect-grade123.mjs";

const NEW_LESSON_TITLE = "Miscellaneous Words";
const SOURCE_LESSONS = ["Daniel - The Movie", "Miscellaneous Words Part 1"];

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

function normWord(w) {
  return String(w ?? "").trim().toLowerCase();
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("create-miscellaneous-words-lesson");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

async function lessonIdByTitle(title) {
  const res = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [title]);
  return res.rows[0]?.id ?? null;
}

async function wordsWithImages(lessonId) {
  const res = await client.query(
    `SELECT word, translation, image_url, example, example_translation,
            difficulty, part_of_speech
     FROM words
     WHERE lesson_id = $1
     ORDER BY id`,
    [lessonId],
  );
  return res.rows.filter((r) => wordHasStoredImage(r));
}

/** Words used in frozen grade 1–5 lessons (read-only). */
async function gradeCurriculumWordSet() {
  const set = new Set();
  for (const title of GRADE_CURRICULUM_TITLES) {
    const id = await lessonIdByTitle(title);
    if (!id) continue;
    const res = await client.query(
      `SELECT LOWER(TRIM(word)) AS w FROM words WHERE lesson_id = $1`,
      [id],
    );
    for (const row of res.rows) set.add(row.w);
  }
  return set;
}

const gradeWords = await gradeCurriculumWordSet();
const merged = [];
const seen = new Set();
let skippedNoImage = 0;
let skippedGradeOverlap = 0;
let skippedDup = 0;

for (const sourceTitle of SOURCE_LESSONS) {
  const lessonId = await lessonIdByTitle(sourceTitle);
  if (!lessonId) {
    console.error(`Source lesson not found: "${sourceTitle}"`);
    process.exit(1);
  }
  const allRows = await client.query(
    `SELECT word, translation, image_url, example, example_translation,
            difficulty, part_of_speech
     FROM words WHERE lesson_id = $1 ORDER BY id`,
    [lessonId],
  );
  for (const row of allRows.rows) {
    if (!wordHasStoredImage(row)) {
      skippedNoImage++;
      continue;
    }
    const key = normWord(row.word);
    if (gradeWords.has(key)) {
      skippedGradeOverlap++;
      continue;
    }
    if (seen.has(key)) {
      skippedDup++;
      continue;
    }
    seen.add(key);
    merged.push({ ...row, source: sourceTitle });
  }
}

console.log(`Sources: ${SOURCE_LESSONS.join(" + ")}`);
console.log(`Skipped (no image): ${skippedNoImage}`);
console.log(`Skipped (grade 1–5 overlap): ${skippedGradeOverlap}`);
console.log(`Skipped (duplicate across sources): ${skippedDup}`);
console.log(`Cards to insert: ${merged.length}`);

const existing = await client.query(`SELECT id, word_count FROM lessons WHERE title = $1 LIMIT 1`, [
  NEW_LESSON_TITLE,
]);

if (existing.rows.length > 0) {
  const lessonId = existing.rows[0].id;
  const count = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [
    lessonId,
  ]);
  if (count.rows[0].n === merged.length) {
    console.log(
      `Lesson "${NEW_LESSON_TITLE}" already exists (id=${lessonId}, ${count.rows[0].n} words). OK.`,
    );
    await client.close();
    process.exit(0);
  }
  console.log(
    `Lesson "${NEW_LESSON_TITLE}" exists (id=${lessonId}) with ${count.rows[0].n} words — rebuilding ${merged.length} cards.`,
  );
  await client.query(`DELETE FROM words WHERE lesson_id = $1`, [lessonId]);
  await client.query(
    `UPDATE lessons SET word_count = $1, text = $2 WHERE id = $3`,
    [
      merged.length,
      "Mixed vocabulary from Daniel - The Movie and Miscellaneous Words Part 1 — unique words with illustrations, excluding grade 1–4 curriculum.",
      lessonId,
    ],
  );
  for (const card of merged) {
    await client.query(
      `INSERT INTO words (
        lesson_id, word, translation, image_url, example, example_translation,
        difficulty, part_of_speech, is_favorite
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)`,
      [
        lessonId,
        card.word,
        card.translation,
        card.image_url,
        card.example,
        card.example_translation,
        card.difficulty,
        card.part_of_speech,
      ],
    );
  }
  console.log(`Rebuilt lesson "${NEW_LESSON_TITLE}" (id=${lessonId}) with ${merged.length} cards.`);
  await client.close();
  process.exit(0);
}

const lessonText =
  "Mixed vocabulary from Daniel - The Movie and Miscellaneous Words Part 1 — unique words with illustrations, excluding grade 1–4 curriculum.";

const inserted = await client.query(
  `INSERT INTO lessons (title, text, word_count, level)
   VALUES ($1, $2, $3, $4)
   RETURNING id`,
  [NEW_LESSON_TITLE, lessonText, merged.length, "all"],
);
const lessonId = inserted.rows[0].id;

for (const card of merged) {
  await client.query(
    `INSERT INTO words (
      lesson_id, word, translation, image_url, example, example_translation,
      difficulty, part_of_speech, is_favorite
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)`,
    [
      lessonId,
      card.word,
      card.translation,
      card.image_url,
      card.example,
      card.example_translation,
      card.difficulty,
      card.part_of_speech,
    ],
  );
}

const withImg = await client.query(
  `SELECT COUNT(*)::int AS n FROM words
   WHERE lesson_id = $1 AND image_url IS NOT NULL AND image_url != ''`,
  [lessonId],
);
console.log(
  `Created lesson "${NEW_LESSON_TITLE}" (id=${lessonId}) with ${merged.length} cards (${withImg.rows[0].n} with images).`,
);
await client.close();
