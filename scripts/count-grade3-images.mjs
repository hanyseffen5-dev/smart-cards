import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BATCH_PROMPTS } from "./grade3-batch-prompts.mjs";
import { assetPath, ASSETS_DIR } from "./lib/grade3-image-style.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = 'grade 3' LIMIT 1`);
if (lessonRes.rows.length === 0) {
  console.log("No grade 3 lesson");
  process.exit(0);
}
const lessonId = lessonRes.rows[0].id;

const dbRes = await client.query(
  `SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_img
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
await client.close();

const allWords = Object.values(BATCH_PROMPTS).flatMap((b) => Object.keys(b));
let assetOk = 0;
let assetMiss = [];
for (const w of allWords) {
  if (existsSync(assetPath(w))) assetOk++;
  else assetMiss.push(w);
}

console.log(`Assets dir: ${ASSETS_DIR}`);
console.log(`DB: ${dbRes.rows[0].with_img}/${dbRes.rows[0].total} with images`);
console.log(`Assets batch1-10: ${assetOk}/${allWords.length}`);
if (assetMiss.length) console.log(`Missing assets: ${assetMiss.join(", ")}`);
