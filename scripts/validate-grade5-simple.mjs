import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";
import { GRADE3_CARDS } from "./seed-data/grade3-cards.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";
import { GRADE5_CARDS } from "./seed-data/grade5-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));

function norm(w) {
  return String(w).toLowerCase().trim();
}

const prior = new Set([
  ...GRADE1_CARDS,
  ...GRADE2_CARDS,
  ...GRADE3_CARDS,
  ...GRADE4_CARDS,
].map((c) => norm(c.word)));

const seen = new Set();
let dupInLesson = 0;
let overlapPrior = 0;
let compoundNoImg = 0;

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
  `SELECT word, image_url FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lid],
);

for (let i = 0; i < GRADE5_CARDS.length; i++) {
  const w = norm(GRADE5_CARDS[i].word);
  if (seen.has(w)) dupInLesson++;
  if (prior.has(w)) overlapPrior++;
  seen.add(w);
  const row = db.rows[i];
  const hasImg = row.image_url && row.image_url.length > 0;
  if (!hasImg && (row.word.includes("-") || row.word.includes(" "))) compoundNoImg++;
}

console.log(JSON.stringify({ total: GRADE5_CARDS.length, dupInLesson, overlapPrior, compoundNoImg }, null, 2));
await c.close();
