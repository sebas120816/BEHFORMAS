#!/bin/bash

echo "Content-Type: text/plain"
echo

pkill -9 -x Grand.Web >/dev/null 2>&1 || true
sleep 2

COMMAND="/home/behforma/ensure-beh-store.sh >/dev/null 2>&1"
LOG="/home/behforma/beh-store-watchdog-install.log"
CRON_LINE="*/5 * * * * $COMMAND"

echo "Checking GrandNode watchdog..." >"$LOG"
crontab -l >>"$LOG" 2>&1 || true

if grep -Fq "/home/behforma/ensure-beh-store.sh" "$LOG"; then
  echo "GrandNode watchdog already installed."
  echo "GrandNode watchdog already installed." >>"$LOG"
  exit 0
fi

(crontab -l 2>/dev/null || true; echo "$CRON_LINE") | crontab - >>"$LOG" 2>&1
crontab -l >>"$LOG" 2>&1 || true

cat "$LOG"
