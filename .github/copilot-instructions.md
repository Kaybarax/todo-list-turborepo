## Copilot project guide: Todo List Turborepo

Use these repo‑specific notes to be productive fast. Keep edits aligned with the structures and scripts below; prefer top‑level pnpm scripts and shared configs over custom logic per app.

### Big picture architecture

- Monorepo managed by pnpm + Turborepo. Apps live in `apps/*`, shared code in `packages/*`.
- Frontends: `apps/web` (Next.js 15), `apps/mobile` (Expo RN). Backend: `apps/api` (NestJS). Workers: `apps/ingestion`.
- Blockchain: `apps/smart-contracts/*` (Hardhat/EVM, Solana/Anchor, Polkadot/Substrate). Shared chain clients in `packages/services`.
- Data flow: Web/Mobile → API (`apps/api`) → MongoDB; API also uses Redis; `apps/ingestion` consumes blockchain data and updates DB. Observability via OpenTelemetry → Collector → Jaeger.

### Run/dev workflow (top‑level commands)

- Node 22.18 (see `.nvmrc`), pnpm 9+. Install once: `pnpm install`.
- All services (docker infra + dev servers): `pnpm dev` (calls `scripts/startDev.sh`).
- Service focus: `pnpm dev:web` | `pnpm dev:api` | `pnpm dev:mobile` | `pnpm dev:ingestion` | `pnpm dev:contracts` (proxy to `scripts/dev-services.sh`).
- Infra (dev) runs from `docker-compose.dev.yml`: MongoDB 27017, Redis 6379, API 3001, Web 3000, Hardhat 8545, Jaeger 16686, MailHog 8025.
- Database helpers: `pnpm db:setup` | `pnpm db:migrate` | `pnpm db:seed` | `pnpm db:reset` (see `db/*`).
- Per‑package dev is also supported via filters: `pnpm --filter @todo/web dev`.

### Build, tests, quality

- Use cached, orchestrated tasks via Turborepo (`turbo.json`). Common tasks: `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`.
- Testing layers: unit/integration/E2E/contract. Useful scripts:
  - All tests: `pnpm test`. E2E (web): `pnpm --filter @todo/web test:e2e` (Playwright).
  - Contracts: `pnpm test:contracts` or network‑specific compile/test: `pnpm contracts:polygon|solana|polkadot|moonbeam|base`.
- Note: API package temporarily disables typecheck (`apps/api/package.json`), so rely on repo‑level `pnpm typecheck` and ESLint to catch issues.

### Blockchain & env conventions

- Quick env scaffold: `.env.example` (RPC URLs, private keys, contract addresses). For dev, Hardhat local RPC is `http://localhost:8545`.
- Tooling checks/fixes: `pnpm blockchain:deps:check|fix|diagnose` and `blockchain:tools:install:*` (see `scripts/*.sh`).
- Contract build orchestration lives in `scripts/build-contracts.sh` and Turborepo tasks `compile:*` (see `turbo.json`).

### Shared packages and design system

- Shared services: `packages/services` (Axios, ethers, @solana/web3.js, @polkadot/api). Prefer adding API/chain client logic here and import in apps.
- UI libraries: `packages/ui-web` (DaisyUI + Style Dictionary) and `packages/ui-mobile`. Build tokens before web build: `pnpm tokens:build` (auto via `apps/web` prebuild).
- Shared configs live in `packages/config-*` (ESLint/Jest/TS). Adopt them for new packages to stay consistent.

### Project patterns

- Namespace packages with `@todo/*`. Reference them via pnpm workspaces (see `pnpm-workspace.yaml`).
- Use pnpm filters for targeted runs, e.g. `pnpm --filter @todo/api lint`.
- When adding a new app/package: update `pnpm-workspace.yaml`, consider Turborepo tasks in `turbo.json`, and if it’s a runtime service also wire it in `docker-compose.dev.yml` and `scripts/dev-services.sh`.
- API docs at `http://localhost:3001/api` (Swagger). Health endpoints: API `/health`; Web `GET /api/health`.

### Examples to follow

- Dev start with infra: see `scripts/startDev.sh` for dependency management (Mongo/Redis health checks, Jaeger, Hardhat).
- API module structure: `apps/api/src/{auth,todo,user,blockchain,...}` with controllers/services/schemas; prefer this layout for new modules.
- Observability wiring: OTEL config/env in API (`JAEGER_ENDPOINT`, `OTEL_*`), collector config at `otel-collector-config.yaml`.

### Gotchas

- Prefer top‑level scripts over direct package commands to ensure infra and dependencies are ready.
- Some tasks assume Docker is running (startDev/dev‑services). If you run services outside scripts, ensure Mongo/Redis are up and `db:setup` has executed.
- Keep outputs consistent with Turborepo caching (e.g., Next.js `.next/**`, `dist/**`, contract `artifacts/**/target/**`).

If any of the above is unclear (e.g., contract deployment flows, Expo/mobile specifics, or adding new service wiring), ask to refine this doc and I’ll expand that section.
