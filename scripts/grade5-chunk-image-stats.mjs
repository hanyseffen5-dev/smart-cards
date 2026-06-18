import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const l of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = l.match(/^\s*([^#=]+?)\s*=\s*(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
loadEnv(join(root, ".env"));
const { PGlite } = require("@electric-sql/pglite");
const c = new PGlite(join(root, ".data", "flashcards"));
const lid = (await c.query(`SELECT id FROM lessons WHERE title = 'grade 5' LIMIT 1`)).rows[0].id;
const db = await c.query(
  `SELECT id, word,
     CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END AS has
   FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lid],
);
const bounds = [
  ["base", 90],
  ["chunk_e", 410],
  ["chunk_a", 250],
  ["chunk_b", 250],
  ["chunk_c", 250],
  ["chunk_d", 250],
];
let start = 0;
for (const [name, n] of bounds) {
  const slice = db.rows.slice(start, start + n);
  const withImg = slice.filter((r) => r.has).length;
  console.log(`${name}: ${withImg}/${slice.length} with images`);
  start += n;
}
await c.close();
