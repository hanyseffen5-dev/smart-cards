/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch8.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";
const LESSON_TITLE = "Miscellaneous Words Part 1";

const CARDS = [
  {
    word: "further",
    translation: "إضافي / أبعد",
    partOfSpeech: "adjective",
    difficulty: "medium",
    example: "They offered no further explanation for their decision.",
    exampleTranslation: "لم يقدموا أي تفسير إضافي لقرارهم.",
    imageKey: "images_81",
    imageUuid: "13119c13",
  },
  {
    word: "succeed",
    translation: "ينجح",
    partOfSpeech: "verb",
    difficulty: "easy",
    example: "He could not succeed without reliable information.",
    exampleTranslation: "لم يكن بإمكانه أن ينجح دون معلومات موثوقة.",
    imageKey: "images_82",
    imageUuid: "6fc2c954",
  },
  {
    word: "metallic",
    translation: "معدني/يشبه المعدن",
    partOfSpeech: "adjective",
    difficulty: "medium",
    example: "A metallic clink came from the drawer as it opened.",
    exampleTranslation: "صدر صوت رنين معدني من الدرج عند فتحه.",
    imageKey: "images_83",
    imageUuid: "0f83fc0d",
  },
  {
    word: "centre",
    translation: "مركز / محور",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "She became the centre of attention in the courtroom.",
    exampleTranslation: "أصبحت محطّ الأنظار في قاعة المحكمة.",
    imageKey: "images_84",
    imageUuid: "247db5db",
  },
  {
    word: "private",
    translation: "خاص",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "He enrolled his children in a private school.",
    exampleTranslation: "ألحق أبناءه بمدرسة خاصة.",
    imageKey: "images_85",
    imageUuid: "0d184b47",
  },
  {
    word: "considerable",
    translation: "كبير / ملحوظ",
    partOfSpeech: "adjective",
    difficulty: "medium",
    example: "She achieved considerable success despite limited resources.",
    exampleTranslation: "حققت نجاحًا ملحوظًا رغم محدودية الموارد.",
    imageKey: "images_86",
    imageUuid: "97100267",
  },
  {
    word: "success",
    translation: "نجاح",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "Their plan ended in success after months of effort.",
    exampleTranslation: "انتهت خطتهم بالنجاح بعد أشهر من الجهد.",
    imageKey: "images_87",
    imageUuid: "1cad4d55",
  },
  {
    word: "matter",
    translation: "مسألة/قضية",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "The matter became clearer after the witness spoke.",
    exampleTranslation: "أصبح الأمر أكثر وضوحًا بعد أن أدلى الشاهد بشهادته.",
    imageKey: "images_88",
    imageUuid: "ca71d32a",
  },
  {
    word: "fairly",
    translation: "إلى حدٍّ ما/بشكل منصف",
    partOfSpeech: "adverb",
    difficulty: "medium",
    example: "The evidence is fairly convincing despite a few gaps.",
    exampleTranslation: "الأدلة مقنعة إلى حدٍّ كبير رغم بعض الثغرات.",
    imageKey: "images_89",
    imageUuid: "24583634",
  },
  {
    word: "system",
    translation: "نظام/أسلوب",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "They developed a system to prevent unauthorized entry.",
    exampleTranslation: "قاموا بتطوير نظام لمنع الدخول غير المصرح به.",
    imageKey: "images_90",
    imageUuid: "25b87ba0",
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

function toDataUrl(filePath) {
  const buf = readFileSync(filePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
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
  const imageUrl = toDataUrl(filePath);
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
