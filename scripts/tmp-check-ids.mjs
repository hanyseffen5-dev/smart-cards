import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
for (const id of [2330, 2393, 2499]) {
  try {
    const r = await client.query(
      `SELECT id, word, translation, example FROM words WHERE id = $1`,
      [id],
    );
    console.log("ok", id, r.rows);
  } catch (e) {
    console.log("fail", id, e.message);
  }
}
await client.close();
