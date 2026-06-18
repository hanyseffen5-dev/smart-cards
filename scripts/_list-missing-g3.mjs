import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { BATCH_PROMPTS } from "./grade3-batch-prompts.mjs";
import { assetPath } from "./lib/grade3-image-style.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lesson = await client.query(`SELECT id FROM lessons WHERE title = 'grade 3' LIMIT 1`);
const lid = lesson.rows[0].id;
const noImg = await client.query(
  `SELECT word FROM words WHERE lesson_id = $1 AND (image_url IS NULL OR image_url = '') ORDER BY id`,
  [lid],
);
console.log("Words without DB image:", noImg.rows.length);
console.log(noImg.rows.map((r) => r.word).join(", "));

const needGen = [];
for (let i = 71; i <= 80; i++) {
  for (const w of Object.keys(BATCH_PROMPTS[`batch${i}`])) {
    if (!existsSync(assetPath(w))) needGen.push({ batch: i, word: w });
  }
}
console.log("\nMissing assets batch71-80:", needGen.length);
for (const { batch, word } of needGen) console.log(`  batch${batch}: ${word}`);
await client.close();
