import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;

const url = process.env.DATABASE_URL ?? "embedded";
const isEmbedded =
  url === "embedded" ||
  url === "pglite" ||
  url.startsWith("pglite://") ||
  url.startsWith("file:");

if (!isEmbedded) {
  console.error("db:reset only applies when DATABASE_URL is embedded (see .env).");
  process.exit(1);
}

let dataDir = join(rootDir, ".data", "flashcards");
if (url.startsWith("pglite://")) dataDir = url.slice("pglite://".length);
if (url.startsWith("file:")) dataDir = url.slice("file:".length);

rmSync(dataDir, { recursive: true, force: true });
console.log(`Removed embedded database at: ${dataDir}`);

const push = spawnSync("pnpm", ["db:push"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});
process.exit(push.status ?? 1);
