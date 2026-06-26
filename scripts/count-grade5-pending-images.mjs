import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { ASSETS_DIR, LESSON_TITLE } from "./lib/grade5-image-style.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));
const lid = (await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE])).rows[0].id;
const noImg = await client.query(
  `SELECT word FROM words WHERE lesson_id = $1 AND (image_url IS NULL OR image_url = '') ORDER BY id`,
  [lid],
);
const assets = new Set(
  readdirSync(ASSETS_DIR)
    .filter((f) => /^grade5_.*\.png$/i.test(f))
    .map((f) => f.replace(/^grade5_/i, "").replace(/\.png$/i, "").replace(/_/g, " ").toLowerCase()),
);
let haveAsset = 0;
for (const r of noImg.rows) {
  if (assets.has(r.word.toLowerCase().trim())) haveAsset++;
}
console.log(`without image: ${noImg.rows.length}, have asset: ${haveAsset}, need GenerateImage: ${noImg.rows.length - haveAsset}`);
await client.close();
