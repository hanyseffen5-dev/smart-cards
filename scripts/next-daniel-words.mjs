import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}
loadEnvFile(join(rootDir, ".env"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const res = await client.query(
  `SELECT id, word, translation, example, part_of_speech, difficulty
   FROM words
   WHERE lesson_id = 1 AND (image_url IS NULL OR image_url = '')
   ORDER BY created_at
   LIMIT 12`,
);

console.log(`Next ${res.rows.length} words without images:\n`);
for (const w of res.rows) {
  console.log(`${w.id}|${w.word}|${w.translation}|${w.example || ""}`);
}

await client.close();
