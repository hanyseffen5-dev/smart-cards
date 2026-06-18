import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const pos = Number(process.argv[2] || "65");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const res = await client.query(`
  SELECT id, word, translation, example, example_translation,
    CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has_img
  FROM words WHERE lesson_id = 1
  ORDER BY CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END DESC, id ASC
`);
const w = res.rows[pos - 1];
if (!w) {
  console.error(`No card at position ${pos}`);
  process.exit(1);
}
console.log(`Card ${pos}/${res.rows.length}: id=${w.id} word="${w.word}" has_img=${w.has_img}`);
console.log(`EN: ${w.example}`);
console.log(`AR: ${w.example_translation}`);
await client.close();
