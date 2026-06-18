import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BATCH_PROMPTS } from "./grade3-batch-prompts.mjs";
import { assetPath } from "./lib/grade3-image-style.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lesson = await client.query(`SELECT id FROM lessons WHERE title = 'grade 3' LIMIT 1`);
const lid = lesson.rows[0].id;
const total = await client.query(`SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1`, [lid]);
const withImg = await client.query(
  `SELECT COUNT(*)::int AS n FROM words WHERE lesson_id = $1 AND image_url IS NOT NULL AND image_url != ''`,
  [lid],
);
console.log(`DB total: ${total.rows[0].n}, with images: ${withImg.rows[0].n}`);

const needGen = [];
for (let i = 61; i <= 70; i++) {
  const words = Object.keys(BATCH_PROMPTS[`batch${i}`]);
  let inDb = 0;
  let hasAsset = 0;
  const missing = [];
  for (const w of words) {
    if (existsSync(assetPath(w))) hasAsset++;
    else missing.push(w);
    const r = await client.query(
      `SELECT image_url FROM words WHERE lesson_id = $1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))`,
      [lid, w],
    );
    if (r.rows[0]?.image_url) inDb++;
  }
  console.log(`batch${i}: assets=${hasAsset}/10 db=${inDb}/10 missing=${missing.join(", ") || "none"}`);
  needGen.push(...missing);
}
console.log(`\nTotal missing assets for batch61-70: ${needGen.length}`);
console.log(needGen.join(", "));
await client.close();
