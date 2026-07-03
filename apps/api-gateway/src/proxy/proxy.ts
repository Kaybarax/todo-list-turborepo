import { buildProxyHeaders } from './headers';
import { shouldRetry } from './retry-policy';
import { buildProxyUrl } from './url';
import { upstreams } from '../config/upstreams';
import { GatewayUpstreamTimeoutError, GatewayUpstreamUnavailableError } from '../errors';
import { mergeGatewayRequestContext } from '../observability/request-context';
import { startUpstreamSpan } from '../observability/telemetry';
import { type GatewayRoute, type RouteMatch } from '../types/route';
import { type Upstream } from '../types/upstream';

type FetchInit = Parameters<typeof fetch>[1];
type Fetcher = (input: string | URL | Request, init?: FetchInit) => Promise<Response>;

function requestBody(request: Request): NonNullable<FetchInit>['body'] {
  if (['GET', 'HEAD'].includes(request.method.toUpperCase())) return undefined;
  return request.body;
}

async function fetchWithTimeout(fetcher: Fetcher, url: URL, init: FetchInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetcher(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new GatewayUpstreamTimeoutError();
    }
    throw new GatewayUpstreamUnavailableError();
  } finally {
    clearTimeout(timeout);
  }
}

function debugHeaders(request: Request, response: Response, route: GatewayRoute, upstream: Upstream): Response {
  const headers = new Headers(response.headers);
  headers.set('x-gateway-route', route.id);
  headers.set('x-gateway-upstream', upstream.id);
  headers.set('x-correlation-id', request.headers.get('x-correlation-id') ?? '');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function proxyRequest(request: Request, match: RouteMatch, fetcher: Fetcher = fetch): Promise<Response> {
  const route = match.route;
  if (route.upstream === 'gateway') {
    throw new GatewayUpstreamUnavailableError('Gateway-owned routes are not proxied');
  }

  const upstream = upstreams[route.upstream];
  const url = buildProxyUrl(request, route, upstream, match.params);
  const startedAt = performance.now();
  const endUpstreamSpan = startUpstreamSpan(request, {
    'gateway.route_id': route.id,
    'gateway.upstream': upstream.id,
    'http.route': route.publicPath,
  });
  const init: FetchInit = {
    method: request.method,
    headers: buildProxyHeaders(request, route),
    body: requestBody(request),
    redirect: 'manual',
  };

  let attempt = 0;
  while (true) {
    const response = await fetchWithTimeout(fetcher, url, init, route.timeoutMs);
    if (!shouldRetry(request.method, route, attempt, response)) {
      mergeGatewayRequestContext(request, {
        routeId: route.id,
        upstream: upstream.id,
        upstreamLatencyMs: Math.round((performance.now() - startedAt) * 100) / 100,
        retryCount: attempt,
        fallbackUsed: false,
      });
      endUpstreamSpan(response.status, attempt);
      return debugHeaders(request, response, route, upstream);
    }
    attempt += 1;
  }
}
