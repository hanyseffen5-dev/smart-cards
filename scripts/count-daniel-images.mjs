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

const stats = await client.query(
  `SELECT
     COUNT(*) AS total,
     SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) AS with_image,
     SUM(CASE WHEN image_url IS NULL OR image_url = '' THEN 1 ELSE 0 END) AS without_image
   FROM words WHERE lesson_id = 1`,
);
console.log("Daniel lesson image stats:", stats.rows[0]);

const noImg = await client.query(
  `SELECT id, word, translation, example, example_translation FROM words
   WHERE lesson_id = 1 AND (image_url IS NULL OR image_url = '')
   ORDER BY created_at`,
);
console.log(`\nWords without images (${noImg.rows.length}):`);
for (const w of noImg.rows) {
  console.log(`  ${w.id}: "${w.word}" - "${w.translation}"`);
}

await client.close();
