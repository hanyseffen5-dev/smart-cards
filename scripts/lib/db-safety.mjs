/**
 * Prevents scripts from opening PGlite while the API server holds the database (main cause of corruption).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");

export function flashcardsDataDir() {
  const url = process.env.DATABASE_URL ?? "embedded";
  if (url.startsWith("pglite://")) return url.slice("pglite://".length);
  if (url.startsWith("file:")) return url.slice("file:".length);
  const root = process.env.PROJECT_ROOT ?? rootDir;
  return join(root, ".data", "flashcards");
}

export function apiLockPath() {
  return join(flashcardsDataDir(), ".api-server.lock");
}

/** Call at the start of any script that opens .data/flashcards directly. */
export function assertServerNotRunning() {
  const lock = apiLockPath();
  if (!existsSync(lock)) return;
  const info = readFileSync(lock, "utf8").trim().split("\n")[0];
  console.error(`
[db] Cannot run this script while Smart Flash Cards API is running.

  The API locks the database at: ${lock}
  (PID ${info || "unknown"})

  Fix:
    1. Stop pnpm dev (close the terminal or Ctrl+C)
    2. Run this script again
    3. Start pnpm dev

Opening the database from two programs at once corrupts PGlite and can erase lessons and images.
`);
  process.exit(1);
}
