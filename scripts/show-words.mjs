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
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("Usage: node show-words.mjs <word1> <word2> ...");
  process.exit(1);
}

for (const t of targets) {
  const res = await client.query(
    `SELECT id, word, translation, example, example_translation, part_of_speech, difficulty
     FROM words WHERE lesson_id = 1 AND LOWER(TRIM(word)) = LOWER(TRIM($1))`,
    [t],
  );
  if (res.rows.length === 0) {
    console.log(`"${t}": NOT FOUND`);
    continue;
  }
  const w = res.rows[0];
  console.log(`\n=== ${w.word} (id=${w.id}) ===`);
  console.log(`  translation: ${w.translation}`);
  console.log(`  part_of_speech: ${w.part_of_speech} / difficulty: ${w.difficulty}`);
  console.log(`  EN: ${w.example || "(none)"}`);
  console.log(`  AR: ${w.example_translation || "(none)"}`);
}

await client.close();
