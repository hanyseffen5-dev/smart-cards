/**
 * Lists all words in the "Daniel - The Movie" lesson.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const lessons = await client.query(`SELECT id, title, word_count FROM lessons ORDER BY id`);
console.log("All lessons:");
for (const l of lessons.rows) {
  console.log(`  id=${l.id}: "${l.title}" (words=${l.word_count})`);
}

const daniel = await client.query(
  `SELECT id FROM lessons WHERE LOWER(title) LIKE '%daniel%' LIMIT 1`,
);
if (daniel.rows.length === 0) {
  console.log("\nNo lesson with 'daniel' in title.");
  await client.close();
  process.exit(0);
}
const lessonId = daniel.rows[0].id;
console.log(`\nFound lesson id=${lessonId}. Listing words:`);

const words = await client.query(
  `SELECT id, word, translation, example, example_translation, part_of_speech, difficulty,
          (image_url IS NOT NULL AND image_url != '') AS has_image
   FROM words WHERE lesson_id = $1 ORDER BY created_at`,
  [lessonId],
);
for (const w of words.rows) {
  console.log(`  ${w.id}: "${w.word}" - "${w.translation}" [${w.part_of_speech}/${w.difficulty}] hasImage=${w.has_image}`);
  console.log(`     EN: ${w.example || "(none)"}`);
  console.log(`     AR: ${w.example_translation || "(none)"}`);
}

console.log(`\nTotal: ${words.rows.length}`);
await client.close();
