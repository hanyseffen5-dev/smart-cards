import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const words = process.argv.slice(2);
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lid = (await client.query(`SELECT id FROM lessons WHERE title = 'grade 2' LIMIT 1`)).rows[0].id;
for (const w of words) {
  const r = await client.query(
    `SELECT id, word FROM words WHERE lesson_id = $1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))`,
    [lid, w],
  );
  console.log(w, r.rows[0] ? `id=${r.rows[0].id}` : "NOT IN DB");
}
await client.close();
