import { ApiClientFactory } from '@todo/services';

const DEFAULT_GATEWAY_URL = 'http://localhost:3003';

/**
 * Get the API gateway base URL.
 */
export const getApiBaseUrl = (): string => {
  return process.env.EXPO_PUBLIC_API_GATEWAY_URL ?? process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_GATEWAY_URL;
};

/**
 * Global API client factory instance
 */
export const apiFactory = new ApiClientFactory({
  baseUrl: getApiBaseUrl(),
  environment: __DEV__ ? 'development' : 'production',
});

/**
 * Convenience export for the todo client
 */
export const todoClient = apiFactory.getTodoClient();

/**
 * Convenience export for the auth client
 */
export const authClient = apiFactory.getAuthClient();
