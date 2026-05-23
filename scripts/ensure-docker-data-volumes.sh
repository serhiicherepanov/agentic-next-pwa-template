#!/usr/bin/env bash
set -euo pipefail

scope="${1:-all}"

ensure_volume() {
  local volume="$1"
  if ! docker volume inspect "$volume" >/dev/null 2>&1; then
    docker volume create "$volume" >/dev/null
    echo "created volume: $volume"
  else
    echo "volume exists: $volume"
  fi
}

case "$scope" in
  local)
    ensure_volume agentic-template-local_pgdata
    ;;
  prod)
    ensure_volume agentic-template-prod_pgdata
    ;;
  all)
    ensure_volume agentic-template-local_pgdata
    ensure_volume agentic-template-prod_pgdata
    ;;
  *)
    echo "Usage: $0 [local|prod|all]" >&2
    exit 2
    ;;
esac
