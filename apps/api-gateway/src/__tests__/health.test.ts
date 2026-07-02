import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AppModule = typeof import('../app');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type RateLimitModule = typeof import('../plugins/rate-limit');

let app: AppModule['app'];
let resetRateLimitBuckets: RateLimitModule['resetRateLimitBuckets'];

const originalFetch = globalThis.fetch;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-value';
  process.env.CORS_ORIGIN = 'http://localhost:3000';
  process.env.RATE_LIMIT_ENABLED = 'true';

  const appModule = await import('../app');
  const rateLimitModule = await import('../plugins/rate-limit');
  app = appModule.app;
  resetRateLimitBuckets = rateLimitModule.resetRateLimitBuckets;
});

beforeEach(() => {
  resetRateLimitBuckets();
  globalThis.fetch = originalFetch;
});

describe('GET /api/v1/health/ready — aggregated readiness', () => {
  it('returns all-up (ready) when every upstream is healthy', async () => {
    let callCount = 0;
    globalThis.fetch = (async () => {
      callCount += 1;
      return new Response(JSON.stringify({ status: 'ready' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      status: string;
      service: string;
      timestamp: string;
      upstreams: Array<{ id: string; serviceName: string; status: string; latency: number }>;
    };

    expect(body.status).toBe('ready');
    expect(body.service).toBe('api-gateway');
    expect(body.timestamp).toBeDefined();
    expect(body.upstreams).toHaveLength(2);
    expect(callCount).toBe(2);

    const nestApi = body.upstreams.find(u => u.id === 'nest-api');
    const bunApi = body.upstreams.find(u => u.id === 'bun-api');

    expect(nestApi?.status).toBe('healthy');
    expect(nestApi?.serviceName).toBe('todo-api');
    expect(typeof nestApi?.latency).toBe('number');

    expect(bunApi?.status).toBe('healthy');
    expect(bunApi?.serviceName).toBe('todo-api-bun');
    expect(typeof bunApi?.latency).toBe('number');
  });

  it('returns partial-down when one upstream is healthy and one is unhealthy', async () => {
    let callIndex = -1;
    globalThis.fetch = (async () => {
      callIndex += 1;
      if (callIndex === 0) {
        // First upstream (nest-api) fails
        return new Response('Service Unavailable', { status: 503 });
      }
      // Second upstream (bun-api) succeeds
      return new Response(JSON.stringify({ status: 'ready' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      status: string;
      upstreams: Array<{ id: string; status: string; latency: number; error?: string }>;
    };

    expect(body.status).toBe('partial-down');
    expect(body.upstreams).toHaveLength(2);

    const nestApi = body.upstreams.find(u => u.id === 'nest-api');
    const bunApi = body.upstreams.find(u => u.id === 'bun-api');

    expect(nestApi?.status).toBe('unhealthy');
    expect(nestApi?.error).toBeDefined();
    expect(typeof nestApi?.latency).toBe('number');

    expect(bunApi?.status).toBe('healthy');
    expect(bunApi?.error).toBeUndefined();
    expect(typeof bunApi?.latency).toBe('number');
  });

  it('returns all-down when every upstream is unhealthy', async () => {
    globalThis.fetch = (async () => {
      return new Response('Service Unavailable', { status: 503 });
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      status: string;
      upstreams: Array<{ id: string; status: string; latency: number; error?: string }>;
    };

    expect(body.status).toBe('all-down');
    expect(body.upstreams).toHaveLength(2);

    for (const upstream of body.upstreams) {
      expect(upstream.status).toBe('unhealthy');
      expect(upstream.error).toBeDefined();
      expect(typeof upstream.latency).toBe('number');
    }
  });

  it('includes per-upstream id, serviceName, status, latency, and error for unhealthy upstreams', async () => {
    globalThis.fetch = (async () => {
      return new Response('Bad Gateway', { status: 502 });
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));
    const body = (await response.json()) as {
      upstreams: Array<{
        id: string;
        serviceName: string;
        status: string;
        latency: number;
        error?: string;
      }>;
    };

    for (const upstream of body.upstreams) {
      expect(upstream.id).toBeOneOf(['nest-api', 'bun-api']);
      expect(upstream.serviceName).toBeOneOf(['todo-api', 'todo-api-bun']);
      expect(upstream.status).toBe('unhealthy');
      expect(typeof upstream.latency).toBe('number');
      expect(upstream.error).toBe('HTTP 502');
    }
  });

  it('preserves existing gateway health metadata endpoint', async () => {
    const response = await app.handle(new Request('http://localhost/api/v1/health'));

    expect(response.status).toBe(200);
    const body = (await response.json()) as { service: string; version: string; timestamp: string };
    expect(body.service).toBe('api-gateway');
    expect(body.version).toBe('0.0.1');
    expect(body.timestamp).toBeDefined();
  });

  it('preserves existing gateway index endpoint', async () => {
    const response = await app.handle(new Request('http://localhost/api/v1'));

    expect(response.status).toBe(200);
    const body = (await response.json()) as { service: string; version: string; timestamp: string };
    expect(body.service).toBe('api-gateway');
    expect(body.version).toBe('0.0.1');
    expect(body.timestamp).toBeDefined();
  });
});
