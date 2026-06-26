/**
 * Write grade6-daily-seeds.tsv — 420+ simple daily words with Arabic (no API).
 * Run: node scripts/gen-grade6-daily-seeds-tsv.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { GRADE6_FINAL } from "./seed-data/grade6-final.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const glossPath = join(root, "scripts/data/grade6-daily-gloss.tsv");
const listPath = join(root, "scripts/data/grade6-daily-word-list.txt");
const outPath = join(root, "scripts/data/grade6-daily-seeds.tsv");

const finalSet = new Set(GRADE6_FINAL.map((c) => normWord(c.word)));
const blocked = new Set(GRADE6_FORBIDDEN_WORDS);
for (const c of GRADE6_CARDS) {
  if (!finalSet.has(normWord(c.word))) blocked.add(normWord(c.word));
}

const gloss = new Map();
for (const line of readFileSync(glossPath, "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const [word, translation, partOfSpeech, difficulty] = t.split("\t");
  if (word && translation) gloss.set(normWord(word), { translation, partOfSpeech: partOfSpeech || "noun", difficulty: difficulty || "easy" });
}

const out = [];
for (const raw of readFileSync(listPath, "utf8").split(/\r?\n/)) {
  const w = normWord(raw.trim());
  if (!w || blocked.has(w)) continue;
  const g = gloss.get(w);
  if (!g) continue;
  out.push(`${w}\t${g.translation}\t${g.partOfSpeech}\t${g.difficulty}`);
  if (out.length >= 450) break;
}

writeFileSync(outPath, `${out.join("\n")}\n`, "utf8");
console.log(`Wrote ${out.length} seeds → ${outPath}`);
if (out.length < 418) {
  console.error(`Need ${420 - out.length} more entries in grade6-daily-gloss.tsv`);
  process.exit(1);
}
