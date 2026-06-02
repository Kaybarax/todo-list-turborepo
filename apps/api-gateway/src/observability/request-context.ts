export type GatewayRequestContext = {
  routeId?: string;
  upstream?: 'gateway' | string;
  upstreamLatencyMs?: number;
  retryCount?: number;
  fallbackUsed?: boolean;
};

const requestContexts = new WeakMap<Request, GatewayRequestContext>();

export function mergeGatewayRequestContext(request: Request, patch: GatewayRequestContext): GatewayRequestContext {
  const next = { ...(requestContexts.get(request) ?? {}), ...patch };
  requestContexts.set(request, next);
  return next;
}

export function getGatewayRequestContext(request: Request): GatewayRequestContext {
  return requestContexts.get(request) ?? {};
}
