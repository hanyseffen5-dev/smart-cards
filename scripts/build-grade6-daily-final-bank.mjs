/**
 * Build grade6-daily-final-bank.mjs — 450+ simple daily-life words with Arabic.
 * Filters against forbidden + existing grade 6 (excluding final batch).
 * Run: node scripts/build-grade6-daily-final-bank.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { GRADE6_FINAL } from "./seed-data/grade6-final.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const seedsPath = join(root, "scripts/data/grade6-daily-seeds.tsv");

const finalSet = new Set(GRADE6_FINAL.map((c) => normWord(c.word)));
const blocked = new Set(GRADE6_FORBIDDEN_WORDS);
for (const c of GRADE6_CARDS) {
  if (!finalSet.has(normWord(c.word))) blocked.add(normWord(c.word));
}

function parse(tsv) {
  return tsv
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [word, translation, partOfSpeech, difficulty] = l.split("\t");
      return [word, translation, partOfSpeech, difficulty || "easy"];
    });
}

const seeds = parse(readFileSync(seedsPath, "utf8"));
const bank = [];
const seen = new Set();

for (const [word, translation, partOfSpeech, difficulty] of seeds) {
  const w = normWord(word);
  if (!w || w.includes("-") || w.includes("_") || /\d/.test(w)) continue;
  if (w.length < 3 || w.length > 12) continue;
  if (blocked.has(w) || seen.has(w)) continue;
  seen.add(w);
  bank.push([w, translation, partOfSpeech, difficulty]);
}

if (bank.length < 420) {
  console.error(`Only ${bank.length} free daily words (need 420). Add more to grade6-daily-seeds.tsv`);
  process.exit(1);
}

const out = `/** Grade 6 daily-life word bank — ${bank.length} simple words (auto-built). */

function parse(tsv) {
  return tsv
    .trim()
    .split("\\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [word, translation, partOfSpeech, difficulty] = l.split("\\t");
      return [word, translation, partOfSpeech, difficulty];
    });
}

export const GRADE6_DAILY_FINAL_BANK = parse(\`
${bank.map(([w, t, p, d]) => `${w}\t${t}\t${p}\t${d}`).join("\n")}
\`);
`;

writeFileSync(join(root, "scripts/lib/grade6-daily-final-bank.mjs"), out, "utf8");
console.log(`Built ${bank.length} words → scripts/lib/grade6-daily-final-bank.mjs`);
console.log(`Sample: ${bank.slice(0, 12).map((x) => x[0]).join(", ")}`);
