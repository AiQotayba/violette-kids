#!/usr/bin/env bash
set -euo pipefail

API_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$API_ROOT"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

corepack enable 2>/dev/null || true

if [ ! -f "$API_ROOT/.env" ]; then
  echo "Missing $API_ROOT/.env — create it from deploy/env.production.example"
  exit 1
fi

mkdir -p "$API_ROOT/logs"

echo "==> Installing dependencies"
export CI=true
pnpm install --no-frozen-lockfile

echo "==> Generating Prisma client"
node scripts/with-env.mjs generate

if grep -qE '^DATABASE_PROVIDER=(mysql|"mysql")' "$API_ROOT/.env"; then
  echo "==> Syncing MySQL schema (db push)"
  node scripts/with-env.mjs db push --skip-generate
elif [ -d "$API_ROOT/prisma/migrations" ] && [ -n "$(ls -A "$API_ROOT/prisma/migrations" 2>/dev/null)" ]; then
  echo "==> Running database migrations"
  node scripts/with-env.mjs migrate deploy
else
  echo "==> Syncing database schema (db push)"
  node scripts/with-env.mjs db push --skip-generate
fi

echo "==> Building API"
node scripts/with-env.mjs generate
./node_modules/.bin/tsc

echo "==> Starting / reloading PM2"
pm2 startOrReload "$API_ROOT/deploy/ecosystem.config.cjs" --update-env
pm2 save

echo "==> Deploy complete"
pm2 status violette-api
