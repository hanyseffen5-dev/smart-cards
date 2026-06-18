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
  await client.query(
    `SELECT id, word FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
    [lessonId],
  )
).rows;
console.log("total", rows.length);
const tail = rows.slice(-20);
for (let i = 0; i < tail.length; i++) {
  const pos = rows.length - 20 + i + 1;
  const seed = GRADE2_CARDS[pos - 1];
  console.log(`pos ${pos} id=${tail[i].id} db=${tail[i].word} seed=${seed?.word}`);
}
await client.close();
