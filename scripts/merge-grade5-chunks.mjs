/**
 * Merge grade5 chunk files into grade5-cards.mjs GRADE5_CARDS_RAW array.
 * Usage: node scripts/merge-grade5-chunks.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const chunks = [
  { path: "scripts/seed-data/grade5-chunk-a.mjs", export: "GRADE5_CHUNK_A" },
  { path: "scripts/seed-data/grade5-chunk-b.mjs", export: "GRADE5_CHUNK_B" },
  { path: "scripts/seed-data/grade5-chunk-c.mjs", export: "GRADE5_CHUNK_C" },
  { path: "scripts/seed-data/grade5-chunk-d.mjs", export: "GRADE5_CHUNK_D" },
];

const basePath = join(root, "scripts/seed-data/grade5-cards.mjs");
const baseSrc = readFileSync(basePath, "utf8");
const baseMatch = baseSrc.match(
  /export const GRADE5_CARDS_RAW = \[([\s\S]*?)\];\s*\n\s*function normWord/,
);
if (!baseMatch) {
  console.error("Could not parse GRADE5_CARDS_RAW from grade5-cards.mjs");
  process.exit(1);
}
const baseCards = baseMatch[1].trim();

const imported = [];
const mergedParts = [baseCards];
let totalNew = 0;

for (const { path, export: name } of chunks) {
  const full = join(root, path);
  if (!existsSync(full)) {
    console.error(`Missing chunk: ${path}`);
    process.exit(1);
  }
  const mod = await import(new URL(path, import.meta.url).href);
  const cards = mod[name];
  if (!Array.isArray(cards)) {
    console.error(`${name} is not an array in ${path}`);
    process.exit(1);
  }
  if (cards.length !== 350) {
    console.error(`${name} has ${cards.length} cards, expected 350`);
    process.exit(1);
  }
  imported.push({ name, cards });
  const body = cards
    .map(
      (c) =>
        `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`,
    )
    .join("\n");
  mergedParts.push(`  // ${name}\n${body}`);
  totalNew += cards.length;
  console.log(`${name}: ${cards.length} cards`);
}

const newRaw = mergedParts.join("\n");
const newSrc = baseSrc.replace(
  /export const GRADE5_CARDS_RAW = \[([\s\S]*?)\];/,
  `export const GRADE5_CARDS_RAW = [\n${newRaw}\n];`,
);

console.log(`\nBase: ${baseCards.split("{ word:").length - 1} cards`);
console.log(`New chunks: ${totalNew} cards`);
console.log(`Total RAW: ${baseCards.split("{ word:").length - 1 + totalNew} cards`);

if (dryRun) {
  console.log("Dry run — no file written.");
  process.exit(0);
}

writeFileSync(basePath, newSrc);
console.log(`Updated ${basePath}`);

// Validate by importing
try {
  const { GRADE5_CARDS } = await import(new URL("./seed-data/grade5-cards.mjs", import.meta.url).href);
  console.log(`Validation OK: GRADE5_CARDS.length = ${GRADE5_CARDS.length}`);
} catch (err) {
  console.error("Validation failed:", err.message);
  process.exit(1);
}
