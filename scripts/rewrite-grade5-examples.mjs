/**
 * Rephrase grade 5 chunk example sentences (keeps words; updates example + translation).
 * Usage: node scripts/rewrite-grade5-examples.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";
import { GRADE3_CARDS } from "./seed-data/grade3-cards.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";
import { GRADE5_CHUNK_A } from "./seed-data/grade5-chunk-a.mjs";
import { GRADE5_CHUNK_B } from "./seed-data/grade5-chunk-b.mjs";
import { GRADE5_CHUNK_C } from "./seed-data/grade5-chunk-c.mjs";
import { GRADE5_CHUNK_D } from "./seed-data/grade5-chunk-d.mjs";
import { GRADE5_CHUNK_E } from "./seed-data/grade5-chunk-e.mjs";
import { makeGrade5Example } from "./lib/grade5-example-patterns.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function normExample(e) {
  return String(e ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

/** Base 100 vocabulary cards from grade5-cards.mjs (hand-written examples). */
function loadBaseGrade5Cards() {
  const src = readFileSync(join(root, "scripts/seed-data/grade5-cards.mjs"), "utf8");
  const cards = [];
  const re =
    /\{\s*word:\s*"([^"]+)",\s*translation:\s*"([^"]+)",\s*partOfSpeech:\s*"([^"]+)",\s*difficulty:\s*"([^"]+)",\s*example:\s*"([^"]+)",\s*exampleTranslation:\s*"([^"]+)"\s*\}/g;
  let m;
  const stop = src.indexOf("...GRADE5_CHUNK_E");
  const slice = stop > 0 ? src.slice(0, stop) : src;
  while ((m = re.exec(slice))) {
    cards.push({ example: m[5] });
  }
  return cards;
}

const blockedExamples = new Set();
for (const c of [...GRADE1_CARDS, ...GRADE2_CARDS, ...GRADE3_CARDS, ...GRADE4_CARDS, ...loadBaseGrade5Cards()]) {
  blockedExamples.add(normExample(c.example));
}
try {
  const exp = JSON.parse(readFileSync(join(root, ".data", "curriculum-words-export.json"), "utf8"));
  for (const e of exp.examples) blockedExamples.add(normExample(e));
} catch {
  console.warn("curriculum-words-export.json not found — skipping export blocklist");
}

const CHUNKS = [
  { export: "GRADE5_CHUNK_A", file: "grade5-chunk-a.mjs", cards: GRADE5_CHUNK_A, topic: "STEM (math, physics, chemistry, biology, engineering)" },
  { export: "GRADE5_CHUNK_B", file: "grade5-chunk-b.mjs", cards: GRADE5_CHUNK_B, topic: "history, geography, civics, cultures" },
  { export: "GRADE5_CHUNK_C", file: "grade5-chunk-c.mjs", cards: GRADE5_CHUNK_C, topic: "literature, writing, grammar, debate, journalism" },
  { export: "GRADE5_CHUNK_D", file: "grade5-chunk-d.mjs", cards: GRADE5_CHUNK_D, topic: "technology, arts, music, sports, health, character, logic" },
  { export: "GRADE5_CHUNK_E", file: "grade5-chunk-e.mjs", cards: GRADE5_CHUNK_E, topic: "vocabulary replacing number cards" },
];

let total = 0;
for (let ci = 0; ci < CHUNKS.length; ci++) {
  const { export: exp, file, cards, topic } = CHUNKS[ci];
  const updated = cards.map((card, idx) => {
    const { example, exampleTranslation } = makeGrade5Example(
      card.word,
      card.translation,
      idx + ci * 300,
      blockedExamples,
      normExample,
    );
    blockedExamples.add(normExample(example));
    return { ...card, example, exampleTranslation };
  });
  const lines = updated.map(
    (c) =>
      `  { word: ${JSON.stringify(c.word)}, translation: ${JSON.stringify(c.translation)}, partOfSpeech: ${JSON.stringify(c.partOfSpeech)}, difficulty: ${JSON.stringify(c.difficulty)}, example: ${JSON.stringify(c.example)}, exampleTranslation: ${JSON.stringify(c.exampleTranslation)} },`,
  );
  const label = String.fromCharCode(65 + Math.min(ci, 4));
  const body = `/** Grade 5 chunk ${label} — ${topic} (${updated.length} cards). */\nexport const ${exp} = [\n${lines.join("\n")}\n];\n`;
  writeFileSync(join(root, "scripts/seed-data", file), body);
  total += updated.length;
  console.log(`Wrote ${file}: ${updated.length} cards (${updated[0].example.slice(0, 60)}…)`);
}
console.log(`\nTotal rephrased: ${total} cards`);
