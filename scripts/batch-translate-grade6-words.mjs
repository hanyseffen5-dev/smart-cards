/**
 * Batch-translate grade 6 candidate words into .data/grade6-word-ar.json
 * Usage: node scripts/batch-translate-grade6-words.mjs [count=600]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { SIMPLE_BANK } from "./lib/grade5-simple-word-bank.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cachePath = join(root, ".data/grade6-word-ar.json");
const candidatesPath = join(root, "scripts/data/grade6-candidate-words.txt");
const target = Number(process.argv[2] || 600);

const blocked = new Set([
  ...GRADE6_FORBIDDEN_WORDS,
  ...GRADE6_CARDS.map((c) => normWord(c.word)),
]);
const map = new Map(SIMPLE_BANK.map(([w, t]) => [normWord(w), t]));
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};
for (const [w, t] of Object.entries(cache)) map.set(normWord(w), t);

const need = [];
for (const word of readFileSync(candidatesPath, "utf8").split(/\r?\n/)) {
  const w = normWord(word.trim());
  if (!w || blocked.has(w) || map.has(w)) continue;
  need.push(w);
  if (need.length >= target) break;
}

async function translateOne(word) {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", word);
  url.searchParams.set("langpair", "en|ar");
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  const json = await res.json();
  const out = json.responseData?.translatedText?.trim() ?? "";
  if (!out || out.toUpperCase().includes("MYMEMORY WARNING") || out.toLowerCase() === word) {
    throw new Error("bad");
  }
  return out;
}

let done = 0;
for (const word of need) {
  try {
    cache[word] = await translateOne(word);
    map.set(word, cache[word]);
    done++;
    if (done % 25 === 0) {
      mkdirSync(dirname(cachePath), { recursive: true });
      writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
      console.log(`Translated ${done}/${need.length}...`);
    }
    await new Promise((r) => setTimeout(r, 300));
  } catch {
    console.warn(`Skip: ${word}`);
  }
}

mkdirSync(dirname(cachePath), { recursive: true });
writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
console.log(`Done. Added ${done} translations (${Object.keys(cache).length} total in cache).`);
