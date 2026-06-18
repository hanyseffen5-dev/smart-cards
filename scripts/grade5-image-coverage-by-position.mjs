/** Read-only: how many of the first N lesson cards have images? */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
loadEnv(join(root, ".env"));

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));

const lesson = await client.query(`SELECT id FROM lessons WHERE title = 'grade 5' LIMIT 1`);
const lessonId = lesson.rows[0].id;

const rows = await client.query(
  `SELECT id, word,
          (image_url IS NOT NULL AND image_url != '') AS has_img
   FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lessonId],
);

for (const n of [100, 103, 700, 800, 1500]) {
  const slice = rows.rows.slice(0, n);
  const withImg = slice.filter((r) => r.has_img).length;
  console.log(`first ${n} cards: ${withImg} with image`);
}

const missingEarly = rows.rows
  .slice(0, 150)
  .filter((r) => !r.has_img)
  .slice(0, 10)
  .map((r) => ({ pos: rows.rows.indexOf(r) + 1, id: r.id, word: r.word }));
console.log("missing in first 150 (sample):", missingEarly);

await client.close();
