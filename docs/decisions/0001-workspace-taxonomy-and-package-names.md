# ADR-001: Workspace Taxonomy and Package Name Decisions

**Status:** Accepted
**Date:** 2026-07-24
**Author:** HOCA Manager (RD-001)
**Roadmap Reference:** [Engineering Department Roadmap](../engineering-department-roadmap.md) — P0: Workspace Taxonomy Refactor

## Context

The monorepo currently uses a flat `apps/*` layout where every application sits directly under `apps/`. As the project expands — more APIs, more frontend frameworks, mobile platforms, and infrastructure modules — a flat namespace becomes harder to navigate, breaks clear ownership boundaries, and makes it harder for AI agents to understand the repository structure.

The engineering department roadmap [lists a workspace taxonomy refactor as P0](../engineering-department-roadmap.md#p0-workspace-taxonomy-refactor) that should happen before the gateway rollout, broader blockchain expansion, and future app/framework additions.

## Decision 1: Target Workspace Taxonomy

We adopt the following directory hierarchy, grouping applications into families by domain rather than keeping all apps flat:

```
apps/
  api-gateway/               # boundary/orchestration layer — stays top-level
  apis/
    nestjs-api/              # moved from apps/api
    bun-elysia-api/          # moved from apps/api-bun
  web-frontends/
    nextjs-web/              # moved from apps/web
  mobile-frontends/
    react-native-mobile/     # moved from apps/mobile
  ingestion/                 # stays top-level for now
  smart-contracts/           # stays top-level for now
```

### Rationale

1. **Family grouping** — APIs (`apps/apis/*`), web frontends (`apps/web-frontends/*`), and mobile frontends (`apps/mobile-frontends/*`) each share conventions, runtime contracts, and deployment patterns. Grouping them makes it clear where new applications of each type belong.

2. **Future expansion** — The taxonomy accommodates future additions without rethinking the structure:
   - `apps/web-frontends/angular-web/`
   - `apps/mobile-frontends/flutter-mobile/`
   - `apps/apis/<runtime-or-domain>-api/`

3. **Boundary clarity** — `apps/api-gateway/` remains at the top level because it is the client-facing boundary and orchestration layer, not a backend API in the `apps/apis/` family. This mirrors the roadmap's explicit directive that the gateway is intentionally not under `apps/apis/*`.

4. **Deferred sub-families** — `apps/ingestion/` and `apps/smart-contracts/` stay at the top level for now. Future consideration may move them to `apps/workers/ingestion` and `apps/blockchain/smart-contracts` once those families have more than one member.

### Non-Decisions (Explicitly Deferred)

The following sub-family groupings are **not yet decided** and will be evaluated later when the relevant domains have multiple applications:

- `apps/workers/ingestion` — defer until a second worker exists
- `apps/blockchain/smart-contracts` — defer until a blockchain operator or indexer exists
- `apps/admin-frontends/*` — defer until admin UIs exist
- `apps/devtools/*` — defer until dev tool interfaces exist

## Decision 2: Stable Package Names (Keep Current)

**Package names remain at their current `@todo/*` values.** Renaming packages and package directories is deferred to a later compatibility PR.

| Current Package Name | Current Path | New Path (after move) | Decision |
|---|---|---|---|
| `@todo/api` | `apps/api` | `apps/apis/nestjs-api` | Keep name |
| `@todo/api-bun` | `apps/api-bun` | `apps/apis/bun-elysia-api` | Keep name |
| `@todo/api-gateway` | `apps/api-gateway` | `apps/api-gateway` (unchanged) | Keep name |
| `@todo/web` | `apps/web` | `apps/web-frontends/nextjs-web` | Keep name |
| `@todo/mobile` | `apps/mobile` | `apps/mobile-frontends/react-native-mobile` | Keep name |
| `@todo/ingestion` | `apps/ingestion` | `apps/ingestion` (unchanged) | Keep name |
| `@todo/smart-contracts` | `apps/smart-contracts` | `apps/smart-contracts` (unchanged) | Keep name |

### Future Rename Candidates (Deferred)

When a rename PR is done, the following mapping should be considered:

| Proposed Name | Current Name | Rationale |
|---|---|---|
| `@todo/nestjs-api` | `@todo/api` | Describes runtime |
| `@todo/bun-elysia-api` | `@todo/api-bun` | Describes runtime |
| `@todo/nextjs-web` | `@todo/web` | Describes framework |
| `@todo/react-native-mobile` | `@todo/mobile` | Describes framework |

### Rationale

1. **Minimum disruption** — Keeping package names stable means downstream imports (`@todo/services`, `@todo/web`, `@todo/mobile`, etc.) do not change across the file-move phase. Only file paths and workspace globs change.

2. **Incremental rollout** — Package renames introduce build config changes, import updates, and potential CI breakage across all consumers. Splitting the move from the rename keeps each PR focused and auditable.

3. **Consumer contracts** — The stable package names (`@todo/api`, `@todo/web`, `@todo/mobile`) are used by:
   - `pnpm-workspace.yaml` (workspace discovery)
   - `turbo.json` (task pipeline filters)
   - `package.json` cross-references across packages
   - Docker build contexts
   - CI path filters
   - Root-level npm scripts (`dev:api`, `dev:web`, etc.)
   - `packages/services` client code
   - Mobile Expo app config

## Migration Constraints

1. **Move with `git mv`** — All file moves must use `git mv` to preserve history. Do not delete and re-add.

2. **Workspace discovery first** — Update `pnpm-workspace.yaml` to include `apps/apis/*`, `apps/web-frontends/*`, and `apps/mobile-frontends/*` **before** moving any files, so the pnpm workspace can still resolve packages during the transition.

3. **Keep `apps/*` in workspace** — The existing `apps/*` glob must remain in `pnpm-workspace.yaml` until all apps are moved, because `api-gateway`, `ingestion`, and `smart-contracts` remain at the top level.

   **Final workspace globs after migration:**
   ```yaml
   packages:
     - 'apps/*'                       # covers api-gateway, ingestion, smart-contracts
     - 'apps/apis/*'                  # covers nestjs-api, bun-elysia-api
     - 'apps/web-frontends/*'         # covers nextjs-web
     - 'apps/mobile-frontends/*'      # covers react-native-mobile
     - 'apps/smart-contracts/*'       # solana, polygon, moonbeam, base, polkadot
     - 'packages/*'
   ```

4. **Path-relative import audit** — After moving each app, audit `tsconfig.json` paths, Dockerfile COPY commands, and CI working-directory references that hard-code the old path.

5. **Validation checklist** — After all moves, verify:
   - `pnpm install` succeeds without missing workspace errors
   - `pnpm dev:api` starts the NestJS API from its new path
   - `pnpm dev:web` starts the Next.js app from its new path
   - `pnpm build` completes without path errors
   - `pnpm quality` (lint + typecheck) passes
   - GitHub Actions path filters still trigger on the new paths

## Successor Handoff

This ADR is the prerequisite for RD-002 (Move APIs into the approved taxonomy).

### For RD-002 (API Move Worker)

- **Reference:** This ADR for the exact target paths
- **Scope:** Move `apps/api` → `apps/apis/nestjs-api` and `apps/api-bun` → `apps/apis/bun-elysia-api`
- **Warnings:**
  - Update `pnpm-workspace.yaml` before moving files (add `apps/apis/*`)
  - Update `turbo.json` task inputs if any reference old paths
  - Update root `package.json` scripts that reference `apps/api` or `apps/api-bun`
  - Update `docker-compose.dev.yml` and Dockerfiles that reference old paths
  - Update CI workflow path filters
  - Validate that `@todo/api` and `@todo/api-bun` resolve after the move
  - Verify existing tests still run
- **Constraints:** Use `git mv` only; keep package names unchanged

### For RD-00X (Web/Mobile Frontend Move Worker)

- **Reference:** This ADR for the exact target paths
- **Scope:** Move `apps/web` → `apps/web-frontends/nextjs-web` and `apps/mobile` → `apps/mobile-frontends/react-native-mobile`
- **Similar constraints:** `pnpm-workspace.yaml` update first, `git mv`, no package renames

## Consequences

1. **Positive:** Clear ownership boundaries — "where does a new API go?" → `apps/apis/`
2. **Positive:** Easier AI agent navigation — directory structure is self-documenting
3. **Positive:** The taxonomy accommodates growth without repeated restructuring
4. **Neutral:** Two-phase migration (move files now, rename packages later) increases total PR count but reduces per-PR risk
5. **Negative:** All configuration files that reference old paths must be updated — the RD-002 and RD-00X workers must be thorough or CI will break
6. **Negative:** During the migration window, both old and new paths must be supported in workspace globs
