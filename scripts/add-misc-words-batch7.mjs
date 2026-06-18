/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch7.mjs
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
    word: "past",
    translation: "الماضي / سابق",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "His past returned to trouble him unexpectedly.",
    exampleTranslation: "عاد ماضيه ليزعجه على نحو غير متوقع.",
    imageKey: "images_71",
    imageUuid: "556b8eef",
  },
  {
    word: "difficult",
    translation: "صعب",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "It became difficult to separate rumor from fact.",
    exampleTranslation: "أصبح من الصعب التمييز بين الشائعة والحقيقة.",
    imageKey: "images_72",
    imageUuid: "d2ec1736",
  },
  {
    word: "part from",
    translation: "يفترق عن / يترك",
    partOfSpeech: "phrasal verb",
    difficulty: "medium",
    example: "He found it hard to part from the staff who had served him for years.",
    exampleTranslation: "وجد صعوبة في فراق الموظفين الذين خدموه لسنوات.",
    imageKey: "images_73",
    imageUuid: "57b171d0",
  },
  {
    word: "flight",
    translation: "فرار / هروب",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "Their sudden flight raised suspicion among the neighbors.",
    exampleTranslation: "أثار فرارهم المفاجئ الشك لدى الجيران.",
    imageKey: "images_74",
    imageUuid: "1c618d2b",
  },
  {
    word: "holder",
    translation: "حامل / شاغل (منصب)",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "He became the holder of an important public office.",
    exampleTranslation: "أصبح شاغلًا لمنصبٍ عامٍ مهم.",
    imageKey: "images_75",
    imageUuid: "5da4fd22",
  },
  {
    word: "government",
    translation: "حكومة / حكومي",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "She applied for a government position in the capital.",
    exampleTranslation: "تقدّمت بطلب لوظيفة حكومية في العاصمة.",
    imageKey: "images_76",
    imageUuid: "3ab20b02",
  },
  {
    word: "appointment",
    translation: "تعيين / منصب",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "His appointment was announced in the official paper.",
    exampleTranslation: "أُعلن عن تعيينه في الجريدة الرسمية.",
    imageKey: "images_77",
    imageUuid: "311616db",
  },
  {
    word: "island",
    translation: "جزيرة",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "They moved to an island far from the public eye.",
    exampleTranslation: "انتقلوا إلى جزيرة بعيدة عن أنظار الناس.",
    imageKey: "images_78",
    imageUuid: "0d5ce0b8",
  },
  {
    word: "manifest",
    translation: "يُظهر / يُبدي",
    partOfSpeech: "verb",
    difficulty: "hard",
    example: "He did not manifest any interest once the case was over.",
    exampleTranslation: "لم يُبدِ أي اهتمام بمجرد انتهاء القضية.",
    imageKey: "images_79",
    imageUuid: "b60e8a98",
  },
  {
    word: "disappointment",
    translation: "خيبة أمل",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "To her disappointment, the letter never arrived.",
    exampleTranslation: "لخيبة أملها، لم تصل الرسالة أبدًا.",
    imageKey: "images_80",
    imageUuid: "1dd73d13",
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
