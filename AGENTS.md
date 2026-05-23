# Agent Guidance

This file is the entry point for AI agents and automation working in this repo. Read it before editing code, then follow the detailed chapters in `docs/agents/`.

## Required Reading

| Document | Purpose |
|---|---|
| [`docs/agents/project.md`](docs/agents/project.md) | Stack, runtime model, architecture boundaries, env and Docker conventions. |
| [`docs/agents/modularity.md`](docs/agents/modularity.md) | Feature-sliced module layout, public module APIs, import boundaries, file-size budget. |
| [`docs/agents/general-development.md`](docs/agents/general-development.md) | TypeScript, UI, API, database, documentation, and file-size conventions. |
| [`docs/agents/testing.md`](docs/agents/testing.md) | Vitest and Playwright policy plus local commands. |
| [`docs/agents/version-control.md`](docs/agents/version-control.md) | Branching, commits, PRs, and non-interactive Git rules. |

## Non-Negotiables

- Start new PR-bound work from a fresh branch. See `.cursor/rules/git-branch-before-task.mdc`.
- Follow the feature-sliced module layout in `docs/agents/modularity.md`. Cross-module imports go through the module's `index.ts` barrel; deep imports are forbidden.
- Keep runtime and workflow docs in sync. If commands, env vars, Docker, CI, or setup steps change, update `README.md` and `docs/agents/*` in the same PR.
- Keep REST API contracts in sync. Every route under `app/api/**` must have shared Zod schemas where practical and OpenAPI registration in `lib/openapi/`.
- Do not commit secrets. Env examples are documentation, not real credentials.
- Before calling work done, run the focused tests for the change and the standard quality gates listed in `docs/agents/testing.md`.

## Project Defaults

- App: Next.js App Router with TypeScript.
- Database: PostgreSQL through Prisma.
- Local dev: app runs on the host, Postgres runs in Docker.
- Production: app and database run through Docker Compose.
- Dokploy: use `docker-compose.dokploy.yml` so platform Traefik handles routing.
- API docs: `/docs` and `/api/openapi.json`.
- Preferred realtime extension: Centrifugo, added only when live messaging is needed and kept behind a server-side publishing module.
- PWA support is optional. Enable `PWA_ENABLED=1` only for app-like products; ordinary sites and landing pages do not need service worker/installability by default.
