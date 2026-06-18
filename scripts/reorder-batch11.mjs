/**
 * Moves the last 10 added cards (batch 11) to the beginning
 * by setting their created_at to a date before all other cards.
 * Usage: node scripts/reorder-batch11.mjs
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

const BATCH11_WORDS = [
  "slight", "have no say", "rights", "will", "patient",
  "leave (something) in (someone's) hands", "safe", "come forward", "law", "put a stop to",
];

const earliest = await client.query(`SELECT MIN(created_at) AS min_date FROM words`);
const minDate = new Date(earliest.rows[0].min_date);

for (let i = 0; i < BATCH11_WORDS.length; i++) {
  const newDate = new Date(minDate.getTime() - (BATCH11_WORDS.length - i) * 60000);
  const res = await client.query(
    `UPDATE words SET created_at = $1 WHERE LOWER(TRIM(word)) = LOWER(TRIM($2)) RETURNING id, word`,
    [newDate.toISOString(), BATCH11_WORDS[i]],
  );
  if (res.rows.length > 0) {
    console.log(`  MOVED: "${res.rows[0].word}" (id=${res.rows[0].id}) → position ${i + 1}`);
  } else {
    console.log(`  NOT FOUND: "${BATCH11_WORDS[i]}"`);
  }
}

await client.close();
console.log("\nDone. Batch 11 cards are now at the beginning.");
