import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  isEmbeddedDatabase,
  getEmbeddedClient,
  closeEmbeddedClient,
  resetEmbeddedDatabase,
  isCorruptedPgliteError,
  backupEmbeddedDatabase,
  setNeedsRestoreFlag,
} from "./embedded";

function projectRoot(): string {
  if (process.env.PROJECT_ROOT) return process.env.PROJECT_ROOT;
  return process.cwd();
}

async function applyEmbeddedSchema(): Promise<void> {
  const sqlPath = join(projectRoot(), "scripts", "init-database.sql");
  if (!existsSync(sqlPath)) {
    throw new Error(`Missing ${sqlPath}. Run from the monorepo root or set PROJECT_ROOT.`);
  }
  const sql = readFileSync(sqlPath, "utf8");
  await getEmbeddedClient().exec(sql);
  console.log("[db] Embedded database initialized (.data/flashcards)");
}

async function migrateWordUniqueIndex(): Promise<void> {
  const client = getEmbeddedClient();
  const old = await client.query<{ n: number }>(
    `SELECT 1 AS n FROM pg_indexes WHERE indexname = 'idx_words_unique_word' LIMIT 1`,
  );
  if (old.rows.length > 0) {
    await client.exec(`
      DROP INDEX IF EXISTS idx_words_unique_word;
      CREATE UNIQUE INDEX IF NOT EXISTS idx_words_unique_word_per_lesson
        ON words (lesson_id, LOWER(TRIM(word)));
    `);
    console.log("[db] Migrated word uniqueness to per-lesson index");
  } else {
    await client.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_words_unique_word_per_lesson
        ON words (lesson_id, LOWER(TRIM(word)));
    `);
  }
}

/** Older embedded DBs were created before student_favorites existed. */
async function migrateStudentFavoritesTable(): Promise<void> {
  const client = getEmbeddedClient();
  const check = await client.query<{ reg: string | null }>(
    `SELECT to_regclass('public.student_favorites') AS reg`,
  );
  if (check.rows[0]?.reg) return;

  await client.exec(`
    CREATE TABLE IF NOT EXISTS student_favorites (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT uniq_student_word UNIQUE (student_id, word_id)
    );
  `);
  console.log("[db] Created missing student_favorites table");
}

async function probeEmbeddedDb(): Promise<boolean> {
  const check = await getEmbeddedClient().query<{ reg: string | null }>(
    `SELECT to_regclass('public.students') AS reg`,
  );
  if (!check.rows[0]?.reg) {
    await applyEmbeddedSchema();
  } else {
    await migrateWordUniqueIndex();
    await migrateStudentFavoritesTable();
  }
  return true;
}

/** Creates tables on first run when using embedded PGlite (no PostgreSQL install needed). */
export async function ensureDatabaseReady(): Promise<void> {
  if (!isEmbeddedDatabase()) return;

  try {
    await probeEmbeddedDb();
    return;
  } catch (err) {
    if (!isCorruptedPgliteError(err)) throw err;
  }

  // One retry — often a stale lock from API + script both opening PGlite.
  await closeEmbeddedClient();
  await new Promise((r) => setTimeout(r, 800));
  try {
    await probeEmbeddedDb();
    return;
  } catch (retryErr) {
    if (!isCorruptedPgliteError(retryErr)) throw retryErr;
  }

  console.warn(
    "[db] Embedded database is corrupted. Saving backup, then resetting .data/flashcards.",
  );
  console.warn(
    "[db] After reset run: pnpm run db:restore-all  (and stop pnpm dev before maintenance scripts).",
  );
  backupEmbeddedDatabase();
  await resetEmbeddedDatabase();
  await applyEmbeddedSchema();
  setNeedsRestoreFlag();
}
