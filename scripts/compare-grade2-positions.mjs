import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lessonId = (await client.query(`SELECT id FROM lessons WHERE title = 'grade 2' LIMIT 1`)).rows[0]
  .id;
const rows = (
  await client.query(`SELECT id, word FROM words WHERE lesson_id = $1 ORDER BY id ASC`, [lessonId])
).rows;

let firstMismatch = 0;
for (let p = 1; p <= rows.length; p++) {
  if (rows[p - 1]?.word !== GRADE2_CARDS[p - 1]?.word) {
    firstMismatch = p;
    break;
  }
}
console.log("DB count", rows.length, "first mismatch at position", firstMismatch || "none");
if (firstMismatch) {
  console.log(" db:", rows[firstMismatch - 1]?.word, "seed:", GRADE2_CARDS[firstMismatch - 1]?.word);
}
await client.close();
