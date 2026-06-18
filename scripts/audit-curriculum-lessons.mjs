/**
 * Read-only check: six curriculum lessons exist with expected counts.
 * Usage: node scripts/audit-curriculum-lessons.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  CURRICULUM_LESSON_TITLES,
  CURRICULUM_LESSON_EXPECTED_COUNTS,
} from "./lib/protect-grade123.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

let ok = true;
for (const title of CURRICULUM_LESSON_TITLES) {
  const expected = CURRICULUM_LESSON_EXPECTED_COUNTS[title];
  const lessonRes = await client.query(
    `SELECT id, word_count FROM lessons WHERE title = $1 LIMIT 1`,
    [title],
  );
  if (lessonRes.rows.length === 0) {
    console.error(`FAIL missing lesson: "${title}"`);
    ok = false;
    continue;
  }
  const lessonId = lessonRes.rows[0].id;
  const countRes = await client.query(
    `SELECT COUNT(*)::int AS n,
      COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS imgs
     FROM words WHERE lesson_id = $1`,
    [lessonId],
  );
  const n = countRes.rows[0].n;
  const imgs = countRes.rows[0].imgs;
  if (n !== expected) {
    console.error(`FAIL "${title}": ${n} words (expected ${expected})`);
    ok = false;
  } else if (imgs < n) {
    console.error(`FAIL "${title}": only ${imgs}/${n} cards have images`);
    ok = false;
  } else {
    console.log(`OK "${title}": ${n} words, ${imgs} images`);
  }
}

await client.close();

const snapPath = join(rootDir, ".data", "curriculum-snapshot.json");
if (existsSync(snapPath)) {
  const snap = JSON.parse(readFileSync(snapPath, "utf8"));
  console.log(`\n[snapshot] Last saved: ${snap.savedAt}`);
}

if (!ok) process.exit(1);
console.log("\n[audit] All curriculum lessons OK.");
