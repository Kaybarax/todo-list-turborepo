# API Family Convention

This document defines the conventions and standards for all API services in the Todo List Turborepo. Every API in the monorepo follows these rules for ownership, packaging, routing, and deployment.

## Table of Contents

- [API Ownership](#api-ownership)
- [Route Ownership and Source of Truth](#route-ownership-and-source-of-truth)
- [The API Gateway](#the-api-gateway)
- [Current API Family Members](#current-api-family-members)
- [Adding a New API](#adding-a-new-api)
- [References](#references)

## API Ownership

Every API in this monorepo owns its full lifecycle. That means each API is responsible for:

- **Runtime**: Declare and configure its own runtime (Node.js/NestJS, Bun/Elysia, or another supported runtime). The runtime version is pinned in the API's own `package.json` via `engines` and in its Dockerfile.
- **Package metadata**: Each API is a pnpm workspace package under a unique `@todo/*` name. Its `package.json` specifies dependencies, scripts, and workspace integration — it must not depend on another API's `package.json` for runtime configuration.
- **Dockerfile**: A self-contained Dockerfile at the root of the API's directory that builds and runs the service independently. No shared Dockerfile across APIs.
- **Environment schema**: All environment variables the API consumes must be documented in a `.env.schema` or equivalent file at the API's root. Required vs optional variables are clearly marked with defaults where applicable.
- **Tests**: Unit, integration, and (where applicable) contract tests live alongside the API. Each API defines its own test scripts in `package.json` and contributes to the monorepo's `turbo.json` test pipeline.
- **OpenAPI / export contract**: Every API that exposes HTTP endpoints publishes an OpenAPI specification (or equivalent contract) under `docs/api/openapi/`. This contract is the source of truth for the API's public surface.
- **Deployment notes**: Operational documentation — build steps, health check endpoints, required secrets, scaling considerations, and any runtime-specific quirks — lives in a `docs/deploy/` file within the API's directory or in a top-level deployment runbook that references the API.

### What Shared Services Provide

Shared packages under `packages/` (such as `@todo/services`, `@todo/ui-web`) provide common utilities, clients, and UI components. They do **not** own runtime configuration, deployment artifacts, or API contracts. That ownership belongs to the API service itself.

## Route Ownership and Source of Truth

Every route exposed by the API family has a single owner and one source of truth.

### Route Owner

Each route is owned by exactly one API service. The owner is the service that implements the business logic for that route. The route owner is documented in the gateway's route map (see `docs/api/gateway/04-routing-and-proxy-model.md`).

When two APIs implement the same logical route (e.g., during migration from NestJS to Bun), the gateway determines which backend serves the request. In that case, the route has a **primary owner** (the canonical implementation) and the migration plan defines the transition timeline.

### Route Source of Truth

The **OpenAPI specification** for each route is the source of truth. It defines:

- HTTP method and path
- Request parameters, headers, and body schema
- Response status codes and body schema
- Authentication and authorization requirements
- Rate-limit tiers and caching behavior

The gateway's route map (defined in `apps/api-gateway`) references these OpenAPI specs to route requests to the correct upstream. No frontend should reference an API route directly — all traffic goes through the gateway.

### Ownership Table

| Route Prefix           | Owner          | Gateway Route? | OpenAPI Spec Location                           |
| ---------------------- | -------------- | -------------- | ----------------------------------------------- |
| `/api/v1/auth/*`       | NestJS API     | Yes            | `docs/api/openapi/nestjs-api-auth.json`         |
| `/api/v1/users/*`      | NestJS API     | Yes            | `docs/api/openapi/nestjs-api-users.json`        |
| `/api/v1/todos/*`      | NestJS API     | Yes            | `docs/api/openapi/nestjs-api-todos.json`        |
| `/api/v1/blockchain/*` | Bun/Elysia API | Yes            | `docs/api/openapi/bun-elysia-api-current.json`  |
| `/api/health`          | Gateway        | Handled inline | `docs/api/openapi/gateway-current.openapi.json` |

This table is updated as routes are added, migrated, or retired.

## The API Gateway

The API gateway lives at `apps/api-gateway` and is intentionally **not** under `apps/apis/*`. This is a deliberate architectural decision:

- The gateway is the **boundary and orchestration layer** between external clients and internal API services.
- It owns cross-cutting concerns: authentication, rate limiting, request routing, GraphQL aggregation, response normalization, and observability.
- It does **not** own business logic, database access, or domain-specific processing.
- Placing the gateway alongside the APIs under `apps/apis/*` would imply it is just another API service, which contradicts its role as the single public entry point.

The gateway stays at `apps/api-gateway` — a top-level app alongside `apps/web`, `apps/mobile`, and the API services. This makes its special role explicit in the directory structure.

### Gateway Contract

Frontends and external clients interact with **only** the gateway's public API. Internal API services are not directly accessible from outside the deployment boundary. This means:

- The `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_BUN_URL` environment variables are replaced by a single `NEXT_PUBLIC_API_GATEWAY_URL`.
- The gateway maps public routes to internal upstreams based on the route ownership table.
- Shared API contracts (e.g., the todo CRUD contract) are defined once and served by whichever upstream the gateway selects. Clients do not choose which backend runtime handles a request.

See the [gateway decision record](./gateway/01-decision-record.md) and [target architecture](./gateway/02-target-architecture.md) for full detail on the gateway design.

## Current API Family Members

### NestJS API

- **Location**: Currently at `apps/api`, planned migration to `apps/apis/nestjs-api`.
- **Runtime**: Node.js with NestJS framework.
- **Package name**: `@todo/api` (will become `@todo/nestjs-api` after migration).
- **Port**: `3001`.
- **Role**: Canonical API — owns auth, user management, todo CRUD, and most business logic.
- **Documentation**: See [`docs/api/bun-elysia-api-guide.md`](./bun-elysia-api-guide.md) for operational details (shared conventions apply).
- **OpenAPI**: Published at `/api/docs` in development.

### Bun/Elysia API

- **Location**: Currently at `apps/api-bun`, planned migration to `apps/apis/bun-elysia-api`.
- **Runtime**: Bun with Elysia framework.
- **Package name**: `@todo/api-bun` (will become `@todo/bun-elysia-api` after migration).
- **Port**: `3002`.
- **Role**: High-throughput API — owns blockchain endpoints, performance-sensitive routes, and serves as a canary for the migration path.
- **OpenAPI**: Published at `/api/docs` (Swagger UI) and `/api/docs/json` in development.

### API Gateway

- **Location**: `apps/api-gateway` (permanent location — not moving to `apps/apis/`).
- **Runtime**: Bun with Elysia framework.
- **Package name**: `@todo/api-gateway`.
- **Port**: `3003`.
- **Role**: Single public entry point for all clients. Routes requests to the appropriate upstream API, handles cross-cutting concerns, and provides GraphQL aggregation for mobile.
- **OpenAPI**: Published at `docs/api/openapi/gateway-current.openapi.json`.

## Adding a New API

When adding a new API service to the monorepo, follow these steps:

### 1. Choose the Location

Create the new API under `apps/apis/<runtime-or-domain>-api`. Examples:

- An Express.js API for notifications: `apps/apis/express-notifications-api`
- A Fastify API for search: `apps/apis/fastify-search-api`
- A domain-specific service for payments: `apps/apis/payments-api`

Use a runtime prefix (e.g., `express-`, `fastify-`, `hono-`) when the runtime choice is significant for the service's identity. Use a domain name only (e.g., `payments-api`) when the runtime is incidental and the domain is the primary identifier.

### 2. Set Up the Package

- Add the API as a pnpm workspace package in `pnpm-workspace.yaml`.
- Name it `@todo/<api-name>` following the existing `@todo/*` convention.
- Define all scripts (`dev`, `build`, `test`, `lint`) in its `package.json`.
- Pin the runtime version in `engines`.

### 3. Add Required Artifacts

Every new API must include:

- **Dockerfile**: A production-ready container image definition.
- **Environment schema**: Document all environment variables with types, defaults, and whether they are required or optional.
- **OpenAPI spec**: Generate or write an OpenAPI 3.x specification and commit it to `docs/api/openapi/`.
- **Tests**: At minimum, a health-check test and tests for each route. Add the test script to the monorepo's CI pipeline.
- **Deployment notes**: Document how the API is deployed, its resource requirements, health check endpoint, and any upstream dependencies.

### 4. Register with the Gateway

- Add the new API as an upstream in the gateway configuration (`apps/api-gateway`).
- Define which routes this API owns in the gateway's route map.
- Ensure the new API is not directly exposed to clients — all traffic must go through `apps/api-gateway`.

### 5. Update Documentation

- Add the new API to the ownership table in this document.
- Update `docs/engineering-department-roadmap.md` if applicable.
- Update the gateway documentation in `docs/api/gateway/` if the new API introduces new routing patterns.

### Checklist for New APIs

```
- [ ] Created at `apps/apis/<runtime-or-domain>-api`
- [ ] Added to `pnpm-workspace.yaml` with `@todo/*` name
- [ ] Has a self-contained Dockerfile
- [ ] Has documented environment schema
- [ ] Has OpenAPI spec committed to `docs/api/openapi/`
- [ ] Has tests (unit + integration)
- [ ] Has deployment notes
- [ ] Registered as upstream in `apps/api-gateway`
- [ ] Routes documented in the gateway route map
- [ ] Added to the ownership table above
```

## References

- [API Gateway Decision Record](./gateway/01-decision-record.md)
- [API Gateway Target Architecture](./gateway/02-target-architecture.md)
- [API Gateway Routing and Proxy Model](./gateway/04-routing-and-proxy-model.md)
- [Bun/Elysia API Guide](./bun-elysia-api-guide.md)
- [Secrets and Configuration Management](./secrets-and-configuration.md)
- [Database Migration Policy](./database-migration-policy.md)
