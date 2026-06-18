import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lesson = await client.query(`SELECT id, word_count FROM lessons WHERE title = 'grade 1' LIMIT 1`);
const lid = lesson.rows[0].id;
const words = await client.query(
  `SELECT id, word, example,
    CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
   FROM words WHERE lesson_id = $1
   ORDER BY CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END DESC, id ASC`,
  [lid],
);

console.log("DB count:", words.rows.length, "word_count:", lesson.rows[0].word_count);
console.log("Seed count:", GRADE1_CARDS.length);
const c299 = words.rows[298];
const c300 = words.rows[299];
console.log("DB pos 299:", c299?.word, "img=", c299?.has_img);
console.log("DB pos 300:", c300?.word ?? "(missing)", "img=", c300?.has_img);
const seed300 = GRADE1_CARDS[299];
console.log("Seed pos 300:", seed300?.word, seed300?.example);
const missing = GRADE1_CARDS.filter(
  (c) => !words.rows.some((r) => r.word.toLowerCase() === c.word.toLowerCase()),
);
console.log("Missing:", missing.map((c) => c.word).join(", ") || "none");
await client.close();
