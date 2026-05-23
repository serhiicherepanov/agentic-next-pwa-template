#!/usr/bin/env bash
set -euo pipefail

ROOT="${APP_HOST_DATA_ROOT:-/opt/agentic-next-pwa-template}"

mkdir -p "$ROOT/postgres"

echo "ok: $ROOT/postgres"
echo "Postgres image uses uid:gid 70:70. If the container cannot write on first deploy, run:"
echo "  sudo chown -R 70:70 \"$ROOT/postgres\""
