#!/usr/bin/env bash
# Example: sync .data and public from your machine to the server (delta transfer).
# Copy to sync-data-to-server.sh, edit variables, run from Git Bash or WSL.
#
# Windows (WSL): convert F:\... to /mnt/f/...
set -euo pipefail

LOCAL_ROOT="${LOCAL_ROOT:-/mnt/f/path/to/FLASH CARD}"
REMOTE="user@your-server-ip"
REMOTE_DIR="/opt/smart-cards"

RSYNC_OPTS=(-avz --progress --partial --inplace)

# --delete removes files on server that no longer exist locally (mirror mode).
# Remove --delete if you only want to push new/changed files without deleting.
SYNC_DELETE="${SYNC_DELETE:-0}"
DELETE_FLAG=()
if [[ "$SYNC_DELETE" == "1" ]]; then
  DELETE_FLAG=(--delete)
fi

rsync "${RSYNC_OPTS[@]}" "${DELETE_FLAG[@]}" \
  "${LOCAL_ROOT}/.data/" "${REMOTE}:${REMOTE_DIR}/.data/"

rsync "${RSYNC_OPTS[@]}" "${DELETE_FLAG[@]}" \
  "${LOCAL_ROOT}/public/" "${REMOTE}:${REMOTE_DIR}/public/"

echo "Sync complete."
