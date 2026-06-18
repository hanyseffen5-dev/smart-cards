/** One-off: grade 2 lesson used invalid level "elementary" — API expects beginner|intermediate|advanced|all */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
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
assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const res = await client.query(
  `UPDATE lessons SET level = 'beginner' WHERE level = 'elementary' RETURNING id, title, level`,
);
for (const row of res.rows) {
  console.log(`Fixed lesson id=${row.id} "${row.title}" → level=${row.level}`);
}
if (res.rows.length === 0) console.log("No lessons with level=elementary.");

await client.close();
