#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${DASHBOARD_BASE_URL:-http://localhost:3000}"
OUT_DIR="${DASHBOARD_SCREENSHOT_DIR:-../docs/snapshots}"
ROUTES="${DASHBOARD_ROUTES:-/clients/foodready /admin}"
CHROME_USER_DATA_DIR="${DASHBOARD_CHROME_USER_DATA_DIR:-/tmp/client-dashboard-chrome}"

if command -v google-chrome >/dev/null 2>&1; then
  CHROME_BIN="google-chrome"
elif command -v google-chrome-stable >/dev/null 2>&1; then
  CHROME_BIN="google-chrome-stable"
else
  echo "Missing google-chrome or google-chrome-stable; cannot capture screenshots." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

for route in $ROUTES; do
  slug="${route#/}"
  slug="${slug//\//-}"
  if [[ -z "$slug" ]]; then
    slug="home"
  fi

  "$CHROME_BIN" \
    --headless=new \
    --disable-gpu \
    --disable-crash-reporter \
    --disable-crashpad \
    --disable-dev-shm-usage \
    --disable-background-networking \
    --no-sandbox \
    --hide-scrollbars \
    --timeout=15000 \
    --virtual-time-budget=3000 \
    --user-data-dir="$CHROME_USER_DATA_DIR" \
    --window-size=1440,1100 \
    --screenshot="$OUT_DIR/${slug}-desktop.png" \
    "$BASE_URL$route"

  "$CHROME_BIN" \
    --headless=new \
    --disable-gpu \
    --disable-crash-reporter \
    --disable-crashpad \
    --disable-dev-shm-usage \
    --disable-background-networking \
    --no-sandbox \
    --hide-scrollbars \
    --timeout=15000 \
    --virtual-time-budget=3000 \
    --user-data-dir="$CHROME_USER_DATA_DIR" \
    --window-size=390,1100 \
    --screenshot="$OUT_DIR/${slug}-mobile.png" \
    "$BASE_URL$route"
done

echo "Screenshots written to $OUT_DIR"
