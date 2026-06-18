/**
 * Adds lesson "Miscellaneous Words Part 1" with 10 vocabulary cards (idempotent).
 * Usage: node scripts/add-misc-words-part1.mjs
 */
import { readFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cropIllustrationFromFile, bufferToDataUrl } from "./lib/illustration-crop.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const LESSON_TITLE = "Miscellaneous Words Part 1";
const IMAGES_DIR = join(rootDir, "scripts", "seed-data", "misc-words-part-1");

const CARDS = [
  {
    word: "adventure",
    translation: "مغامرة",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "They described the adventure in great detail.",
    exampleTranslation: "وصفوا المغامرة بتفاصيل كبيرة.",
    image: "adventure.png",
  },
  {
    word: "abhorrent",
    translation: "مكروه جدًا / بغيض",
    partOfSpeech: "adjective",
    difficulty: "hard",
    example: "Violence was abhorrent to her.",
    exampleTranslation: "كان العنف مكروهًا جدًا لديها.",
    image: "abhorrent.png",
  },
  {
    word: "precise",
    translation: "دقيق",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "Please give me a precise time for the meeting.",
    exampleTranslation: "من فضلك أعطني وقتًا دقيقًا للاجتماع.",
    image: "precise.png",
  },
  {
    word: "observer",
    translation: "مراقب",
    partOfSpeech: "noun",
    difficulty: "easy",
    example: "An observer noticed the small changes in his expression.",
    exampleTranslation: "لاحظ المراقب التغيّرات الصغيرة في تعابير وجهه.",
    image: "observer.png",
  },
  {
    word: "reasoning",
    translation: "استدلال / تفكير منطقي",
    partOfSpeech: "noun",
    difficulty: "medium",
    example: "Her reasoning was clear and convincing.",
    exampleTranslation: "كان استدلالها واضحاً ومقنعاً.",
    image: "reasoning.png",
  },
  {
    word: "predominate",
    translation: "يَسود / يَغْلِب",
    partOfSpeech: "verb",
    difficulty: "hard",
    example: "One idea began to predominate in his mind.",
    exampleTranslation: "بدأت فكرة واحدة تسود في عقله.",
    image: "predominate.png",
  },
  {
    word: "balanced",
    translation: "متوازن",
    partOfSpeech: "adjective",
    difficulty: "easy",
    example: "A balanced decision considers both sides.",
    exampleTranslation: "القرار المتوازن يأخذ الجانبين بعين الاعتبار.",
    image: "balanced.png",
  },
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

function embeddedDir(url) {
  if (url.startsWith("pglite://")) return url.slice("pglite://".length);
  if (url.startsWith("file:")) return url.slice("file:".length);
  return join(rootDir, ".data", "flashcards");
}

async function toDataUrl(filePath) {
  const cropped = await cropIllustrationFromFile(filePath);
  writeFileSync(filePath, cropped);
  return bufferToDataUrl(cropped);
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT = rootDir;
assertServerNotRunning();
const url = process.env.DATABASE_URL || "embedded";

if (!existsSync(IMAGES_DIR)) {
  console.error(`Missing images folder: ${IMAGES_DIR}`);
  console.error("Run the copy step or place PNG files named adventure.png, etc.");
  process.exit(1);
}

const missingImages = CARDS.filter((c) => !existsSync(join(IMAGES_DIR, c.image)));
if (missingImages.length > 0) {
  console.error("Missing image files:", missingImages.map((c) => c.image).join(", "));
  process.exit(1);
}

const dir = embeddedDir(url);
mkdirSync(dirname(dir), { recursive: true });
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const existing = await client.query(
  `SELECT id FROM lessons WHERE title = $1 LIMIT 1`,
  [LESSON_TITLE],
);

if (existing.rows.length > 0) {
  const lessonId = existing.rows[0].id;
  const words = await client.query(
    `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`,
    [lessonId],
  );
  console.log(
    `Lesson "${LESSON_TITLE}" already exists (id=${lessonId}, ${words.rows[0].n} words). Skipping.`,
  );
  await client.close();
  process.exit(0);
}

const lessonText =
  "A curated vocabulary set of mixed words — nouns, verbs, and adjectives at beginner, intermediate, and advanced levels.";

const insertedLesson = await client.query(
  `INSERT INTO lessons (title, text, word_count, level)
   VALUES ($1, $2, $3, $4)
   RETURNING id`,
  [LESSON_TITLE, lessonText, CARDS.length, "all"],
);
const lessonId = insertedLesson.rows[0].id;

for (const card of CARDS) {
  const imagePath = join(IMAGES_DIR, card.image);
  const imageUrl = await toDataUrl(imagePath);
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
}

await client.close();
console.log(`Created lesson "${LESSON_TITLE}" (id=${lessonId}) with ${CARDS.length} cards.`);
