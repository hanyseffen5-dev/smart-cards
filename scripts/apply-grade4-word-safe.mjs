/** Apply one grade4 image at a time with fresh DB connection (avoids PGlite concurrency issues). */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade4-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const words = process.argv.slice(2);
if (words.length === 0) {
  console.error("Usage: node scripts/apply-grade4-word-safe.mjs <word> [word2 ...]");
  process.exit(1);
}

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
assertServerNotRunning();
assertGrade123WriteAllowed("apply-grade4-word-safe");

const { PGlite } = require("@electric-sql/pglite");

for (const word of words) {
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing asset: ${src}`);
    process.exit(1);
  }
  const buf = await makeSquare(src);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const client = new PGlite(join(rootDir, ".data", "flashcards"));
  const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
    LESSON_TITLE,
  ]);
  const lessonId = lessonRes.rows[0].id;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = $2 AND LOWER(TRIM(word)) = LOWER(TRIM($3))
     RETURNING id, word`,
    [dataUrl, lessonId, word],
  );
  await client.close();
  if (res.rows.length === 0) {
    console.error(`Word not found: "${word}"`);
    process.exit(1);
  }
  console.log(`Updated id=${res.rows[0].id} "${res.rows[0].word}"`);
}
