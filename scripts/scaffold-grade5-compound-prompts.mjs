/**
 * Scaffold sentence-aligned prompts for grade 5 compound-replacement images (10 per batch).
 * Run: node scripts/scaffold-grade5-compound-prompts.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sceneForCard } from "./daniel-redo-scene.mjs";
import { GENERATE_IMAGE_STYLE } from "./lib/daniel-image-style.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(readFileSync(join(root, ".data/grade5-compound-replacements.json"), "utf8"));
const BATCH_SIZE = 10;

const batches = {};
const batchMeta = [];
for (let i = 0; i < src.picks.length; i += BATCH_SIZE) {
  const n = Math.floor(i / BATCH_SIZE) + 1;
  const key = `batch${n}`;
  const slice = src.picks.slice(i, i + BATCH_SIZE);
  const prompts = {};
  for (const row of slice) {
    const scene = sceneForCard(row.word, row.example, "");
    prompts[row.word] = `${GENERATE_IMAGE_STYLE} ${scene}`;
  }
  batches[key] = prompts;
  batchMeta.push({ key, words: slice.map((r) => r.word), count: slice.length });
}

const batchExports = Object.entries(batches)
  .map(([key, prompts]) => {
    const varName = key.toUpperCase().replace(/(\d+)/, "_$1") + "_PROMPTS";
    return `export const ${varName} = ${JSON.stringify(prompts, null, 2)};`;
  })
  .join("\n\n");

const mapEntries = Object.keys(batches)
  .map((k) => `  ${k}: ${k.toUpperCase().replace(/(\d+)/, "_$1")}_PROMPTS,`)
  .join("\n");

const body = `/** Grade 5 compound-replacement image prompts (${src.picks.length} cards, ${Object.keys(batches).length} batches). Auto-scaffolded ${new Date().toISOString().slice(0, 10)}. */
${batchExports}

export const BATCH_PROMPTS = {
${mapEntries}
};

export const BATCH_META = ${JSON.stringify(batchMeta, null, 2)};
`;
writeFileSync(join(root, "scripts/grade5-compound-batch-prompts.mjs"), body);
console.log(`Scaffolded ${Object.keys(batches).length} batches (${src.picks.length} words)`);
