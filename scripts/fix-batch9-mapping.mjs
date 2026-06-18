/**
 * @deprecated Use fix-misc-batch8-9-images.mjs instead.
 * Re-exports correct batch 9 mapping from add-misc-words-batch9.mjs.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
spawnSync(process.execPath, [join(root, "scripts", "fix-misc-batch8-9-images.mjs")], {
  cwd: root,
  stdio: "inherit",
});
