/**
 * Scaffold a prompts map for the next N Daniel words without images.
 * Output: scripts/daniel-batchN-prompts.mjs template + JSON for review.
 *
 * Usage:
 *   node scripts/scaffold-daniel-prompts.mjs [limit] [batchName]
 *   node scripts/scaffold-daniel-prompts.mjs 50 batch5
 */
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { sceneForCard } from "./daniel-redo-scene.mjs";
import { STYLE } from "./lib/daniel-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const LIMIT = Number(process.argv[2] || 50);
const batchName = (process.argv[3] || "next").replace(/[^a-z0-9-]/gi, "");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const res = await client.query(
  `SELECT id, word, example
   FROM words
   WHERE lesson_id = 1
     AND (image_url IS NULL OR image_url = '')
     AND example IS NOT NULL AND TRIM(example) != ''
   ORDER BY id
   LIMIT $1`,
  [LIMIT],
);

await client.close();

if (res.rows.length === 0) {
  console.log("No words without images.");
  process.exit(0);
}

const prompts = {};
for (const row of res.rows) {
  const scene = sceneForCard(row.word, row.example, "");
  prompts[row.word] = `${scene} Matches '${row.example.replace(/'/g, "\\'")}'.`;
}

const varName = `BATCH_${batchName.toUpperCase().replace(/-/g, "_")}_PROMPTS`;
const outPath = join(rootDir, "scripts", `daniel-${batchName}-prompts.mjs`);
const body = `/** Auto-scaffolded ${new Date().toISOString().slice(0, 10)} — review scenes before generating */\nexport const ${varName} = ${JSON.stringify(prompts, null, 2)};\n\nexport const STYLE = ${JSON.stringify(STYLE)};\n`;
writeFileSync(outPath, body, "utf8");

const jsonPath = join(rootDir, "scripts", `daniel-${batchName}-words.json`);
writeFileSync(jsonPath, JSON.stringify(res.rows, null, 2), "utf8");

console.log(`Scaffolded ${res.rows.length} prompts → ${outPath}`);
console.log(`Word list → ${jsonPath}`);
console.log("\nNext steps:");
console.log(`  1. Review/edit scenes in ${outPath}`);
console.log(`  2. node scripts/generate-daniel-images.mjs ${batchName}  (after wiring in generate script)`);
console.log(`  3. Create apply-daniel-${batchName}.mjs + pnpm db:apply-daniel-${batchName}`);
