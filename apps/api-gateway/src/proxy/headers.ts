import { getCorrelationId, getRequestId } from '../plugins/request-id';
import { type GatewayRoute } from '../types/route';

const FORWARDED_HEADERS = new Set([
  'authorization',
  'content-type',
  'accept',
  'accept-language',
  'user-agent',
  'x-request-id',
  'x-correlation-id',
  'traceparent',
  'tracestate',
  'baggage',
  'x-environment',
  'x-api-version',
]);

const HOP_BY_HOP_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
]);

export function buildProxyHeaders(request: Request, route: GatewayRoute): Headers {
  const headers = new Headers();
  for (const [name, value] of request.headers.entries()) {
    const lowerName = name.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lowerName)) continue;
    if (FORWARDED_HEADERS.has(lowerName)) {
      headers.set(lowerName, value);
    }
  }

  const url = new URL(request.url);
  headers.set('x-gateway-service', 'todo-api-gateway');
  headers.set('x-gateway-route', route.id);
  headers.set('x-forwarded-host', request.headers.get('host') ?? url.host);
  headers.set('x-forwarded-proto', url.protocol.replace(':', ''));
  headers.set('x-forwarded-for', request.headers.get('x-forwarded-for') ?? '127.0.0.1');

  // Ensure correlation ID is always forwarded (it may only exist on set.headers, not request.headers)
  if (!headers.has('x-correlation-id')) {
    headers.set('x-correlation-id', getCorrelationId(request));
  }

  return headers;
}
