import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const words = ["wheelbarrow", "sovereignty", "transistor"];
const client = new PGlite(join(rootDir, ".data", "flashcards"));
for (const word of words) {
  const r = await client.query(
    `SELECT id, word, lesson_id,
      CASE WHEN image_url IS NULL OR image_url = '' THEN 0 ELSE length(image_url) END AS img_len
     FROM words WHERE LOWER(TRIM(word)) = LOWER(TRIM($1))`,
    [word],
  );
  console.log(word, r.rows);
}
await client.close();
