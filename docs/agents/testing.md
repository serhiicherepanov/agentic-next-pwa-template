# Testing

## Policy

- Vitest covers pure logic, schemas, stores, OpenAPI generation, and service modules.
- Playwright covers user-visible workflows and API smoke checks.
- CI runs typecheck, lint, unit tests, production build, and Playwright smoke.

## Local Commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm dev:deps:e2e
pnpm e2e
```

Focused Playwright examples:

```bash
pnpm e2e e2e/health.spec.ts
pnpm e2e --project=mobile-portrait
pnpm e2e --grep "home page"
PLAYWRIGHT_NO_WEBSERVER=1 pnpm e2e
```

## Debugging

Prefer focused failing specs first, then broaden to the full suite. Keep timeouts tight enough that hangs surface quickly.

Playwright artifacts go under `test-artifacts/` and should not be committed.
