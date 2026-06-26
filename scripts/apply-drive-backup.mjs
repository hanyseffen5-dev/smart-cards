/**
 * Apply a full Smart Cards backup (from Google Drive download or local folder).
 *
 * Expected layout (any of these):
 *   .data/flashcards/     — PGlite database
 *   public/               — migrated /images
 *   assets/               — grade/daniel PNG sources
 *   flashcards-db.tgz     — compressed .data (extracted automatically)
 *   data.zip / .data.zip  — zip archive (extracted automatically)
 *
 * Usage:
 *   node scripts/apply-drive-backup.mjs <path-to-backup-folder-or-zip>
 *   node scripts/apply-drive-backup.mjs --drive-folder 18QjU-XEiDUFKiVSS3BSWNqEd6ARm1lfD
 */
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { assertServerNotRunning, flashcardsDataDir } from "./lib/db-safety.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRIVE_FOLDER_ID = "18QjU-XEiDUFKiVSS3BSWNqEd6ARm1lfD";

function log(msg) {
  console.log(`[drive-backup] ${msg}`);
}

function die(msg) {
  console.error(`[drive-backup] ERROR: ${msg}`);
  process.exit(1);
}

function extractZip(zipPath, destDir) {
  mkdirSync(destDir, { recursive: true });
  if (process.platform === "win32") {
    const r = spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}' -Force`,
      ],
      { stdio: "inherit" },
    );
    if (r.status !== 0) die(`Failed to extract zip: ${zipPath}`);
    return;
  }
  const r = spawnSync("unzip", ["-o", zipPath, "-d", destDir], { stdio: "inherit" });
  if (r.status !== 0) die(`Failed to extract zip: ${zipPath}`);
}

function extractTgz(tgzPath, destDir) {
  mkdirSync(destDir, { recursive: true });
  const r = spawnSync("tar", ["-xzf", tgzPath, "-C", destDir], { stdio: "inherit" });
  if (r.status !== 0) die(`Failed to extract tgz: ${tgzPath}`);
}

function findBackupRoot(dir) {
  const abs = resolve(dir);
  if (!existsSync(abs)) die(`Path not found: ${abs}`);

  if (statSync(abs).isFile()) {
    const work = join(root, ".drive-sync", "extracted");
    rmSync(work, { recursive: true, force: true });
    mkdirSync(work, { recursive: true });
    const lower = abs.toLowerCase();
    if (lower.endsWith(".zip")) extractZip(abs, work);
    else if (lower.endsWith(".tgz") || lower.endsWith(".tar.gz")) extractTgz(abs, work);
    else die(`Unsupported archive: ${abs}`);
    return findBackupRoot(work);
  }

  const hasData = existsSync(join(abs, ".data", "flashcards"));
  const hasPublic = existsSync(join(abs, "public"));
  const hasAssets = existsSync(join(abs, "assets"));
  if (hasData || hasPublic || hasAssets) return abs;

  // Single nested folder (typical Drive download)
  const children = readdirSync(abs).filter((n) => !n.startsWith("."));
  if (children.length === 1) {
    const nested = join(abs, children[0]);
    if (statSync(nested).isDirectory()) return findBackupRoot(nested);
  }

  // Archives inside folder
  for (const name of readdirSync(abs)) {
    const lower = name.toLowerCase();
    if (lower === "flashcards-db.tgz" || lower.endsWith(".zip") || lower.endsWith(".tgz")) {
      const work = join(abs, ".extracted");
      rmSync(work, { recursive: true, force: true });
      mkdirSync(work, { recursive: true });
      const archive = join(abs, name);
      if (lower.endsWith(".zip")) extractZip(archive, work);
      else extractTgz(archive, work);
      return findBackupRoot(work);
    }
  }

  die(`No .data/public/assets found under: ${abs}`);
}

function copyTree(src, dst, label) {
  if (!existsSync(src)) {
    log(`Skip ${label} — not in backup`);
    return 0;
  }
  rmSync(dst, { recursive: true, force: true });
  mkdirSync(dirname(dst), { recursive: true });
  cpSync(src, dst, { recursive: true });
  const count = readdirSync(dst, { recursive: true }).filter((p) => {
    try {
      return statSync(join(dst, p)).isFile();
    } catch {
      return false;
    }
  }).length;
  log(`Copied ${label}: ${count} file(s) → ${dst}`);
  return count;
}

async function tryDownloadPublicFolder(folderId) {
  const url = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  log(`Trying public download from ${url}`);
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  if (/sign in|Sign in/i.test(html) && html.length < 50_000) {
    die(
      "Google Drive folder requires sign-in. Either:\n" +
        "  1. Share folder as «Anyone with the link → Viewer», then re-run\n" +
        "  2. Download the folder manually (right-click → Download) and run:\n" +
        `       node scripts/apply-drive-backup.mjs "C:\\path\\to\\download"`,
    );
  }
  die(
    "Automatic folder download needs a manual download first.\n" +
      "Download from Drive, then run:\n" +
      `  node scripts/apply-drive-backup.mjs "C:\\path\\to\\downloaded\\folder"`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  let source = args[0];

  if (source === "--drive-folder") {
    await tryDownloadPublicFolder(args[1] || DRIVE_FOLDER_ID);
    return;
  }

  if (!source) {
    const defaultDir = join(root, ".drive-sync", "download");
    if (existsSync(defaultDir)) source = defaultDir;
    else {
      die(
        "Usage: node scripts/apply-drive-backup.mjs <backup-folder-or-zip>\n" +
          `   or: node scripts/apply-drive-backup.mjs --drive-folder ${DRIVE_FOLDER_ID}`,
      );
    }
  }

  assertServerNotRunning();

  const backupRoot = findBackupRoot(source);
  log(`Backup root: ${backupRoot}`);

  const dataSrc = join(backupRoot, ".data", "flashcards");
  const publicSrc = join(backupRoot, "public");
  const assetsSrc = join(backupRoot, "assets");

  const dataDst = flashcardsDataDir();
  const publicDst = join(root, "public");
  const assetsDst = join(root, "assets");

  let total = 0;
  total += copyTree(dataSrc, dataDst, "database (.data/flashcards)");
  total += copyTree(publicSrc, publicDst, "public images");
  total += copyTree(assetsSrc, assetsDst, "assets PNGs");

  if (total === 0) die("Nothing was copied — check backup contents.");

  log("Backup applied. Next:");
  log("  1. pnpm run build:prod");
  log("  2. pnpm start:prod   (or ./deploy.sh on server)");
  log("  3. Hard-refresh browser (Ctrl+Shift+R)");
}

main().catch((err) => die(err instanceof Error ? err.message : String(err)));
