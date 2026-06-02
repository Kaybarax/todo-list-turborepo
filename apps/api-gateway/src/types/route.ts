import { type UpstreamId } from './upstream';

export type GatewayMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type GatewayAuthPolicy = 'public' | 'required' | 'optional';
export type RouteOwner = 'gateway' | 'api' | 'api-bun';

export interface GatewayRoute {
  id: string;
  publicPath: string;
  methods: GatewayMethod[];
  upstream: UpstreamId;
  upstreamPath?: string;
  auth: GatewayAuthPolicy;
  timeoutMs: number;
  retries: number;
  fallback?: UpstreamId;
  tags: string[];
  owner: RouteOwner;
}

export interface RouteMatch {
  route: GatewayRoute;
  params: Record<string, string>;
  methodAllowed: boolean;
}
