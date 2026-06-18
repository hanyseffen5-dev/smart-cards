import { existsSync } from "node:fs";
import { join } from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Static images migrated out of the database live under <projectRoot>/public.
// e.g. an image_url of "/images/apple_42.png" is served directly from disk by express.static.
const projectRoot = process.env.PROJECT_ROOT ?? process.cwd();
const publicDir = join(projectRoot, "public");
app.use(
  express.static(publicDir, {
    // Migrated files are content-addressed (unique names), so cache them hard.
    maxAge: "7d",
    immutable: true,
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use("/api", router);

// ─── Production: serve the built React frontend (single-container deploy) ────
// When the Vite build exists, Express serves it so the UI and API share one origin.
// The frontend then uses relative /api and /images paths (no CORS, no VITE_API_URL needed).
const clientDir = join(
  projectRoot,
  "artifacts",
  "smart-flashcards",
  "dist",
  "public",
);
if (existsSync(clientDir)) {
  app.use(express.static(clientDir, { maxAge: "1h" }));
  // SPA fallback: any non-API GET that isn't a real asset returns index.html
  // so client-side routes (e.g. /lessons/5) work on a hard refresh.
  app.get(/^(?!\/api\/).*/, (req, res, next) => {
    if (req.method !== "GET") {
      next();
      return;
    }
    res.sendFile(join(clientDir, "index.html"));
  });
  logger.info({ clientDir }, "[Static] Serving built frontend");
}

export default app;
