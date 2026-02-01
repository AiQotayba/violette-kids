#!/usr/bin/env bash
# Restore from backup: ./restore.sh path/to/backup.sql
set -e
[ -z "$1" ] && { echo "Usage: $0 backup.sql"; exit 1; }
[ ! -f "$1" ] && { echo "File not found: $1"; exit 1; }
if [ -n "$DATABASE_URL" ]; then
  psql "$DATABASE_URL" -f "$1"
else
  psql -h "${PGHOST:-localhost}" -U "${PGUSER}" -d "${PGDATABASE:-violette_kids}" -f "$1"
fi
echo "Restored: $1"
