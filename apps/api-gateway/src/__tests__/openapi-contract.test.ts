import { beforeAll, describe, expect, it } from 'bun:test';

import { routeTable } from '../config/route-table';
import { upstreams } from '../config/upstreams';
import { gatewayContractPaths, routeTableOpenApiPaths } from '../openapi/gateway-contract';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AppModule = typeof import('../app');

let app: AppModule['app'];

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-value';
  process.env.CORS_ORIGIN = 'http://localhost:3000';
  ({ app } = await import('../app'));
});

function toOpenApiPath(path: string): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

const upstreamContractPaths = {
  'bun-openapi': new Set([
    'GET /api/v1/todos',
    'GET /api/v1/todos/stats',
    'POST /api/v1/auth/login',
    'GET /api/v1/auth/profile',
    'POST /api/v1/auth/refresh',
    'POST /api/v1/auth/register',
  ]),
  'nest-openapi': new Set([
    'GET /api/v1/users/profile',
    'POST /api/v1/todos',
    'GET /api/v1/todos/{id}',
    'PATCH /api/v1/todos/{id}',
    'DELETE /api/v1/todos/{id}',
    'PATCH /api/v1/todos/{id}/toggle',
  ]),
};

describe('gateway OpenAPI and route contract', () => {
  it('exports OpenAPI JSON with gateway documentation metadata', async () => {
    const response = await app.handle(new Request('http://localhost/api/docs/json'));

    expect(response.status).toBe(200);
    const spec = (await response.json()) as {
      openapi: string;
      info: { title: string; version: string };
      paths: Record<string, unknown>;
    };
    expect(spec.openapi).toStartWith('3.');
    expect(spec.info.title).toBe('API Gateway');
    expect(spec.info.version).toBe('0.0.1');
    expect(spec.paths['/api/v1']).toBeTruthy();
    expect(spec.paths['/api/v1/health']).toBeTruthy();
    expect(spec.paths['/api/v1/health/ready']).toBeTruthy();
  });

  it('requires OpenAPI metadata on every route table entry', () => {
    for (const route of routeTable) {
      expect(route.openapi.operationId).toBeTruthy();
      expect(route.openapi.summary).toBeTruthy();
      expect(route.openapi.responseShape).toBeTruthy();
      expect(['gateway', 'nest-openapi', 'bun-openapi']).toContain(route.openapi.source);
    }
  });

  it('ensures every proxied route has an upstream and source contract configured', () => {
    for (const route of routeTable.filter(route => route.upstream !== 'gateway')) {
      expect(upstreams[route.upstream]).toBeTruthy();
      expect(route.upstreamPath).toBeTruthy();
      expect(route.openapi.source).not.toBe('gateway');
    }
  });

  it('keeps route table paths in the generated contract path map', () => {
    const contractPaths = gatewayContractPaths();

    for (const route of routeTable) {
      const path = toOpenApiPath(route.publicPath);
      expect(contractPaths[path]).toBeTruthy();
      for (const method of route.methods) {
        expect(contractPaths[path]?.[method.toLowerCase() as Lowercase<typeof method>]?.operationId).toBe(
          route.openapi.operationId,
        );
      }
    }
  });

  it('catches route table drift with a stable public path snapshot', () => {
    expect(routeTableOpenApiPaths()).toEqual([
      '/api/v1',
      '/api/v1/auth/login',
      '/api/v1/auth/profile',
      '/api/v1/auth/refresh',
      '/api/v1/auth/register',
      '/api/v1/health',
      '/api/v1/health/ready',
      '/api/v1/todos',
      '/api/v1/todos/stats',
      '/api/v1/todos/{id}',
      '/api/v1/todos/{id}/toggle',
      '/api/v1/users/profile',
    ]);
  });

  it('documents client-facing todo response shapes used by @todo/services', () => {
    const todoRoutes = routeTable.filter(route => route.tags.includes('todos'));

    expect(todoRoutes.map(route => route.openapi.responseShape)).toEqual([
      'PaginatedTodos',
      'ApiTodo',
      'TodoStats',
      'ApiTodo',
      'ApiTodo',
    ]);
  });

  it('maps upstream comparison sources to declared route owners', () => {
    const sourceByOwner = {
      gateway: 'gateway',
      api: 'nest-openapi',
      'api-bun': 'bun-openapi',
    } as const;

    for (const route of routeTable) {
      expect(route.openapi.source).toBe(sourceByOwner[route.owner]);
    }
  });

  it('compares proxied route methods against declared upstream OpenAPI sources', () => {
    for (const route of routeTable.filter(route => route.upstream !== 'gateway')) {
      const source = route.openapi.source;
      expect(source).not.toBe('gateway');
      const sourcePaths = upstreamContractPaths[source];
      for (const method of route.methods) {
        expect(sourcePaths.has(`${method} ${toOpenApiPath(route.upstreamPath ?? route.publicPath)}`)).toBe(true);
      }
    }
  });
});
