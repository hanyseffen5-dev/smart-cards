/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch5.mjs
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
    word: "baffle",
    translation: "يُحيّر",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "The puzzle baffled the students.",
    exampleTranslation: "حيّر اللغز الطلاب.",
    imageKey: "images_51",
    imageUuid: "18a56480",
  },
  {
    word: "distinction",
    translation: "تمييز / فرق",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "There is a distinction between seeing and observing.",
    exampleTranslation: "هناك فرق بين الرؤية والملاحظة.",
    imageKey: "images_52",
    imageUuid: "cf7f6052",
  },
  {
    word: "owe",
    translation: "يَدين بـ / يستحقّ",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "We owe Mrs. Toller an apology for doubting her account.",
    exampleTranslation: "نحن مدينون للسيدة تولر باعتذار لأننا شككنا في روايتها.",
    imageKey: "images_53",
    imageUuid: "77aecd2f",
  },
  {
    word: "apology",
    translation: "اعتذار",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "His apology sounded sincere and immediate.",
    exampleTranslation: "بدا اعتذاره صادقًا وفوريًا.",
    imageKey: "images_54",
    imageUuid: "5537a0f0",
  },
  {
    word: "clear up",
    translation: "يوضّح / يزيل الغموض",
    partOfSpeech: "phrasal verb",
    difficulty: "medium",
    example: "Her testimony cleared up the confusion around the case.",
    exampleTranslation: "أزالت شهادتها الغموض الذي كان يحيط بالقضية.",
    imageKey: "images_55",
    imageUuid: "4f6d1494",
  },
  {
    word: "puzzle",
    translation: "يُحيّر / يربك",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "The contradictory statements puzzled the investigators.",
    exampleTranslation: "حيّرت التصريحات المتناقضة المحققين.",
    imageKey: "images_56",
    imageUuid: "2dea6187",
  },
  {
    word: "surgeon",
    translation: "جرّاح",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "The surgeon arrived quickly after hearing about the injury.",
    exampleTranslation: "وصل الجرّاح بسرعة بعد أن سمع عن الإصابة.",
    imageKey: "images_57",
    imageUuid: "193f8b09",
  },
  {
    word: "locus standi",
    translation: "الصفة القانونية / الأهلية لرفع دعوى",
    partOfSpeech: "noun",
    difficulty: "hard",
    example: "Without locus standi, he could not challenge the decision in court.",
    exampleTranslation: "لولا توافر الصفة القانونية، لما تمكن من الطعن في القرار أمام المحكمة.",
    imageKey: "images_58",
    imageUuid: "a358d1dc",
  },
  {
    word: "rather",
    translation: "إلى حدّ ما / نوعًا ما",
    partOfSpeech: "adverb",
    difficulty: "easy",
    example: "The explanation was rather convincing despite the gaps.",
    exampleTranslation: "كان الشرح مقنعًا إلى حدٍّ ما رغم الثغرات.",
    imageKey: "images_59",
    imageUuid: "9a3e8b35",
  },
  {
    word: "solve",
    translation: "يحلّ (لغزًا/مشكلة)",
    partOfSpeech: "verb",
    difficulty: "easy",
    example: "They managed to solve the mystery before nightfall.",
    exampleTranslation: "تمكّنوا من حلّ اللغز قبل حلول الليل.",
    imageKey: "images_60",
    imageUuid: "780e8938",
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
