/**
 * Safely access environment variables in both Node.js and browser environments
 */
export function getEnvVar(key: string, defaultValue: string = ''): string {
  // Check if we're in a Node.js environment
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
      return (globalThis as any).process.env[key] ?? defaultValue;
    }
  } catch {
    // Ignore errors and fall back to default
  }

  // In browser environments, return the default value
  // In production, these would typically be injected at build time
  return defaultValue;
}

/**
 * Check if a required environment variable is set
 */
export function requireEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get environment variable as boolean
 */
export function getEnvVarAsBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  if (!value) return defaultValue;

  const lowerValue = value.toLowerCase();
  return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes';
}

/**
 * Get environment variable as number
 */
export function getEnvVarAsNumber(key: string, defaultValue: number = 0): number {
  const value = getEnvVar(key);
  if (!value) return defaultValue;

  const numValue = Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
}

/**
 * Check if we're running in development environment
 */
export function isDevelopment(): boolean {
  return getEnvVar('NODE_ENV') === 'development';
}

/**
 * Check if we're running in production environment
 */
export function isProduction(): boolean {
  return getEnvVar('NODE_ENV') === 'production';
}

/**
 * Check if we're running in test environment
 */
export function isTest(): boolean {
  return getEnvVar('NODE_ENV') === 'test';
}
