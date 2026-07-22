#!/bin/bash
set -euo pipefail

APP_ROOT="/home/behforma/tienda.behformas.com"
BACKUP_ROOT="/home/behforma/backups/beh-store"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_ROOT/$STAMP"

mkdir -p "$TARGET"
touch "$APP_ROOT/.deploying"
trap 'rm -f "$APP_ROOT/.deploying"' EXIT
pkill -TERM -x Grand.Web >/dev/null 2>&1 || true
for _ in {1..15}; do
  pgrep -x Grand.Web >/dev/null 2>&1 || break
  sleep 1
done
cp -a "$APP_ROOT/App_Data/beh-marketplace.db" "$TARGET/"
cp -a "$APP_ROOT/App_Data/Settings.cfg" "$TARGET/"
cp -a "$APP_ROOT/App_Data/appsettings.Production.json" "$TARGET/"
cp -a "$APP_ROOT/App_Data/DataProtectionKeys" "$TARGET/"

tar -czf "$BACKUP_ROOT/beh-store-$STAMP.tar.gz" -C "$TARGET" .
rm -rf "$TARGET"
find "$BACKUP_ROOT" -type f -name 'beh-store-*.tar.gz' -mtime +21 -delete
"$APP_ROOT/deploy-store.sh"
