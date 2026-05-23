# General Development Practices

## Pre-Flight

Before treating a change as complete:

- Run `pnpm typecheck`.
- Run `pnpm lint`.
- Run `pnpm test` for pure logic, schemas, stores, and OpenAPI changes.
- Run focused Playwright specs for user-visible behavior.
- Run `pnpm build` for runtime, Docker, env, or Next.js changes.

## TypeScript And Imports

- Use TypeScript for first-party application code.
- Keep imports resolvable in the same branch. Do not add an import without adding the target file.
- Prefer shared helpers under `lib/` only when they remove real duplication or clarify a boundary.

## UI

- Compose shadcn/ui-style primitives instead of ad-hoc repeated styling.
- Keep recurring design tokens in CSS variables or Tailwind utilities.
- Use Sonner for short-lived user feedback. Use form errors for field validation and dialogs for destructive confirmations.

## API

- Route Handlers under `app/api/**` should validate inputs with Zod where practical.
- Register every public API route in `lib/openapi/`.
- Keep `/api/openapi.json` and `/docs` working after API changes.

## Database

- Use Prisma for normal application queries.
- Schema changes must include a migration.
- Do not edit applied migrations.
- Think through uniqueness and soft-delete semantics before adding unique constraints.

## Documentation

When changing how people develop, test, run, deploy, or configure the app, update:

- `README.md`
- `AGENTS.md` when the index changes
- the relevant file under `docs/agents/`
- env examples when variables change

## File Size Budget

First-party `*.ts` and `*.tsx` files should stay easy to review.

- Soft target: 400 non-blank, non-comment lines (enforced as a `warn` by ESLint).
- Functions: aim for ≤ 80 lines.
- Split large modules by ownership boundary, not by mechanical chunking. See [`modularity.md`](modularity.md) for the feature-sliced module layout that this budget supports.
