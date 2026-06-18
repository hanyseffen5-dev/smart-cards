import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
if (existsSync(join(rootDir, ".env"))) {
  for (const line of readFileSync(join(rootDir, ".env"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
const { PGlite } = require("@electric-sql/pglite");
const c = new PGlite(join(rootDir, ".data", "flashcards"));
const lesson = await c.query(
  `SELECT id FROM lessons WHERE title = 'Miscellaneous Words Part 1' LIMIT 1`,
);
const words = await c.query(
  `SELECT id, word, example FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lesson.rows[0].id],
);
const nums = process.argv.slice(2).map(Number).filter(Boolean);
for (let i = 0; i < words.rows.length; i++) {
  const n = i + 1;
  if (nums.length && !nums.includes(n)) continue;
  const w = words.rows[i];
  console.log(`${n}. id=${w.id} | ${w.word}`);
}
await c.close();
