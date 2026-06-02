import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';

import { getRecordedSpans, resetRecordedSpans } from '../observability/telemetry';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AppModule = typeof import('../app');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AuthPolicyModule = typeof import('../plugins/auth-policy');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type RateLimitModule = typeof import('../plugins/rate-limit');

let app: AppModule['app'];
let resetRateLimitBuckets: RateLimitModule['resetRateLimitBuckets'];
let signTestJwt: AuthPolicyModule['signTestJwt'];
let logLines: string[];

const originalConsoleInfo = console.info;
const originalFetch = globalThis.fetch;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-value';
  process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:8081';
  process.env.RATE_LIMIT_ENABLED = 'true';

  const appModule = await import('../app');
  const authPolicyModule = await import('../plugins/auth-policy');
  const rateLimitModule = await import('../plugins/rate-limit');
  app = appModule.app;
  signTestJwt = authPolicyModule.signTestJwt;
  resetRateLimitBuckets = rateLimitModule.resetRateLimitBuckets;
});

beforeEach(() => {
  resetRateLimitBuckets();
  globalThis.fetch = originalFetch;
  resetRecordedSpans();
  logLines = [];
  console.info = (message?: unknown) => {
    logLines.push(String(message));
  };
});

describe('api-gateway', () => {
  it('responds to health check with request id and security headers', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/v1', {
        headers: { 'x-request-id': 'request-12345678' },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('x-request-id')).toBe('request-12345678');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    const body = (await response.json()) as { service: string; version: string; timestamp: string };
    expect(body.service).toBe('api-gateway');
    expect(body.version).toBe('0.0.1');
    expect(body.timestamp).toBeDefined();
  });

  it('handles CORS preflight with configured origins, methods, headers, and credentials', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/v1/todos', {
        method: 'OPTIONS',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'content-type,x-request-id',
        },
      }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
    expect(response.headers.get('access-control-allow-credentials')).toBe('true');
    expect(response.headers.get('access-control-allow-methods')).toContain('OPTIONS');
    expect(response.headers.get('access-control-allow-headers')).toContain('x-request-id');
    expect(response.headers.get('access-control-expose-headers')).toBe('x-request-id');
  });

  it('normalizes gateway-generated errors', async () => {
    const response = await app.handle(new Request('http://localhost/api/v1/missing'));

    expect(response.status).toBe(404);
    expect(response.headers.get('x-request-id')).toBeTruthy();
    const body = (await response.json()) as {
      error: string;
      errorCode: string;
      message: string;
      requestId: string;
    };
    expect(body.error).toBe('Route Not Found');
    expect(body.errorCode).toBe('GW_ROUTE_NOT_FOUND');
    expect(body.message).toContain('/api/v1/missing');
    expect(response.headers.get('x-request-id')).toBe(body.requestId);
  });

  it('rejects oversized request bodies before route handling', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/v1', {
        method: 'POST',
        headers: {
          'content-length': '1048577',
          'content-type': 'application/json',
        },
        body: '{}',
      }),
    );

    expect(response.status).toBe(413);
    const body = (await response.json()) as { errorCode: string };
    expect(body.errorCode).toBe('GW_PAYLOAD_TOO_LARGE');
  });

  it('emits structured request logs with method, path, route id, status, duration, request id, and upstream', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/v1', {
        headers: { 'x-request-id': 'request-logging-1' },
      }),
    );

    expect(response.status).toBe(200);
    expect(logLines).toHaveLength(1);
    const log = JSON.parse(logLines[0] ?? '{}') as Record<string, unknown>;
    expect(log.method).toBe('GET');
    expect(log.path).toBe('/api/v1');
    expect(log.routeId).toBe('/api/v1');
    expect(log.status).toBe(200);
    expect(typeof log.durationMs).toBe('number');
    expect(log.requestId).toBe('request-logging-1');
    expect(log.upstream).toBe('gateway');
    expect(log.retryCount).toBe(0);
    expect(log.fallbackUsed).toBe(false);
  });

  it('applies in-memory rate limiting in local mode', async () => {
    let lastResponse = new Response();
    for (let i = 0; i < 301; i += 1) {
      lastResponse = await app.handle(
        new Request('http://localhost/api/v1', {
          headers: { 'x-forwarded-for': '203.0.113.10' },
        }),
      );
    }

    expect(lastResponse.status).toBe(429);
    expect(lastResponse.headers.get('x-request-id')).toBeTruthy();
    expect(lastResponse.headers.get('x-ratelimit-limit')).toBe('300');
    expect(lastResponse.headers.get('x-ratelimit-remaining')).toBe('0');
    const body = (await lastResponse.json()) as { errorCode: string };
    expect(body.errorCode).toBe('GW_RATE_LIMITED');
  });

  it('allows public proxied auth routes without a token', async () => {
    let upstreamCalled = false;
    globalThis.fetch = (async () => {
      upstreamCalled = true;
      return new Response(JSON.stringify({ token: 'issued-upstream-token' }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const response = await app.handle(
      new Request('http://localhost/api/v1/auth/register', {
        method: 'POST',
      }),
    );

    expect(upstreamCalled).toBe(true);
    expect(response.status).toBe(201);
  });

  it('rejects protected routes without a token at the gateway', async () => {
    let upstreamCalled = false;
    globalThis.fetch = (async () => {
      upstreamCalled = true;
      return new Response('should not be called');
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/todos'));

    expect(upstreamCalled).toBe(false);
    expect(response.status).toBe(401);
    const body = (await response.json()) as { errorCode: string };
    expect(body.errorCode).toBe('GW_AUTH_REQUIRED');
  });

  it('rejects protected routes with invalid Bearer token format', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/v1/todos', {
        headers: { authorization: 'Bearer invalid' },
      }),
    );

    expect(response.status).toBe(401);
    const body = (await response.json()) as { errorCode: string; message: string };
    expect(body.errorCode).toBe('GW_AUTH_INVALID');
    expect(body.message).toContain('Bearer JWT format');
  });

  it('accepts a valid JWT, forwards authorization upstream, and does not log raw JWT', async () => {
    const token = signTestJwt({
      sub: 'user-123',
      email: 'user@example.com',
      exp: Math.floor(Date.now() / 1000) + 60,
    });
    let forwardedAuthorization: string | null = null;
    globalThis.fetch = (async (_input: string | URL | Request, init?: Parameters<typeof fetch>[1]) => {
      forwardedAuthorization = new Headers(init?.headers).get('authorization');
      return new Response(JSON.stringify({ todos: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const response = await app.handle(
      new Request('http://localhost/api/v1/todos', {
        headers: {
          authorization: `Bearer ${token}`,
          'x-request-id': 'request-auth-valid',
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(forwardedAuthorization ?? '').toBe(`Bearer ${token}`);
    expect(logLines.join('\n')).not.toContain(token);
    const log = JSON.parse(logLines.at(-1) ?? '{}') as Record<string, unknown>;
    expect(log.userIdHash).toBeTruthy();
    expect(log.userIdHash).not.toBe('user-123');
    expect(JSON.stringify(log)).not.toContain('user@example.com');
  });

  it('logs proxied route decisions, upstream latency, request id, and trace-linked spans', async () => {
    const token = signTestJwt({
      sub: 'user-456',
      exp: Math.floor(Date.now() / 1000) + 60,
    });
    let forwardedHeaders = new Headers();
    globalThis.fetch = (async (_input: string | URL | Request, init?: Parameters<typeof fetch>[1]) => {
      forwardedHeaders = new Headers(init?.headers);
      return new Response(JSON.stringify({ todos: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const response = await app.handle(
      new Request('http://localhost/api/v1/todos', {
        headers: {
          authorization: `Bearer ${token}`,
          baggage: 'tenant=demo',
          traceparent: '00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01',
          tracestate: 'todo=observability',
          'x-request-id': 'request-observe-proxy',
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(forwardedHeaders.get('traceparent')).toBe('00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01');
    expect(forwardedHeaders.get('tracestate')).toBe('todo=observability');
    expect(forwardedHeaders.get('baggage')).toBe('tenant=demo');
    expect(forwardedHeaders.get('x-request-id')).toBe('request-observe-proxy');

    const log = JSON.parse(logLines.at(-1) ?? '{}') as Record<string, unknown>;
    expect(log.requestId).toBe('request-observe-proxy');
    expect(log.routeId).toBe('todos.list');
    expect(log.upstream).toBe('bun-api');
    expect(typeof log.upstreamLatencyMs).toBe('number');
    expect(log.retryCount).toBe(0);
    expect(log.fallbackUsed).toBe(false);

    const spans = getRecordedSpans();
    const gatewaySpan = spans.find(span => span.name === 'gateway.request');
    const upstreamSpan = spans.find(span => span.name === 'gateway.upstream');
    expect(gatewaySpan?.serviceName).toBe('todo-api-gateway');
    expect(gatewaySpan?.traceparent).toBe('00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01');
    expect(gatewaySpan?.attributes['gateway.route_id']).toBe('todos.list');
    expect(gatewaySpan?.attributes['gateway.upstream']).toBe('bun-api');
    expect(gatewaySpan?.attributes['http.status_code']).toBe(200);
    expect(upstreamSpan?.attributes['gateway.route_id']).toBe('todos.list');
    expect(upstreamSpan?.attributes['gateway.upstream']).toBe('bun-api');
    expect(upstreamSpan?.attributes['http.status_code']).toBe(200);
  });

  it('keeps request id in gateway-generated error responses and error scenario logs', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/v1/missing', {
        headers: { 'x-request-id': 'request-error-observe' },
      }),
    );

    expect(response.status).toBe(404);
    const body = (await response.json()) as { requestId: string };
    expect(body.requestId).toBe('request-error-observe');
    expect(response.headers.get('x-request-id')).toBe('request-error-observe');

    const log = JSON.parse(logLines.at(-1) ?? '{}') as Record<string, unknown>;
    expect(log.requestId).toBe('request-error-observe');
    expect(log.path).toBe('/api/v1/missing');
    expect(log.status).toBe(404);
    expect(log.upstream).toBe('gateway');

    const gatewaySpan = getRecordedSpans().find(span => span.name === 'gateway.request');
    expect(gatewaySpan?.attributes['http.status_code']).toBe(404);
    expect(gatewaySpan?.attributes['http.route']).toBe('/api/v1/missing');
    expect(gatewaySpan?.attributes['gateway.upstream']).toBe('gateway');
  });
});

process.on('exit', () => {
  console.info = originalConsoleInfo;
  globalThis.fetch = originalFetch;
});
