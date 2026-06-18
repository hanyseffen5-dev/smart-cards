import { join } from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(join(root, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");

for (const name of ["flashcards", "flashcards-broken-20260531-0131", "flashcards-test"]) {
  const db = new PGlite(join(root, ".data", name));
  try {
    const lesson = await db.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, ["grade 4"]);
    if (!lesson.rows.length) {
      console.log(`${name}: no grade 4 lesson`);
      await db.close();
      continue;
    }
    const lessonId = lesson.rows[0].id;
    const stats = await db.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_img
       FROM words WHERE lesson_id = $1`,
      [lessonId],
    );
    console.log(`${name}: ${stats.rows[0].with_img}/${stats.rows[0].total}`);
  } catch (err) {
    console.log(`${name}: error reading snapshot`);
  }
  await db.close();
}
