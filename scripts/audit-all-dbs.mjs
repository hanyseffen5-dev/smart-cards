import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");

const DBS = [
  [join(rootDir, ".data", "flashcards"), "CURRENT"],
  [join(rootDir, ".data", "flashcards-broken-20260531-0131"), "BACKUP-20260531"],
  [join(rootDir, ".data", "flashcards-test"), "TEST"],
  [join(rootDir, "artifacts", "api-server", ".data", "flashcards"), "API-SERVER"],
];

async function audit(dir, label) {
  if (!existsSync(dir)) {
    console.log(`\n=== ${label} === MISSING (${dir})`);
    return;
  }
  const client = new PGlite(dir);
  try {
    const lessons = await client.query(`SELECT id, title, word_count FROM lessons ORDER BY id`);
    console.log(`\n=== ${label} === (${dir})`);
    for (const l of lessons.rows) {
      console.log(`  id=${l.id} "${l.title}" words=${l.word_count}`);
    }
    for (const title of ["grade 1", "grade 2", "grade 3", "grade 4", "Miscellaneous Words"]) {
      const l = lessons.rows.find((r) => r.title === title);
      if (!l) continue;
      const w = await client.query(
        `SELECT COUNT(*)::int AS n,
          SUM(CASE WHEN image_url IS NOT NULL AND LENGTH(image_url) > 100 THEN 1 ELSE 0 END)::int AS img
         FROM words WHERE lesson_id = $1`,
        [l.id],
      );
      console.log(`  >> ${title}: ${w.rows[0].n} words, ${w.rows[0].img} with images`);
    }
  } catch (e) {
    console.log(`\n=== ${label} === ERROR: ${e.message}`);
  }
  await client.close();
}

for (const [dir, label] of DBS) {
  await audit(dir, label);
}
