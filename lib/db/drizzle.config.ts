import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const schemaDir = path.join(configDir, "src/schema");

const schema = fs
  .readdirSync(schemaDir)
  .filter((file) => file.endsWith(".ts") && file !== "index.ts")
  .map((file) => path.join(schemaDir, file));

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Copy .env.example to .env and configure PostgreSQL.");
}

export default defineConfig({
  schema,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
