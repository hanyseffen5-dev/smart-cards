/**
 * Build lib/grade5-replacement-bank.mjs from grade5-replacement-gloss.tsv
 * Run: node scripts/build-grade5-replacement-bank.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tsvPath = join(root, "scripts/data/grade5-replacement-gloss.tsv");
const outPath = join(root, "scripts/lib/grade5-replacement-bank.mjs");

const rows = [];
for (const line of readFileSync(tsvPath, "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t) continue;
  const [word, translation, partOfSpeech, difficulty] = t.split("\t");
  if (!word || !translation) continue;
  rows.push([word, translation, partOfSpeech || "noun", difficulty || "medium"]);
}

const body = `/** Unique daily-life words for grade 5 compound replacements (${rows.length} entries). */
export const GRADE5_REPLACEMENT_BANK = [
${rows.map((r) => `  [${r.map((x) => JSON.stringify(x)).join(", ")}],`).join("\n")}
];
`;
writeFileSync(outPath, body);
console.log(`Wrote ${rows.length} entries → ${outPath}`);
