# Engineering Department Turborepo Remaining Work

Last scanned: 2026-06-05

This document is the comprehensive remaining-work roadmap for turning this Todo List Turborepo into a reusable engineering-department bootstrap repository: a repo that a company or team can clone, configure, and use as the starting point for web, mobile, API, gateway, blockchain, infrastructure, observability, testing, deployment, and AI-agent workflows.

It also includes the later breakup plan: how to split this monorepo into smaller reusable department modules and how to turn those modules into Codex/cloud-code skills.

## Current State Summary

The repo already contains a broad foundation:

- Next.js web app in `apps/web`.
- Expo React Native app in `apps/mobile`.
- NestJS API in `apps/api`.
- Bun/Elysia API in `apps/api-bun`.
- Bun/Elysia API gateway in `apps/api-gateway`.
- Background ingestion worker in `apps/ingestion`.
- Multi-network smart contracts in `apps/smart-contracts` for Polygon, Solana, Polkadot, Moonbeam, and Base.
- Shared packages for web UI, mobile UI, services, utilities, TypeScript, ESLint, Jest, and release config.
- Docker Compose, Kubernetes reference manifests, Terraform modules, Terragrunt live environments, GitHub Actions, deployment docs, design-system docs, blockchain docs, and testing docs.
- API gateway planning and execution docs with several early phases already implemented.

The remaining work is mostly not about adding folders. It is about making the repo production-grade, internally consistent, decomposable, fully verified, and easy for AI agents to operate safely.

## Target End State

The repo should become an engineering-department template with these properties:

- A new team can bootstrap a production-ready full-stack engineering platform quickly.
- Each department capability is optional, documented, and independently removable.
- Each app and package has clear ownership, runtime contracts, environment contracts, tests, deployment paths, and runbooks.
- The default path is simple, but advanced paths are available: API gateway, REST for web, GraphQL for mobile, dual API runtime, blockchain integrations, background workers, observability, IaC, mobile releases, visual testing, and AI-agent automation.
- AI agents can understand the repo from local docs, run narrowly scoped commands, create services safely, and generate module-specific changes without guessing.
- Later extraction into separate repos/packages/skills is straightforward because boundaries are clean.

## Priority Legend

- P0: Required before calling this a reusable engineering-department bootstrap repo.
- P1: Required for production-grade teams and serious adoption.
- P2: Strongly recommended for scale, polish, and maintainability.
- P3: Optional expansions once the core platform is stable.

## P0: Repo Hygiene And Source Of Truth

- [ ] Remove generated/build artifacts from the working tree and keep them ignored:
  - [ ] `.DS_Store` files.
  - [ ] `.turbo` folders.
  - [ ] `.next`.
  - [ ] `dist` folders.
  - [ ] `coverage`.
  - [ ] `test-results`.
  - [ ] `playwright-report`.
- [ ] Decide whether generated `.d.ts` and `.map` files under `packages/services/src` belong in source. Prefer generating them into `dist` only.
- [ ] Add a repeatable repo-clean verification command that fails on committed generated artifacts.
- [ ] Normalize all docs to use `pnpm`, not `npm`, unless a package truly requires npm.
- [ ] Fix stale docs that still reference old smart-contract paths, direct API URLs, or outdated test locations.
- [ ] Add a single top-level "golden path" onboarding flow:
  - [ ] `pnpm install`.
  - [ ] `pnpm doctor`.
  - [ ] `pnpm dev`.
  - [ ] `pnpm verify`.
- [ ] Add `pnpm doctor` as a repo health command covering Node, pnpm, Bun, Docker, Terraform, Terragrunt, Expo/EAS, Rust, Solana, Anchor, and optional blockchain tools.
- [ ] Add `pnpm verify` as the default pre-PR quality command.
- [ ] Create a maintained status matrix showing each app/package with build, lint, typecheck, unit test, integration test, e2e, Docker, deployment, docs, and owner status.
- [ ] Update `AGENTS.md` with the current gateway-first architecture and the new engineering-department roadmap.

## P0: Product And Template Readiness

- [ ] Decide whether the template is primarily:
  - [ ] A Todo reference app.
  - [ ] A general engineering-department platform using Todo as the sample domain.
  - [ ] A generator/scaffold that can remove Todo-specific behavior.
- [ ] Add a "domain replacement guide" explaining how to replace Todo with another product domain.
- [ ] Move domain-specific constants, sample data, names, and labels behind configurable template variables where possible.
- [ ] Add a bootstrap questionnaire for new teams:
  - [ ] Web enabled?
  - [ ] Mobile enabled?
  - [ ] API gateway enabled?
  - [ ] NestJS API enabled?
  - [ ] Bun API enabled?
  - [ ] Blockchain enabled?
  - [ ] Which chains?
  - [ ] Ingestion worker enabled?
  - [ ] Vercel enabled?
  - [ ] AWS ECS enabled?
  - [ ] EAS enabled?
  - [ ] Terraform/Terragrunt enabled?
  - [ ] Kubernetes reference manifests enabled?
- [ ] Add a `template.config.json` or equivalent manifest describing enabled modules, ports, env vars, service names, package names, and deployment targets.
- [ ] Add scripts or docs for renaming the workspace from `@todo/*` to a company namespace.
- [ ] Add a checklist for safely deleting optional modules.
- [ ] Add a "minimal install" path for teams that want only web + API + DB.
- [ ] Add a "full platform install" path for all services.

## P0: API Gateway Completion

The gateway is already scaffolded and has substantial middleware, route table, auth, proxy, OpenAPI, and tests. Remaining work should finish it as the durable public backend boundary.

- [ ] Make the gateway contract intentionally hybrid:
  - [ ] Web uses REST through `/api/v1/*`.
  - [ ] Mobile uses GraphQL through `/graphql`.
  - [ ] Both clients share gateway auth policy, request IDs, telemetry, and upstream routing.
- [ ] Implement gateway `GET /api/v1/health`.
- [ ] Implement gateway `GET /api/v1/health/ready`.
- [ ] Aggregate readiness from NestJS API, Bun API, and Redis when enabled.
- [ ] Include per-upstream status and latency in readiness responses.
- [ ] Add health tests for all-up, partial-down, and all-down states.
- [ ] Run route parity tests for every auth/user/todo route through the gateway.
- [ ] Compare gateway responses against direct NestJS/Bun responses for status code, body shape, and auth behavior.
- [ ] Confirm `packages/services` clients work with the gateway base URL without consumer-facing API changes.
- [ ] Run web e2e todo flows through the gateway.
- [ ] Run mobile GraphQL smoke flows through the gateway.
- [ ] Add mobile GraphQL endpoint, schema, resolvers, and tests.
- [ ] Add mobile GraphQL client configuration.
- [ ] Migrate mobile todo/profile/dashboard reads to GraphQL.
- [ ] Migrate mobile todo mutations to GraphQL where appropriate.
- [ ] Keep web todo/auth flows on gateway REST.
- [ ] Add `api-gateway` to `docker-compose.dev.yml`.
- [ ] Add an `apps/api-gateway/Dockerfile`.
- [ ] Update `scripts/startDev.sh` so `pnpm dev` starts the gateway by default.
- [ ] Update `scripts/dev-backend.sh` for service-specific startup groups.
- [ ] Add OpenTelemetry initialization for the gateway.
- [ ] Emit gateway request spans and upstream proxy spans.
- [ ] Forward `traceparent`, `tracestate`, and `baggage`.
- [ ] Add request, upstream, auth failure, rate-limit, retry, and fallback metrics.
- [ ] Validate gateway traces in Jaeger.
- [ ] Add CI checks for gateway build, lint, typecheck, test, OpenAPI export, and route drift.
- [ ] Add canary controls:
  - [ ] Route-level default upstream.
  - [ ] Environment route overrides.
  - [ ] Development-only `x-api-backend` override.
  - [ ] Percentage canary.
  - [ ] Sticky user hashing.
  - [ ] Read fallback.
  - [ ] Shadow reads.
  - [ ] Metrics for canary and fallback behavior.
- [ ] Add infrastructure support:
  - [ ] Gateway ECR repo.
  - [ ] Gateway ECS service.
  - [ ] Gateway task definition.
  - [ ] Gateway ALB target group and listener rule.
  - [ ] Gateway Secrets Manager values.
  - [ ] Gateway CloudWatch logs.
  - [ ] Security groups from ALB to gateway and gateway to internal APIs.
  - [ ] Terragrunt dev, staging, and production wiring.
  - [ ] GitHub Actions workflow for gateway image build and deploy.
- [ ] Restrict direct public access to NestJS and Bun APIs after gateway rollout.
- [ ] Remove deprecated frontend backend-selection env vars after stable production rollout.

## P0: Environment And Secrets Contract

- [ ] Update `docs/development/environment-variables.md` for gateway-first naming:
  - [ ] `NEXT_PUBLIC_API_GATEWAY_URL`.
  - [ ] `NEXT_PUBLIC_WS_GATEWAY_URL`.
  - [ ] `EXPO_PUBLIC_API_GATEWAY_URL`.
  - [ ] `EXPO_PUBLIC_WS_GATEWAY_URL`.
  - [ ] Optional `EXPO_PUBLIC_GRAPHQL_GATEWAY_URL` override if `/graphql` cannot be derived from the gateway URL.
  - [ ] Gateway runtime variables.
- [ ] Mark which variables are build-time, runtime, public, private, secret, or generated.
- [ ] Make every `.env.example` complete and consistent.
- [ ] Add missing local env examples for gateway and frontend migration paths.
- [ ] Add environment validation tests per app.
- [ ] Add a generated env reference from schemas if possible.
- [ ] Add a secrets rotation runbook.
- [ ] Add a "never expose these to web/mobile" checklist.
- [ ] Ensure Terraform outputs, GitHub environment secrets, Vercel env vars, EAS env vars, and ECS Secrets Manager values match the same contract.

## P0: Build, Test, And CI Reliability

- [ ] Make `pnpm quality` consistently green.
- [ ] Make `pnpm test` consistently green or split it into clearly documented reliable tiers.
- [ ] Add a fast default check:
  - [ ] Format check.
  - [ ] Lint affected packages.
  - [ ] Typecheck affected packages.
  - [ ] Unit tests affected packages.
- [ ] Add a full release check:
  - [ ] All builds.
  - [ ] All tests.
  - [ ] Web e2e.
  - [ ] Mobile smoke.
  - [ ] API integration.
  - [ ] Gateway contract.
  - [ ] Smart-contract matrix.
  - [ ] IaC plan validation.
  - [ ] Security scans.
- [ ] Fix the testing strategy doc so examples are valid Markdown and commands use pnpm.
- [ ] Add coverage thresholds per package where practical.
- [ ] Add flake-tracking for Playwright, mobile e2e, blockchain integration, and external-service-dependent tests.
- [ ] Ensure GitHub Actions path filters map correctly to all workspaces, including `apps/api-gateway`.
- [ ] Add CI artifact retention rules for coverage, traces, Playwright reports, and deployment metadata.
- [ ] Add a release gate checklist that can be run manually before tagging or production deploy.

## P0: Web App Completion

- [ ] Make the web app gateway-first in all runtime paths.
- [ ] Keep the web app on REST through gateway `/api/v1/*` to demonstrate REST as the browser-facing client technology.
- [ ] Verify auth, todo CRUD, todo filtering, wallet connect, blockchain status, theme switching, and error states through Playwright.
- [ ] Add loading, empty, error, offline, and retry states for all primary workflows.
- [ ] Add production-ready authentication UX:
  - [ ] Register.
  - [ ] Login.
  - [ ] Refresh.
  - [ ] Logout.
  - [ ] Session expiry.
  - [ ] Protected routes.
- [ ] Add accessibility verification for pages, not only component stories.
- [ ] Add web performance budgets.
- [ ] Add web telemetry and frontend trace propagation to the gateway.
- [ ] Add PWA decision and implementation path if still intended.
- [ ] Add deployment smoke tests against Vercel preview and production.
- [ ] Add runtime configuration docs for Vercel.

## P0: Mobile App Completion

- [ ] Make the mobile app gateway-first in all runtime paths.
- [ ] Use GraphQL through gateway `/graphql` for mobile application data flows.
- [ ] Add a mobile GraphQL client, cache policy, auth header handling, and request ID propagation.
- [ ] Add GraphQL queries for profile, todo list, todo detail, todo stats, dashboard, and blockchain summary.
- [ ] Add GraphQL mutations for create, update, toggle, and delete todo flows where appropriate.
- [ ] Add persisted-query plan for production mobile clients.
- [ ] Run Expo smoke workflow for iOS simulator, Android emulator, and Expo Go where supported.
- [ ] Add EAS build profile validation for development, preview, and production.
- [ ] Add mobile auth screens and protected navigation if not complete.
- [ ] Add todo CRUD, filtering, offline, retry, and error flows.
- [ ] Add mobile wallet-connect UX and network support policy.
- [ ] Add mobile observability:
  - [ ] Error reporting.
  - [ ] Performance traces.
  - [ ] API request correlation IDs.
- [ ] Add mobile release runbook:
  - [ ] Build.
  - [ ] Submit.
  - [ ] Rollback.
  - [ ] OTA update policy.
  - [ ] Store credential policy.
- [ ] Add device networking docs for localhost, Android emulator, iOS simulator, and physical devices.
- [ ] Add mobile accessibility checks for screen-reader labels, focus order, contrast, touch target size, and reduced motion.

## P0: API Services Completion

- [ ] Decide long-term role of `apps/api` versus `apps/api-bun`:
  - [ ] NestJS as canonical API and Bun as experimental/edge.
  - [ ] Bun as future canonical API and NestJS as legacy.
  - [ ] Both as supported runtimes behind gateway.
- [ ] Document ownership and route source of truth for each API route.
- [ ] Add API parity tests where both APIs implement the same surface.
- [ ] Ensure MongoDB schemas and validation rules are aligned across APIs.
- [ ] Ensure auth semantics are aligned across APIs.
- [ ] Add refresh-token storage, rotation, revocation, and replay protection if production auth is intended.
- [ ] Add role-based access control or authorization policy hooks.
- [ ] Add request validation and response schemas for every endpoint.
- [ ] Add consistent error envelopes.
- [ ] Add API pagination, sorting, filtering, and limits as reusable patterns.
- [ ] Add API rate-limit policy docs.
- [ ] Add database transaction and consistency policy.
- [ ] Add API runbooks:
  - [ ] Local debugging.
  - [ ] Production incident.
  - [ ] Database migration.
  - [ ] Cache flush.
  - [ ] Auth secret rotation.
- [ ] Add OpenAPI generation and comparison for both APIs and the gateway.

## P0: Database, Migrations, And Data Lifecycle

- [ ] Make MongoDB migrations idempotent, ordered, and tested.
- [ ] Add migration rollback policy.
- [ ] Add migration dry-run mode.
- [ ] Add schema version tracking and migration audit logs.
- [ ] Add seed profiles:
  - [ ] Minimal.
  - [ ] Demo.
  - [ ] E2E.
  - [ ] Load-test.
- [ ] Add data retention policy.
- [ ] Add backup and restore runbook.
- [ ] Add local restore-from-snapshot docs.
- [ ] Add database indexes and explain why they exist.
- [ ] Add production index rollout procedure.
- [ ] Add PII/data classification guidance.

## P0: Infrastructure And Deployment

- [ ] Verify Terraform modules are complete for current target architecture.
- [ ] Verify Terragrunt dev/staging/prod live configs actually instantiate the required modules.
- [ ] Add gateway infrastructure to Terraform/Terragrunt.
- [ ] Add drift detection workflow.
- [ ] Add plan/apply approval policy by environment.
- [ ] Add production manual approval gates.
- [ ] Add remote state bootstrap documentation that matches current paths.
- [ ] Add least-privilege IAM review.
- [ ] Add AWS OIDC role validation.
- [ ] Add Vercel project/env wiring docs.
- [ ] Add EAS secrets and environment setup docs.
- [ ] Add deployment rollback runbooks for web, API, gateway, ingestion, mobile, and contracts.
- [ ] Clarify Kubernetes status:
  - [ ] Reference only.
  - [ ] Local optional.
  - [ ] Supported deployment target.
- [ ] If Kubernetes remains supported, update manifests for gateway and current env contracts.

## P0: Security Baseline

- [ ] Add a security architecture document.
- [ ] Add threat model for web, mobile, API, gateway, ingestion, blockchain, CI/CD, and IaC.
- [ ] Add secret scanning and dependency scanning gates.
- [ ] Add CodeQL or equivalent as required status checks.
- [ ] Add SAST/DAST policy.
- [ ] Add JWT hardening plan:
  - [ ] JWKS or asymmetric keys.
  - [ ] Key rotation.
  - [ ] Token revocation.
  - [ ] Refresh token reuse detection.
- [ ] Add CORS production allowlist policy.
- [ ] Add security headers policy for web and gateway.
- [ ] Add rate-limit and abuse-protection defaults.
- [ ] Add audit logging for auth and sensitive actions.
- [ ] Add dependency update and vulnerability response runbook.
- [ ] Add public/private network boundary documentation.
- [ ] Add mobile secret exposure review.
- [ ] Add smart-contract security review checklist.

## P1: Ingestion Service Completion

- [ ] Define ingestion ownership: blockchain events, API imports, data sync, or all of these.
- [ ] Replace placeholder polling paths with production event ingestion where supported.
- [ ] Add per-network ingestion adapters.
- [ ] Add checkpointing for each network.
- [ ] Add idempotency keys and duplicate handling.
- [ ] Add retry and dead-letter behavior.
- [ ] Add backfill mode.
- [ ] Add rate-limit handling for RPC providers.
- [ ] Add observability:
  - [ ] Job metrics.
  - [ ] Lag metrics.
  - [ ] Error metrics.
  - [ ] Per-network status.
- [ ] Add admin/manual commands:
  - [ ] Run once.
  - [ ] Backfill range.
  - [ ] Reprocess failed events.
  - [ ] Show checkpoints.
- [ ] Add ECS deployment verification.
- [ ] Add ingestion runbook and incident guide.

## P1: Blockchain Platform Completion

- [ ] Define canonical contract feature set across networks.
- [ ] Decide which networks are first-class versus examples.
- [ ] Normalize Todo contract APIs across Polygon, Moonbeam, Base, Solana, and Polkadot where feasible.
- [ ] Generate typed clients/artifacts for each network.
- [ ] Publish artifact locations and versioning rules.
- [ ] Add contract deployment registry format.
- [ ] Add network config validation.
- [ ] Add local devnet scripts for all supported networks where feasible.
- [ ] Add testnet deployment smoke tests.
- [ ] Add mainnet deployment approval workflows.
- [ ] Add contract verification for EVM networks.
- [ ] Add Solana program ID management and upgrade authority policy.
- [ ] Add Polkadot/Substrate pallet upgrade policy.
- [ ] Add wallet compatibility matrix.
- [ ] Add chain-specific failure-mode docs.
- [ ] Add smart-contract audit checklist.
- [ ] Add gas/cost reporting.
- [ ] Add bridge/cross-chain policy only if cross-chain behavior becomes a goal.

## P1: Shared Services Package Completion

- [ ] Make `@todo/services` the single public SDK for frontend API and blockchain calls.
- [ ] Remove generated artifacts from `src` if they are build outputs.
- [ ] Add explicit browser, Node, and React Native compatibility tests.
- [ ] Add gateway-base-url examples.
- [ ] Add API client retry, timeout, cancellation, and correlation ID policies.
- [ ] Add typed error classes and docs.
- [ ] Add auth token storage abstraction for web/mobile.
- [ ] Add blockchain provider abstraction docs.
- [ ] Add package API report or export-surface tests to prevent accidental breaking changes.
- [ ] Add semver/release policy.

## P1: Design System And UI Packages

- [ ] Decide whether `ui-web` and `ui-mobile` should remain separate or share token/core primitives.
- [ ] Finish token parity between web and mobile.
- [ ] Add design token governance:
  - [ ] Naming rules.
  - [ ] Deprecation rules.
  - [ ] Versioning.
  - [ ] Theme acceptance tests.
- [ ] Add accessibility acceptance criteria for every component.
- [ ] Add visual regression baselines that are stable in CI.
- [ ] Add bundle-size budgets.
- [ ] Add component API docs and usage recipes.
- [ ] Add design-system release workflow.
- [ ] Add migration guide for consumers when component APIs change.
- [ ] Add examples for business app screens, not only isolated components.

## P1: Observability And Operations

- [ ] Define standard telemetry fields across all services.
- [ ] Add request ID propagation across web, mobile, gateway, APIs, and ingestion.
- [ ] Add trace propagation from frontend to gateway to upstream services.
- [ ] Add dashboards:
  - [ ] Web health.
  - [ ] Mobile health.
  - [ ] Gateway health.
  - [ ] API health.
  - [ ] Ingestion health.
  - [ ] Blockchain RPC health.
  - [ ] Database and Redis health.
- [ ] Add alerts:
  - [ ] Error rate.
  - [ ] Latency.
  - [ ] Auth failures.
  - [ ] Ingestion lag.
  - [ ] Contract deployment failure.
  - [ ] Database connection exhaustion.
- [ ] Add runbooks for each alert.
- [ ] Add local observability quickstart with Jaeger, OTEL Collector, and logs.
- [ ] Decide whether Elasticsearch remains a supported path and document current status.

## P1: Developer Experience

- [ ] Add a developer portal README or docs index focused on workflows, not just files.
- [ ] Add command cheat sheets by role:
  - [ ] Frontend engineer.
  - [ ] Mobile engineer.
  - [ ] Backend engineer.
  - [ ] Platform engineer.
  - [ ] Blockchain engineer.
  - [ ] QA engineer.
  - [ ] AI agent.
- [ ] Add VS Code recommended extensions and tasks.
- [ ] Add devcontainer verification.
- [ ] Add local port map and conflict handling.
- [ ] Add troubleshooting flows for the most common startup failures.
- [ ] Add "known expensive commands" and alternatives.
- [ ] Add contribution guidelines for adding a new app, package, route, env var, contract, workflow, or Terraform module.

## P1: Release And Package Management

- [ ] Decide which packages are publishable and which are internal.
- [ ] Add changeset policy for publishable packages.
- [ ] Add package provenance/SBOM policy.
- [ ] Add package installation tests for every publishable package.
- [ ] Add API compatibility checks for `@todo/services`, UI packages, and config packages.
- [ ] Add release notes templates.
- [ ] Add versioning policy for the template itself versus packages inside the template.
- [ ] Add a "template upgrade" guide for downstream teams.

## P1: Documentation Completion

- [ ] Add architecture decision records for major choices:
  - [ ] Monorepo.
  - [ ] pnpm/Turborepo.
  - [ ] Gateway-first API.
  - [ ] NestJS and Bun coexistence.
  - [ ] MongoDB and Redis.
  - [ ] Terraform/Terragrunt.
  - [ ] Vercel/ECS/EAS deployment split.
  - [ ] Blockchain multi-network factory.
- [ ] Add diagrams:
  - [ ] Local dev.
  - [ ] Production deployment.
  - [ ] API gateway request path.
  - [ ] Auth flow.
  - [ ] Ingestion flow.
  - [ ] Blockchain deployment flow.
  - [ ] CI/CD flow.
- [ ] Add runbooks for each production service.
- [ ] Add "how to add a new service" guide.
- [ ] Add "how to add a new chain" guide.
- [ ] Add "how to add a new frontend app" guide.
- [ ] Add "how to add a new package" guide.
- [ ] Add "how to make an AI-agent-safe change" guide.

## P2: Optional Platform Expansions

- [ ] Add non-mobile GraphQL clients only if a real aggregation use case exists. The baseline template already uses GraphQL for mobile.
- [ ] Add workflow/orchestration service for durable jobs if ingestion or AI tasks require it.
- [ ] Add queue infrastructure for async processing.
- [ ] Add feature flag provider.
- [ ] Add admin app or internal dashboard.
- [ ] Add billing/payments module as an optional department capability.
- [ ] Add email/notification service as an optional department capability.
- [ ] Add search service as an optional department capability.
- [ ] Add analytics/event pipeline.
- [ ] Add multi-tenant organization model.
- [ ] Add RBAC/ABAC service.
- [ ] Add audit-log service.

## Breakup Plan: Future Standalone Modules

The repo should eventually be decomposable into a platform core plus optional department modules. Each module should have its own README, `AGENTS.md`, env contract, commands, tests, CI, deployment notes, and skill instructions.

### Module 1: Platform Core

- [ ] pnpm/Turborepo workspace.
- [ ] Shared TypeScript, ESLint, Prettier, Jest/Vitest, Playwright, and release config.
- [ ] Scripts for doctor, verify, clean, build, test, and package validation.
- [ ] GitHub Actions base workflows.
- [ ] Devcontainer and local tooling.
- [ ] AI-agent operating rules.

### Module 2: Web Department

- [ ] Next.js app template.
- [ ] Gateway REST client setup.
- [ ] Auth flows.
- [ ] Design-system integration.
- [ ] E2E tests.
- [ ] Vercel deployment.
- [ ] Web observability.
- [ ] PWA option.

### Module 3: Mobile Department

- [ ] Expo app template.
- [ ] Gateway GraphQL client setup.
- [ ] Auth flows.
- [ ] Shared mobile UI integration.
- [ ] EAS build/submit setup.
- [ ] Mobile smoke/e2e tests.
- [ ] Mobile observability.
- [ ] Device networking docs.

### Module 4: Design System Department

- [ ] Web UI package.
- [ ] Mobile UI package.
- [ ] Token pipeline.
- [ ] Storybook.
- [ ] Accessibility tests.
- [ ] Visual regression.
- [ ] Release workflow.

### Module 5: API Department

- [ ] NestJS API option.
- [ ] Bun/Elysia API option.
- [ ] Auth module.
- [ ] Todo/domain module example.
- [ ] MongoDB/Redis integration.
- [ ] OpenAPI generation.
- [ ] Unit/integration tests.
- [ ] Docker/ECS deployment.

### Module 6: API Gateway Department

- [ ] Bun/Elysia gateway.
- [ ] Route table.
- [ ] REST contract for web.
- [ ] GraphQL contract for mobile.
- [ ] Auth boundary.
- [ ] Proxy engine.
- [ ] Health/readiness.
- [ ] OpenAPI contract.
- [ ] Canary/fallback controls.
- [ ] Observability.
- [ ] Deployment.

### Module 7: Data And Ingestion Department

- [ ] Background worker template.
- [ ] MongoDB migration/seed system.
- [ ] Checkpointing.
- [ ] Backfill.
- [ ] Retry/dead-letter policy.
- [ ] Worker observability.
- [ ] ECS deployment.

### Module 8: Blockchain Department

- [ ] Shared blockchain service factory.
- [ ] Network config.
- [ ] EVM contract template.
- [ ] Solana Anchor template.
- [ ] Polkadot/Substrate template.
- [ ] Deployment scripts.
- [ ] Artifact/version registry.
- [ ] Contract tests.
- [ ] Wallet integration docs.

### Module 9: Infrastructure Department

- [ ] Terraform modules.
- [ ] Terragrunt live environments.
- [ ] AWS ECS/Fargate.
- [ ] ALB/networking/security groups.
- [ ] Secrets Manager.
- [ ] GitHub OIDC.
- [ ] Vercel/EAS integration points.
- [ ] Kubernetes reference option.

### Module 10: Observability Department

- [ ] OTEL Collector.
- [ ] Jaeger local dev.
- [ ] Cloud logs/traces.
- [ ] Prometheus/reference metrics.
- [ ] Dashboards.
- [ ] Alerts.
- [ ] Runbooks.

### Module 11: QA And Release Department

- [ ] Test strategy.
- [ ] Unit/integration/e2e/visual/contract/security test gates.
- [ ] Release gates.
- [ ] Changesets/semantic release.
- [ ] Package publishing.
- [ ] Deployment smoke tests.
- [ ] Rollback procedures.

### Module 12: AI Agent Department

- [ ] Agent workflow docs.
- [ ] Issue-to-PR automation.
- [ ] Review-comment fixing workflows.
- [ ] AI-safe command registry.
- [ ] AI-safe file ownership map.
- [ ] Codex skills.
- [ ] Cloud-code skills.

## Skill Creation Plan

The long-term goal is to create skills that let a user ask an AI agent to set up the whole engineering department or only the pieces they need.

Each skill should include:

- Purpose and when to use it.
- Inputs/questions the agent should ask.
- Files and folders it owns.
- Commands it can run.
- Environment variables it must create or update.
- Validation commands.
- Rollback/cleanup notes.
- Common failure modes.
- Examples of successful output.

### Skill 1: Engineering Department Turborepo Bootstrap

- [ ] Read target company/product name.
- [ ] Choose enabled modules.
- [ ] Rename namespace from `@todo/*`.
- [ ] Generate/update `template.config.json`.
- [ ] Create initial env examples.
- [ ] Run doctor/verify.
- [ ] Produce onboarding summary.

### Skill 2: Web App Bootstrap

- [ ] Enable Next.js app.
- [ ] Configure gateway REST URL.
- [ ] Configure auth pages.
- [ ] Wire design system.
- [ ] Add e2e smoke.
- [ ] Configure Vercel env/deploy docs.

### Skill 3: Mobile App Bootstrap

- [ ] Enable Expo app.
- [ ] Configure gateway GraphQL URL for simulator/device.
- [ ] Configure EAS profiles.
- [ ] Wire mobile UI package.
- [ ] Add smoke test.
- [ ] Produce build/submit instructions.

### Skill 4: API Service Bootstrap

- [ ] Choose NestJS, Bun/Elysia, or both.
- [ ] Create resource module.
- [ ] Add schema/model/controller/service/tests.
- [ ] Add OpenAPI docs.
- [ ] Add Docker and ECS wiring.
- [ ] Add env validation.

### Skill 5: API Gateway Bootstrap

- [ ] Add gateway service.
- [ ] Add upstreams.
- [ ] Add route table.
- [ ] Add REST routes for web clients.
- [ ] Add GraphQL schema/resolvers for mobile clients.
- [ ] Add auth policies.
- [ ] Add health/readiness.
- [ ] Add OpenAPI/contract tests.
- [ ] Add Docker/dev/deploy wiring.

### Skill 6: Design System Bootstrap

- [ ] Create token set.
- [ ] Generate web and mobile outputs.
- [ ] Add component scaffold.
- [ ] Add stories.
- [ ] Add accessibility and visual tests.
- [ ] Add release notes.

### Skill 7: Blockchain Network Bootstrap

- [ ] Choose network type: EVM, Solana, or Polkadot/Substrate.
- [ ] Add contract/program/pallet template.
- [ ] Add tests.
- [ ] Add deployment script.
- [ ] Add service factory implementation.
- [ ] Add frontend wallet config.
- [ ] Add artifact registry entry.

### Skill 8: Ingestion Worker Bootstrap

- [ ] Add source adapter.
- [ ] Add checkpoint model.
- [ ] Add backfill command.
- [ ] Add retry/dead-letter behavior.
- [ ] Add observability.
- [ ] Add ECS deployment wiring.

### Skill 9: Infrastructure Bootstrap

- [ ] Choose deployment targets.
- [ ] Configure Terraform modules.
- [ ] Configure Terragrunt environments.
- [ ] Configure GitHub OIDC.
- [ ] Configure Secrets Manager.
- [ ] Configure deployment workflows.
- [ ] Run plan validation.

### Skill 10: Observability Bootstrap

- [ ] Enable local OTEL/Jaeger.
- [ ] Add service instrumentation.
- [ ] Add dashboards.
- [ ] Add alert rules.
- [ ] Add runbooks.
- [ ] Validate trace propagation.

### Skill 11: QA And Release Bootstrap

- [ ] Add test matrix.
- [ ] Add CI path filters.
- [ ] Add release gates.
- [ ] Add package publishing.
- [ ] Add deployment smoke tests.
- [ ] Add rollback checklist.

### Skill 12: Repo Decomposition Assistant

- [ ] Identify module boundaries.
- [ ] Move selected module into standalone repo/package layout.
- [ ] Preserve package names or rename them.
- [ ] Generate module README and AGENTS instructions.
- [ ] Generate module-specific CI.
- [ ] Generate migration notes for consumers.

## Suggested Implementation Sequence

### Phase 1: Stabilize The Existing Repo

- [ ] Clean generated artifacts from source.
- [ ] Fix docs command drift.
- [ ] Add status matrix.
- [ ] Add `pnpm doctor`.
- [ ] Add `pnpm verify`.
- [ ] Make core checks green.

### Phase 2: Finish Gateway-First Architecture

- [ ] Complete gateway health/readiness.
- [ ] Add gateway Docker/dev-script integration.
- [ ] Complete route parity and frontend e2e through gateway.
- [ ] Add gateway telemetry.
- [ ] Add gateway infrastructure and deployment.
- [ ] Remove direct API public exposure.

### Phase 3: Production Hardening

- [ ] Finish env/secrets contract.
- [ ] Finish security baseline.
- [ ] Finish observability dashboards/runbooks.
- [ ] Finish deployment rollback docs.
- [ ] Finish API/database migration policies.

### Phase 4: Make It A True Template

- [ ] Add module enable/disable strategy.
- [ ] Add namespace/domain replacement strategy.
- [ ] Add minimal/full bootstrap paths.
- [ ] Add template manifest.
- [ ] Add reusable generation scripts or documented manual flows.

### Phase 5: Strengthen Each Department Module

- [ ] Web department.
- [ ] Mobile department.
- [ ] API department.
- [ ] Gateway department.
- [ ] Blockchain department.
- [ ] Infrastructure department.
- [ ] Observability department.
- [ ] QA/release department.
- [ ] AI-agent department.

### Phase 6: Create Skills

- [ ] Write the global engineering-department bootstrap skill.
- [ ] Write module-specific bootstrap skills.
- [ ] Add validation fixtures for each skill.
- [ ] Test skills against a fresh clone.
- [ ] Test skills against a partially configured repo.
- [ ] Test decomposition skill by extracting at least one module.

### Phase 7: Split Into Standalone Parts

- [ ] Extract platform core.
- [ ] Extract web module.
- [ ] Extract mobile module.
- [ ] Extract API module.
- [ ] Extract gateway module.
- [ ] Extract blockchain module.
- [ ] Extract infrastructure module.
- [ ] Extract observability module.
- [ ] Extract QA/release module.
- [ ] Publish migration and composition docs.

## Definition Of Done For The Whole Vision

- [ ] A new user can clone the repo and run one documented flow to get a working local platform.
- [ ] A new user can choose a minimal setup without blockchain/mobile/infra complexity.
- [ ] A new user can choose the full setup with all major engineering-department capabilities.
- [ ] CI reliably validates the selected platform.
- [ ] Each app/package has clear docs, env vars, tests, deployment, and ownership.
- [ ] Gateway is the public API boundary.
- [ ] Web and mobile use the gateway.
- [ ] Backend APIs are private in production.
- [ ] Infrastructure is reproducible through Terraform/Terragrunt.
- [ ] Secrets are never stored in source.
- [ ] Observability and runbooks are sufficient for production incidents.
- [ ] Blockchain support is modular and optional.
- [ ] The repo can be decomposed into standalone department modules.
- [ ] Codex/cloud-code skills exist for the full repo and for each major department module.
- [ ] The skills can bootstrap, modify, verify, and document the platform without requiring the user to know the whole repo.
