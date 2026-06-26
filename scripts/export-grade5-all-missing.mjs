/** Export all grade 5 words without DB images. */
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildPrompt, ASSETS_DIR, LESSON_TITLE } from "./lib/grade5-image-style.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const outPath = process.argv[2] || join(root, ".data", "grade5-all-missing.json");

const existing = new Set(
  readdirSync(ASSETS_DIR)
    .filter((f) => /^grade5_.+\.png$/i.test(f))
    .map((f) => f.replace(/^grade5_/i, "").replace(/\.png$/i, "").replace(/_/g, " ").toLowerCase()),
);

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));
const lid = (await client.query(`SELECT id FROM lessons WHERE title = $1`, [LESSON_TITLE])).rows[0].id;
const rows = await client.query(
  `SELECT id, word, example FROM words WHERE lesson_id = $1 AND (image_url IS NULL OR image_url = '') ORDER BY id`,
  [lid],
);

const picks = rows.rows.map((r) => ({
  id: r.id,
  word: r.word,
  example: r.example,
  hasAsset: existing.has(r.word.toLowerCase().trim()),
  assetFile: `grade5_${r.word.replace(/\s+/g, "_")}.png`,
  prompt: buildPrompt({ word: r.word, example: r.example }),
}));

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  JSON.stringify(
    {
      count: picks.length,
      needGenerateImage: picks.filter((p) => !p.hasAsset).length,
      hasAssetNeedDanielRedo: picks.filter((p) => p.hasAsset).length,
      picks,
    },
    null,
    2,
  ),
);
console.log(`Wrote ${picks.length} → ${outPath}`);
console.log(`  need GenerateImage: ${picks.filter((p) => !p.hasAsset).length}`);
console.log(`  has asset (redo Daniel): ${picks.filter((p) => p.hasAsset).length}`);
await client.close();
