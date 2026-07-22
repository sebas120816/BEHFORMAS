#!/bin/bash

APP_ROOT="/home/behforma/tienda.behformas.com"
APP="$APP_ROOT/Grand.Web"
LOG="$APP_ROOT/App_Data/production.log"

echo "Content-Type: text/plain"
echo

pkill -9 -x Grand.Web >/dev/null 2>&1 || true
sleep 1

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

ulimit -v unlimited >/dev/null 2>&1 || true
ulimit -s 1024 >/dev/null 2>&1 || true

cd "$APP_ROOT" || exit 1
nohup setsid -f "$APP" >>"$LOG" 2>&1 </dev/null &
sleep 8

PID="$(pgrep -x Grand.Web | head -n 1)"
if [ -n "$PID" ] && curl --silent --fail --max-time 2 -H "Host: tienda.behformas.com" http://127.0.0.1:5080/ >/dev/null 2>&1; then
  echo "GrandNode started with PID $PID."
else
  echo "GrandNode could not be started."
  tail -n 20 "$LOG"
  exit 1
fi
