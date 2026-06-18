import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const arg = process.argv[2] || "80";
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lesson = await client.query(
  `SELECT id FROM lessons WHERE title = 'Miscellaneous Words' LIMIT 1`,
);
const lessonId = lesson.rows[0]?.id;
const res = await client.query(
  `SELECT id, word, example, example_translation,
    CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
  FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
  [lessonId],
);
const byWord = res.rows.find((r) => r.word.toLowerCase() === arg.toLowerCase());
const pos = byWord ? res.rows.indexOf(byWord) + 1 : Number(arg);
const w = byWord ?? res.rows[pos - 1];
if (!w) {
  console.error(`No card at position ${pos}`);
  process.exit(1);
}
console.log(`Card ${pos}/${res.rows.length}: id=${w.id} word="${w.word}" has_img=${w.has_img}`);
console.log(`EN: ${w.example}`);
console.log(`AR: ${w.example_translation}`);
await client.close();
