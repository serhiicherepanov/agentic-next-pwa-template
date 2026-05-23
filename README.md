# Agentic Next PWA Template

Production-minded starter for Next.js App Router projects where agents and humans share the same workflow.

## Stack

- Next.js 15, React 19, TypeScript, pnpm
- Prisma 6 + PostgreSQL 16
- Tailwind CSS 4 + shadcn/ui conventions
- Zod schemas + generated OpenAPI at `/api/openapi.json` and `/docs`
- TanStack Query, zustand, react-hook-form
- Optional PWA manifest and service worker via `@ducanh2912/next-pwa`
- Vitest, Playwright, ESLint, Husky
- Docker Compose for local dependencies and production runtime

## Priority Extensions

Realtime and lightweight messaging should use Centrifugo first when the product needs live updates, fan-out notifications, presence, or user-scoped event streams. Keep REST and PostgreSQL as the source of truth, publish small server-side events after successful writes, and hide the transport behind a module such as `lib/realtime/publisher.ts`.

PWA is not required for ordinary websites, landing pages, or content sites. Enable it only when the product should behave like an application: dashboards, admin panels, mobile worker tools, or stores that intentionally support installable app behavior. Set `PWA_ENABLED=1`, keep `app/manifest.ts`, installable icons, service worker registration, and at least one Playwright check for `/manifest.webmanifest` in sync. Replace the placeholder SVG icon with generated PNG icon sizes before production launch.

## Local Setup

```bash
cp .env.dev.example .env.dev
cp .env.e2e.example .env.e2e
pnpm install
pnpm dev:deps
pnpm db:migrate:dev
pnpm dev
```

Open `http://localhost:3000`.

## Tests

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm dev:deps:e2e
pnpm e2e
pnpm verify:ci
```

Use `PLAYWRIGHT_NO_WEBSERVER=1 pnpm e2e` when a dev server is already running.

## Production

Self-hosted Docker Compose with a direct published app port:

```bash
cp .env.prod.example .env.prod
pnpm prod:up
```

The production image runs Prisma deploy migrations on startup by default. Set `APP_AUTO_MIGRATE=0` if migrations are managed separately.

## Dokploy

Dokploy should use `docker-compose.dokploy.yml`. It reuses the base app stack, stores Postgres under `APP_HOST_DATA_ROOT`, and connects the app to Dokploy's external Traefik network without publishing ports from the compose file.

Minimum Dokploy env:

```dotenv
APP_HOST_DATA_ROOT=/opt/agentic-next-pwa-template
DOKPLOY_NETWORK=dokploy-network
POSTGRES_USER=agentic
POSTGRES_PASSWORD=replace-with-a-long-random-password
POSTGRES_DB=agentic
DATABASE_URL=postgresql://agentic:replace-with-a-long-random-password@db:5432/agentic?schema=public
APP_AUTO_MIGRATE=1
LOG_LEVEL=info
```

Prepare the host directory once when managing the server manually:

```bash
APP_HOST_DATA_ROOT=/opt/agentic-next-pwa-template pnpm docker:dokploy:dirs
docker compose --env-file .env.prod -f docker-compose.dokploy.yml up -d --build
```

## Agent Workflow

Start with `AGENTS.md`. Keep `README.md`, env examples, and `docs/agents/*` in sync when changing how the project is developed, tested, or deployed.
