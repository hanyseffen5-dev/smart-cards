/**
 * Adds 12 new cards to "Miscellaneous Words Part 1" with correct image mapping.
 * Skips any word that already exists in the database (global uniqueness).
 *
 * Usage: node scripts/add-misc-words-batch3.mjs
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
    word: "drift",
    translation: "يبتعد تدريجيًا / ينساب",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "After graduation, they drifted apart.",
    exampleTranslation: "بعد التخرج، ابتعدوا عن بعضهم تدريجيًا.",
    imageKey: "images_18",
    imageUuid: "87a0e39f",
  },
  {
    word: "absorb",
    translation: "يستوعب / يَشغل",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "The project absorbed all her attention.",
    exampleTranslation: "شغل المشروع كل انتباهها.",
    imageKey: "images_20",
    imageUuid: "25d087fd",
  },
  {
    word: "introspective",
    translation: "تأمّلي / يميل لمراجعة الذات",
    partOfSpeech: "adjective",
    difficulty: "hard",
    example: "He grew introspective after the incident.",
    exampleTranslation: "أصبح تأمّليًا بعد الحادثة.",
    imageKey: "images_40",
    imageUuid: "d1ec8120",
  },
  {
    word: "delicately",
    translation: "بلُطف / بحذر",
    partOfSpeech: "adverb",
    difficulty: "medium",
    example: "She handled the sensitive topic delicately.",
    exampleTranslation: "تعاملت مع الموضوع الحساس بلطف وحذر.",
    imageKey: "images_31",
    imageUuid: "dd188039",
  },
  {
    word: "associated",
    translation: "مرتبط",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "That street is associated with many memories.",
    exampleTranslation: "ذلك الشارع مرتبط بذكريات كثيرة.",
    imageKey: "images_34",
    imageUuid: "5ed9897f",
  },
  {
    word: "swiftly",
    translation: "بسرعة",
    partOfSpeech: "adverb",
    difficulty: "easy",
    example: "He walked swiftly to the door.",
    exampleTranslation: "مشى بسرعة إلى الباب.",
    imageKey: "images_36",
    imageUuid: "2e5d8bc0",
  },
  {
    word: "vague",
    translation: "غامض / غير واضح",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "He gave a vague answer to the question.",
    exampleTranslation: "أعطى إجابة غامضة عن السؤال.",
    imageKey: "images_32",
    imageUuid: "8772ef23",
  },
  {
    word: "companion",
    translation: "رفيق",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "A reliable companion makes travel easier.",
    exampleTranslation: "الرفيق الموثوق يجعل السفر أسهل.",
    imageKey: "images_33",
    imageUuid: "4f73cf5a",
  },
  {
    word: "silhouette",
    translation: "ظلّ / هيئة سوداء",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "A silhouette moved behind the curtain.",
    exampleTranslation: "تحرك ظلّ خلف الستارة.",
    imageKey: "images_35",
    imageUuid: "27f0529d",
  },
  {
    word: "effusive",
    translation: "مُفرط في إظهار العاطفة",
    partOfSpeech: "adjective",
    difficulty: "hard",
    example: "She gave an effusive welcome to the guests.",
    exampleTranslation: "قدّمت ترحيبًا مبالغًا فيه للضيوف.",
    imageKey: "images_39",
    imageUuid: "47fdd1d5",
  },
  {
    word: "eagerly",
    translation: "بحماس / بشغف",
    partOfSpeech: "adverb",
    difficulty: "easy",
    example: "She eagerly awaited the results.",
    exampleTranslation: "كانت تنتظر النتائج بشغف.",
    imageKey: "images_37",
    imageUuid: "19b6d92d",
  },
  {
    word: "attitude",
    translation: "موقف / هيئة",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "His attitude showed confidence.",
    exampleTranslation: "أظهر موقفه الثقة.",
    imageKey: "images_38",
    imageUuid: "591fd239",
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
  if (!match) return null;
  return join(ASSETS_DIR, match);
}

function toDataUrl(filePath) {
  const buf = readFileSync(filePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

loadEnvFile(join(rootDir, ".env"));
const dir = join(rootDir, ".data", "flashcards");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const lesson = await client.query(
  `SELECT id FROM lessons WHERE title = $1 LIMIT 1`,
  [LESSON_TITLE],
);
if (lesson.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found!`);
  await client.close();
  process.exit(1);
}
const lessonId = lesson.rows[0].id;

let added = 0;
let skipped = 0;

for (const card of CARDS) {
  // Check for global duplicates
  const existing = await client.query(
    `SELECT id FROM words WHERE LOWER(TRIM(word)) = LOWER(TRIM($1)) LIMIT 1`,
    [card.word],
  );
  if (existing.rows.length > 0) {
    console.log(`  SKIP (duplicate): "${card.word}" already exists (id=${existing.rows[0].id})`);
    skipped++;
    continue;
  }

  const filePath = findAssetFile(card.imageKey, card.imageUuid);
  if (!filePath) {
    console.error(`  ERROR: asset file not found for ${card.imageKey} → "${card.word}"`);
    skipped++;
    continue;
  }

  const imageUrl = toDataUrl(filePath);
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
  console.log(`  ADDED: "${card.word}" ← ${card.imageKey}`);
  added++;
}

// Update lesson word count
const wordCount = await client.query(
  `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`,
  [lessonId],
);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [
  wordCount.rows[0].n,
  lessonId,
]);

await client.close();
console.log(`\nDone. Added: ${added}, Skipped: ${skipped}. Total words in lesson: ${wordCount.rows[0].n}`);
