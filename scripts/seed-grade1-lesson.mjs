/**
 * Creates lesson "grade 1" with 300 vocabulary cards (idempotent).
 * Usage: node scripts/seed-grade1-lesson.mjs
 */
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import { GRADE1_CARDS, GRADE1_LESSON_TITLE } from "./seed-data/grade1-cards.mjs";

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
assertGrade123WriteAllowed("seed-grade1-lesson");

const url = process.env.DATABASE_URL || "embedded";
const dir = embeddedDir(url);
mkdirSync(dirname(dir), { recursive: true });
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const existing = await client.query(`SELECT id, word_count FROM lessons WHERE title = $1 LIMIT 1`, [
  GRADE1_LESSON_TITLE,
]);

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

if (existing.rows.length > 0) {
  const lessonId = existing.rows[0].id;
  const removed = await removeLessonDuplicates(lessonId);
  if (removed > 0) {
    console.log(`Removed ${removed} duplicate word(s) from "${GRADE1_LESSON_TITLE}".`);
  }
  const words = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [
    lessonId,
  ]);
  const n = words.rows[0].n;
  await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [n, lessonId]);
  if (n >= GRADE1_CARDS.length) {
    console.log(`Lesson "${GRADE1_LESSON_TITLE}" already exists (id=${lessonId}, ${n} words). OK.`);
    await client.close();
    process.exit(0);
  }
  console.log(`Lesson id=${lessonId} has ${n} words — adding missing cards...`);
  const have = await client.query(`SELECT LOWER(TRIM(word)) AS w FROM words WHERE lesson_id = $1`, [
    lessonId,
  ]);
  const haveSet = new Set(have.rows.map((r) => r.w));
  let added = 0;
  for (const card of GRADE1_CARDS) {
    if (haveSet.has(card.word.toLowerCase())) continue;
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

const lessonText =
  "Grade 1 English vocabulary — colors, animals, numbers, family, body, food, school, actions, nature, clothes, transport, seasons, and everyday words with simple example sentences.";

const insertedLesson = await client.query(
  `INSERT INTO lessons (title, text, word_count, level)
   VALUES ($1, $2, $3, $4)
   RETURNING id`,
  [GRADE1_LESSON_TITLE, lessonText, GRADE1_CARDS.length, "beginner"],
);
const lessonId = insertedLesson.rows[0].id;

for (const card of GRADE1_CARDS) {
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
}

await client.close();
console.log(`Created lesson "${GRADE1_LESSON_TITLE}" (id=${lessonId}) with ${GRADE1_CARDS.length} cards.`);
