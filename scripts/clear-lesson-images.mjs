import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const lessonId = process.argv[2] ?? "1";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));

const port = process.env.PORT || "3000";
const res = await fetch(`http://127.0.0.1:${port}/api/lessons/${lessonId}/images`, {
  method: "DELETE",
});

const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`Failed (${res.status}):`, body);
  console.error("Start API first: pnpm dev:api");
  process.exit(1);
}

console.log(`Lesson ${lessonId}: cleared ${body.cleared} image(s). No new images will be generated until you request it.`);
