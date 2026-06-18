/**
 * List missing grade4 PNG assets per batch.
 * Usage: node scripts/list-missing-grade4.mjs
 * Exit 1 if any missing.
 */
import { existsSync, statSync } from "node:fs";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { assetPath } from "./lib/grade4-image-style.mjs";

const MIN_BYTES = 500;

function isValidAsset(word) {
  const p = assetPath(word);
  if (!existsSync(p)) return false;
  try {
    return statSync(p).size >= MIN_BYTES;
  } catch {
    return false;
  }
}

const missingByBatch = {};
let have = 0;
let miss = 0;
let corrupt = 0;

for (const b of Object.keys(BATCH_PROMPTS).sort((a, b) => {
  return parseInt(a.replace("batch", ""), 10) - parseInt(b.replace("batch", ""), 10);
})) {
  const m = [];
  for (const w of Object.keys(BATCH_PROMPTS[b])) {
    const p = assetPath(w);
    if (!existsSync(p)) {
      miss++;
      m.push(w);
    } else if (!isValidAsset(w)) {
      corrupt++;
      m.push(`${w} (corrupt)`);
    } else {
      have++;
    }
  }
  if (m.length) missingByBatch[b] = m;
}

console.log(`Assets dir: ${process.env.GRADE4_ASSETS_DIR || "(default daniel ASSETS_DIR)"}`);
console.log(`have ${have}, missing ${miss}, corrupt ${corrupt}`);
for (const [b, words] of Object.entries(missingByBatch)) {
  console.log(`${b}: ${words.join(", ")}`);
}

process.exit(miss + corrupt > 0 ? 1 : 0);
