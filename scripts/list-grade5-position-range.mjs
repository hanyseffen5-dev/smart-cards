/** Read-only: list grade 5 cards by 1-based position range. */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BATCH_PROMPTS } from "./grade5-compound-batch-prompts.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

const from = Number(process.argv[2] || 584);
const to = Number(process.argv[3] || 700);

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lesson = await client.query(`SELECT id FROM lessons WHERE title = 'grade 5' LIMIT 1`);
const lessonId = lesson.rows[0].id;
const res = await client.query(
  `SELECT id, word, example FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
  [lessonId],
);

const slice = res.rows.slice(from - 1, to);
for (let i = 0; i < slice.length; i++) {
  const pos = from + i;
  const row = slice[i];
  let prompt = "";
  for (const [batch, map] of Object.entries(BATCH_PROMPTS)) {
    if (map[row.word]) {
      prompt = map[row.word];
      break;
    }
  }
  console.log(JSON.stringify({ pos, id: row.id, word: row.word, example: row.example, prompt }));
}
console.error(`Listed ${slice.length} cards (${from}–${to})`);
await client.close();
