import { Elysia } from 'elysia';

import { getAuthContext } from './auth-policy';
import { getRequestId } from './request-id';

type GatewayLog = {
  level: 'info';
  event: 'gateway_request';
  method: string;
  path: string;
  routeId: string;
  status: number;
  durationMs: number;
  requestId: string;
  userIdHash?: string;
  upstream: 'gateway';
};

function statusFromSet(status: unknown): number {
  return typeof status === 'number' ? status : 200;
}

export const structuredLoggingPlugin = new Elysia({ name: 'structured-logging' })
  .derive(() => ({ startedAt: performance.now() }))
  .onAfterHandle(({ path, request, set, startedAt }) => {
    const requestId = String(set.headers['x-request-id'] ?? getRequestId(request));
    const log: GatewayLog = {
      level: 'info',
      event: 'gateway_request',
      method: request.method,
      path,
      routeId: path,
      status: statusFromSet(set.status),
      durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
      requestId,
      userIdHash: getAuthContext(request)?.userIdHash,
      upstream: 'gateway',
    };

    console.info(JSON.stringify(log));
  })
  .as('global');
