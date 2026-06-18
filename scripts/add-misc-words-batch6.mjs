/**
 * Adds 10 new cards to "Miscellaneous Words Part 1".
 * Skips duplicates. Usage: node scripts/add-misc-words-batch6.mjs
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
    word: "sinister",
    translation: "مشؤوم / شرير / مُريب",
    partOfSpeech: "adjective",
    difficulty: "hard",
    example: "A sinister silence filled the hallway.",
    exampleTranslation: "ساد صمتٌ مشؤوم في الردهة.",
    imageKey: "images_61",
    imageUuid: "e8390bcf",
  },
  {
    word: "survive",
    translation: "ينجو / يبقى على قيد الحياة",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "He survived the ordeal but never fully recovered.",
    exampleTranslation: "لقد نجا من المحنة لكنه لم يتعافَ تمامًا.",
    imageKey: "images_62",
    imageUuid: "ed144045",
  },
  {
    word: "broken",
    translation: "منهك / محطم نفسيًا",
    partOfSpeech: "adjective",
    difficulty: "medium",
    example: "After the scandal, he lived as a broken man.",
    exampleTranslation: "بعد الفضيحة، عاش رجلاً محطمًا.",
    imageKey: "images_63",
    imageUuid: "31a7d43e",
  },
  {
    word: "solely",
    translation: "فقط / حصريًا",
    partOfSpeech: "adverb",
    difficulty: "medium",
    example: "The project succeeded solely because of careful planning.",
    exampleTranslation: "نجح المشروع فقط بفضل التخطيط الدقيق.",
    imageKey: "images_64",
    imageUuid: "a2860b35",
  },
  {
    word: "escort",
    translation: "يُرافق (لحماية أو توجيه)",
    partOfSpeech: "verb",
    difficulty: "medium",
    example: "Holmes asked Watson to escort Miss Hunter to the station.",
    exampleTranslation: "طلب هولمز من واتسون أن يرافق الآنسة هنتر إلى المحطة.",
    imageKey: "images_65",
    imageUuid: "c7f192ff",
  },
  {
    word: "marry",
    translation: "يتزوّج",
    partOfSpeech: "verb",
    difficulty: "easy",
    example: "They decided to marry quietly without a large ceremony.",
    exampleTranslation: "قرروا الزواج بهدوء دون حفل كبير.",
    imageKey: "images_66",
    imageUuid: "a94034d5",
  },
  {
    word: "special license",
    translation: "ترخيص/إذن خاص (للزواج)",
    partOfSpeech: "noun phrase",
    difficulty: "hard",
    example: "They married by special license to avoid delays.",
    exampleTranslation: "تزوّجا بموجب ترخيص خاص لتجنّب التأخير.",
    imageKey: "images_67",
    imageUuid: "d476627d",
  },
  {
    word: "devoted",
    translation: "مُخلص / مُتفانٍ",
    partOfSpeech: "adjective",
    difficulty: "medium",
    example: "She remained devoted to her family during difficult times.",
    exampleTranslation: "ظلت مخلصة لعائلتها خلال الأوقات الصعبة.",
    imageKey: "images_68",
    imageUuid: "0da478eb",
  },
  {
    word: "servant",
    translation: "خادم / مُستخدم",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "The servants knew the household's secrets better than anyone.",
    exampleTranslation: "كان الخدم يعرفون أسرار البيت أكثر من أيّ شخصٍ آخر.",
    imageKey: "images_69",
    imageUuid: "a9c558c8",
  },
  {
    word: "probably",
    translation: "على الأرجح",
    partOfSpeech: "adverb",
    difficulty: "easy",
    example: "They probably suspected the truth long before the police did.",
    exampleTranslation: "ربما اشتبهوا في الحقيقة قبل الشرطة بوقت طويل.",
    imageKey: "images_70",
    imageUuid: "d634db6b",
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
