import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AppModule = typeof import('../app');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type RateLimitModule = typeof import('../plugins/rate-limit');

let app: AppModule['app'];
let resetRateLimitBuckets: RateLimitModule['resetRateLimitBuckets'];
let logLines: string[];

const originalConsoleInfo = console.info;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-value';
  process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:8081';
  process.env.RATE_LIMIT_ENABLED = 'true';

  const appModule = await import('../app');
  const rateLimitModule = await import('../plugins/rate-limit');
  app = appModule.app;
  resetRateLimitBuckets = rateLimitModule.resetRateLimitBuckets;
});

beforeEach(() => {
  resetRateLimitBuckets();
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
});

process.on('exit', () => {
  console.info = originalConsoleInfo;
});
