import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const positions = process.argv.slice(2).map(Number).filter(Boolean);
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lesson = await client.query(`SELECT id FROM lessons WHERE title = 'grade 3' LIMIT 1`);
if (lesson.rows.length === 0) {
  console.error('Lesson "grade 3" not found');
  process.exit(1);
}
const res = await client.query(
  `SELECT id, word, translation, example, example_translation,
    CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
   FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lesson.rows[0].id],
);
const nums = positions.length ? positions : [1];
for (const pos of nums) {
  const w = res.rows[pos - 1];
  if (!w) {
    console.error(`No card at position ${pos}`);
    continue;
  }
  console.log(`Card ${pos}/${res.rows.length}: id=${w.id} word="${w.word}" has_img=${w.has_img}`);
  console.log(`EN: ${w.example}`);
  console.log(`AR: ${w.example_translation ?? "null"}`);
  console.log("---");
}
await client.close();
