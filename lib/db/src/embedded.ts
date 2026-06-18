import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

export function isEmbeddedDatabase(url = process.env.DATABASE_URL ?? ""): boolean {
  return (
    url === "embedded" ||
    url === "pglite" ||
    url.startsWith("pglite://") ||
    url.startsWith("file:")
  );
}

export function embeddedDataDir(url = process.env.DATABASE_URL ?? ""): string {
  if (url.startsWith("pglite://")) return url.slice("pglite://".length);
  if (url.startsWith("file:")) return url.slice("file:".length);
  const root = process.env.PROJECT_ROOT ?? process.cwd();
  return join(root, ".data", "flashcards");
}

let client: PGlite | null = null;
let embeddedDrizzle: ReturnType<typeof drizzle> | null = null;

export function isCorruptedPgliteError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("Aborted()") ||
    msg.includes("Program terminated with exit") ||
    msg.includes("PANIC")
  );
}

export function needsRestoreFlagPath(url = process.env.DATABASE_URL ?? ""): string {
  return join(embeddedDataDir(url), ".needs-restore");
}

export function setNeedsRestoreFlag(url = process.env.DATABASE_URL ?? ""): void {
  mkdirSync(embeddedDataDir(url), { recursive: true });
  writeFileSync(
    needsRestoreFlagPath(url),
    `Created ${new Date().toISOString()}\nRun: pnpm run db:restore-all\n`,
    "utf8",
  );
}

export function clearNeedsRestoreFlag(url = process.env.DATABASE_URL ?? ""): void {
  try {
    rmSync(needsRestoreFlagPath(url), { force: true });
  } catch {
    // ignore
  }
}

/** Copies .data/flashcards to .data/backups/flashcards-<timestamp> before destructive reset. */
export function backupEmbeddedDatabase(url = process.env.DATABASE_URL ?? ""): string | null {
  const dir = embeddedDataDir(url);
  if (!existsSync(dir)) return null;
  const backupsDir = join(dirname(dir), "backups");
  mkdirSync(backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dest = join(backupsDir, `flashcards-${stamp}`);
  cpSync(dir, dest, { recursive: true });
  writeFileSync(join(backupsDir, "LATEST.txt"), dest, "utf8");
  console.warn(`[db] Backup saved to: ${dest}`);
  return dest;
}

/** Closes the PGlite client without deleting files (retry after lock conflict). */
export async function closeEmbeddedClient(): Promise<void> {
  embeddedDrizzle = null;
  if (client) {
    try {
      await client.close();
    } catch {
      // ignore close errors on corrupted stores
    }
    client = null;
  }
}

/** Closes PGlite and deletes the on-disk data directory (embedded mode only). */
export async function resetEmbeddedDatabase(): Promise<void> {
  await closeEmbeddedClient();
  const dir = embeddedDataDir();
  rmSync(dir, { recursive: true, force: true });
}

export function getEmbeddedClient(): PGlite {
  if (!client) {
    const dir = embeddedDataDir();
    mkdirSync(dirname(dir), { recursive: true });
    client = new PGlite(dir);
  }
  return client;
}

export function createEmbeddedDb() {
  if (!embeddedDrizzle) {
    embeddedDrizzle = drizzle(getEmbeddedClient(), { schema });
  }
  return embeddedDrizzle;
}
