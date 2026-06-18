/**
 * Copy grade4_*.png from Cursor project dir into GRADE4 assets folder.
 * Usage: node scripts/copy-grade4-generated.mjs [sourceDir]
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ASSETS_DIR } from "./lib/grade4-image-style.mjs";

const sources = [
  process.argv[2],
  process.cwd(),
  join(process.cwd(), "assets"),
].filter(Boolean);

let copied = 0;
for (const srcDir of sources) {
  if (!existsSync(srcDir)) continue;
  for (const f of readdirSync(srcDir)) {
    if (!/^grade4_.+\.png$/i.test(f)) continue;
    const dest = join(ASSETS_DIR, f);
    if (existsSync(dest)) continue;
    mkdirSync(ASSETS_DIR, { recursive: true });
    copyFileSync(join(srcDir, f), dest);
    console.log(`Copied ${f}`);
    copied++;
  }
}
console.log(`Done: ${copied} new file(s) → ${ASSETS_DIR}`);
