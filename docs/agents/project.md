# Project Rules For Agents

This template is a small production starter for Next.js applications that are maintained by humans and AI agents.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js App Router, React, TypeScript strict |
| UI | Tailwind CSS, shadcn/ui conventions, Radix primitives |
| Data | PostgreSQL 16, Prisma 6 (Neon serverless driver optional for Vercel) |
| Server state | TanStack Query |
| Client state | zustand for local UI state only |
| Forms | react-hook-form + Zod |
| API docs | Zod schemas + `@asteasolutions/zod-to-openapi` |
| PWA | Optional Next.js manifest + `@ducanh2912/next-pwa` service worker |
| Tests | Vitest and Playwright |
| Runtime | Docker Compose for dependencies and production |

## Priority Extension Points

These are preferred directions when a product requirement appears. Do not add them until the project needs them.

### Realtime And Messaging

Use Centrifugo as the first-choice realtime and lightweight messaging layer when the app needs live updates, fan-out notifications, presence, or user-scoped event streams.

- Keep REST and the database as the source of truth. Realtime events should usually carry `{ kind, ids }` signals, not full authoritative records.
- Publish from server-side domain services after successful writes, not directly from client components.
- Derive channel access on the server from the authenticated session or role. Do not trust channel names from request bodies.
- Keep the transport behind a small module such as `lib/realtime/publisher.ts` so the app can run without realtime in early phases and tests can mock publishing.
- If Centrifugo is added, update Docker Compose, env examples, README, OpenAPI/auth docs where relevant, and Playwright coverage for at least one live-update flow.

### Serverless Postgres (Vercel / Neon)

The project can be deployed to Vercel using Neon Serverless Postgres without forking the codebase. Prisma is wired through `@prisma/adapter-neon`, which is activated only when `DATABASE_DRIVER=neon` is set.

- Default behavior is unchanged: local dev, Docker Compose, and Dokploy run with `DATABASE_DRIVER=pg` (or unset) and the bundled Prisma Postgres engine.
- On Vercel set `DATABASE_DRIVER=neon` and `DATABASE_URL` to the Neon pooled connection string (`-pooler` host, `sslmode=require`).
- Migrations must be run against the non-pooled Neon URL (`pnpm exec prisma migrate deploy`). Do not run `prisma migrate` against the pooler endpoint.
- Keep the adapter switching inside `lib/db.ts` and the new env var documented in all `.env.*.example` files. Do not import Neon packages directly from feature modules.

### PWA App Mode

PWA is optional. Do not enable it for ordinary websites, landing pages, content sites, or simple marketing pages unless the product explicitly needs installable app behavior.

If the project is meant to behave like an installed application, keep PWA support as a first-class runtime concern rather than an afterthought.

- Set `PWA_ENABLED=1` only for app-like products: dashboards, admin panels, mobile tools, or stores that intentionally support installable/PWA behavior.
- Keep `app/manifest.ts` accurate: name, short name, start URL, display mode, theme color, and icons.
- Keep service worker behavior in `worker/index.js` small and explicit. Add offline caching, push handling, or notification-click routing only when the product needs it.
- Replace template placeholder icons with production PNG icon sets before launch. Keep the SVG placeholder only for early scaffolding.
- Add or update Playwright coverage for installability-critical surfaces, at minimum `/manifest.webmanifest`; add service worker/push checks when those features become product requirements.
- If app-like PWA behavior is intentionally removed, keep `PWA_ENABLED` unset and consider removing PWA-specific package/config to reduce build surface.

## Runtime Model

- Local development runs the Next.js app on the host with `pnpm dev`.
- The default `docker-compose.yml` starts external dependencies only, currently PostgreSQL.
- Production uses `docker-compose.prod.yml`, which adds the app image, a published port, and a durable Postgres volume on top of the shared base in `docker-compose.shared.yml`.
- Dokploy uses `docker-compose.dokploy.yml`, which extends the same shared base, bind-mounts Postgres under `APP_HOST_DATA_ROOT`, and attaches the app to Dokploy's external Traefik network without publishing ports.
- Env files are convenience inputs. Commands should also work when variables are injected by CI or the deployment platform.

## Architecture Boundaries

- Code is organized **by feature**, not by technical layer. See [`modularity.md`](modularity.md) for the full layout, module contract, and import rules.
- Each feature lives under `modules/<feature>/` with its own `domain/`, `data/`, `schemas/`, `api/`, `ui/`, and `__tests__/`. The module's `index.ts` is its only public API.
- `app/` is a thin transport layer. Route Handlers and pages wire request → module → response and contain no business logic.
- `shared/` holds cross-cutting infrastructure only (db client, logger, http helpers, pure utils). It must not depend on `modules/`.
- Prisma is the default database access layer. Avoid raw SQL outside migrations or well-justified performance paths.
- React Query owns fetched server state. Zustand owns small UI coordination state.
- Shared Zod schemas live inside the module that owns them (`modules/<feature>/schemas/`). Generic schemas used by multiple modules live in `shared/`.
- OpenAPI registration lives in each module's `api/` folder. API routes are incomplete without the matching OpenAPI update.

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
- Dokploy uses host bind mounts instead of named production volumes. Prepare `${APP_HOST_DATA_ROOT}/postgres` with `pnpm docker:dokploy:dirs` when managing the host manually.
- The app entrypoint runs Prisma deploy migrations by default when `APP_AUTO_MIGRATE=1`.

## Definition Of Done

- Code is typechecked, linted, and covered by focused tests.
- API changes update Zod schemas and OpenAPI.
- Setup/runtime changes update `README.md` and agent docs.
- No secrets, local-only paths, or generated artifacts are committed accidentally.
