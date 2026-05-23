# Agentic Next PWA Template

Production-minded starter for Next.js App Router projects where agents and humans share the same workflow.

## Stack

- Next.js 15, React 19, TypeScript, pnpm
- Prisma 6 + PostgreSQL 16
- Tailwind CSS 4 + shadcn/ui conventions
- Zod schemas + generated OpenAPI at `/api/openapi.json` and `/docs`
- TanStack Query, zustand, react-hook-form
- Vitest, Playwright, ESLint, Husky
- Docker Compose for local dependencies and production runtime

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

```bash
cp .env.prod.example .env.prod
pnpm prod:up
```

The production image runs Prisma deploy migrations on startup by default. Set `APP_AUTO_MIGRATE=0` if migrations are managed separately.

## Agent Workflow

Start with `AGENTS.md`. Keep `README.md`, env examples, and `docs/agents/*` in sync when changing how the project is developed, tested, or deployed.
