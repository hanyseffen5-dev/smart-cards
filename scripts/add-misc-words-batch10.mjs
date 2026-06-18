/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch10.mjs
 * 
 * Image-to-word mapping verified by reading each file individually.
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
    word: "convince",
    translation: "يُقنع",
    partOfSpeech: "verb",
    difficulty: "easy",
    example: "The detective tried to convince the guard to cooperate.",
    exampleTranslation: "حاول المحقق إقناع الحارس بالتعاون.",
    imageKey: "images_101",
    imageUuid: "e2435614",
  },
  {
    word: "interest",
    translation: "مصلحة/اهتمام",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "It was in her interest to tell the truth early.",
    exampleTranslation: "كان من مصلحتها أن تقول الحقيقة مبكرًا.",
    imageKey: "images_102",
    imageUuid: "bfaa3944",
  },
  {
    word: "free-handed",
    translation: "كريم/سخي",
    partOfSpeech: "adjective",
    difficulty: "hard",
    example: "A free-handed patron paid everyone's expenses without hesitation.",
    exampleTranslation: "تكفّل راعٍ كريم بسداد نفقات الجميع دون تردد.",
    imageKey: "images_103",
    imageUuid: "e2cb525f",
  },
  {
    word: "gentleman",
    translation: "رجل نبيل/سيد",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "He behaved like a gentleman even under pressure.",
    exampleTranslation: "تصرف كرجل نبيل حتى تحت الضغط.",
    imageKey: "images_104",
    imageUuid: "6ef1a6b7",
  },
  {
    word: "ladder",
    translation: "سلّم",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "They placed a ladder against the wall to reach the window.",
    exampleTranslation: "وضعوا سلّمًا مسنودًا إلى الحائط للوصول إلى النافذة.",
    imageKey: "images_105",
    imageUuid: "ae63b5de",
  },
  {
    word: "remain",
    translation: "يتبقّى",
    partOfSpeech: "verb",
    difficulty: "easy",
    example: "Only one question remained after the witness finished speaking.",
    exampleTranslation: "لم يتبقَّ سوى سؤال واحد بعد أن انتهى الشاهد من الإدلاء بشهادته.",
    imageKey: "images_106",
    imageUuid: "895130e3",
  },
  {
    word: "make clear",
    translation: "يوضّح",
    partOfSpeech: "verb phrase",
    difficulty: "medium",
    example: "The witness promised to make clear what happened that night.",
    exampleTranslation: "وعد الشاهد بتوضيح ما حدث تلك الليلة.",
    imageKey: "images_107",
    imageUuid: "8e7e3c89",
  },
  {
    word: "cellar",
    translation: "قبو",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "They searched the cellar for any hidden evidence.",
    exampleTranslation: "فتشوا القبو بحثًا عن أي دليل مخفي.",
    imageKey: "images_108",
    imageUuid: "f4046b1b",
  },
  {
    word: "police court",
    translation: "محكمة الشرطة",
    partOfSpeech: "noun",
    difficulty: "hard",
    example: "He was summoned to the police court to answer the charge.",
    exampleTranslation: "استُدعي إلى محكمة الشرطة للمثول أمام تهمةٍ موجهةٍ إليه.",
    imageKey: "images_109",
    imageUuid: "8ffd9d60",
  },
  {
    word: "stand (someone's) friend",
    translation: "يساند (شخصًا) / يكون عونًا له",
    partOfSpeech: "idiom",
    difficulty: "hard",
    example: "In the crisis, she stood his friend and spoke on his behalf.",
    exampleTranslation: "في الأزمة، وقفت إلى جانب صديقه وتحدثت نيابةً عنه.",
    imageKey: "images_110",
    imageUuid: "46f56824",
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
