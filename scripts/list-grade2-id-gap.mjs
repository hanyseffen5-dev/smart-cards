import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";

const word = process.argv[2] || "builder";
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lessonId = (await client.query(`SELECT id FROM lessons WHERE title = 'grade 2' LIMIT 1`)).rows[0]
  .id;
const rows = (
  await client.query(`SELECT id, word FROM words WHERE lesson_id = $1 ORDER BY id ASC`, [lessonId])
).rows;
const i = GRADE2_CARDS.findIndex((c) => c.word === word);
const prev = GRADE2_CARDS[i - 1];
const next = GRADE2_CARDS[i + 1];
const prevRow = rows.find((r) => r.word === prev.word);
const nextRow = rows.find((r) => r.word === next.word);
console.log(word, "seed pos", i + 1);
console.log("prev", prev.word, prevRow?.id);
console.log("next", next.word, nextRow?.id);
console.log("gap", nextRow && prevRow ? nextRow.id - prevRow.id : "n/a");
await client.close();
