import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { createEmbeddedDb, isEmbeddedDatabase, isCorruptedPgliteError } from "./embedded";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";

export { ensureDatabaseReady } from "./setup";
export {
  isEmbeddedDatabase,
  embeddedDataDir,
  backupEmbeddedDatabase,
  setNeedsRestoreFlag,
  clearNeedsRestoreFlag,
  needsRestoreFlagPath,
} from "./embedded";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Use 'embedded' for local dev without PostgreSQL, or a postgresql:// URL.",
  );
}

export const pool: pg.Pool | null = isEmbeddedDatabase()
  ? null
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
    });

type AppDb = NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>;

const postgresDb = isEmbeddedDatabase()
  ? null
  : drizzle(pool!, { schema });

/** Always uses the current PGlite client (recreated after corruption reset). */
export const db: AppDb = isEmbeddedDatabase()
  ? new Proxy({} as AppDb, {
      get(_target, prop) {
        const real = createEmbeddedDb() as AppDb;
        const value = Reflect.get(real as object, prop, real);
        return typeof value === "function" ? value.bind(real) : value;
      },
    })
  : postgresDb!;

export { isCorruptedPgliteError };

export * from "./schema";
