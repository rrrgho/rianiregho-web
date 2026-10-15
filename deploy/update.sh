#!/usr/bin/env bash
# Run ON THE SERVER, inside the app folder, to deploy what you pushed to Git:
#
#   cd /var/www/rp/iregho-web/rianiregho-web && ./deploy/update.sh
#
# Pulls the latest code, rebuilds the image and restarts the container.
# Needs `.env.production` in this folder (it is never in Git).
set -euo pipefail

cd "$(dirname "$0")/.."
BRANCH="${DEPLOY_BRANCH:-main}"
HEALTH_URL="http://127.0.0.1:8021/api/health"

test -f .env.production || { echo "Missing .env.production (see deploy/env.production.example)" >&2; exit 1; }

echo "==> Pulling $BRANCH"
git fetch origin "$BRANCH"
git merge --ff-only "origin/$BRANCH"

echo "==> Building and restarting"
docker tag rianiregho-web:latest rianiregho-web:previous 2>/dev/null || true
docker compose build
docker compose up -d
docker image prune -f >/dev/null

echo "==> Waiting for health check"
for _ in $(seq 1 30); do
  if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
    echo "OK: deployed $(git rev-parse --short HEAD) and healthy."
    exit 0
  fi
  sleep 2
done

echo "Health check failed. Recent logs:" >&2
docker compose logs --tail=50 web >&2
echo "Roll back: docker tag rianiregho-web:previous rianiregho-web:latest && docker compose up -d --no-build" >&2
exit 1
