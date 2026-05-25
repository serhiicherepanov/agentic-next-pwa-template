# Modularity

This chapter is the structural backbone of the template. It exists so that even when an individual file is written poorly — and at scale some will be — the damage stays **local** to its module and cannot leak into the rest of the codebase.

Folders alone never guarantee this. The guarantees come from three combined mechanisms: **public module APIs (barrels)**, **machine-enforced import boundaries**, and **size limits**.

## Why Layer-First Layouts Decay

A common Next.js layout splits code by technical layer:

```
app/            routes (UI + API)
components/    UI
lib/            business logic + helpers + data
```

At small size this is fine. As features multiply, every feature spreads across all four trees. Touching one feature means touching four directories, related code drifts apart, "shared" folders accumulate unrelated helpers, and there is no enforced contract between modules. The codebase slowly becomes a graph instead of a tree.

This template chooses a **feature-sliced** layout from day one, even when there is only one module.

## Target Layout

```
app/                                  thin route wrappers only
  api/<feature>/route.ts              → import { handlers } from "@/modules/<feature>"
  <feature>/page.tsx                  → import { Page } from "@/modules/<feature>"

modules/
  <feature>/
    index.ts                          public API; the ONLY entry point from outside
    services/                         ALL business logic (DB, rules, aggregations)
    schemas/                          Zod schemas shared by api + forms
    api/                              route handler bodies + OpenAPI paths
    ui/                               React components for this feature
    __tests__/

shared/                               cross-cutting building blocks (strict scope)
  db/                                 Prisma client
  logger/
  http/                               api-error, client-request
  ui/                                 small UI primitives that are NOT shadcn
  utils/                              pure helpers, each with tests

components/ui/                        shadcn primitives only; no business logic
lib/                                  reserved for shared/* during migration; prefer shared/
```

`app/` becomes a thin transport layer. A route file should generally be 5–15 lines: validate the request, call the module, return the response.

## Business Logic: One Folder (`services/`)

Anything that is not visualization goes in **`modules/<feature>/services/`** — queries, calculations, aggregations, domain rules. Not in `ui/`, not in `app/`, not split across several top-level folders.

The main reason is **DRY across surfaces**: admin UI, client UI, and REST routes must call the **same** service functions. If each screen owns its own Prisma query, filters and totals drift apart.

Rules:

- **One place per feature:** `services/`. More files inside that folder are fine; logic does not belong in `ui/` or parallel folders.
- **No Prisma or raw SQL** outside `services/` (except migrations).
- **React components** only format for display (dates, currency, empty states).
- **Route handlers** validate → call one service → return response.
- **Admin and client** import from the same `services/` (parameters or thin wrappers if scope differs — not a second copy in another component).
- Feature-specific logic stays in that module's `services/`. Do not park it in `shared/`.

## Module Contract

Every module under `modules/<feature>/` exposes a single public API through its `index.ts`. Everything else is private to the module.

```ts
export { CatalogPage } from "./ui/catalog-page";
export { catalogAdminHandlers } from "./api/admin-handlers";
export { listCatalogItems, getCatalogItem } from "./services/catalog";
export type { CatalogItem } from "./services/catalog.types";
```

Consumers import only the barrel:

```ts
import { CatalogPage } from "@/modules/catalog";
```

Deep imports from outside the module (`@/modules/catalog/services/...`) are forbidden — use the barrel.

## Hard Rules

1. **Import only through the module barrel** from outside the module. Deep cross-module paths are an ESLint error.
2. **`app/` is a thin layer.** No business logic in `page.tsx` or `route.ts`. They wire request → module service → response.
3. **Business logic stays in `services/` only.** UI and API handlers do not query the database, aggregate, or encode domain rules.
4. **`shared/` must not depend on `modules/`.** Ever. Dependencies only flow `modules/` → `shared/`.
5. **`modules/X` must not depend on `modules/Y` directly** — only through `modules/Y`'s barrel. Cycles are forbidden.
6. **File size budget**: `max-lines: 400` (already enforced as `warn`; promote to `error` once the project stabilizes). Functions: aim for ≤ 80 lines. Large files must be split by ownership boundary, not by mechanical chunking.
7. **Server/client separation by naming**: prefer `*.server.ts`, `*.client.ts`, `*.shared.ts` suffixes (or Next.js `"use server"` / `"use client"` directives) so server-only code cannot leak into the client bundle.
8. **Tests live next to the code** they cover, under `__tests__/` inside the module.

## When To Create A New Module

Create `modules/<feature>/` when a piece of functionality has at least one of:

- its own persistence (Prisma models or repositories it owns),
- its own REST surface (`app/api/<feature>/**`),
- its own user-facing screen or panel,
- distinct business invariants that should not leak into other features.

Do not create a module just to group two helpers. Single-file helpers stay in `shared/utils/` until a real boundary appears.

## When To Put Code In `shared/`

`shared/` is for **cross-cutting infrastructure** that is genuinely feature-agnostic:

- the Prisma client (`shared/db/`),
- the logger,
- HTTP error and fetch helpers,
- generic UI primitives that are not shadcn components,
- pure utilities with their own tests.

If a "shared" helper is only used by one module, move it into that module. If it is used by two modules and encodes a domain concept, it usually belongs in a third module that both depend on through its barrel — not in `shared/`.

## Enforcement

The structure is enforced by tooling, not by review discipline:

- **`max-lines`** in `eslint.config.mjs` (already configured) prevents god-files from growing unnoticed.
- **`no-restricted-imports`** or **`eslint-plugin-boundaries`** should be added when the first second module appears. It encodes the rules above as ESLint errors:
  - `app/**` may import from `@/modules/*` (barrels only) and `@/shared/*`.
  - `modules/<x>/**` may import from `@/modules/<y>` (barrel only, `x !== y`), `@/shared/*`, and its own subtree.
  - `shared/**` may import from `@/shared/*` only. Never from `@/modules/*` or `@/app/*`.
  - Deep imports across module boundaries are forbidden.

When this is wired up, a poorly written file stays a local problem of its module. It physically cannot spread, because nothing outside the module can reach past the barrel.

## Migration Path For An Existing Layer-First Project

If you fork this template into a project that already grew the layer-first way, migrate incrementally:

1. Add ESLint boundary rules and `max-lines` as `warn`. This freezes further decay without breaking the build.
2. Split the largest files first (one PR each). The top offenders are usually the highest ROI.
3. Pick one feature as a pilot and move it into `modules/<feature>/` end-to-end (services + schemas + api + ui + tests). This becomes the template for the rest.
4. Migrate the remaining features one module per PR.
5. Move `lib/shared/` content into `shared/` with topical subfolders. Break up `utils.ts`.
6. Reduce `app/api/**` route files to thin wrappers.
7. Promote `max-lines` and boundary rules from `warn` to `error`.

## Definition Of Done For A Module Change

- All cross-module imports go through barrels.
- No file exceeds the `max-lines` budget without an explicit, justified ESLint disable.
- Tests for the change live inside the module under `__tests__/`.
- If the module exposes a REST surface, OpenAPI registration in the module's `api/` is updated.
