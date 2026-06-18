/**
 * Export full GenerateImage prompts for grade4 batch81-90 to JSON.
 * Usage: node scripts/export-grade4-batch81-90-json.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { GENERATE_IMAGE_STYLE } from "./lib/daniel-image-style.mjs";
import { assetFileName } from "./lib/grade4-image-style.mjs";

const batches = Array.from({ length: 10 }, (_, i) => `batch${81 + i}`);
const out = [];

for (const batch of batches) {
  const prompts = BATCH_PROMPTS[batch];
  if (!prompts) {
    console.error(`Missing ${batch} in BATCH_PROMPTS`);
    process.exit(1);
  }
  for (const [word, hint] of Object.entries(prompts)) {
    out.push({
      word,
      batch,
      file: assetFileName(word),
      prompt: `${GENERATE_IMAGE_STYLE} ${hint}`,
    });
  }
}

const path = join(dirname(fileURLToPath(import.meta.url)), "grade4-gen-batch81-90.json");
writeFileSync(path, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${out.length} prompts → ${path}`);
