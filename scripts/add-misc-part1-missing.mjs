/**
 * Adds the 3 part-1 cards that failed on first import (mystery, scandal, eclipse).
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cropIllustrationFromFile, bufferToDataUrl } from "./lib/illustration-crop.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const LESSON_TITLE = "Miscellaneous Words Part 1";
const IMAGES_DIR = join(rootDir, "scripts", "seed-data", "misc-words-part-1");

const CARDS = [
  {
    word: "mystery",
    translation: "لغز",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "The disappearance remains a mystery to this day.",
    exampleTranslation: "لا يزال الاختفاء لغزًا حتى اليوم.",
    image: "mystery.png",
  },
  {
    word: "scandal",
    translation: "فضيحة",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "The politician tried to hide the scandal from the press.",
    exampleTranslation: "حاول السياسي إخفاء الفضيحة عن الصحافة.",
    image: "scandal.png",
  },
  {
    word: "eclipse",
    translation: "يُطغي على / يَحجُب",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "New events eclipsed the older story in the newspapers.",
    exampleTranslation: "طغت أحداث جديدة على القصة الأقدم في الصحف.",
    image: "eclipse.png",
  },
];

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  LESSON_TITLE,
]);
if (!lesson.rows.length) {
  console.error("Lesson not found");
  process.exit(1);
}
const lessonId = lesson.rows[0].id;

let added = 0;
for (const card of CARDS) {
  const dup = await client.query(`SELECT id FROM words WHERE LOWER(word) = LOWER($1) LIMIT 1`, [
    card.word,
  ]);
  if (dup.rows.length) {
    console.log(`SKIP (exists): ${card.word}`);
    continue;
  }
  const imagePath = join(IMAGES_DIR, card.image);
  const cropped = await cropIllustrationFromFile(imagePath);
  const imageUrl = bufferToDataUrl(cropped);
  await client.query(
    `INSERT INTO words (
      lesson_id, word, translation, image_url, example, example_translation,
      difficulty, part_of_speech, is_favorite
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)`,
    [
      lessonId,
      card.word,
      card.translation,
      imageUrl,
      card.example,
      card.exampleTranslation,
      card.difficulty,
      card.partOfSpeech,
    ],
  );
  console.log(`ADDED: ${card.word}`);
  added++;
}

const total = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [
  lessonId,
]);
console.log(`Done. Added ${added}. Lesson total: ${total.rows[0].n}`);
await client.close();
