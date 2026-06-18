/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch4.mjs
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
    word: "ridiculous",
    translation: "سخيف",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "The excuse sounded ridiculous.",
    exampleTranslation: "بدت الحجة سخيفة.",
    imageKey: "images_50",
    imageUuid: "83d86d46",
  },
  {
    word: "remark",
    translation: "يُعلّق / يَذكر",
    partOfSpeech: "verb",
    difficulty: "easy",
    example: "She remarked that the room felt cold.",
    exampleTranslation: "علّقت بأن الغرفة تبدو باردة.",
    imageKey: "images_41",
    imageUuid: "4aa2beb1",
  },
  {
    word: "deduce",
    translation: "يَستنتِج",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "From the footprints, he deduced the suspect's height.",
    exampleTranslation: "من آثار الأقدام استنتج طول المشتبه به.",
    imageKey: "images_43",
    imageUuid: "dbf5ceb7",
  },
  {
    word: "clumsy",
    translation: "أخرق / غير ماهر",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "He made a clumsy mistake while carrying the tray.",
    exampleTranslation: "ارتكب خطأً أخرق وهو يحمل الصينية.",
    imageKey: "images_44",
    imageUuid: "366d11cc",
  },
  {
    word: "trifle",
    translation: "شيء تافه / قليل",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "It was only a trifle, but it worried him.",
    exampleTranslation: "كان شيئًا تافهًا، لكنه أقلقه.",
    imageKey: "images_42",
    imageUuid: "bcc423e8",
  },
  {
    word: "conceal",
    translation: "يُخفي",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "He tried to conceal the letter in his coat.",
    exampleTranslation: "حاول إخفاء الرسالة في معطفه.",
    imageKey: "images_49",
    imageUuid: "daca8a84",
  },
  {
    word: "bulge",
    translation: "انتفاخ",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "There was a bulge in his pocket.",
    exampleTranslation: "كان هناك انتفاخ في جيبه.",
    imageKey: "images_48",
    imageUuid: "c715853c",
  },
  {
    word: "incorrigible",
    translation: "لا يُصلَح / ميؤوس منه",
    partOfSpeech: "adjective",
    difficulty: "hard",
    example: "He is incorrigible and never follows rules.",
    exampleTranslation: "هو لا يُصلَح ولا يتبع القواعد أبدًا.",
    imageKey: "images_45",
    imageUuid: "bf6b81c1",
  },
  {
    word: "malignant",
    translation: "خبيث / مؤذٍ",
    partOfSpeech: "adjective",
    difficulty: "hard",
    example: "A malignant rumor spread quickly.",
    exampleTranslation: "انتشرت إشاعة خبيثة بسرعة.",
    imageKey: "images_46",
    imageUuid: "919d9b91",
  },
  {
    word: "specimen",
    translation: "نموذج / عيّنة",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "This specimen shows how the machine works.",
    exampleTranslation: "يوضح هذا النموذج كيف تعمل الآلة.",
    imageKey: "images_47",
    imageUuid: "c0a48bec",
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
