/**
 * Ensures modern words table columns exist on older embedded DB files.
 * Safe to run multiple times.
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
  console.log("[migrate] No .data/flashcards yet - skip.");
  process.exit(0);
}

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

await client.exec(`
  ALTER TABLE words ADD COLUMN IF NOT EXISTS image_url TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS audio_url TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS example TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS example_translation TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS difficulty TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS part_of_speech TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
`);

await client.exec(`
  UPDATE words SET difficulty = 'medium' WHERE difficulty IS NULL OR difficulty = '';
  UPDATE words SET is_favorite = FALSE WHERE is_favorite IS NULL;
  UPDATE words SET created_at = NOW() WHERE created_at IS NULL;
`);

await client.exec(`
  ALTER TABLE words ALTER COLUMN difficulty SET DEFAULT 'medium';
  ALTER TABLE words ALTER COLUMN is_favorite SET DEFAULT FALSE;
  ALTER TABLE words ALTER COLUMN created_at SET DEFAULT NOW();
`);

const cols = await client.query(`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'words'
  ORDER BY ordinal_position
`);

console.log(
  `[migrate] words columns: ${cols.rows.map((r) => r.column_name).join(", ")}`,
);
await client.close();
