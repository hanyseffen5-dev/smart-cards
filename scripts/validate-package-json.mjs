import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const skip = new Set(["node_modules", ".git", "dist", ".data"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name === "package.json") out.push(p);
  }
  return out;
}

let bad = 0;
for (const p of walk(root)) {
  try {
    JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    console.error("INVALID:", p, e.message);
    bad++;
  }
}
console.log(bad ? `${bad} invalid file(s)` : "All workspace package.json files are valid JSON");
