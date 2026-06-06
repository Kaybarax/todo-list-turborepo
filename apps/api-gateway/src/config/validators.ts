// ---------------------------------------------------------------------------
// Environment variable validation helpers (no process.env dependency)
// ---------------------------------------------------------------------------

export interface ServerConfig {
  port: number;
  publicPrefix: string;
}

export interface UpstreamsConfig {
  nestApiUrl: string;
  bunApiUrl: string;
}

export interface AuthConfig {
  jwtSecret: string;
  authValidateLocally: boolean;
  authForwardAuthorization: boolean;
}

export interface CorsConfig {
  origins: string[];
  credentials: boolean;
  allowedHeaders: string[];
  allowedMethods: string[];
}

export interface ProxyConfig {
  proxyTimeoutMs: number;
  bodyLimitBytes: number;
}

export interface RateLimitingConfig {
  rateLimitEnabled: boolean;
  windowMs: number;
  max: number;
  redisUrl: string | null;
}

export interface GraphQLConfig {
  enabled: boolean;
  path: string;
}

export interface Config {
  server: ServerConfig;
  upstreams: UpstreamsConfig;
  auth: AuthConfig;
  cors: CorsConfig;
  proxy: ProxyConfig;
  rateLimiting: RateLimitingConfig;
  graphql: GraphQLConfig;
}

export function requireNonEmpty(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function parseNonEmpty(_key: string, value: string | undefined, defaultVal: string): string {
  if (value === undefined || value.trim() === '') return defaultVal;
  return value;
}

export function parsePositiveInt(key: string, value: string | undefined, defaultVal: number): number {
  if (value === undefined || value === '') return defaultVal;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${key} must be a positive integer, got: ${value}`);
  }
  return parsed;
}

export function parseURL(key: string, value: string | undefined, defaultVal: string): string {
  if (value === undefined || value === '') return defaultVal;
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`Environment variable ${key} must be a valid URL, got: ${value}`);
  }
}

export function parseOptionalURL(key: string, value: string | undefined): string | null {
  if (value === undefined || value === '') return null;
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`Environment variable ${key} must be a valid URL, got: ${value}`);
  }
}

export function parseBoolean(key: string, value: string | undefined, defaultVal: boolean): boolean {
  if (value === undefined || value === '') return defaultVal;
  const lower = value.toLowerCase();
  if (lower === 'true') return true;
  if (lower === 'false') return false;
  throw new Error(`Environment variable ${key} must be "true" or "false", got: ${value}`);
}

export function parseCsv(key: string, value: string | undefined, defaultVal: string[]): string[] {
  const source = value === undefined || value === '' ? defaultVal.join(',') : value;
  const values = source
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  if (values.length === 0) {
    throw new Error(`Environment variable ${key} must include at least one value`);
  }

  return values;
}
