/**
 * Export full GenerateImage prompts for grade4 batches to JSON.
 * Usage: node scripts/export-grade4-batch-prompts-json.mjs batch51 batch52
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { GENERATE_IMAGE_STYLE } from "./lib/daniel-image-style.mjs";
import { assetFileName } from "./lib/grade4-image-style.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";

const batches = process.argv.slice(2).filter((b) => b.startsWith("batch"));
if (!batches.length) {
  console.error("Usage: node scripts/export-grade4-batch-prompts-json.mjs batch51 ...");
  process.exit(1);
}

const cardByWord = new Map(GRADE4_CARDS.map((c) => [c.word.toLowerCase(), c]));
const out = [];

for (const batch of batches) {
  const prompts = BATCH_PROMPTS[batch];
  if (!prompts) {
    console.error("Unknown batch:", batch);
    continue;
  }
  for (const [word, hint] of Object.entries(prompts)) {
    const full = `${GENERATE_IMAGE_STYLE} ${hint}`;
    out.push({
      word,
      batch,
      file: assetFileName(word),
      prompt: full,
    });
  }
}

const path = join(dirname(fileURLToPath(import.meta.url)), "grade4-gen-batch51-60.json");
writeFileSync(path, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${out.length} prompts → ${path}`);
