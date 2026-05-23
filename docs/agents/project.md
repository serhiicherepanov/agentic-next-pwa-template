# Project Rules For Agents

This template is a small production starter for Next.js applications that are maintained by humans and AI agents.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js App Router, React, TypeScript strict |
| UI | Tailwind CSS, shadcn/ui conventions, Radix primitives |
| Data | PostgreSQL 16, Prisma 6 |
| Server state | TanStack Query |
| Client state | zustand for local UI state only |
| Forms | react-hook-form + Zod |
| API docs | Zod schemas + `@asteasolutions/zod-to-openapi` |
| Tests | Vitest and Playwright |
| Runtime | Docker Compose for dependencies and production |

## Runtime Model

- Local development runs the Next.js app on the host with `pnpm dev`.
- `docker-compose.dev.yml` starts external dependencies only, currently PostgreSQL.
- Production uses `docker-compose.prod.yml`, which includes the app image and durable Postgres volume.
- Env files are convenience inputs. Commands should also work when variables are injected by CI or the deployment platform.

## Architecture Boundaries

- Route Handlers and server-side modules own persistence and business rules.
- Prisma is the default database access layer. Avoid raw SQL outside migrations or well-justified performance paths.
- React Query owns fetched server state. Zustand owns small UI coordination state.
- Shared Zod schemas live under `lib/schemas/`.
- OpenAPI registration lives under `lib/openapi/`. API routes are incomplete without the matching OpenAPI update.

## Environment

Document new required variables in all relevant env examples:

- `.env.dev.example`
- `.env.e2e.example`
- `.env.prod.example`

Never commit real secrets. Prefer explicit validation in `lib/env.ts` for server-only variables.

## Docker

Keep local and production Compose files aligned when they share a service concern such as image version, healthchecks, or env names.

- Local volumes use the `agentic-template-local_*` prefix.
- Production volumes use the `agentic-template-prod_*` prefix.
- The app entrypoint runs Prisma deploy migrations by default when `APP_AUTO_MIGRATE=1`.

## Definition Of Done

- Code is typechecked, linted, and covered by focused tests.
- API changes update Zod schemas and OpenAPI.
- Setup/runtime changes update `README.md` and agent docs.
- No secrets, local-only paths, or generated artifacts are committed accidentally.
