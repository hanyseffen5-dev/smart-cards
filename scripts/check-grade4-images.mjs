import { readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { ASSETS_DIR, LESSON_TITLE } from "./lib/grade4-image-style.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

const assetFiles = existsSync(ASSETS_DIR)
  ? readdirSync(ASSETS_DIR).filter((f) => f.startsWith("grade4_") && f.endsWith(".png"))
  : [];

let promptWords = 0;
for (const batch of Object.keys(BATCH_PROMPTS)) {
  promptWords += Object.keys(BATCH_PROMPTS[batch]).length;
}

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
if (lessonRes.rows.length === 0) {
  console.log("Lesson not found:", LESSON_TITLE);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;
const total = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [lessonId]);
const withImg = await client.query(
  `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1 AND image_url IS NOT NULL AND image_url != ''`,
  [lessonId],
);
const batches = Object.keys(BATCH_PROMPTS);
await client.close();

console.log("Grade 4 image status");
console.log("====================");
console.log("Cards in seed:", GRADE4_CARDS.length);
console.log("Words in DB:", total.rows[0].n);
console.log("With images in DB:", withImg.rows[0].n);
console.log("PNG assets on disk:", assetFiles.length);
console.log("Words with prompts (batches):", promptWords, `(${batches.length} batches: ${batches.join(", ")})`);
console.log("Assets dir:", ASSETS_DIR);
