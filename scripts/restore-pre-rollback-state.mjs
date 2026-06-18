/**
 * Undo rollback-grade4-before-batch61: re-apply batch61–70 images from assets.
 * Restores grade 4 to ~707 images (state before last rollback attempt).
 * Stop pnpm dev first.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade4-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

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
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  LESSON_TITLE,
]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found.`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

let totalOk = 0;
let totalMiss = 0;

for (let n = 61; n <= 70; n++) {
  const batchArg = `batch${n}`;
  const words = Object.keys(BATCH_PROMPTS[batchArg] ?? {});
  let ok = 0;
  let miss = 0;
  for (const word of words) {
    const src = assetPath(word);
    if (!existsSync(src)) {
      miss++;
      continue;
    }
    const buf = await makeSquare(src);
    const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
    const res = await client.query(
      `UPDATE words SET image_url = $1
       WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
       RETURNING id`,
      [dataUrl, lessonId, word],
    );
    if (res.rows.length === 0) miss++;
    else ok++;
  }
  console.log(`${batchArg}: ${ok} applied, ${miss} missing`);
  totalOk += ok;
  totalMiss += miss;
}

const stats = await client.query(
  `SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_img
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
await client.close();

console.log(`\nRestored batch61–70: ${totalOk} ok, ${totalMiss} missing assets.`);
console.log(`Grade 4: ${stats.rows[0].with_img}/${stats.rows[0].total} with images`);
