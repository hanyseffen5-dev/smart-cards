import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

try {
  const r = await client.query(`SELECT COUNT(*)::int AS n FROM words`);
  console.log("read ok:", r.rows[0].n);
  const u = await client.query(`SELECT id FROM words LIMIT 1`);
  const id = u.rows[0].id;
  const w = await client.query(`UPDATE words SET difficulty = difficulty WHERE id = $1 RETURNING id`, [id]);
  console.log("write ok:", w.rows[0].id);
} catch (e) {
  console.error("FAIL:", e.message);
}
await client.close();
