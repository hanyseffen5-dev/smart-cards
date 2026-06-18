/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch9.mjs
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
    word: "imprisonment",
    translation: "سجن/حبس",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "Wrongful imprisonment can destroy a person's life.",
    exampleTranslation: "يمكن للسجن الظالم أن يدمر حياة الإنسان.",
    imageKey: "images_91",
    imageUuid: "6053383f",
  },
  {
    word: "in order to",
    translation: "من أجل أن",
    partOfSpeech: "phrase",
    difficulty: "easy",
    example: "She spoke quietly in order to avoid waking the baby.",
    exampleTranslation: "تحدثت بصوت خافت لتتجنب إيقاظ الطفل.",
    imageKey: "images_92",
    imageUuid: "ddd6571c",
  },
  {
    word: "otherwise",
    translation: "وإلا/بخلاف ذلك",
    partOfSpeech: "adverb",
    difficulty: "easy",
    example: "Hurry up, otherwise we will miss the train.",
    exampleTranslation: "أسرع، وإلا فسوف نفوت القطار.",
    imageKey: "images_100",
    imageUuid: "a8acc2ed",
  },
  {
    word: "get rid of",
    translation: "يتخلّص من",
    partOfSpeech: "phrasal verb",
    difficulty: "easy",
    example: "He tried to get rid of the documents before the police arrived.",
    exampleTranslation: "حاول التخلص من الوثائق قبل وصول الشرطة.",
    imageKey: "images_93",
    imageUuid: "7df50e8e",
  },
  {
    word: "disagreeable",
    translation: "غير مستساغ/مزعج",
    partOfSpeech: "adjective",
    difficulty: "medium",
    example: "The interrogator adopted a disagreeable tone to unsettle the suspect.",
    exampleTranslation: "اتخذ المحقق نبرة غير محببة لإرباك المشتبه به.",
    imageKey: "images_94",
    imageUuid: "7dee175c",
  },
  {
    word: "persevering",
    translation: "مثابر",
    partOfSpeech: "adjective",
    difficulty: "medium",
    example: "A persevering investigator revisits small details again and again.",
    exampleTranslation: "يعود المحقق المثابر إلى التفاصيل الصغيرة مرارًا وتكرارًا.",
    imageKey: "images_96",
    imageUuid: "a49154c2",
  },
  {
    word: "persistence",
    translation: "إصرار/مواظبة",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "Her persistence eventually uncovered the truth.",
    exampleTranslation: "أدى إصرارها في النهاية إلى كشف الحقيقة.",
    imageKey: "images_95",
    imageUuid: "f4ded851",
  },
  {
    word: "blockade",
    translation: "يحاصر/حصار",
    partOfSpeech: "verb",
    difficulty: "hard",
    example: "They decided to blockade the building until the suspect surrendered.",
    exampleTranslation: "قرروا محاصرة المبنى حتى يسلم المشتبه به نفسه.",
    imageKey: "images_98",
    imageUuid: "17f022ba",
  },
  {
    word: "seaman",
    translation: "بحّار",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "The seaman described the storm with remarkable calm.",
    exampleTranslation: "وصف البحّار العاصفة بهدوء لافت.",
    imageKey: "images_97",
    imageUuid: "8b3f1ef8",
  },
  {
    word: "argument",
    translation: "حُجّة/جدال",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "The lawyer presented an argument based on the timeline.",
    exampleTranslation: "قدّم المحامي حجةً استنادًا إلى التسلسل الزمني.",
    imageKey: "images_99",
    imageUuid: "706b2120",
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
