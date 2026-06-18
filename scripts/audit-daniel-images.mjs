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

const stats = await client.query(
  `SELECT COUNT(*) AS total,
          SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) AS with_image
   FROM words WHERE lesson_id = 1`,
);
console.log("Daniel lesson stats:", stats.rows[0]);

const withImg = await client.query(
  `SELECT id, word, LENGTH(image_url) AS len,
          LEFT(image_url, 40) AS prefix
   FROM words WHERE lesson_id = 1 AND image_url IS NOT NULL AND image_url != ''
   ORDER BY created_at`,
);
console.log("\nWords WITH images:");
for (const r of withImg.rows) console.log(`  ${r.id}: ${r.word} (${(r.len/1024).toFixed(1)} KB) ${r.prefix}...`);

const lesson = await client.query(`SELECT id, title, word_count FROM lessons WHERE id = 1`);
console.log("\nLesson:", lesson.rows[0]);

const ordered = await client.query(
  `SELECT id, word, (image_url IS NOT NULL AND image_url != '') AS has_img
   FROM words WHERE lesson_id = 1 ORDER BY created_at LIMIT 15`,
);
console.log("\nFirst 15 by created_at:");
for (let i = 0; i < ordered.rows.length; i++) {
  const r = ordered.rows[i];
  console.log(`  ${i + 1}. id=${r.id} "${r.word}" hasImage=${r.has_img}`);
}

await client.close();
