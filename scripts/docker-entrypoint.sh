#!/usr/bin/env sh
set -eu

if [ "${APP_AUTO_MIGRATE:-1}" = "1" ]; then
  pnpm prisma migrate deploy
fi

exec "$@"
