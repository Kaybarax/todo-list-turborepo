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
