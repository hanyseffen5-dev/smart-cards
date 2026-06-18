/**
 * Replaces global unique(word) with unique(lesson_id, word) so the same English word
 * can appear in Daniel and Miscellaneous lessons (e.g. "mystery").
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning, flashcardsDataDir } from "./lib/db-safety.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));

function loadEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv();
process.env.PROJECT_ROOT = root;
assertServerNotRunning();

const dir = flashcardsDataDir();
if (!existsSync(dir)) {
  console.log("[migrate] No .data/flashcards yet — skip.");
  process.exit(0);
}

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const old = await client.query(
  `SELECT 1 AS n FROM pg_indexes WHERE indexname = 'idx_words_unique_word' LIMIT 1`,
);

if (old.rows.length > 0) {
  await client.exec(`
    DROP INDEX IF EXISTS idx_words_unique_word;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_words_unique_word_per_lesson
      ON words (lesson_id, LOWER(TRIM(word)));
  `);
  console.log("[migrate] Replaced global word index with per-lesson index.");
} else {
  await client.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_words_unique_word_per_lesson
      ON words (lesson_id, LOWER(TRIM(word)));
  `);
  console.log("[migrate] Per-lesson word index OK.");
}

await client.close();
