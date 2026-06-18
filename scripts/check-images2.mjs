import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const words = ["persevering", "blockade", "otherwise", "get rid of", "disagreeable", "imprisonment", "in order to"];
for (const w of words) {
  const res = await client.query(
    `SELECT id, word FROM words WHERE LOWER(TRIM(word)) = LOWER(TRIM($1))`,
    [w],
  );
  if (res.rows.length > 0) {
    const row = res.rows[0];
    const imgUrl = (await client.query(`SELECT image_url FROM words WHERE id = $1`, [row.id])).rows[0].image_url;
    const base64 = imgUrl.replace(/^data:image\/png;base64,/, "");
    const buf = Buffer.from(base64, "base64");
    const outPath = join(rootDir, "scripts", `db_${w.replace(/ /g, '_')}.png`);
    writeFileSync(outPath, buf);
    console.log(`${w} (id=${row.id}) → saved to db_${w.replace(/ /g, '_')}.png`);
  }
}
await client.close();
