/**
 * Creates lesson "grade 2" with 600 vocabulary cards (idempotent).
 * Usage:
 *   node scripts/seed-grade2-lesson.mjs          — add missing cards only
 *   node scripts/seed-grade2-lesson.mjs --sync   — remove obsolete words, add/update to match seed-data
 */
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import {
  GRADE2_CARDS,
  GRADE2_LESSON_TITLE,
  GRADE2_TARGET_TOTAL,
} from "./seed-data/grade2-cards.mjs";

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

function embeddedDir(url) {
  if (url.startsWith("pglite://")) return url.slice("pglite://".length);
  if (url.startsWith("file:")) return url.slice("file:".length);
  return join(rootDir, ".data", "flashcards");
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT = rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("seed-grade2-lesson");

const url = process.env.DATABASE_URL || "embedded";
const dir = embeddedDir(url);
mkdirSync(dirname(dir), { recursive: true });
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const sync = process.argv.includes("--sync");

const existing = await client.query(`SELECT id, word_count FROM lessons WHERE title = $1 LIMIT 1`, [
  GRADE2_LESSON_TITLE,
]);

const lessonText =
  "Grade 2 English vocabulary — school, home, playground, numbers, food, animals, weather, feelings, and daily actions. Suited to Grade 2 learners (not Grade 3+ words).";

async function syncLessonWords(lessonId) {
  const target = new Map(
    GRADE2_CARDS.map((c) => [c.word.toLowerCase().trim(), c]),
  );
  const rows = await client.query(
    `SELECT id, LOWER(TRIM(word)) AS w FROM words WHERE lesson_id = $1`,
    [lessonId],
  );
  let deleted = 0;
  let updated = 0;
  for (const row of rows.rows) {
    const card = target.get(row.w);
    if (!card) {
      await client.query(`DELETE FROM words WHERE id = $1`, [row.id]);
      deleted++;
      continue;
    }
    await client.query(
      `UPDATE words SET
        word = $2, translation = $3, example = $4, example_translation = $5,
        difficulty = $6, part_of_speech = $7
       WHERE id = $1`,
      [
        row.id,
        card.word,
        card.translation,
        card.example,
        card.exampleTranslation,
        card.difficulty,
        card.partOfSpeech,
      ],
    );
    updated++;
    target.delete(row.w);
  }
  const added = await insertCards(lessonId, [...target.values()]);
  const finalCount = await client.query(
    `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`,
    [lessonId],
  );
  const total = finalCount.rows[0].n;
  await client.query(
    `UPDATE lessons SET word_count = $1, text = $2 WHERE id = $3`,
    [total, lessonText, lessonId],
  );
  return { deleted, updated, added, total };
}

async function removeLessonDuplicates(lessonId) {
  const dupes = await client.query(
    `SELECT LOWER(TRIM(word)) AS w
     FROM words WHERE lesson_id = $1
     GROUP BY LOWER(TRIM(word)) HAVING COUNT(*) > 1`,
    [lessonId],
  );
  let deleted = 0;
  for (const { w } of dupes.rows) {
    const all = await client.query(
      `SELECT id FROM words
       WHERE lesson_id = $1 AND LOWER(TRIM(word)) = $2
       ORDER BY id`,
      [lessonId, w],
    );
    for (const row of all.rows.slice(1)) {
      await client.query(`DELETE FROM words WHERE id = $1`, [row.id]);
      deleted++;
    }
  }
  return deleted;
}

async function insertCards(lessonId, cards) {
  let added = 0;
  for (const card of cards) {
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
    added++;
  }
  return added;
}

if (existing.rows.length > 0) {
  const lessonId = existing.rows[0].id;
  const removed = await removeLessonDuplicates(lessonId);
  if (removed > 0) {
    console.log(`Removed ${removed} duplicate word(s) from "${GRADE2_LESSON_TITLE}".`);
  }
  if (sync) {
    const r = await syncLessonWords(lessonId);
    await client.close();
    console.log(
      `Synced "${GRADE2_LESSON_TITLE}" (id=${lessonId}): deleted ${r.deleted}, updated ${r.updated}, added ${r.added}. Total ${r.total} words.`,
    );
    process.exit(0);
  }
  const words = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [
    lessonId,
  ]);
  const n = words.rows[0].n;
  await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [n, lessonId]);
  if (n >= GRADE2_CARDS.length) {
    console.log(
      `Lesson "${GRADE2_LESSON_TITLE}" already exists (id=${lessonId}, ${n} words). OK.`,
    );
    await client.close();
    process.exit(0);
  }
  console.log(`Lesson id=${lessonId} has ${n} words — adding missing cards...`);
  const have = await client.query(`SELECT LOWER(TRIM(word)) AS w FROM words WHERE lesson_id = $1`, [
    lessonId,
  ]);
  const haveSet = new Set(have.rows.map((r) => r.w));
  const missing = GRADE2_CARDS.filter((c) => !haveSet.has(c.word.toLowerCase()));
  const added = await insertCards(lessonId, missing);
  const finalCount = await client.query(
    `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`,
    [lessonId],
  );
  const total = finalCount.rows[0].n;
  await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [total, lessonId]);
  await client.close();
  console.log(`Added ${added} cards. Lesson id=${lessonId} now has ${total} words.`);
  process.exit(0);
}

const insertedLesson = await client.query(
  `INSERT INTO lessons (title, text, word_count, level)
   VALUES ($1, $2, $3, $4)
   RETURNING id`,
  [GRADE2_LESSON_TITLE, lessonText, GRADE2_TARGET_TOTAL, "beginner"],
);
const lessonId = insertedLesson.rows[0].id;

const added = await insertCards(lessonId, GRADE2_CARDS);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [added, lessonId]);

await client.close();
console.log(
  `Created lesson "${GRADE2_LESSON_TITLE}" (id=${lessonId}) with ${added} cards (target ${GRADE2_TARGET_TOTAL}).`,
);
