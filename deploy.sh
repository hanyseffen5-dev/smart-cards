#!/usr/bin/env bash
# Smart Cards — server deploy script
# Rebuilds the Docker image and restarts the container.
# Usually invoked automatically by .git/hooks/post-merge after `git pull`.
set -euo pipefail

# ─── Configuration (override via environment or edit defaults) ───────────────
APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
IMAGE_NAME="${IMAGE_NAME:-smart-cards}"
CONTAINER_NAME="${CONTAINER_NAME:-smart-cards}"
HOST_PORT="${HOST_PORT:-3000}"
ENV_FILE="${ENV_FILE:-${APP_DIR}/.env}"

log() { printf '[deploy] %s\n' "$*"; }
die() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

cd "$APP_DIR"

command -v docker >/dev/null 2>&1 || die "docker not found — install Docker first."
[[ -f Dockerfile ]] || die "Dockerfile not found in ${APP_DIR}"
[[ -f "$ENV_FILE" ]] || die "Missing ${ENV_FILE} — copy .env.example and fill secrets on the server."

mkdir -p "${APP_DIR}/.data" "${APP_DIR}/public"

log "Building image ${IMAGE_NAME}:latest ..."
docker build -t "${IMAGE_NAME}:latest" .

if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  log "Stopping container ${CONTAINER_NAME} ..."
  docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
  docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
fi

log "Starting container ${CONTAINER_NAME} on port ${HOST_PORT} ..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "${HOST_PORT}:3000" \
  -v "${APP_DIR}/.data:/app/.data" \
  -v "${APP_DIR}/public:/app/public" \
  --env-file "$ENV_FILE" \
  "${IMAGE_NAME}:latest"

log "Waiting for health check ..."
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${HOST_PORT}/api/healthz" >/dev/null 2>&1 \
    || curl -sf "http://127.0.0.1:${HOST_PORT}/" >/dev/null 2>&1; then
    log "Deploy complete — app is responding on port ${HOST_PORT}."
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi
  sleep 2
done

log "Container started but health check timed out. Check logs:"
log "  docker logs ${CONTAINER_NAME}"
exit 0
