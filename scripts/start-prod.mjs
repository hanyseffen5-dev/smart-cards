/**
 * Production launcher — loads .env then runs the built API server
 * (which also serves the Vite frontend from dist/public).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

process.env.PROJECT_ROOT = projectRoot;
loadEnvFile(resolve(projectRoot, ".env"));
process.env.NODE_ENV = "production";
process.env.PORT ??= "3000";
process.env.DATABASE_URL ??= "embedded";
process.env.BACKGROUND_WORKERS ??= "false";
process.env.ALLOW_IMAGE_GENERATION ??= "false";

// In Docker/Linux use /app/assets; locally fall back to project assets/.
if (!process.env.DANIEL_ASSETS_DIR) {
  process.env.DANIEL_ASSETS_DIR = resolve(projectRoot, "assets");
}

const entry = resolve(projectRoot, "artifacts/api-server/dist/index.mjs");
if (!existsSync(entry)) {
  console.error("[start-prod] Missing build — run: pnpm run build:prod");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--enable-source-maps", entry],
  { stdio: "inherit", env: process.env, cwd: projectRoot },
);
process.exit(result.status ?? 1);
