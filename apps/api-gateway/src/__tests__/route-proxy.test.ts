import { beforeAll, describe, expect, it } from 'bun:test';

import { routeTable } from '../config/route-table';
import { GatewayUpstreamTimeoutError } from '../errors';
import { buildProxyHeaders } from '../proxy/headers';
import { shouldRetry } from '../proxy/retry-policy';
import { buildProxyUrl } from '../proxy/url';
import { matchRoute } from '../routing/matcher';
import { type GatewayRoute, type RouteMatch } from '../types/route';
import { type Upstream } from '../types/upstream';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type ProxyModule = typeof import('../proxy/proxy');

let proxyRequest: ProxyModule['proxyRequest'];

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-value';
  process.env.CORS_ORIGIN = 'http://localhost:3000';
  ({ proxyRequest } = await import('../proxy/proxy'));
});

const expectedRouteIds = [
  'gateway.index',
  'gateway.health',
  'gateway.health.ready',
  'auth.register',
  'auth.login',
  'auth.refresh',
  'auth.profile',
  'users.profile',
  'todos.list',
  'todos.create',
  'todos.stats',
  'todos.by-id',
  'todos.toggle',
];

function route(id: string): GatewayRoute {
  const found = routeTable.find(entry => entry.id === id);
  if (!found) throw new Error(`Missing route ${id}`);
  return found;
}

function match(method: string, path: string): RouteMatch {
  const result = matchRoute(routeTable, method, path);
  if (!result) throw new Error(`Expected route match for ${method} ${path}`);
  return result;
}

describe('route table metadata', () => {
  it('covers the Phase 3 gateway and proxied routes', () => {
    expect(routeTable.map(entry => entry.id)).toEqual(expectedRouteIds);
  });

  it('defines required metadata for every route', () => {
    for (const entry of routeTable) {
      expect(entry.id).toBeTruthy();
      expect(entry.publicPath).toStartWith('/api/v1');
      expect(entry.methods.length).toBeGreaterThan(0);
      expect(entry.upstream).toBeTruthy();
      expect(entry.auth).toBeTruthy();
      expect(entry.timeoutMs).toBeGreaterThan(0);
      expect(entry.retries).toBeGreaterThanOrEqual(0);
      expect(entry.tags.length).toBeGreaterThan(0);
      expect(entry.owner).toBeTruthy();

      if (entry.upstream !== 'gateway') {
        expect(entry.upstreamPath).toBeTruthy();
      }
    }
  });
});

describe('route matcher', () => {
  it('matches exact routes', () => {
    expect(match('GET', '/api/v1').route.id).toBe('gateway.index');
    expect(match('GET', '/api/v1/health/ready').route.id).toBe('gateway.health.ready');
  });

  it('selects method-specific routes for duplicate public paths', () => {
    expect(match('GET', '/api/v1/todos').route.id).toBe('todos.list');
    expect(match('POST', '/api/v1/todos').route.id).toBe('todos.create');
  });

  it('matches parameterized routes and decodes params', () => {
    const result = match('PATCH', '/api/v1/todos/todo%201/toggle');
    expect(result.route.id).toBe('todos.toggle');
    expect(result.params.id).toBe('todo 1');
  });

  it('reports matched path with unsupported method as 405-ready', () => {
    const result = match('DELETE', '/api/v1/auth/login');
    expect(result.route.id).toBe('auth.login');
    expect(result.methodAllowed).toBe(false);
  });

  it('returns null for no route', () => {
    expect(matchRoute(routeTable, 'GET', '/api/v1/not-real')).toBeNull();
  });

  it('supports wildcard routes only when a table explicitly supplies one', () => {
    const wildcardRoute: GatewayRoute = {
      id: 'debug.wildcard',
      publicPath: '/api/v1/debug/*',
      methods: ['GET'],
      upstream: 'nest-api',
      upstreamPath: '/api/v1/debug/*',
      auth: 'required',
      timeoutMs: 1_000,
      retries: 0,
      tags: ['debug'],
      owner: 'api',
    };

    expect(matchRoute([wildcardRoute], 'GET', '/api/v1/debug/a/b/c')?.route.id).toBe('debug.wildcard');
  });
});

describe('proxy URL and header behavior', () => {
  const upstream: Upstream = {
    id: 'bun-api',
    baseUrl: 'http://localhost:3002',
    healthPath: '/api/v1/health/ready',
    serviceName: 'todo-api-bun',
  };

  it('builds upstream URLs with path params and preserved query strings', () => {
    const request = new Request('http://gateway.local/api/v1/todos/todo%201/toggle?dryRun=true&sort=desc');
    const url = buildProxyUrl(request, route('todos.toggle'), upstream, { id: 'todo 1' });

    expect(url.toString()).toBe('http://localhost:3002/api/v1/todos/todo%201/toggle?dryRun=true&sort=desc');
  });

  it('forwards only allowed headers and adds gateway headers', () => {
    const request = new Request('https://gateway.local/api/v1/todos', {
      headers: {
        authorization: 'Bearer token',
        connection: 'keep-alive',
        host: 'gateway.local',
        'x-request-id': 'request-headers-1',
        'x-api-version': '2026-06-02',
        'x-secret-debug': 'nope',
      },
    });

    const headers = buildProxyHeaders(request, route('todos.list'));

    expect(headers.get('authorization')).toBe('Bearer token');
    expect(headers.get('x-api-version')).toBe('2026-06-02');
    expect(headers.get('connection')).toBeNull();
    expect(headers.get('host')).toBeNull();
    expect(headers.get('x-secret-debug')).toBeNull();
    expect(headers.get('x-gateway-service')).toBe('todo-api-gateway');
    expect(headers.get('x-gateway-route')).toBe('todos.list');
    expect(headers.get('x-forwarded-host')).toBe('gateway.local');
    expect(headers.get('x-forwarded-proto')).toBe('https');
    expect(headers.get('x-forwarded-for')).toBe('127.0.0.1');
  });
});

describe('timeout and retry behavior', () => {
  it('retries idempotent requests on retryable upstream status and preserves final response body', async () => {
    const calls: string[] = [];
    const fetcher = async (input: string | URL | Request): Promise<Response> => {
      calls.push(String(input));
      if (calls.length === 1) {
        return new Response('bad gateway', { status: 502 });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    const result = await proxyRequest(
      new Request('http://gateway.local/api/v1/todos?page=1'),
      match('GET', '/api/v1/todos'),
      fetcher,
    );

    expect(calls).toHaveLength(2);
    expect(result.status).toBe(200);
    expect(result.headers.get('x-gateway-route')).toBe('todos.list');
    expect(result.headers.get('x-gateway-upstream')).toBe('bun-api');
    expect(await result.json()).toEqual({ ok: true });
  });

  it('does not retry mutating requests by default', () => {
    expect(shouldRetry('POST', route('todos.create'), 0, new Response('unavailable', { status: 503 }))).toBe(false);
  });

  it('maps aborted upstream calls to a gateway timeout error', async () => {
    const slowRoute = { ...route('todos.list'), timeoutMs: 1 };
    const slowMatch: RouteMatch = { ...match('GET', '/api/v1/todos'), route: slowRoute };
    const fetcher = (_input: string | URL | Request, init?: Parameters<typeof fetch>[1]): Promise<Response> =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('aborted', 'AbortError'));
        });
      });

    let thrown: unknown;
    try {
      await proxyRequest(new Request('http://gateway.local/api/v1/todos'), slowMatch, fetcher);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(GatewayUpstreamTimeoutError);
  });
});
