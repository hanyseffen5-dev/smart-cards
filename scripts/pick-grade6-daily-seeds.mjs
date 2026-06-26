/**
 * Find free simple daily words and write grade6-daily-seeds.tsv (needs Arabic).
 * Run: node scripts/pick-grade6-daily-seeds.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { GRADE6_FINAL } from "./seed-data/grade6-final.mjs";
import { SIMPLE_BANK } from "./lib/grade5-simple-word-bank.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const finalSet = new Set(GRADE6_FINAL.map((c) => normWord(c.word)));
const blocked = new Set(GRADE6_FORBIDDEN_WORDS);
for (const c of GRADE6_CARDS) {
  if (!finalSet.has(normWord(c.word))) blocked.add(normWord(c.word));
}

const gloss = new Map(SIMPLE_BANK.map(([w, t, p, d]) => [normWord(w), { t, p, d }]));
for (const cacheFile of [".data/grade6-daily-ar.json", ".data/grade6-word-ar.json"]) {
  const cachePath = join(root, cacheFile);
  if (!existsSync(cachePath)) continue;
  for (const [w, t] of Object.entries(JSON.parse(readFileSync(cachePath, "utf8")))) {
    const n = normWord(w);
    if (!gloss.has(n) && t) gloss.set(n, { t, p: guessPos(n), d: guessDiff(n) });
  }
}

function guessPos(w) {
  if (/ly$/.test(w) && w.length > 4) return "adverb";
  if (/(ful|ous|ive|able|ible|less|ish|al|ic|ed|ing)$/.test(w) && w.length > 5) return "adjective";
  if (/(ate|ify|ize|en|er|ish)$/.test(w) && w.length > 4) return "verb";
  return "noun";
}
function guessDiff(w) {
  if (w.length <= 5) return "easy";
  if (w.length >= 9) return "hard";
  return "medium";
}

const listPath = join(root, "scripts/data/grade6-daily-word-list.txt");
const words = readFileSync(listPath, "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean);

const out = [];
for (const raw of words) {
  const w = normWord(raw);
  if (!w || w.includes("-") || /\d/.test(w) || w.length < 3 || w.length > 12) continue;
  if (blocked.has(w)) continue;
  const g = gloss.get(w);
  if (!g?.t) continue;
  out.push(`${w}\t${g.t}\t${g.p}\t${g.d}`);
  if (out.length >= 450) break;
}

writeFileSync(join(root, "scripts/data/grade6-daily-seeds.tsv"), `${out.join("\n")}\n`, "utf8");
console.log(`Wrote ${out.length} seeds to grade6-daily-seeds.tsv`);
if (out.length < 420) console.warn(`Need ${420 - out.length} more words with Arabic in list/gloss.`);
