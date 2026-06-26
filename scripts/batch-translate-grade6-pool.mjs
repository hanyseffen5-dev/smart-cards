/**
 * Batch-translate free grade6-word-pool entries missing Arabic gloss.
 * Usage: node scripts/batch-translate-grade6-pool.mjs
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
const poolPath = join(root, "scripts/data/grade6-word-pool.txt");

const blocked = new Set([
  ...GRADE6_FORBIDDEN_WORDS,
  ...GRADE6_CARDS.map((c) => normWord(c.word)),
]);
const known = new Map(SIMPLE_BANK.map(([w, t]) => [normWord(w), t]));
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};
for (const [w, t] of Object.entries(cache)) known.set(w, t);

const need = [];
for (const word of readFileSync(poolPath, "utf8").split(/\r?\n/)) {
  const w = normWord(word.trim());
  if (!w || blocked.has(w) || known.has(w)) continue;
  need.push(w);
}

async function translateOne(word) {
  for (let i = 0; i < 4; i++) {
    try {
      const url = new URL("https://api.mymemory.translated.net/get");
      url.searchParams.set("q", word);
      url.searchParams.set("langpair", "en|ar");
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      const json = await res.json();
      const out = json.responseData?.translatedText?.trim() ?? "";
      if (!out || out.toUpperCase().includes("MYMEMORY WARNING") || out.toLowerCase() === word) throw 0;
      return out;
    } catch {
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  return null;
}

let done = 0;
for (const word of need) {
  const t = await translateOne(word);
  if (!t) {
    console.warn(`Skip pool: ${word}`);
    continue;
  }
  cache[word] = t;
  known.set(word, t);
  done++;
  if (done % 20 === 0) save();
  await new Promise((r) => setTimeout(r, 280));
}
console.log(`Pool done: ${done}`);

const dictPath = join(root, "scripts/data/words_alpha.txt");
const dictNeed = [];
if (existsSync(dictPath)) {
  for (const w of readFileSync(dictPath, "utf8").split(/\r?\n/)) {
    const n = normWord(w.trim());
    if (n.length < 4 || n.length > 7) continue;
    if (!/^[a-z]+$/.test(n) || !/[aeiouy]/.test(n)) continue;
    if (blocked.has(n) || known.has(n)) continue;
    dictNeed.push(n);
    if (dictNeed.length >= 500) break;
  }
}

for (const word of dictNeed) {
  const t = await translateOne(word);
  if (!t) continue;
  cache[word] = t;
  known.set(word, t);
  done++;
  if (done % 25 === 0) save();
  await new Promise((r) => setTimeout(r, 280));
}

function save() {
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
  console.log(`Saved ${done} total translations...`);
}

mkdirSync(dirname(cachePath), { recursive: true });
writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
console.log(`Finished. Added ${done} translations (${Object.keys(cache).length} in cache).`);
