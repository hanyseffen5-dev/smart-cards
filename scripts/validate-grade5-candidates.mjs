import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE5_CARDS_RAW } from "./seed-data/grade5-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, ".data", "curriculum-words-export.json"), "utf8"));
const words = new Set(data.words);
const examples = new Set(data.examples);

const seenW = new Set(GRADE5_CARDS_RAW.map((c) => c.word.toLowerCase().trim()));
const seenE = new Set(
  GRADE5_CARDS_RAW.map((c) => c.example.toLowerCase().trim().replace(/\s+/g, " ")),
);

let file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/validate-grade5-candidates.mjs <candidates.mjs>");
  process.exit(1);
}

const mod = await import(new URL(file, import.meta.url).href);
const candidates = mod.CANDIDATES ?? mod.default ?? [];
const errors = [];

for (const c of candidates) {
  const w = c.word.toLowerCase().trim();
  const e = c.example.toLowerCase().trim().replace(/\s+/g, " ");
  if (seenW.has(w)) errors.push(`dup in g5 seed: ${c.word}`);
  if (seenE.has(e)) errors.push(`dup example in g5 seed: ${c.example}`);
  if (words.has(w)) errors.push(`curriculum word: ${c.word}`);
  if (examples.has(e)) errors.push(`curriculum example: ${c.example}`);
  seenW.add(w);
  seenE.add(e);
}

if (errors.length) {
  console.error(errors.slice(0, 40).join("\n"));
  if (errors.length > 40) console.error(`...and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(`OK: ${candidates.length} candidates (${seenW.size} total g5 words checked).`);
