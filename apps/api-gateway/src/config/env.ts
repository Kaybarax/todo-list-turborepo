// ---------------------------------------------------------------------------
// Typed environment configuration for the API Gateway
// ---------------------------------------------------------------------------

import {
  type AuthConfig,
  type Config,
  type CorsConfig,
  type GraphQLConfig,
  type ProxyConfig,
  type RateLimitingConfig,
  type ServerConfig,
  type UpstreamsConfig,
  parseBoolean,
  parseCsv,
  parseNonEmpty,
  parseOptionalURL,
  parsePositiveInt,
  parseURL,
  requireNonEmpty,
} from './validators';

export type {
  AuthConfig,
  Config,
  CorsConfig,
  GraphQLConfig,
  ProxyConfig,
  RateLimitingConfig,
  ServerConfig,
  UpstreamsConfig,
};
export { parseBoolean, parseCsv, parseNonEmpty, parseOptionalURL, parsePositiveInt, parseURL, requireNonEmpty };

export const DEFAULT_CORS_ALLOWED_HEADERS = [
  'content-type',
  'authorization',
  'x-request-id',
  'x-api-version',
  'x-environment',
  'traceparent',
  'tracestate',
  'baggage',
];

export const DEFAULT_CORS_ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

// ---------------------------------------------------------------------------
// Config object
// ---------------------------------------------------------------------------

export const config: Config = {
  server: {
    port: parsePositiveInt('PORT', process.env.PORT, 3003),
    publicPrefix: process.env.PUBLIC_API_PREFIX ?? '/api/v1',
  },
  upstreams: {
    nestApiUrl: parseURL('NEST_API_URL', process.env.NEST_API_URL, 'http://localhost:3001'),
    bunApiUrl: parseURL('BUN_API_URL', process.env.BUN_API_URL, 'http://localhost:3002'),
  },
  auth: {
    jwtSecret: requireNonEmpty('JWT_SECRET', process.env.JWT_SECRET),
    authValidateLocally: parseBoolean('AUTH_VALIDATE_LOCALLY', process.env.AUTH_VALIDATE_LOCALLY, true),
    authForwardAuthorization: parseBoolean('AUTH_FORWARD_AUTHORIZATION', process.env.AUTH_FORWARD_AUTHORIZATION, true),
  },
  cors: {
    origins: parseCsv('CORS_ORIGIN', requireNonEmpty('CORS_ORIGIN', process.env.CORS_ORIGIN), []),
    credentials: parseBoolean('CORS_CREDENTIALS', process.env.CORS_CREDENTIALS, true),
    allowedHeaders: parseCsv('CORS_ALLOWED_HEADERS', process.env.CORS_ALLOWED_HEADERS, DEFAULT_CORS_ALLOWED_HEADERS),
    allowedMethods: parseCsv('CORS_ALLOWED_METHODS', process.env.CORS_ALLOWED_METHODS, DEFAULT_CORS_ALLOWED_METHODS),
  },
  proxy: {
    proxyTimeoutMs: parsePositiveInt('PROXY_TIMEOUT_MS', process.env.PROXY_TIMEOUT_MS, 10000),
    bodyLimitBytes: parsePositiveInt('BODY_LIMIT_BYTES', process.env.BODY_LIMIT_BYTES, 1_048_576),
  },
  rateLimiting: {
    rateLimitEnabled: parseBoolean('RATE_LIMIT_ENABLED', process.env.RATE_LIMIT_ENABLED, true),
    windowMs: parsePositiveInt('RATE_LIMIT_WINDOW_MS', process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    max: parsePositiveInt('RATE_LIMIT_MAX', process.env.RATE_LIMIT_MAX, 300),
    redisUrl: parseOptionalURL('RATE_LIMIT_REDIS_URL', process.env.RATE_LIMIT_REDIS_URL),
  },
  graphql: {
    enabled: parseBoolean('GRAPHQL_ENABLED', process.env.GRAPHQL_ENABLED, false),
    path: parseNonEmpty('GRAPHQL_PATH', process.env.GRAPHQL_PATH, '/graphql'),
  },
};

export const { server, upstreams, auth, cors, proxy, rateLimiting, graphql } = config;
