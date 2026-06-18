import { createHash } from "node:crypto";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cropIllustrationFromFile } from "./lib/illustration-crop.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";
const require = createRequire(join(root, "lib/db/package.json"));
const { PGlite } = require("@electric-sql/pglite");

const checks = [
  { id: 356, word: "matter", key: "images_88", uuid: "ca71d32a" },
  { id: 357, word: "fairly", key: "images_89", uuid: "24583634" },
  { id: 358, word: "system", key: "images_90", uuid: "25b87ba0" },
  { id: 359, word: "imprisonment", key: "images_91", uuid: "6053383f" },
  { id: 361, word: "otherwise", key: "images_100", uuid: "a8acc2ed" },
  { id: 367, word: "seaman", key: "images_97", uuid: "8b3f1ef8" },
  { id: 368, word: "argument", key: "images_99", uuid: "706b2120" },
];

function findAsset(key, uuid) {
  const f = readdirSync(ASSETS).find(
    (n) => n.includes(key) && n.includes(uuid) && n.endsWith(".png"),
  );
  return f ? join(ASSETS, f) : null;
}

function hashBuf(buf) {
  return createHash("sha256").update(buf).digest("hex").slice(0, 12);
}

const client = new PGlite(join(root, ".data", "flashcards"));
for (const c of checks) {
  const path = findAsset(c.key, c.uuid);
  if (!path) {
    console.log(c.word, "MISSING ASSET");
    continue;
  }
  const crop = await cropIllustrationFromFile(path);
  const assetH = hashBuf(crop);
  const r = await client.query("SELECT image_url FROM words WHERE id = $1", [c.id]);
  const url = r.rows[0]?.image_url || "";
  const b64 = url.replace(/^data:image\/\w+;base64,/, "");
  const dbH = b64 ? hashBuf(Buffer.from(b64, "base64")) : "no-image";
  console.log(
    c.word,
    dbH === assetH ? "OK (DB matches cropped asset)" : `MISMATCH db=${dbH} asset=${assetH}`,
  );
}
await client.close();
