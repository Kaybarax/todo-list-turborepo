import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AppModule = typeof import('../app');

let app: AppModule['app'];

const originalFetch = globalThis.fetch;

function mockFetchForHealth(upstreamStatuses: Record<string, { status: number; body?: string }>) {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    if (url.includes('localhost:3001')) {
      const config = upstreamStatuses['nest-api'] ?? { status: 200 };
      return new Response(config.body ?? JSON.stringify({ status: 'ready' }), {
        status: config.status,
        headers: { 'content-type': 'application/json' },
      });
    }
    if (url.includes('localhost:3002')) {
      const config = upstreamStatuses['bun-api'] ?? { status: 200 };
      return new Response(config.body ?? JSON.stringify({ status: 'ready' }), {
        status: config.status,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response('not found', { status: 404 });
  }) as unknown as typeof fetch;
}

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-value';
  process.env.CORS_ORIGIN = 'http://localhost:3000';

  ({ app } = await import('../app'));
});

beforeEach(() => {
  globalThis.fetch = originalFetch;
});

describe('health endpoints', () => {
  it('returns 200 with correct shape on GET /api/v1/health', async () => {
    mockFetchForHealth({
      'nest-api': { status: 200 },
      'bun-api': { status: 200 },
    });

    const response = await app.handle(new Request('http://localhost/api/v1/health'));
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      service: string;
      version: string;
      timestamp: string;
      upstreams: Record<string, { status: string; latencyMs: number | null; serviceName: string }>;
    };

    expect(body.service).toBe('api-gateway');
    expect(body.version).toBe('0.0.1');
    expect(body.timestamp).toBeDefined();
    expect(body.upstreams).toBeDefined();

    expect(body.upstreams['nest-api']).toBeDefined();
    expect(body.upstreams['nest-api'].status).toBe('healthy');
    expect(body.upstreams['nest-api'].serviceName).toBe('todo-api');
    expect(typeof body.upstreams['nest-api'].latencyMs).toBe('number');

    expect(body.upstreams['bun-api']).toBeDefined();
    expect(body.upstreams['bun-api'].status).toBe('healthy');
    expect(body.upstreams['bun-api'].serviceName).toBe('todo-api-bun');
    expect(typeof body.upstreams['bun-api'].latencyMs).toBe('number');
  });

  it('returns ready when all upstreams are healthy on GET /api/v1/health/ready', async () => {
    mockFetchForHealth({
      'nest-api': { status: 200 },
      'bun-api': { status: 200 },
    });

    const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      service: string;
      version: string;
      status: string;
      ready: boolean;
      upstreams: Record<string, { status: string }>;
    };

    expect(body.status).toBe('ready');
    expect(body.ready).toBe(true);
    expect(body.service).toBe('api-gateway');
    expect(body.version).toBe('0.0.1');
    expect(body.upstreams['nest-api'].status).toBe('healthy');
    expect(body.upstreams['bun-api'].status).toBe('healthy');
  });

  it('returns degraded when some upstreams are unhealthy on GET /api/v1/health/ready', async () => {
    mockFetchForHealth({
      'nest-api': { status: 200 },
    });

    globalThis.fetch = ((input: string | URL | Request) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

      if (url.includes('localhost:3001')) {
        return new Response(JSON.stringify({ status: 'ready' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      if (url.includes('localhost:3002')) {
        return Promise.reject(new TypeError('connection refused'));
      }
      return new Response('not found', { status: 404 });
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      status: string;
      ready: boolean;
      upstreams: Record<string, { status: string; error: string | null }>;
    };

    expect(body.status).toBe('degraded');
    expect(body.ready).toBe(false);
    expect(body.upstreams['nest-api'].status).toBe('healthy');
    expect(body.upstreams['bun-api'].status).toBe('unhealthy');
    expect(body.upstreams['bun-api'].error).toBeTruthy();
  });

  it('returns unhealthy when all upstreams are unhealthy on GET /api/v1/health/ready', async () => {
    globalThis.fetch = (async () => {
      return new Response('service unavailable', { status: 503 });
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      status: string;
      ready: boolean;
      upstreams: Record<string, { status: string }>;
    };

    expect(body.status).toBe('unhealthy');
    expect(body.ready).toBe(false);
    expect(body.upstreams['nest-api'].status).toBe('unhealthy');
    expect(body.upstreams['bun-api'].status).toBe('unhealthy');
  });

  it('handles upstream errors gracefully without crashing the gateway', async () => {
    globalThis.fetch = (async () => {
      throw new TypeError('fetch failed');
    }) as unknown as typeof fetch;

    const response = await app.handle(new Request('http://localhost/api/v1/health'));
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      upstreams: Record<string, { status: string; error: string | null }>;
    };

    expect(body.upstreams['nest-api'].status).toBe('unhealthy');
    expect(body.upstreams['nest-api'].error).toBeTruthy();
    expect(body.upstreams['bun-api'].status).toBe('unhealthy');
    expect(body.upstreams['bun-api'].error).toBeTruthy();
  });
});
