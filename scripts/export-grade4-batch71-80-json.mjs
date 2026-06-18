/**
 * Export full GenerateImage prompts for grade4 batch71-80 to JSON.
 * Usage: node scripts/export-grade4-batch71-80-json.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { GENERATE_IMAGE_STYLE } from "./lib/daniel-image-style.mjs";
import { assetFileName } from "./lib/grade4-image-style.mjs";

const batches = Array.from({ length: 10 }, (_, i) => `batch${71 + i}`);
const out = [];

for (const batch of batches) {
  const prompts = BATCH_PROMPTS[batch];
  for (const [word, hint] of Object.entries(prompts)) {
    out.push({
      word,
      batch,
      file: assetFileName(word),
      prompt: `${GENERATE_IMAGE_STYLE} ${hint}`,
    });
  }
}

const path = join(dirname(fileURLToPath(import.meta.url)), "grade4-gen-batch71-80.json");
writeFileSync(path, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${out.length} prompts → ${path}`);
