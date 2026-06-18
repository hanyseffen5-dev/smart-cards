/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch11.mjs
 *
 * Image-to-word mapping verified by reading each file individually.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cropIllustrationFromFile, bufferToDataUrl } from "./lib/illustration-crop.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";
const LESSON_TITLE = "Miscellaneous Words Part 1";

const CARDS = [
  {
    word: "slight",
    translation: "يُهمِل / يَنتقص",
    partOfSpeech: "verb",
    difficulty: "hard",
    example: "She felt slighted when her opinions were ignored.",
    exampleTranslation: "شعرت بالإهانة عندما تم تجاهل آرائها.",
    imageKey: "images_111",
    imageUuid: "f5719291",
  },
  {
    word: "have no say",
    translation: "لا يكون له رأي/قرار",
    partOfSpeech: "phrase",
    difficulty: "medium",
    example: "He had no say in the matter despite being affected by it.",
    exampleTranslation: "لم يكن له رأي في الأمر رغم أنه كان متأثرًا به.",
    imageKey: "images_112",
    imageUuid: "d5c72356",
  },
  {
    word: "rights",
    translation: "حقوق",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "She insisted on her rights under the agreement.",
    exampleTranslation: "أصرت على حقوقها بموجب الاتفاقية.",
    imageKey: "images_113",
    imageUuid: "eb97d8cd",
  },
  {
    word: "will",
    translation: "وصيّة",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "The property was distributed according to the will.",
    exampleTranslation: "تم توزيع التركة وفقًا للوصية.",
    imageKey: "images_114",
    imageUuid: "cc3a8f17",
  },
  {
    word: "patient",
    translation: "صبور",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "She remained patient during the long investigation.",
    exampleTranslation: "ظلت صبورة خلال التحقيق الطويل.",
    imageKey: "images_115",
    imageUuid: "d43a5f68",
  },
  {
    word: "leave (something) in (someone's) hands",
    translation: "يترك (شيئًا) في يد/عهدة (شخص)",
    partOfSpeech: "phrase",
    difficulty: "medium",
    example: "He left the finances in his father's hands.",
    exampleTranslation: "ترك الأمور المالية بين يدي والده.",
    imageKey: "images_116",
    imageUuid: "0db6c7a2",
  },
  {
    word: "safe",
    translation: "آمن / مطمئن",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "He felt safe because she would never challenge him publicly.",
    exampleTranslation: "كان يشعر بالأمان لأنها لم تكن لتتحداه علنًا أبدًا.",
    imageKey: "images_117",
    imageUuid: "9d34d455",
  },
  {
    word: "come forward",
    translation: "يتقدّم (للظهور/للإعلان عن نفسه)",
    partOfSpeech: "phrasal verb",
    difficulty: "medium",
    example: "A new witness came forward with crucial information.",
    exampleTranslation: "تقدّم شاهدٌ جديدٌ بمعلوماتٍ حاسمة.",
    imageKey: "images_118",
    imageUuid: "b2acbf22",
  },
  {
    word: "law",
    translation: "القانون",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "The lawyer explained what the law would allow him to claim.",
    exampleTranslation: "شرح المحامي ما الذي يحق له المطالبة به وفقًا للقانون.",
    imageKey: "images_119",
    imageUuid: "ea7f38af",
  },
  {
    word: "put a stop to",
    translation: "يضع حدًّا لـ",
    partOfSpeech: "verb phrase",
    difficulty: "medium",
    example: "They tried to put a stop to the marriage plans.",
    exampleTranslation: "حاولوا إيقاف خطط الزواج.",
    imageKey: "images_120",
    imageUuid: "b73f7a67",
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

function findAssetFile(imageKey, uuid) {
  const files = readdirSync(ASSETS_DIR);
  const match = files.find(
    (f) => f.includes(imageKey) && f.includes(uuid) && f.endsWith(".png"),
  );
  return match ? join(ASSETS_DIR, match) : null;
}

async function toDataUrl(filePath) {
  const buf = await cropIllustrationFromFile(filePath);
  return bufferToDataUrl(buf);
}

loadEnvFile(join(rootDir, ".env"));
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lesson.rows.length === 0) { console.error("Lesson not found!"); await client.close(); process.exit(1); }
const lessonId = lesson.rows[0].id;

let added = 0, skipped = 0;
for (const card of CARDS) {
  const existing = await client.query(`SELECT id FROM words WHERE LOWER(TRIM(word)) = LOWER(TRIM($1)) LIMIT 1`, [card.word]);
  if (existing.rows.length > 0) { console.log(`  SKIP (duplicate): "${card.word}"`); skipped++; continue; }
  const filePath = findAssetFile(card.imageKey, card.imageUuid);
  if (!filePath) { console.error(`  ERROR: file not found for ${card.imageKey}`); skipped++; continue; }
  const imageUrl = await toDataUrl(filePath);
  await client.query(
    `INSERT INTO words (lesson_id, word, translation, image_url, example, example_translation, difficulty, part_of_speech, is_favorite) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false)`,
    [lessonId, card.word, card.translation, imageUrl, card.example, card.exampleTranslation, card.difficulty, card.partOfSpeech],
  );
  console.log(`  ADDED: "${card.word}" ← ${card.imageKey}`);
  added++;
}

const wc = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [lessonId]);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [wc.rows[0].n, lessonId]);
await client.close();
console.log(`\nDone. Added: ${added}, Skipped: ${skipped}. Total: ${wc.rows[0].n}`);
