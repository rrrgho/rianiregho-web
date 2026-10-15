#!/usr/bin/env bash
# Deploy rianiregho-web to the server: sync the source, rebuild the image and
# restart the container. Run from the repo root on your machine:
#
#   ./deploy/deploy.sh
#
# Prerequisites: SSH key access to the server and a configured
# `.env.production` in $DEPLOY_DIR (see docs/DEPLOYMENT.md).
set -euo pipefail

SERVER="${DEPLOY_SERVER:-root@31.97.107.242}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/rp/iregho-web/rianiregho-web}"
HEALTH_URL="http://127.0.0.1:8021/api/health"

cd "$(dirname "$0")/.."

echo "==> Syncing source to $SERVER:$DEPLOY_DIR"
ssh "$SERVER" "mkdir -p '$DEPLOY_DIR'"
# Excluded paths (.env*, storage, ...) are never uploaded and, because we do not
# use --delete-excluded, are never deleted on the server either.
rsync -az --delete \
  --exclude '.git' --exclude 'node_modules' --exclude '.next' \
  --exclude '.env*' --exclude 'storage' --exclude '.DS_Store' \
  --exclude 'database_connection_info.txt' \
  ./ "$SERVER:$DEPLOY_DIR/"

echo "==> Building and restarting"
ssh "$SERVER" "set -e; cd '$DEPLOY_DIR';
  test -f .env.production || { echo 'Missing .env.production in $DEPLOY_DIR'; exit 1; }
  docker tag rianiregho-web:latest rianiregho-web:previous 2>/dev/null || true
  docker compose build
  docker compose up -d
  docker image prune -f >/dev/null"

echo "==> Waiting for health check"
for i in $(seq 1 30); do
  if ssh "$SERVER" "curl -fsS $HEALTH_URL" >/dev/null 2>&1; then
    echo "OK: deployed and healthy."
    exit 0
  fi
  sleep 2
done

echo "Health check failed. Recent logs:" >&2
ssh "$SERVER" "cd '$DEPLOY_DIR' && docker compose logs --tail=50 web" >&2
echo "Roll back with: ssh $SERVER 'cd $DEPLOY_DIR && docker tag rianiregho-web:previous rianiregho-web:latest && docker compose up -d --no-build'" >&2
exit 1
