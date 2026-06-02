import { Elysia } from 'elysia';

import { config } from '../config/env';

function resolveOrigin(origin: string | null): string | undefined {
  if (!origin) return undefined;
  if (config.cors.origins.includes('*')) return origin;
  return config.cors.origins.includes(origin) ? origin : undefined;
}

function applyCorsHeaders(headers: Record<string, string | number>, origin: string): void {
  headers['access-control-allow-origin'] = origin;
  headers['access-control-allow-methods'] = config.cors.allowedMethods.join(', ');
  headers['access-control-allow-headers'] = config.cors.allowedHeaders.join(', ');
  headers['access-control-expose-headers'] = 'x-request-id';
  headers.vary = 'Origin';

  if (config.cors.credentials) {
    headers['access-control-allow-credentials'] = 'true';
  }
}

export const corsPolicyPlugin = new Elysia({ name: 'cors-policy' })
  .onRequest(({ request, set }) => {
    const allowedOrigin = resolveOrigin(request.headers.get('origin'));
    if (allowedOrigin) {
      applyCorsHeaders(set.headers, allowedOrigin);
    }

    if (request.method === 'OPTIONS') {
      set.status = 204;
      return new Response(null, {
        status: 204,
        headers: Object.fromEntries(Object.entries(set.headers).map(([key, value]) => [key, String(value)])),
      });
    }

    return undefined;
  })
  .onAfterHandle(({ request, set }) => {
    const allowedOrigin = resolveOrigin(request.headers.get('origin'));
    if (allowedOrigin) {
      applyCorsHeaders(set.headers, allowedOrigin);
    }
  })
  .as('global');
