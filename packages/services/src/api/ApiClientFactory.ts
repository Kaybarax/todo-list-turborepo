import { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { AuthApiClient } from './AuthApiClient';
import { BaseApiClient } from './BaseApiClient';
import { TodoApiClient } from './TodoApiClient';
import { type ApiClientConfig } from './types';

/**
 * Configuration for API client factory
 */
export interface ApiClientFactoryConfig extends ApiClientConfig {
  /** Environment (development, staging, production) */
  environment?: 'development' | 'staging' | 'production';
  /** API version */
  version?: string;
}

/**
 * Factory for creating API clients
 */
export class ApiClientFactory {
  private config: Required<ApiClientFactoryConfig>;
  private clients: Map<string, BaseApiClient> = new Map();

  /**
   * Create a new ApiClientFactory
   * @param config - Factory configuration
   */
  constructor(config: ApiClientFactoryConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      defaultHeaders: {},
      environment: 'production',
      version: 'v1',
      ...config,
    };

    // Add version to base URL if not already present
    if (!this.config.baseUrl.includes('/api/')) {
      this.config.baseUrl = `${this.config.baseUrl}/api/${this.config.version}`;
    }

    // Add environment-specific headers
    this.config.defaultHeaders = {
      'X-Environment': this.config.environment,
      'X-API-Version': this.config.version,
      ...this.config.defaultHeaders,
    };
  }

  /**
   * Get or create a TodoApiClient
   */
  getTodoClient(): TodoApiClient {
    const key = 'todo';

    if (!this.clients.has(key)) {
      const client = new TodoApiClient(this.config);
      this.clients.set(key, client);
    }

    return this.clients.get(key) as TodoApiClient;
  }

  /**
   * Get or create an AuthApiClient
   */
  getAuthClient(): AuthApiClient {
    const key = 'auth';

    if (!this.clients.has(key)) {
      const client = new AuthApiClient(this.config);
      this.clients.set(key, client);
    }

    return this.clients.get(key) as AuthApiClient;
  }

  /**
   * Get or create a BaseApiClient for custom endpoints
   */
  getBaseClient(): BaseApiClient {
    const key = 'base';

    if (!this.clients.has(key)) {
      const client = new BaseApiClient(this.config);
      this.clients.set(key, client);
    }

    return this.clients.get(key) as BaseApiClient;
  }

  /**
   * Set authentication token for all clients
   * @param token - JWT token
   * @param refreshToken - Refresh token (optional)
   */
  setAuthToken(token: string, refreshToken?: string): void {
    this.clients.forEach(client => {
      client.setAuthToken(token, refreshToken);
    });
  }

  /**
   * Clear authentication token from all clients
   */
  clearAuthToken(): void {
    this.clients.forEach(client => {
      client.clearAuthToken();
    });
  }

  /**
   * Add request interceptor to all clients
   * @param interceptor - Request interceptor function
   */

  addGlobalRequestInterceptor(
    interceptor: (
      config: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  ): void {
    this.clients.forEach(client => {
      client.addRequestInterceptor(interceptor);
    });
  }

  /**
   * Add response interceptor to all clients
   * @param interceptor - Response interceptor function
   */

  addGlobalResponseInterceptor(interceptor: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>): void {
    this.clients.forEach(client => {
      client.addResponseInterceptor(interceptor);
    });
  }

  /**
   * Add error interceptor to all clients
   * @param interceptor - Error interceptor function
   */

  addGlobalErrorInterceptor(interceptor: (error: Error) => Error | Promise<Error>): void {
    this.clients.forEach(client => {
      client.addErrorInterceptor(interceptor);
    });
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<ApiClientFactoryConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration for all clients
   * @param updates - Configuration updates
   */
  updateConfig(updates: Partial<ApiClientFactoryConfig>): void {
    this.config = { ...this.config, ...updates };

    // Clear existing clients to force recreation with new config
    this.clients.clear();
  }

  /**
   * Create a factory with environment-specific defaults
   * @param environment - Environment name
   * @param baseUrl - Base URL for the environment
   * @param overrides - Additional configuration overrides
   */
  static createForEnvironment(
    environment: 'development' | 'staging' | 'production',
    baseUrl: string,
    overrides?: Partial<ApiClientFactoryConfig>,
  ): ApiClientFactory {
    const config: ApiClientFactoryConfig = {
      baseUrl,
      environment,
      timeout: environment === 'development' ? 60000 : 30000,
      retryAttempts: environment === 'development' ? 1 : 3,
      retryDelay: environment === 'development' ? 500 : 1000,
      ...overrides,
    };

    return new ApiClientFactory(config);
  }

  /**
   * Create a factory for local development
   * @param port - Local server port (default: 3001)
   * @param overrides - Additional configuration overrides
   */
  static createForDevelopment(port = 3001, overrides?: Partial<ApiClientFactoryConfig>): ApiClientFactory {
    return ApiClientFactory.createForEnvironment('development', `http://localhost:${port}`, overrides);
  }
}
