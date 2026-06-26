/** Copy grade5_*.png from Cursor assets mirror to project assets/. */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src =
  process.env.CURSOR_ASSETS_DIR ||
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";
const dst = join(root, "assets");
const filter = process.argv[2]; // optional word

mkdirSync(dst, { recursive: true });
let n = 0;
for (const f of readdirSync(src)) {
  if (!/^grade5_.*\.png$/i.test(f)) continue;
  if (filter && !f.toLowerCase().includes(filter.toLowerCase().replace(/\s+/g, "_"))) continue;
  copyFileSync(join(src, f), join(dst, f));
  n++;
}
console.log(`Synced ${n} grade5 PNG(s) → ${dst}`);
