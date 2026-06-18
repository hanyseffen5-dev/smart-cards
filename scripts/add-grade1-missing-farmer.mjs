/**
 * Insert missing grade 1 "farmer" card + image (restores 300 cards; nice stays last in seed).
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

const WORD = "farmer";
const card = GRADE1_CARDS.find((c) => c.word === WORD);
if (!card) {
  console.error(`"${WORD}" not in seed`);
  process.exit(1);
}

loadEnvFile(join(rootDir, ".env"));
assertServerNotRunning();

const src = assetPath(WORD);
if (!existsSync(src)) {
  console.error(`Missing asset: ${src}`);
  process.exit(1);
}

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  GRADE1_LESSON_TITLE,
]);
const lessonId = lessonRes.rows[0].id;

const FARMER_ID = 633; // gap between baker (634) and driver (635) in curriculum order

const exists = await client.query(
  `SELECT id FROM words WHERE lesson_id = $1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))`,
  [lessonId, WORD],
);
if (exists.rows.length > 0) {
  console.log(`"${WORD}" already in DB id=${exists.rows[0].id}`);
} else {
  const slot = await client.query(`SELECT id, word FROM words WHERE id = $1`, [FARMER_ID]);
  if (slot.rows.length > 0) {
    console.error(`ID ${FARMER_ID} already used by "${slot.rows[0].word}"`);
    process.exit(1);
  }
  const buf = await makeSquare(src);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const ins = await client.query(
    `INSERT INTO words (
      id, lesson_id, word, translation, image_url, example, example_translation,
      difficulty, part_of_speech, is_favorite
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)
    RETURNING id`,
    [
      FARMER_ID,
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
  await client.query(
    `SELECT setval(pg_get_serial_sequence('words', 'id'), (SELECT MAX(id) FROM words))`,
  );
  console.log(`Inserted id=${ins.rows[0].id} "${card.word}" — ${card.example}`);
}

const count = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [
  lessonId,
]);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [count.rows[0].n, lessonId]);

const ordered = await client.query(
  `SELECT id, word, example,
    CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
   FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
  [lessonId],
);
const last = ordered.rows[ordered.rows.length - 1];
console.log(`Total: ${count.rows[0].n}`);
console.log(`Card ${ordered.rows.length}: id=${last.id} "${last.word}" img=${last.has_img} — ${last.example}`);

await client.close();
