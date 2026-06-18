/**
 * Restores "Miscellaneous Words Part 1" (initial 10 cards + batches 3–11).
 * Stop pnpm dev before running so PGlite is not locked.
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const envPath = join(root, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
process.env.PROJECT_ROOT = root;
assertServerNotRunning();
const scripts = [
  "add-misc-words-part1.mjs",
  "add-misc-words-batch3.mjs",
  "add-misc-words-batch4.mjs",
  "add-misc-words-batch5.mjs",
  "add-misc-words-batch6.mjs",
  "add-misc-words-batch7.mjs",
  "add-misc-words-batch8.mjs",
  "add-misc-words-batch9.mjs",
  "add-misc-words-batch10.mjs",
  "add-misc-words-batch11.mjs",
];

for (const name of scripts) {
  console.log(`\n>>> ${name}`);
  const r = spawnSync(process.execPath, [join(root, "scripts", name)], {
    cwd: root,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    console.error(`Failed: ${name}`);
    process.exit(r.status ?? 1);
  }
}

console.log("\n>>> smart-crop-images.mjs");
const crop = spawnSync(process.execPath, [join(root, "scripts", "smart-crop-images.mjs")], {
  cwd: root,
  stdio: "inherit",
});
if (crop.status !== 0) process.exit(crop.status ?? 1);

console.log("\nDone. Restart with: pnpm dev (then Ctrl+Shift+R in browser)");
