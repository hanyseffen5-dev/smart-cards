/**
 * Copy generated grade5 PNGs from staging dir to DANIEL_ASSETS_DIR.
 * Usage: node scripts/install-grade5-batch-assets.mjs [.data/grade5-batch-simple-100.json] [stagingDir]
 */
import { readFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = process.argv[2] || join(root, ".data", "grade5-batch-simple-100.json");
const stagingDir = process.argv[3] || join(root, "assets");

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv(join(root, ".env"));
const destDir =
  process.env.DANIEL_ASSETS_DIR ||
  process.env.GRADE5_ASSETS_DIR ||
  join(root, "assets");
mkdirSync(destDir, { recursive: true });

const { picks } = JSON.parse(readFileSync(jsonPath, "utf8"));
let copied = 0;
let missing = 0;
for (const { assetFile } of picks) {
  const src = join(stagingDir, assetFile);
  const dest = join(destDir, assetFile);
  if (!existsSync(src)) {
    missing++;
    continue;
  }
  copyFileSync(src, dest);
  copied++;
}
console.log(`Copied ${copied}/${picks.length} → ${destDir}, missing: ${missing}`);
