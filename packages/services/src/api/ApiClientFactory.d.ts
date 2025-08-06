import { ApiClientConfig } from './types';
import { BaseApiClient } from './BaseApiClient';
import { TodoApiClient } from './TodoApiClient';
import { AuthApiClient } from './AuthApiClient';
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
export declare class ApiClientFactory {
    private config;
    private clients;
    /**
     * Create a new ApiClientFactory
     * @param config - Factory configuration
     */
    constructor(config: ApiClientFactoryConfig);
    /**
     * Get or create a TodoApiClient
     */
    getTodoClient(): TodoApiClient;
    /**
     * Get or create an AuthApiClient
     */
    getAuthClient(): AuthApiClient;
    /**
     * Get or create a BaseApiClient for custom endpoints
     */
    getBaseClient(): BaseApiClient;
    /**
     * Set authentication token for all clients
     * @param token - JWT token
     * @param refreshToken - Refresh token (optional)
     */
    setAuthToken(token: string, refreshToken?: string): void;
    /**
     * Clear authentication token from all clients
     */
    clearAuthToken(): void;
    /**
     * Add request interceptor to all clients
     * @param interceptor - Request interceptor function
     */
    addGlobalRequestInterceptor(interceptor: (config: any) => any | Promise<any>): void;
    /**
     * Add response interceptor to all clients
     * @param interceptor - Response interceptor function
     */
    addGlobalResponseInterceptor(interceptor: (response: any) => any | Promise<any>): void;
    /**
     * Add error interceptor to all clients
     * @param interceptor - Error interceptor function
     */
    addGlobalErrorInterceptor(interceptor: (error: any) => any | Promise<any>): void;
    /**
     * Get current configuration
     */
    getConfig(): Required<ApiClientFactoryConfig>;
    /**
     * Update configuration for all clients
     * @param updates - Configuration updates
     */
    updateConfig(updates: Partial<ApiClientFactoryConfig>): void;
    /**
     * Create a factory with environment-specific defaults
     * @param environment - Environment name
     * @param baseUrl - Base URL for the environment
     * @param overrides - Additional configuration overrides
     */
    static createForEnvironment(environment: 'development' | 'staging' | 'production', baseUrl: string, overrides?: Partial<ApiClientFactoryConfig>): ApiClientFactory;
    /**
     * Create a factory for local development
     * @param port - Local server port (default: 3001)
     * @param overrides - Additional configuration overrides
     */
    static createForDevelopment(port?: number, overrides?: Partial<ApiClientFactoryConfig>): ApiClientFactory;
}
//# sourceMappingURL=ApiClientFactory.d.ts.map