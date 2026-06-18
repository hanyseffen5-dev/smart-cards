import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { embeddedDataDir, needsRestoreFlagPath } from "@workspace/db";
import { logger } from "./logger";

const LOCK_NAME = ".api-server.lock";

function lockPath(): string {
  const dir = embeddedDataDir();
  mkdirSync(dir, { recursive: true });
  return join(dir, LOCK_NAME);
}

export function acquireEmbeddedDbLock(): void {
  const path = lockPath();
  if (existsSync(path)) {
    const prev = readFileSync(path, "utf8").trim();
    logger.warn(
      { prev },
      "[db] Stale lock file found — another API instance may have crashed. Overwriting lock.",
    );
  }
  writeFileSync(path, `${process.pid}\n${new Date().toISOString()}\n`, "utf8");
}

export function releaseEmbeddedDbLock(): void {
  try {
    rmSync(lockPath(), { force: true });
  } catch {
    // ignore
  }
}

export function warnIfNeedsRestore(): void {
  const flag = needsRestoreFlagPath();
  if (!existsSync(flag)) return;
  const msg = readFileSync(flag, "utf8");
  logger.error(
    { flag, msg },
    "[db] Database was reset after corruption — lessons/images need restore. Run: pnpm run db:restore-all (stop dev first).",
  );
}
