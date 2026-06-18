import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

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
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const res = await client.query(
  `SELECT word, LENGTH(image_url) AS sz
   FROM words
   WHERE image_url IS NOT NULL AND image_url != ''
   ORDER BY sz DESC LIMIT 10`,
);
for (const r of res.rows) {
  console.log(`${r.word}: ${(r.sz / 1024).toFixed(1)} KB`);
}

const total = await client.query(
  `SELECT MIN(LENGTH(image_url)) AS mn, MAX(LENGTH(image_url)) AS mx, AVG(LENGTH(image_url))::INT AS av
   FROM words WHERE image_url IS NOT NULL AND image_url != ''`,
);
console.log("\nOverall:", total.rows[0]);

await client.close();
