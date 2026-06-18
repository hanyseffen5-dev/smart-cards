/**
 * Re-compress grade4_<word>.png files to 640×640 cream (smaller DB blobs).
 * Usage: node scripts/compress-grade4-assets.mjs simile alliteration ...
 */
import { existsSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { assetPath, makeSquare } from "./lib/grade4-image-style.mjs";

const words = process.argv.slice(2);
if (!words.length) {
  console.error("Usage: node scripts/compress-grade4-assets.mjs <word> ...");
  process.exit(1);
}

for (const word of words) {
  const src = assetPath(word);
  if (!existsSync(src)) {
    console.error(`Missing: ${src}`);
    process.exit(1);
  }
  const buf = await makeSquare(src);
  writeFileSync(src, buf);
  console.log(`Compressed ${word}: ${buf.length} bytes → ${src}`);
}
