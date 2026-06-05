import { Elysia } from 'elysia';

import { getAuthContext } from './auth-policy';
import { getRequestId } from './request-id';
import { GatewayError } from '../errors';
import { getGatewayRequestContext } from '../observability/request-context';
import { startGatewaySpan } from '../observability/telemetry';

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
  upstream: string;
  upstreamLatencyMs?: number;
  retryCount: number;
  fallbackUsed: boolean;
};

function statusFromSet(status: unknown): number {
  return typeof status === 'number' ? status : 200;
}

function statusFromError(error: unknown): number {
  return error instanceof GatewayError ? error.status : 500;
}

const logStates = new WeakMap<Request, { startedAt: number; endGatewaySpan: ReturnType<typeof startGatewaySpan> }>();

function getLogState(request: Request) {
  const existing = logStates.get(request);
  if (existing) return existing;
  const state = { startedAt: performance.now(), endGatewaySpan: startGatewaySpan(request) };
  logStates.set(request, state);
  return state;
}

function writeRequestLog(input: {
  path: string;
  request: Request;
  set: { headers: Record<string, unknown>; status?: unknown };
  startedAt: number;
  status: number;
  endGatewaySpan: ReturnType<typeof startGatewaySpan>;
}) {
  const { path, request, set, startedAt, status, endGatewaySpan } = input;
  const requestId = String(set.headers['x-request-id'] ?? getRequestId(request));
  const requestContext = getGatewayRequestContext(request);
  const log: GatewayLog = {
    level: 'info',
    event: 'gateway_request',
    method: request.method,
    path,
    routeId: requestContext.routeId ?? path,
    status,
    durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
    requestId,
    userIdHash: getAuthContext(request)?.userIdHash,
    upstream: requestContext.upstream ?? 'gateway',
    upstreamLatencyMs: requestContext.upstreamLatencyMs,
    retryCount: requestContext.retryCount ?? 0,
    fallbackUsed: requestContext.fallbackUsed ?? false,
  };

  endGatewaySpan(requestContext, status);
  console.info(JSON.stringify(log));
}

export const structuredLoggingPlugin = new Elysia({ name: 'structured-logging' })
  .derive(({ request }) => {
    getLogState(request);
    return {};
  })
  .onAfterHandle(({ path, request, set }) => {
    const { startedAt, endGatewaySpan } = getLogState(request);
    writeRequestLog({
      path,
      request,
      set,
      startedAt,
      status: statusFromSet(set.status),
      endGatewaySpan,
    });
  })
  .onError(({ error, path, request, set }) => {
    const { startedAt, endGatewaySpan } = getLogState(request);
    writeRequestLog({
      path,
      request,
      set,
      startedAt,
      status: statusFromError(error),
      endGatewaySpan,
    });
  })
  .as('global');
