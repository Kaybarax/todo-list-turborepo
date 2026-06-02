import { Elysia } from 'elysia';

import { routeTable } from '../config/route-table';
import { GatewayMethodNotAllowedError, GatewayRouteNotFoundError } from '../errors';
import { enforceAuthPolicy } from '../plugins/auth-policy';
import { proxyRequest } from '../proxy/proxy';
import { matchRoute } from '../routing/matcher';

async function handleProxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const match = matchRoute(routeTable, request.method, url.pathname);
  if (!match) {
    throw new GatewayRouteNotFoundError(url.pathname);
  }
  if (!match.methodAllowed) {
    throw new GatewayMethodNotAllowedError(url.pathname);
  }
  if (match.route.upstream === 'gateway') {
    throw new GatewayRouteNotFoundError(url.pathname);
  }

  enforceAuthPolicy(request, match.route);
  return proxyRequest(request, match);
}

export const restProxyRoute = new Elysia().all('/api/v1/*', ({ request }) => handleProxy(request));
