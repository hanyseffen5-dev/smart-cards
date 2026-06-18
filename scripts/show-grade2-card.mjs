import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";

const pos = Number(process.argv[2] || "595");
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lessonId = (await client.query(`SELECT id FROM lessons WHERE title = 'grade 2' LIMIT 1`)).rows[0]
  .id;
const rows = (
  await client.query(
    `SELECT id, word, example, example_translation,
      CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
     FROM words WHERE lesson_id = $1 ORDER BY id ASC`,
    [lessonId],
  )
).rows;
const w = rows[pos - 1];
const seed = GRADE2_CARDS[pos - 1];
console.log(`Lesson id=${lessonId} | Card ${pos}/${rows.length}`);
console.log(`word="${w?.word}" img=${w?.has_img}`);
console.log(`EN: ${w?.example}`);
console.log(`AR: ${w?.example_translation}`);
console.log(`Seed match: ${w?.word === seed?.word ? "yes" : "no (seed " + seed?.word + ")"}`);
await client.close();
