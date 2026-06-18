/**
 * Find and remove duplicate words, keeping the first occurrence.
 * Usage: node scripts/fix-duplicates.mjs
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

// Find duplicates within the same lesson only (per-lesson unique words)
const dupes = await client.query(`
  SELECT lesson_id, LOWER(TRIM(word)) AS w, COUNT(*)::int AS cnt
  FROM words
  GROUP BY lesson_id, LOWER(TRIM(word))
  HAVING COUNT(*) > 1
  ORDER BY cnt DESC
`);

if (dupes.rows.length === 0) {
  console.log("No duplicates found.");
  await client.close();
  process.exit(0);
}

console.log(`Found ${dupes.rows.length} duplicate word(s):`);

let deleted = 0;
for (const { lesson_id, w, cnt } of dupes.rows) {
  const all = await client.query(
    `SELECT id, word FROM words
     WHERE lesson_id = $1 AND LOWER(TRIM(word)) = $2
     ORDER BY id`,
    [lesson_id, w],
  );
  console.log(`  lesson ${lesson_id} "${w}" × ${cnt}: ids=${all.rows.map((r) => r.id).join(", ")}`);

  // Keep the first, delete the rest
  const toDelete = all.rows.slice(1).map((r) => r.id);
  for (const id of toDelete) {
    await client.query(`DELETE FROM words WHERE id = $1`, [id]);
    console.log(`    Deleted id=${id}`);
    deleted++;
  }
}

// Update lesson word counts
await client.query(`
  UPDATE lessons SET word_count = sub.cnt
  FROM (SELECT lesson_id, COUNT(*)::int AS cnt FROM words GROUP BY lesson_id) sub
  WHERE lessons.id = sub.lesson_id
`);

await client.close();
console.log(`\nDone. Removed ${deleted} duplicate(s).`);
