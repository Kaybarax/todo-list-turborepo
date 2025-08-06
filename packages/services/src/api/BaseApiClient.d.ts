import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiClientConfig, ApiResponse, RequestInterceptor, ResponseInterceptor, ErrorInterceptor, RetryConfig } from './types';
/**
 * Base API client with authentication, retry logic, and error handling
 */
export declare class BaseApiClient {
    protected client: AxiosInstance;
    protected config: Required<ApiClientConfig>;
    private authToken;
    private refreshToken;
    private requestInterceptors;
    private responseInterceptors;
    private errorInterceptors;
    /**
     * Create a new BaseApiClient
     * @param config - API client configuration
     */
    constructor(config: ApiClientConfig);
    /**
     * Set authentication token
     * @param token - JWT token
     * @param refreshToken - Refresh token (optional)
     */
    setAuthToken(token: string, refreshToken?: string): void;
    /**
     * Clear authentication token
     */
    clearAuthToken(): void;
    /**
     * Get current authentication token
     */
    getAuthToken(): string | null;
    /**
     * Add request interceptor
     * @param interceptor - Request interceptor function
     */
    addRequestInterceptor(interceptor: RequestInterceptor): void;
    /**
     * Add response interceptor
     * @param interceptor - Response interceptor function
     */
    addResponseInterceptor(interceptor: ResponseInterceptor): void;
    /**
     * Add error interceptor
     * @param interceptor - Error interceptor function
     */
    addErrorInterceptor(interceptor: ErrorInterceptor): void;
    /**
     * Make a GET request
     * @param url - Request URL
     * @param config - Request configuration
     */
    get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * Make a POST request
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     */
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * Make a PUT request
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     */
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * Make a PATCH request
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     */
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * Make a DELETE request
     * @param url - Request URL
     * @param config - Request configuration
     */
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * Make a request with retry logic
     * @param method - HTTP method
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     * @param retryConfig - Retry configuration
     */
    protected request<T>(method: string, url: string, data?: any, config?: AxiosRequestConfig, retryConfig?: RetryConfig): Promise<ApiResponse<T>>;
    /**
     * Setup axios interceptors
     */
    private setupInterceptors;
    /**
     * Handle successful response
     * @param response - Axios response
     */
    private handleResponse;
    /**
     * Handle error response
     * @param error - Error object
     */
    private handleError;
    /**
     * Determine if a request should be retried
     * @param error - Error object
     */
    private shouldRetry;
    /**
     * Refresh authentication token
     */
    private refreshAuthToken;
    /**
     * Sleep for a specified duration
     * @param ms - Duration in milliseconds
     */
    private sleep;
}
//# sourceMappingURL=BaseApiClient.d.ts.map