/**
 * Build candidate pool for grade 5 simple replacements (read-only analysis).
 */
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
  return String(w ?? "").toLowerCase().trim();
}
function isSimpleWord(w) {
  const s = String(w ?? "").trim();
  return s.length >= 3 && s.length <= 14 && !/[-\s]/.test(s) && /^[a-zA-Z]+$/.test(s);
}

const blocked = new Set();
for (const c of [...GRADE1_CARDS, ...GRADE2_CARDS, ...GRADE3_CARDS, ...GRADE4_CARDS, ...GRADE5_CARDS]) {
  blocked.add(norm(c.word));
}
try {
  const exp = JSON.parse(readFileSync(join(root, ".data", "curriculum-words-export.json"), "utf8"));
  for (const w of exp.words) blocked.add(norm(w));
} catch {}

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
const withImg = await c.query(
  `SELECT word FROM words WHERE lesson_id = $1 AND image_url IS NOT NULL AND image_url != ''`,
  [lid],
);
for (const r of withImg.rows) blocked.add(norm(r.word));

const g4simple = GRADE4_CARDS.filter((c) => isSimpleWord(c.word) && !blocked.has(norm(c.word)));
console.log("grade4 simple unused:", g4simple.length);
console.log("sample:", g4simple.slice(0, 10).map((c) => c.word));
await c.close();
