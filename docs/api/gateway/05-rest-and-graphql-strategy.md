# 05 REST And GraphQL Strategy

## Recommendation

Use a deliberate hybrid gateway contract:

- The web app uses REST through `/api/v1/*`.
- The mobile app uses GraphQL through `/graphql`.
- The gateway owns both contracts and hides NestJS/Bun/internal-service routing from clients.

Start by stabilizing REST proxying because the existing clients are REST-oriented. Then add GraphQL as the mobile-facing gateway-owned aggregation surface. Do not replace every REST endpoint with GraphQL. Use GraphQL where it makes the mobile app simpler, reduces round trips, or demonstrates flexible client-driven data selection.

## Why REST First

The existing API clients in `packages/services` are REST-oriented Axios clients.

Existing endpoints already fit REST well:

- Auth
- Users
- Todos
- Health

The fastest safe web migration is:

```text
web REST calls -> gateway REST path -> existing upstream REST path
```

This preserves existing web contracts while moving routing decisions out of the frontend.

## When GraphQL Helps

GraphQL is the target mobile application data contract. It is especially useful when a screen needs multiple backend calls or flexible field selection.

Good examples:

- Mobile home screen that needs user profile, todo stats, recent todos, and blockchain sync summary.
- Mobile todo list with pagination, filters, and only the fields needed for the current view.
- Mobile wallet screen with profile, connected networks, and recent transaction status.
- Dashboard view that combines todos, blockchain networks, transaction status, and ingestion status.
- Future admin or analytics surface.
- Future clients that need smaller payloads on mobile networks.

Poor examples:

- `POST /auth/login`
- `POST /auth/register`
- `PATCH /todos/:id/toggle`
- Simple CRUD endpoints already used by shared clients

## Recommended Hybrid API Surface

```text
/api/v1/*     REST, stable client contract, proxy or BFF handlers
/graphql      mobile-facing GraphQL aggregation endpoint
/api/docs     gateway OpenAPI docs
/graphql/docs optional GraphQL explorer in development only
```

## GraphQL Ownership

The gateway owns the GraphQL schema because GraphQL is a client-facing composition contract. In this repo, GraphQL is specifically the mobile-facing application data contract.

Resolvers should call:

- Gateway upstream clients
- Existing REST APIs
- Future internal services

Resolvers should not directly write MongoDB for todo/user domain behavior.

## Initial GraphQL Schema Candidate

```graphql
type Query {
  me: User
  todos(filter: TodoFilter, pagination: PaginationInput): TodoConnection!
  todo(id: ID!): Todo
  todoStats: TodoStats!
  dashboard: Dashboard!
}

type Mutation {
  createTodo(input: CreateTodoInput!): Todo!
  updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
  toggleTodo(id: ID!): Todo!
  deleteTodo(id: ID!): DeleteResult!
}

type Dashboard {
  user: User!
  stats: TodoStats!
  recentTodos: [Todo!]!
}
```

## Resolver Pattern

```ts
const resolvers = {
  Query: {
    me: async (_parent, _args, ctx) => {
      return ctx.clients.users.getProfile(ctx.auth);
    },
    dashboard: async (_parent, _args, ctx) => {
      const [user, stats, recentTodos] = await Promise.all([
        ctx.clients.users.getProfile(ctx.auth),
        ctx.clients.todos.getStats(ctx.auth),
        ctx.clients.todos.list({ limit: 5 }, ctx.auth),
      ]);

      return { user, stats, recentTodos };
    },
  },
};
```

## REST Proxy Versus BFF Handler

Use REST proxy when:

- Public route matches upstream route.
- Response shape should remain unchanged.
- No composition is needed.
- Route is part of migration from NestJS to Bun.

Use BFF handler when:

- The frontend needs a shape different from the upstream.
- The handler combines multiple upstreams.
- The handler hides legacy backend differences.
- The handler handles a gateway-specific concern.

## OpenAPI Strategy

The gateway should publish its own OpenAPI document for public REST routes.

There are three practical phases:

### Phase 1: Manual Gateway OpenAPI

Define gateway route docs directly in Elysia route metadata.

Pros:

- Fastest to implement.
- Clear public contract.

Cons:

- Requires manual sync with upstream changes.

### Phase 2: Upstream OpenAPI Import

Use existing scripts:

- `apps/api/scripts/dump-openapi.ts`
- `apps/api-bun/scripts/export-openapi.ts`

Then generate or validate gateway docs from selected upstream paths.

Pros:

- Better drift detection.
- Supports route ownership.

Cons:

- Requires tooling.

### Phase 3: Public Contract Tests

Treat gateway OpenAPI as the contract.

CI checks:

- Gateway OpenAPI exports successfully.
- Upstream route exists for every proxied gateway route.
- Breaking changes require explicit approval.
- Client tests use gateway URL only.

## Mobile GraphQL Client Requirements

- Add a GraphQL client in `apps/mobile`.
- Keep the gateway URL as the only public backend URL.
- Add `EXPO_PUBLIC_GRAPHQL_GATEWAY_URL` only if the GraphQL endpoint cannot be derived from `EXPO_PUBLIC_API_GATEWAY_URL`.
- Share auth token handling with REST-compatible auth flows.
- Pass `x-request-id` or a generated correlation ID with GraphQL requests.
- Add persisted queries once the mobile schema stabilizes.
- Add mobile GraphQL tests for dashboard, todo list, todo mutation, auth failure, offline, and partial-error states.

## GraphQL Security

For the mobile GraphQL endpoint:

- Disable introspection in production unless behind admin auth.
- Enforce max query depth.
- Enforce max operation complexity.
- Disable arbitrary batching unless rate-limited.
- Prefer persisted queries for mobile once stable.
- Apply the same auth policy as REST.

## Migration Rule

The web app does not need to move to GraphQL for this template. Its role is to demonstrate REST through the gateway while mobile demonstrates GraphQL through the gateway.
