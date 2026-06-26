/**
 * Creates lesson "grade 6" with vocabulary cards (idempotent).
 * Grade 6 is a NEW lesson (not part of the frozen curriculum), so it only
 * requires the dev-server safety check.
 * Usage:
 *   node scripts/seed-grade6-lesson.mjs          — add missing cards only
 *   node scripts/seed-grade6-lesson.mjs --sync   — remove obsolete words, add/update to match seed-data
 */
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { syncAppWordsTxt } from "./lib/app-words-registry.mjs";
import {
  GRADE6_CARDS,
  GRADE6_LESSON_TITLE,
  GRADE6_TARGET_TOTAL,
} from "./seed-data/grade6-cards.mjs";

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

const url = process.env.DATABASE_URL || "embedded";
const dir = embeddedDir(url);
mkdirSync(dirname(dir), { recursive: true });
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const sync = process.argv.includes("--sync");

const lessonText =
  "Grade 6 English vocabulary — academic thinking skills, language arts, science, math, and social studies words suited to Grade 6 learners. 2000 unique cards.";

const existing = await client.query(`SELECT id, word_count FROM lessons WHERE title = $1 LIMIT 1`, [
  GRADE6_LESSON_TITLE,
]);

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

async function syncLessonWords(lessonId) {
  const target = new Map(GRADE6_CARDS.map((c) => [c.word.toLowerCase().trim(), c]));
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
  await client.query(`UPDATE lessons SET word_count = $1, text = $2 WHERE id = $3`, [
    total,
    lessonText,
    lessonId,
  ]);
  return { deleted, updated, added, total };
}

async function finishSeed(message) {
  await client.close();
  const w = await syncAppWordsTxt();
  console.log(message);
  if (w.added > 0) console.log(`app-words.txt: +${w.added} new (${w.total} total).`);
}

if (existing.rows.length > 0) {
  const lessonId = existing.rows[0].id;
  if (sync) {
    const r = await syncLessonWords(lessonId);
    await finishSeed(
      `Synced "${GRADE6_LESSON_TITLE}" (id=${lessonId}): deleted ${r.deleted}, updated ${r.updated}, added ${r.added}. Total ${r.total} words.`,
    );
    process.exit(0);
  }
  const have = await client.query(`SELECT LOWER(TRIM(word)) AS w FROM words WHERE lesson_id = $1`, [
    lessonId,
  ]);
  const haveSet = new Set(have.rows.map((r) => r.w));
  const missing = GRADE6_CARDS.filter((c) => !haveSet.has(c.word.toLowerCase().trim()));
  const added = await insertCards(lessonId, missing);
  const finalCount = await client.query(
    `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`,
    [lessonId],
  );
  const total = finalCount.rows[0].n;
  await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [total, lessonId]);
  await finishSeed(
    `Added ${added} cards. Lesson "${GRADE6_LESSON_TITLE}" (id=${lessonId}) now has ${total} words.`,
  );
  process.exit(0);
}

const insertedLesson = await client.query(
  `INSERT INTO lessons (title, text, word_count, level)
   VALUES ($1, $2, $3, $4)
   RETURNING id`,
  [GRADE6_LESSON_TITLE, lessonText, GRADE6_TARGET_TOTAL, "advanced"],
);
const lessonId = insertedLesson.rows[0].id;

const added = await insertCards(lessonId, GRADE6_CARDS);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [added, lessonId]);

await finishSeed(
  `Created lesson "${GRADE6_LESSON_TITLE}" (id=${lessonId}) with ${added} cards (target ${GRADE6_TARGET_TOTAL}).`,
);
