/**
 * Insert 6 missing grade 2 cards (builder, blueberry, recycle, safety, shrimp, doormat)
 * at curriculum id gaps so tail cards 595–600 align with knight…unicorn.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade2-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const MISSING = ["builder", "blueberry", "recycle", "safety", "shrimp", "doormat"];

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

loadEnvFile(join(rootDir, ".env"));
assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonId = (await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]))
  .rows[0].id;

const rows = (
  await client.query(`SELECT id, word FROM words WHERE lesson_id = $1 ORDER BY id ASC`, [lessonId])
).rows;

function targetIdForWord(word) {
  const seedIndex = GRADE2_CARDS.findIndex((c) => c.word === word);
  if (seedIndex < 0) return null;
  const prev = GRADE2_CARDS[seedIndex - 1];
  const next = GRADE2_CARDS[seedIndex + 1];
  const prevRow = prev ? rows.find((r) => r.word.toLowerCase() === prev.word.toLowerCase()) : null;
  const nextRow = next ? rows.find((r) => r.word.toLowerCase() === next.word.toLowerCase()) : null;
  if (prevRow && nextRow) {
    const gap = nextRow.id - prevRow.id;
    if (gap > 1) return prevRow.id + 1;
  }
  if (prevRow) return prevRow.id + 1;
  if (nextRow) return nextRow.id - 1;
  return null;
}

let added = 0;
for (const word of MISSING) {
  const exists = await client.query(
    `SELECT id FROM words WHERE lesson_id = $1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))`,
    [lessonId, word],
  );
  if (exists.rows.length > 0) {
    console.log(`Skip existing: ${word}`);
    continue;
  }
  const card = GRADE2_CARDS.find((c) => c.word === word);
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing asset for ${word}: ${src}`);
    process.exit(1);
  }
  const buf = await makeSquare(src);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  let insertId = targetIdForWord(word);
  if (insertId != null) {
    const taken = await client.query(`SELECT id, word FROM words WHERE id = $1`, [insertId]);
    if (taken.rows.length > 0) {
      console.log(`ID ${insertId} taken by ${taken.rows[0].word}, auto id for ${word}`);
      insertId = null;
    }
  }
  if (insertId == null) {
    const ins = await client.query(
      `INSERT INTO words (
        lesson_id, word, translation, image_url, example, example_translation,
        difficulty, part_of_speech, is_favorite
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false) RETURNING id`,
      [
        lessonId,
        card.word,
        card.translation,
        dataUrl,
        card.example,
        card.exampleTranslation,
        card.difficulty,
        card.partOfSpeech,
      ],
    );
    console.log(`Inserted id=${ins.rows[0].id} "${word}"`);
    rows.push({ id: ins.rows[0].id, word });
    rows.sort((a, b) => a.id - b.id);
  } else {
    const ins = await client.query(
      `INSERT INTO words (
        id, lesson_id, word, translation, image_url, example, example_translation,
        difficulty, part_of_speech, is_favorite
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false) RETURNING id`,
      [
        insertId,
        lessonId,
        card.word,
        card.translation,
        dataUrl,
        card.example,
        card.exampleTranslation,
        card.difficulty,
        card.partOfSpeech,
      ],
    );
    console.log(`Inserted id=${ins.rows[0].id} "${word}"`);
    rows.push({ id: ins.rows[0].id, word });
    rows.sort((a, b) => a.id - b.id);
  }
  added++;
}

await client.query(`SELECT setval(pg_get_serial_sequence('words', 'id'), (SELECT MAX(id) FROM words))`);

const count = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [lessonId]);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [count.rows[0].n, lessonId]);

const ordered = (
  await client.query(`SELECT word FROM words WHERE lesson_id = $1 ORDER BY id ASC`, [lessonId])
).rows;
for (const p of [595, 596, 597, 598, 599, 600]) {
  const w = ordered[p - 1];
  const seed = GRADE2_CARDS[p - 1];
  console.log(`Card ${p}: ${w?.word} (seed ${seed?.word}) ${w?.word === seed?.word ? "OK" : "X"}`);
}
console.log(`\nAdded ${added}. Total ${count.rows[0].n}`);
await client.close();
