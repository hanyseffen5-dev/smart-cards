import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE5_CARDS } from "./seed-data/grade5-cards.mjs";

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
const lid = (await c.query(`SELECT id FROM lessons WHERE title='grade 5' LIMIT 1`)).rows[0].id;
const db = await c.query(`SELECT id, word FROM words WHERE lesson_id=$1 ORDER BY id`, [lid]);
let mism = 0;
for (let i = 0; i < Math.min(db.rows.length, GRADE5_CARDS.length); i++) {
  if (db.rows[i].word.toLowerCase() !== GRADE5_CARDS[i].word.toLowerCase()) {
    if (mism < 5) console.log(`pos ${i + 1}: db=${db.rows[i].word} seed=${GRADE5_CARDS[i].word}`);
    mism++;
  }
}
console.log(`mismatches: ${mism}/${db.rows.length}`);
await c.close();
