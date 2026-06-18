/**
 * Remove duplicate words within the "grade 1" lesson only (keeps first by id).
 * Usage: node scripts/fix-grade1-duplicates.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { GRADE1_LESSON_TITLE } from "./seed-data/grade1-cards.mjs";

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
assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lesson = await client.query(
  `SELECT id FROM lessons WHERE LOWER(TRIM(title)) = LOWER(TRIM($1)) LIMIT 1`,
  [GRADE1_LESSON_TITLE],
);

if (lesson.rows.length === 0) {
  console.log(`Lesson "${GRADE1_LESSON_TITLE}" not found.`);
  await client.close();
  process.exit(0);
}

const lessonId = lesson.rows[0].id;

const dupes = await client.query(
  `SELECT LOWER(TRIM(word)) AS w, COUNT(*)::int AS cnt
   FROM words
   WHERE lesson_id = $1
   GROUP BY LOWER(TRIM(word))
   HAVING COUNT(*) > 1
   ORDER BY cnt DESC`,
  [lessonId],
);

if (dupes.rows.length === 0) {
  const count = await client.query(
    `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`,
    [lessonId],
  );
  await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [
    count.rows[0].n,
    lessonId,
  ]);
  console.log(`No duplicates in "${GRADE1_LESSON_TITLE}" (${count.rows[0].n} words).`);
  await client.close();
  process.exit(0);
}

console.log(`Found ${dupes.rows.length} duplicate word(s) in "${GRADE1_LESSON_TITLE}":`);

let deleted = 0;
for (const { w, cnt } of dupes.rows) {
  const all = await client.query(
    `SELECT id, word FROM words
     WHERE lesson_id = $1 AND LOWER(TRIM(word)) = $2
     ORDER BY id`,
    [lessonId, w],
  );
  console.log(`  "${w}" × ${cnt}: ids=${all.rows.map((r) => r.id).join(", ")}`);
  for (const row of all.rows.slice(1)) {
    await client.query(`DELETE FROM words WHERE id = $1`, [row.id]);
    console.log(`    Deleted id=${row.id}`);
    deleted++;
  }
}

const count = await client.query(
  `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`,
  [lessonId],
);
await client.query(`UPDATE lessons SET word_count = $1 WHERE id = $2`, [
  count.rows[0].n,
  lessonId,
]);

await client.close();
console.log(`\nDone. Removed ${deleted} duplicate(s). Lesson now has ${count.rows[0].n} words.`);
