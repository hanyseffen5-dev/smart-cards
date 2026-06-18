import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const artifactDir = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1].trim();
    const value = match[2].trim();
    // Later lines in .env override earlier ones (e.g. duplicate keys).
    process.env[key] = value;
  }
}

const projectRoot = resolve(artifactDir, "../..");
process.env.PROJECT_ROOT = projectRoot;

loadEnvFile(resolve(projectRoot, ".env"));
loadEnvFile(resolve(artifactDir, ".env"));

process.env.NODE_ENV ??= "development";
process.env.PORT ??= "3000";
process.env.DATABASE_URL ??= "embedded";
process.env.BACKGROUND_WORKERS ??= "false";
process.env.ALLOW_IMAGE_GENERATION ??= "false";

function freePort(port) {
  if (process.platform === "win32") {
    spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { $p = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue; if ($p -and $p.ProcessName -eq 'node') { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }`,
      ],
      { stdio: "ignore", shell: true },
    );
    return;
  }
  spawnSync("sh", ["-c", `fuser -k ${port}/tcp 2>/dev/null || true`], {
    stdio: "ignore",
  });
}

freePort(Number(process.env.PORT));

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: artifactDir,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("node", ["./build.mjs"]);
run("node", ["--enable-source-maps", "./dist/index.mjs"]);
