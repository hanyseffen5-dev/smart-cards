/**
 * Build grade6-candidate-words.txt — free elementary pool words first, then dictionary filler.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { SIMPLE_BANK } from "./lib/grade5-simple-word-bank.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const blocked = new Set([
  ...GRADE6_FORBIDDEN_WORDS,
  ...GRADE6_CARDS.map((c) => normWord(c.word)),
]);

const NUMBER_WORDS = new Set([
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  "hundred", "thousand", "million", "first", "second", "third", "fourth", "fifth",
]);

function ok(w) {
  const n = normWord(w);
  if (n.length < 4 || n.length > 11) return false;
  if (!/^[a-z]+$/.test(n)) return false;
  if (!/[aeiouy]/.test(n)) return false;
  if (NUMBER_WORDS.has(n) || /\d/.test(n) || blocked.has(n)) return false;
  return true;
}

function add(w, seen, out) {
  const n = normWord(w);
  if (!ok(n) || seen.has(n)) return;
  seen.add(n);
  out.push(n);
}

const pool = readFileSync(join(root, "scripts/data/grade6-word-pool.txt"), "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean);

const out = [];
const seen = new Set();
for (const w of pool) add(w, seen, out);
for (const [w] of SIMPLE_BANK) add(w, seen, out);

const dictPath = join(root, "scripts/data/words_alpha.txt");
if (existsSync(dictPath)) {
  for (const w of readFileSync(dictPath, "utf8").split(/\r?\n/)) {
    if (out.length >= 2200) break;
    if (w.length < 4 || w.length > 9) continue;
    add(w, seen, out);
  }
}

writeFileSync(join(root, "scripts/data/grade6-candidate-words.txt"), `${out.join("\n")}\n`, "utf8");
console.log(`Wrote ${out.length} candidates (${out.filter((w) => pool.includes(w) || pool.includes(normWord(w))).length} from pool).`);
