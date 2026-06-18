# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# Smart Flash Cards — single-container production image
# Builds the Express API server + the React (Vite) frontend, then runs the API
# server which also serves the frontend and the migrated /images static files.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim

# pnpm is provided by Corepack (bundled with Node).
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

WORKDIR /app

# Copy the whole monorepo. (node_modules, dist, .data and public are excluded
# via .dockerignore — dependencies are installed fresh and code is built below.)
COPY . .

# Install all workspace dependencies exactly as locked.
RUN pnpm install --frozen-lockfile

# Build the API server (esbuild -> dist/index.mjs) and the frontend (Vite).
RUN pnpm run build:prod

# ─── Runtime configuration ───────────────────────────────────────────────────
ENV NODE_ENV=production
# PROJECT_ROOT lets the server find scripts/init-database.sql, assets/, public/ and .data/.
ENV PROJECT_ROOT=/app
# Embedded PGlite database (no external PostgreSQL needed).
ENV DATABASE_URL=embedded
ENV PORT=3000
# Never auto-generate images or run background workers in production.
ENV BACKGROUND_WORKERS=false
ENV ALLOW_IMAGE_GENERATION=false

# The database and migrated images live in volumes so they survive redeploys.
VOLUME ["/app/.data", "/app/public"]

EXPOSE 3000

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
