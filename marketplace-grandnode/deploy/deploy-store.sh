#!/bin/bash
set -euo pipefail

APP_ROOT="/home/behforma/tienda.behformas.com"
STAGING="$APP_ROOT/.staging"
LOCK="$APP_ROOT/.deploying"
LOG="$APP_ROOT/App_Data/production.log"

touch "$LOCK"
trap 'rm -f "$LOCK"' EXIT

pkill -TERM -x Grand.Web >/dev/null 2>&1 || true
for _ in {1..15}; do
  pgrep -x Grand.Web >/dev/null 2>&1 || break
  sleep 1
done
pkill -KILL -x Grand.Web >/dev/null 2>&1 || true

if [ -d "$STAGING" ]; then
  # Normalize known plugin paths in staging to avoid file-vs-directory conflicts.
  if [ -f "$STAGING/Plugins/Theme.BehOffice/Content" ]; then
    rm -f "$STAGING/Plugins/Theme.BehOffice/Content"
  fi
  mkdir -p "$STAGING/Plugins/Theme.BehOffice/Content/css/cart"

  cp -a "$STAGING/." "$APP_ROOT/"
  rm -rf "$STAGING"
fi

export HOME="/home/behforma"
export ASPNETCORE_ENVIRONMENT="Production"
export ASPNETCORE_URLS="http://127.0.0.1:5080"
export BEH_DISABLE_IMAGE_RESIZE="1"
export BEH_DEFAULT_TITLE="BEH Office | Mobiliario de oficina en Colombia"
export DOTNET_EnableDiagnostics="0"
export DOTNET_PROCESSOR_COUNT="1"
export DOTNET_GCConserveMemory="9"
export DOTNET_GCServer="0"
export DOTNET_TieredCompilation="0"
export DOTNET_ReadyToRun="1"
export DOTNET_SYSTEM_NET_SOCKETS_THREAD_COUNT="1"
export DOTNET_GCHeapHardLimitSOH="0x04000000"
export DOTNET_GCHeapHardLimitLOH="0x02000000"
export DOTNET_GCHeapHardLimitPOH="0x01000000"

ulimit -s 1024 >/dev/null 2>&1 || true
cd "$APP_ROOT"
nohup setsid -f "$APP_ROOT/Grand.Web" >>"$LOG" 2>&1 </dev/null &
