import { type GatewayRoute } from '../types/route';
import { type Upstream } from '../types/upstream';

function replaceParams(path: string, params: Record<string, string>): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => encodeURIComponent(params[key] ?? ''));
}

export function buildProxyUrl(
  request: Request,
  route: GatewayRoute,
  upstream: Upstream,
  params: Record<string, string>,
): URL {
  const incomingUrl = new URL(request.url);
  const upstreamPath = replaceParams(route.upstreamPath ?? route.publicPath, params);
  const url = new URL(upstreamPath, upstream.baseUrl);
  url.search = incomingUrl.search;
  return url;
}
