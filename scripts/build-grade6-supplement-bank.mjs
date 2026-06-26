/** Builds scripts/lib/grade6-supplement-bank.mjs */
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { GRADE6_EXTENSION_BANK } from "./lib/grade6-extension-bank.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXT = new Set(GRADE6_EXTENSION_BANK.map((r) => r[0]));

const NUMBER = new Set([
  "one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve",
  "thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty",
  "thirty","forty","fifty","sixty","seventy","eighty","ninety","hundred","thousand",
  "million","zero","first","second","third","fourth","fifth","sixth","seventh","eighth",
  "ninth","tenth","single","double","triple","dozen","half","quarter","once","twice",
]);

const POS_OK = new Set(["noun", "verb", "adjective", "adverb"]);
const DIFF_OK = new Set(["easy", "medium", "hard"]);

function validWord(w) {
  if (!/^[a-z]+$/.test(w)) return false;
  if (NUMBER.has(w)) return false;
  if (EXT.has(w)) return false;
  return true;
}

/** @type {[string,string,string,string][]} */
const ENTRIES = JSON.parse(
  readFileSync(join(__dirname, "data/grade6-supplement-entries.json"), "utf8"),
);

const seen = new Set();
const bank = [];
for (const [word, ar, pos, diff] of ENTRIES) {
  const w = word.toLowerCase().trim();
  if (!validWord(w)) {
    console.warn("skip invalid/ext:", w);
    continue;
  }
  if (seen.has(w)) {
    console.warn("skip dupe:", w);
    continue;
  }
  if (!POS_OK.has(pos) || !DIFF_OK.has(diff)) {
    throw new Error(`bad meta for ${w}: ${pos}/${diff}`);
  }
  seen.add(w);
  bank.push([w, ar.trim(), pos, diff]);
}

if (bank.length !== 1000) {
  console.error(`Expected 1000 entries, got ${bank.length}`);
  process.exit(1);
}

const tsv = bank.map((r) => r.join("\t")).join("\n");
const out = `/** Grade 6 supplement word bank — 1000 elementary vocabulary words (compliment → z + topics). */

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

export const GRADE6_SUPPLEMENT_BANK = parse(\`
${tsv}
\`);
`;

const dest = join(__dirname, "lib/grade6-supplement-bank.mjs");
writeFileSync(dest, out, "utf8");
console.log(`Wrote ${dest} (${bank.length} words, ${out.split("\\n").length} lines)`);
