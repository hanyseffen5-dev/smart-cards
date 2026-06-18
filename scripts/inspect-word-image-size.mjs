import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");
const ids = [265, 266, 267, 268, 269, 270, 271];
const client = new PGlite(join(root, ".data", "flashcards"));
for (const id of ids) {
  const r = await client.query("SELECT word, image_url FROM words WHERE id=$1", [id]);
  const row = r.rows[0];
  const url = row?.image_url || "";
  const b64 = url.replace(/^data:image\/\w+;base64,/, "");
  if (!b64) {
    console.log(id, row?.word, "NO IMAGE");
    continue;
  }
  const buf = Buffer.from(b64, "base64");
  const m = await sharp(buf).metadata();
  console.log(id, row.word, `${m.width}x${m.height}`, `ar=${(m.width / m.height).toFixed(2)}`);
}
await client.close();
