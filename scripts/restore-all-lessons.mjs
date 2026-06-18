/**
 * Restores Daniel images + Miscellaneous lesson after DB reset/corruption.
 * MUST run while pnpm dev is stopped.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertServerNotRunning, flashcardsDataDir } from "./lib/db-safety.mjs";
import { grade123WriteBlocked } from "./lib/protect-grade123.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

function run(script) {
  console.log(`\n>>> ${script}`);
  const r = spawnSync(process.execPath, [join(root, "scripts", script)], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, PROJECT_ROOT: root },
  });
  if (r.status !== 0) {
    console.error(`Failed: ${script}`);
    process.exit(r.status ?? 1);
  }
}

/** grade 1–5 + Miscellaneous Words are protected unless GRADE123_DB_WRITE_CONFIRMED=1 */
function runProtected(script) {
  if (grade123WriteBlocked()) {
    console.log(`\n>>> SKIP ${script} (curriculum lessons protected — set GRADE123_DB_WRITE_CONFIRMED=1 after user confirms نعم)`);
    return;
  }
  run(script);
}

loadEnv();
process.env.PROJECT_ROOT = root;
assertServerNotRunning();

run("migrate-word-unique-index.mjs");
run("seed-daniel-lesson.mjs");
run("restore-daniel-images.mjs");
run("restore-misc-lesson.mjs");
runProtected("seed-grade1-lesson.mjs");
runProtected("seed-grade2-lesson.mjs");
runProtected("seed-grade3-lesson.mjs");
runProtected("restore-grade1-images.mjs");
runProtected("restore-grade2-images.mjs");
runProtected("restore-grade3-images.mjs");
runProtected("seed-grade4-lesson.mjs");
runProtected("restore-grade4-images.mjs");
runProtected("seed-grade5-lesson.mjs");
runProtected("restore-grade5-images.mjs");
runProtected("create-miscellaneous-words-lesson.mjs");
runProtected("fill-misc-example-translations.mjs");
run("snapshot-curriculum-lessons.mjs");

const flag = join(flashcardsDataDir(), ".needs-restore");
if (existsSync(flag)) rmSync(flag, { force: true });

console.log("\n[db] Restore complete. Start: pnpm run dev");
console.log("Then hard-refresh the browser (Ctrl+Shift+R).");
