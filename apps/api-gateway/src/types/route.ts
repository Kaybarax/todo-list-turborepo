import { type UpstreamId } from './upstream';

export type GatewayMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type GatewayAuthPolicy = 'public' | 'required' | 'optional';
export type RouteOwner = 'gateway' | 'api' | 'api-bun';
export type OpenApiSource = 'gateway' | 'nest-openapi' | 'bun-openapi';

export interface GatewayOpenApiMetadata {
  source: OpenApiSource;
  operationId: string;
  summary: string;
  responseShape: string;
}

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
  openapi: GatewayOpenApiMetadata;
}

export interface RouteMatch {
  route: GatewayRoute;
  params: Record<string, string>;
  methodAllowed: boolean;
}
