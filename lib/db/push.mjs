import { createRequire } from "node:module";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(pkgDir, "package.json"));
const rootDir = join(pkgDir, "../../..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1].trim();
    const value = match[2].trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(join(rootDir, ".env"));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to .env (see .env.example).");
  process.exit(1);
}

const sqlPath = join(rootDir, "scripts", "init-database.sql");
const sql = readFileSync(sqlPath, "utf8");

function isEmbedded(url) {
  return url === "embedded" || url === "pglite" || url.startsWith("pglite://") || url.startsWith("file:");
}

function embeddedDir(url) {
  if (url.startsWith("pglite://")) return url.slice("pglite://".length);
  if (url.startsWith("file:")) return url.slice("file:".length);
  return join(rootDir, ".data", "flashcards");
}

try {
  if (isEmbedded(databaseUrl)) {
    const { PGlite } = require("@electric-sql/pglite");
    const dir = embeddedDir(databaseUrl);
    mkdirSync(dirname(dir), { recursive: true });
    const client = new PGlite(dir);
    await client.exec(sql);
    await client.close();
    console.log(`Embedded database schema applied at: ${dir}`);
  } else {
    const pg = require("pg");
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log("PostgreSQL schema applied successfully.");
  }
} catch (err) {
  console.error("Failed to apply database schema:", err.message);
  if (!isEmbedded(databaseUrl)) {
    console.error("\nTip: set DATABASE_URL=embedded in .env to run without installing PostgreSQL.");
  }
  process.exit(1);
}
