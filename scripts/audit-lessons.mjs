import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { readdirSync, existsSync } from "node:fs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const assetsDir =
  process.env.GRADE3_ASSETS_DIR ||
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessons = await client.query(`SELECT id, title, word_count FROM lessons ORDER BY id`);
console.log("=== Lessons ===");
for (const l of lessons.rows) console.log(`  id=${l.id} "${l.title}" word_count=${l.word_count}`);

for (const title of ["grade 1", "grade 2", "grade 3", "grade 4"]) {
  const l = lessons.rows.find((r) => r.title === title);
  if (!l) {
    console.log(`\n${title}: NOT IN DATABASE`);
    continue;
  }
  const w = await client.query(
    `SELECT COUNT(*)::int AS n,
      SUM(CASE WHEN image_url IS NOT NULL AND LENGTH(image_url) > 100 THEN 1 ELSE 0 END)::int AS img
     FROM words WHERE lesson_id = $1`,
    [l.id],
  );
  const prefix = title.replace(" ", "") + "_";
  let assetCount = 0;
  if (existsSync(assetsDir)) {
    assetCount = readdirSync(assetsDir).filter((f) => f.startsWith(prefix) && f.endsWith(".png")).length;
  }
  console.log(`\n${title} (id=${l.id}): DB ${w.rows[0].n} words, ${w.rows[0].img} with images, ${assetCount} asset files`);
}

await client.close();
