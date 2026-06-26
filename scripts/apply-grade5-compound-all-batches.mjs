/**
 * Apply all compound-replacement batches (batch3–batch60) to DB.
 * Usage: node scripts/apply-grade5-compound-all-batches.mjs
 *        node scripts/apply-grade5-compound-all-batches.mjs batch3 batch10
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BATCH_META } from "./grade5-compound-batch-prompts.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
assertGrade123WriteAllowed("apply-grade5-compound-all-batches");

const from = process.argv[2] || "batch3";
const to = process.argv[3] || "batch60";
const batches = BATCH_META.filter((b) => b.key >= from && b.key <= to).map((b) => b.key);

for (const batch of batches) {
  console.log(`\n=== ${batch} ===`);
  const { execSync } = await import("node:child_process");
  execSync(`node scripts/apply-grade5-compound-batch.mjs ${batch}`, {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env, GRADE123_DB_WRITE_CONFIRMED: "1" },
  });
}

console.log("\nAll requested batches applied.");
