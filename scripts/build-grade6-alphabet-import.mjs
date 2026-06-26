/**
 * Import alphabet vocabulary CSV into grade 6 seed chunks.
 * Usage: node scripts/build-grade6-alphabet-import.mjs [--translate]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord, normExample } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS, GRADE6_FORBIDDEN_EXAMPLES } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "scripts/seed-data/grade6-alphabet-import.csv");
const cachePath = join(root, ".data/grade6-alphabet-example-ar.json");
const outDir = join(root, "scripts/seed-data");
const translate = process.argv.includes("--translate");
const CHUNK_SIZE = 200;

function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || /^Word,/i.test(trimmed)) continue;
    const parts = trimmed.split(",");
    if (parts.length < 4) continue;
    const word = parts[0].trim();
    const partOfSpeech = parts[1].trim();
    const meaning = parts[2].trim();
    const example = parts.slice(3).join(",").trim();
    if (!word || !meaning || !example) continue;
    rows.push({ word, partOfSpeech, meaning, example });
  }
  return rows;
}

function normalizePos(raw) {
  const first = raw.split("/")[0].trim().toLowerCase();
  if (first.startsWith("verb")) return "verb";
  if (first.startsWith("noun")) return "noun";
  if (first.startsWith("adj")) return "adjective";
  if (first.startsWith("adv")) return "adverb";
  if (first.startsWith("prep")) return "preposition";
  if (first.startsWith("conj")) return "conjunction";
  if (first.includes("number")) return "number";
  return first.replace(/\s*\(.*\)/, "") || "noun";
}

function difficultyFor(word, pos) {
  const w = normWord(word);
  if (w.length >= 10 || pos === "adjective" && w.length >= 9) return "hard";
  if (w.length <= 5 && pos === "noun") return "easy";
  return "medium";
}

function loadCache() {
  if (!existsSync(cachePath)) return {};
  return JSON.parse(readFileSync(cachePath, "utf8"));
}

function saveCache(cache) {
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
}

async function translateExample(text, cache) {
  const key = text.trim();
  if (cache[key] && !isBadTranslation(key, cache[key])) return cache[key];
  if (!translate) return `[${key}]`;

  let lastErr;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const url = new URL("https://api.mymemory.translated.net/get");
      url.searchParams.set("q", key);
      url.searchParams.set("langpair", "en|ar");
      const res = await fetch(url, { signal: AbortSignal.timeout(25_000) });
      if (!res.ok) throw new Error(`MyMemory ${res.status}`);
      const json = await res.json();
      const out = json.responseData?.translatedText?.trim() ?? "";
      if (!out || out.toUpperCase().includes("MYMEMORY WARNING")) {
        throw new Error(`MyMemory busy for: ${key.slice(0, 60)}`);
      }
      if (isBadTranslation(key, out)) throw new Error(`Untranslated result for: ${key.slice(0, 60)}`);
      cache[key] = out;
      await new Promise((r) => setTimeout(r, 450 + attempt * 300));
      return out;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr ?? new Error(`translate failed: ${key.slice(0, 60)}`);
}

function fallbackExampleTranslation(meaning, example) {
  const base = meaning.split("/")[0].trim();
  return base.endsWith(".") || base.endsWith("؟") ? base : `${base}.`;
}

function isBadTranslation(source, translated) {
  if (!translated) return true;
  if (translated === source) return true;
  if (translated.startsWith("[")) return true;
  const latin = (translated.match(/[a-z]/gi) ?? []).length;
  return latin > translated.length * 0.55;
}

function cardLine(c) {
  return `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`;
}

const existingG6 = new Set(GRADE6_CARDS.map((c) => normWord(c.word)));
const seenImport = new Set();
const raw = parseCsv(readFileSync(csvPath, "utf8"));
const accepted = [];
const skipped = { inGrade6: 0, forbiddenWord: 0, forbiddenExample: 0, duplicate: 0 };

for (const row of raw) {
  const w = normWord(row.word);
  const ex = normExample(row.example);
  if (seenImport.has(w)) {
    skipped.duplicate++;
    continue;
  }
  seenImport.add(w);
  if (existingG6.has(w)) {
    skipped.inGrade6++;
    continue;
  }
  if (GRADE6_FORBIDDEN_WORDS.has(w)) {
    skipped.forbiddenWord++;
    continue;
  }
  if (GRADE6_FORBIDDEN_EXAMPLES.has(ex)) {
    skipped.forbiddenExample++;
    continue;
  }
  accepted.push(row);
}

const cache = loadCache();
const cards = [];
for (let i = 0; i < accepted.length; i++) {
  const row = accepted[i];
  const partOfSpeech = normalizePos(row.partOfSpeech);
  let exampleTranslation;
  try {
    exampleTranslation = await translateExample(row.example, cache);
  } catch {
    exampleTranslation = fallbackExampleTranslation(row.meaning, row.example);
    cache[row.example.trim()] = exampleTranslation;
    saveCache(cache);
    console.warn(`Fallback translation for "${row.word}"`);
  }
  if (exampleTranslation.startsWith("[")) {
    console.error("Run with --translate to fill Arabic example sentences.");
    process.exit(1);
  }
  cards.push({
    word: row.word,
    translation: row.meaning,
    partOfSpeech,
    difficulty: difficultyFor(row.word, partOfSpeech),
    example: row.example,
    exampleTranslation,
  });
  saveCache(cache);
  if ((i + 1) % 50 === 0) console.log(`Translated ${i + 1}/${accepted.length}...`);
}
saveCache(cache);

const chunkFiles = [];
for (let i = 0; i < cards.length; i += CHUNK_SIZE) {
  const chunk = cards.slice(i, i + CHUNK_SIZE);
  const label = String.fromCharCode(65 + Math.floor(i / CHUNK_SIZE));
  const exportName = `GRADE6_ALPHABET_${label}`;
  const fileName = `grade6-alphabet-${label.toLowerCase()}.mjs`;
  const body = `/** Grade 6 alphabet import batch ${label} (${chunk.length} cards). Auto-generated — node scripts/build-grade6-alphabet-import.mjs */\nexport const ${exportName} = [\n${chunk.map(cardLine).join("\n")}\n];\n`;
  writeFileSync(join(outDir, fileName), body, "utf8");
  chunkFiles.push({ exportName, fileName, count: chunk.length });
}

const indexBody = `/** Grade 6 alphabet import — ${cards.length} cards from CSV. */
${chunkFiles.map((c) => `import { ${c.exportName} } from "./${c.fileName.replace(".mjs", ".mjs")}";`).join("\n")}

export const GRADE6_ALPHABET = [
${chunkFiles.map((c) => `  ...${c.exportName},`).join("\n")}
];
`;
writeFileSync(join(outDir, "grade6-alphabet.mjs"), indexBody, "utf8");

console.log(`CSV rows: ${raw.length}`);
console.log(`Accepted: ${cards.length}`);
console.log(`Skipped — in grade 6: ${skipped.inGrade6}, forbidden word: ${skipped.forbiddenWord}, forbidden example: ${skipped.forbiddenExample}, duplicate: ${skipped.duplicate}`);
for (const c of chunkFiles) console.log(`  ${c.fileName}: ${c.count}`);
