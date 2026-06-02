import { type GatewayMethod, type GatewayRoute, type RouteMatch } from '../types/route';

function splitPath(path: string): string[] {
  return path.replace(/\/+$/, '').split('/').filter(Boolean);
}

function matchPath(routePath: string, incomingPath: string): Record<string, string> | null {
  const routeParts = splitPath(routePath);
  const incomingParts = splitPath(incomingPath);
  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i += 1) {
    const routePart = routeParts[i];
    const incomingPart = incomingParts[i];
    if (routePart === '*') return params;
    if (!incomingPart) return null;
    if (routePart?.startsWith(':')) {
      params[routePart.slice(1)] = decodeURIComponent(incomingPart);
      continue;
    }
    if (routePart !== incomingPart) return null;
  }

  return routeParts.length === incomingParts.length ? params : null;
}

export function matchRoute(routes: readonly GatewayRoute[], method: string, pathname: string): RouteMatch | null {
  const normalizedMethod = method.toUpperCase() as GatewayMethod;
  let methodMismatch: RouteMatch | null = null;
  for (const route of routes) {
    const params = matchPath(route.publicPath, pathname);
    if (!params) continue;
    const methodAllowed = route.methods.includes(normalizedMethod);
    if (!methodAllowed) {
      methodMismatch ??= { route, params, methodAllowed };
      continue;
    }
    return {
      route,
      params,
      methodAllowed,
    };
  }

  return methodMismatch;
}
