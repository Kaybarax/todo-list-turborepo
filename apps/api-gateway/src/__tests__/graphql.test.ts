import { beforeAll, describe, expect, it } from 'bun:test';

import { type Elysia } from 'elysia';

import { config } from '../config/env';
import { createGraphQLRoute } from '../graphql/index';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AppModule = typeof import('../app');

// ---------------------------------------------------------------------------
// Enabled
// ---------------------------------------------------------------------------

describe('GraphQL (enabled)', () => {
  let app: Elysia;

  beforeAll(() => {
    // Mutate the shared config singleton so createGraphQLRoute reads it fresh
    config.graphql = { enabled: true, path: '/graphql' };
    app = createGraphQLRoute();
  });

  it('GET /graphql returns the GraphQL playground (HTML)', async () => {
    const response = await app.handle(
      new Request('http://localhost/graphql', {
        headers: { accept: 'text/html' },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
  });

  it('POST /graphql { query: "{ health }" } returns { data: { health: "ok" } }', async () => {
    const response = await app.handle(
      new Request('http://localhost/graphql', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: '{ health }' }),
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { data: { health: string } };
    expect(body.data.health).toBe('ok');
  });

  it('POST /graphql { query: "{ todos { id title completed } }" } returns empty array', async () => {
    const response = await app.handle(
      new Request('http://localhost/graphql', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: '{ todos { id title completed } }' }),
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { data: { todos: [] } };
    expect(body.data.todos).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------

describe('GraphQL (disabled)', () => {
  let disabledApp: Elysia;

  beforeAll(() => {
    config.graphql = { enabled: false, path: '/graphql' };
    disabledApp = createGraphQLRoute();
  });

  it('returns 404 when GRAPHQL_ENABLED=false', async () => {
    const response = await disabledApp.handle(new Request('http://localhost/graphql'));

    expect(response.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// REST endpoint unaffected
// ---------------------------------------------------------------------------

describe('REST endpoint with GraphQL enabled', () => {
  let fullApp: AppModule['app'];

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-value';
    process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:8081';
    process.env.RATE_LIMIT_ENABLED = 'true';

    const appModule: AppModule = await import('../app');
    fullApp = appModule.app;
  });

  it('REST endpoint at /api/v1 works when GraphQL is compiled into app', async () => {
    const response = await fullApp.handle(
      new Request('http://localhost/api/v1', {
        headers: { 'x-request-id': 'graphql-rest-test' },
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { service: string };
    expect(body.service).toBe('api-gateway');
  });
});
