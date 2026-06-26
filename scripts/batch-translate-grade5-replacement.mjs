/**
 * Translate grade5-replacement-word-list.txt → grade5-replacement-gloss.tsv
 * Usage: node scripts/batch-translate-grade5-replacement.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const listPath = join(root, "scripts/data/grade5-replacement-word-list.txt");
const outPath = join(root, "scripts/data/grade5-replacement-gloss.tsv");

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

async function translate(word) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(word)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  const json = await res.json();
  const out = json?.[0]?.[0]?.[0]?.trim() ?? "";
  if (!out || out.toLowerCase() === word.toLowerCase()) throw new Error("empty");
  return out;
}

const words = readFileSync(listPath, "utf8")
  .split(/\r?\n/)
  .map((l) => normWord(l.trim()))
  .filter(Boolean);

const lines = [];
for (let i = 0; i < words.length; i++) {
  const w = words[i];
  try {
    const ar = await translate(w);
    const pos = guessPos(w);
    lines.push(`${w}\t${ar}\t${pos}\t${guessDiff(w)}`);
    if ((i + 1) % 25 === 0) console.log(`${i + 1}/${words.length}...`);
    await new Promise((r) => setTimeout(r, 200));
  } catch {
    console.warn(`Skip: ${w}`);
  }
}

writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${lines.length} gloss entries → ${outPath}`);
