import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lid = (await client.query(`SELECT id, word_count FROM lessons WHERE title = 'grade 2' LIMIT 1`)).rows[0];
const rows = (
  await client.query(
    `SELECT id, word, example,
      CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
     FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
    [lid.id],
  )
).rows;

console.log("DB:", rows.length, "word_count:", lid.word_count, "seed:", GRADE2_CARDS.length);
for (let pos = 588; pos <= 599; pos++) {
  const db = rows[pos];
  const seed = GRADE2_CARDS[pos];
  console.log(
    `Card ${pos + 1}: DB=${db?.word ?? "MISSING"} img=${db?.has_img ?? "-"} | seed=${seed?.word}`,
  );
}
const missing = GRADE2_CARDS.filter(
  (c) => !rows.some((r) => r.word.toLowerCase() === c.word.toLowerCase()),
);
console.log("Missing words:", missing.map((c) => c.word).join(", ") || "none");
await client.close();
