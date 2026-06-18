/**
 * Roll back grade 4 to before batch61–70 images (cards 601–700).
 * 1) Backup current DB folder
 * 2) Clear image_url for batch61–70 words (no read of blobs)
 * 3) Re-apply batch1–batch60 from assets
 *
 * Stop pnpm dev before running.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade4-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";

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
assertGrade123WriteAllowed("rollback-grade4-before-batch61");

const liveDir = join(rootDir, ".data", "flashcards");
console.log("Skipping full-folder copy (large PGlite). Clear + re-apply only.");

const rollbackWords = [];
for (let n = 61; n <= 70; n++) {
  const key = `batch${n}`;
  const batch = BATCH_PROMPTS[key];
  if (!batch) {
    console.warn(`Missing ${key} in BATCH_PROMPTS`);
    continue;
  }
  rollbackWords.push(...Object.keys(batch));
}
console.log(`Clearing images for ${rollbackWords.length} words (batch61–70)...`);

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(liveDir);

const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  LESSON_TITLE,
]);
if (lessonRes.rows.length === 0) {
  console.error(`Lesson "${LESSON_TITLE}" not found.`);
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

let cleared = 0;
for (const word of rollbackWords) {
  const res = await client.query(
    `UPDATE words SET image_url = NULL
     WHERE lesson_id = $1 AND LOWER(TRIM(word)) = LOWER(TRIM($2))
     RETURNING id`,
    [lessonId, word],
  );
  if (res.rows.length > 0) cleared++;
}
console.log(`Cleared ${cleared}/${rollbackWords.length} batch61–70 words.`);

const keepBatches = [];
for (let n = 1; n <= 60; n++) keepBatches.push(`batch${n}`);

let totalOk = 0;
let totalMiss = 0;
for (const batchArg of keepBatches) {
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
  if (ok > 0) console.log(`${batchArg}: ${ok} applied, ${miss} missing`);
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

console.log(`\nRe-applied batch1–60: ${totalOk} ok, ${totalMiss} missing assets.`);
console.log(`Grade 4 now: ${stats.rows[0].with_img}/${stats.rows[0].total} with images`);
console.log(`Next: restart pnpm dev and hard-refresh browser (Ctrl+Shift+R)`);
