#!/usr/bin/env bash
# Backup PostgreSQL DB (use with cron). Set DATABASE_URL or PGHOST/PGUSER/PGPASSWORD.
set -e
SOURCE="${BASH_SOURCE[0]}"
DIR="$(cd "$(dirname "$SOURCE")" && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$DIR/../backups}"
mkdir -p "$BACKUP_DIR"
FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
if [ -n "$DATABASE_URL" ]; then
  pg_dump "$DATABASE_URL" --no-owner --no-acl -f "$FILE"
else
  pg_dump -h "${PGHOST:-localhost}" -U "${PGUSER}" -d "${PGDATABASE:-violette_kids}" --no-owner --no-acl -f "$FILE"
fi
echo "Backup: $FILE"
