/**
 * Creates lesson "Daniel - The Movie" from artifacts/api-server/src/seed.ts (idempotent).
 * Usage: node scripts/seed-daniel-lesson.mjs
 */
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const DANIEL_TITLE = "Daniel - The Movie";
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

function stripTs(s) {
  return s.replace(/\s+as const/g, "").replace(/:\s*"all"\s*\|\s*"beginner"[^;]*/g, ': "all"');
}

function loadDanielSeed() {
  const seedPath = join(rootDir, "artifacts", "api-server", "src", "seed.ts");
  let src = readFileSync(seedPath, "utf8");
  const lessonStart = src.indexOf("const SEED_LESSON = ");
  const wordsStart = src.indexOf("const SEED_WORDS");
  if (lessonStart < 0 || wordsStart < 0) {
    throw new Error(`Could not find SEED_LESSON / SEED_WORDS in ${seedPath}`);
  }
  const lessonSrc = stripTs(src.slice(lessonStart + "const SEED_LESSON = ".length, wordsStart).trim().replace(/;\s*$/, ""));
  const wordsEnd = src.indexOf("export async function seedIfEmpty");
  const wordsEq = src.indexOf("=", wordsStart);
  const wordsSrc = stripTs(src.slice(wordsEq + 1, wordsEnd).trim().replace(/;\s*$/, ""));
  const SEED_LESSON = eval(`(${lessonSrc})`);
  const SEED_WORDS = eval(`(${wordsSrc})`);
  return { SEED_LESSON, SEED_WORDS };
}

function embeddedDir(url) {
  if (url.startsWith("pglite://")) return url.slice("pglite://".length);
  if (url.startsWith("file:")) return url.slice("file:".length);
  return join(rootDir, ".data", "flashcards");
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT = rootDir;
assertServerNotRunning();

const { SEED_LESSON, SEED_WORDS } = loadDanielSeed();
const url = process.env.DATABASE_URL || "embedded";
const dir = embeddedDir(url);
mkdirSync(dirname(dir), { recursive: true });
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const existing = await client.query(`SELECT id, word_count FROM lessons WHERE title = $1 LIMIT 1`, [
  DANIEL_TITLE,
]);

if (existing.rows.length > 0) {
  const lessonId = existing.rows[0].id;
  const have = await client.query(`SELECT LOWER(TRIM(word)) AS w FROM words WHERE lesson_id = $1`, [lessonId]);
  const haveSet = new Set(have.rows.map((r) => r.w));
  let added = 0;
  for (const w of SEED_WORDS) {
    if (haveSet.has(w.word.toLowerCase())) continue;
    await client.query(
      `INSERT INTO words (
        lesson_id, word, translation, image_url, example, example_translation,
        difficulty, part_of_speech, is_favorite
      ) VALUES ($1, $2, $3, NULL, $4, NULL, $5, $6, false)`,
      [lessonId, w.word, w.translation, w.example, w.difficulty, w.partOfSpeech],
    );
    added++;
  }
  const n = await client.query(`SELECT COUNT(*)::int AS c FROM words WHERE lesson_id = $1`, [lessonId]);
  await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [n.rows[0].c, lessonId]);
  await client.close();
  console.log(`Daniel lesson id=${lessonId}: added ${added}, total ${n.rows[0].c} words.`);
  process.exit(0);
}

const inserted = await client.query(
  `INSERT INTO lessons (title, text, word_count, level)
   VALUES ($1, $2, $3, $4)
   RETURNING id`,
  [SEED_LESSON.title, SEED_LESSON.text, SEED_WORDS.length, SEED_LESSON.level ?? "all"],
);
const lessonId = inserted.rows[0].id;

for (const w of SEED_WORDS) {
  await client.query(
    `INSERT INTO words (
      lesson_id, word, translation, image_url, example, example_translation,
      difficulty, part_of_speech, is_favorite
    ) VALUES ($1, $2, $3, NULL, $4, NULL, $5, $6, false)`,
    [lessonId, w.word, w.translation, w.example, w.difficulty, w.partOfSpeech],
  );
}

await client.close();
console.log(`Created "${DANIEL_TITLE}" (id=${lessonId}) with ${SEED_WORDS.length} words.`);
