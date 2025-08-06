import axios from 'axios';
import { ApiError } from './ApiError';
/**
 * Base API client with authentication, retry logic, and error handling
 */
export class BaseApiClient {
    client;
    config;
    authToken = null;
    refreshToken = null;
    requestInterceptors = [];
    responseInterceptors = [];
    errorInterceptors = [];
    /**
     * Create a new BaseApiClient
     * @param config - API client configuration
     */
    constructor(config) {
        this.config = {
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000,
            defaultHeaders: {},
            ...config,
        };
        this.client = axios.create({
            baseURL: this.config.baseUrl,
            timeout: this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...this.config.defaultHeaders,
            },
        });
        this.setupInterceptors();
    }
    /**
     * Set authentication token
     * @param token - JWT token
     * @param refreshToken - Refresh token (optional)
     */
    setAuthToken(token, refreshToken) {
        this.authToken = token;
        this.refreshToken = refreshToken || null;
    }
    /**
     * Clear authentication token
     */
    clearAuthToken() {
        this.authToken = null;
        this.refreshToken = null;
    }
    /**
     * Get current authentication token
     */
    getAuthToken() {
        return this.authToken;
    }
    /**
     * Add request interceptor
     * @param interceptor - Request interceptor function
     */
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    /**
     * Add response interceptor
     * @param interceptor - Response interceptor function
     */
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
    /**
     * Add error interceptor
     * @param interceptor - Error interceptor function
     */
    addErrorInterceptor(interceptor) {
        this.errorInterceptors.push(interceptor);
    }
    /**
     * Make a GET request
     * @param url - Request URL
     * @param config - Request configuration
     */
    async get(url, config) {
        return this.request('GET', url, undefined, config);
    }
    /**
     * Make a POST request
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     */
    async post(url, data, config) {
        return this.request('POST', url, data, config);
    }
    /**
     * Make a PUT request
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     */
    async put(url, data, config) {
        return this.request('PUT', url, data, config);
    }
    /**
     * Make a PATCH request
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     */
    async patch(url, data, config) {
        return this.request('PATCH', url, data, config);
    }
    /**
     * Make a DELETE request
     * @param url - Request URL
     * @param config - Request configuration
     */
    async delete(url, config) {
        return this.request('DELETE', url, undefined, config);
    }
    /**
     * Make a request with retry logic
     * @param method - HTTP method
     * @param url - Request URL
     * @param data - Request data
     * @param config - Request configuration
     * @param retryConfig - Retry configuration
     */
    async request(method, url, data, config, retryConfig) {
        const retry = {
            attempts: this.config.retryAttempts,
            delay: this.config.retryDelay,
            backoff: 'exponential',
            retryCondition: this.shouldRetry.bind(this),
            ...retryConfig,
        };
        let lastError;
        for (let attempt = 0; attempt <= retry.attempts; attempt++) {
            try {
                const response = await this.client.request({
                    method,
                    url,
                    data,
                    ...config,
                });
                return this.handleResponse(response);
            }
            catch (error) {
                lastError = error;
                // Don't retry on the last attempt
                if (attempt === retry.attempts) {
                    break;
                }
                // Check if we should retry
                if (!retry.retryCondition(error)) {
                    break;
                }
                // Calculate delay
                const delay = retry.backoff === 'exponential'
                    ? retry.delay * Math.pow(2, attempt)
                    : retry.delay;
                // Wait before retrying
                await this.sleep(delay);
            }
        }
        throw this.handleError(lastError);
    }
    /**
     * Setup axios interceptors
     */
    setupInterceptors() {
        // Request interceptor for authentication
        this.client.interceptors.request.use(async (config) => {
            // Add authentication header
            if (this.authToken) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${this.authToken}`;
            }
            // Apply custom request interceptors
            let modifiedConfig = config;
            for (const interceptor of this.requestInterceptors) {
                modifiedConfig = await interceptor(modifiedConfig);
            }
            return modifiedConfig;
        }, (error) => Promise.reject(error));
        // Response interceptor
        this.client.interceptors.response.use(async (response) => {
            // Apply custom response interceptors
            let modifiedResponse = response;
            for (const interceptor of this.responseInterceptors) {
                modifiedResponse = await interceptor(modifiedResponse);
            }
            return modifiedResponse;
        }, async (error) => {
            // Handle token refresh for 401 errors
            if (error.response?.status === 401 && this.refreshToken) {
                try {
                    await this.refreshAuthToken();
                    // Retry the original request
                    return this.client.request(error.config);
                }
                catch (refreshError) {
                    // Refresh failed, clear tokens
                    this.clearAuthToken();
                    throw refreshError;
                }
            }
            // Apply custom error interceptors
            let modifiedError = error;
            for (const interceptor of this.errorInterceptors) {
                modifiedError = await interceptor(modifiedError);
            }
            return Promise.reject(modifiedError);
        });
    }
    /**
     * Handle successful response
     * @param response - Axios response
     */
    handleResponse(response) {
        const data = response.data;
        // If the response is already in our ApiResponse format
        if (data && typeof data === 'object' && 'success' in data) {
            return data;
        }
        // Wrap the response in our ApiResponse format
        return {
            success: true,
            data: data,
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Handle error response
     * @param error - Error object
     */
    handleError(error) {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return ApiError.timeoutError('Request timeout', error);
        }
        if (!error.response) {
            return ApiError.networkError('Network error', error);
        }
        const { status, data } = error.response;
        return ApiError.fromResponse(status, data, error);
    }
    /**
     * Determine if a request should be retried
     * @param error - Error object
     */
    shouldRetry(error) {
        // Don't retry client errors (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
            return false;
        }
        // Retry network errors and server errors (5xx)
        return !error.response || error.response.status >= 500;
    }
    /**
     * Refresh authentication token
     */
    async refreshAuthToken() {
        if (!this.refreshToken) {
            throw ApiError.authenticationError('No refresh token available');
        }
        try {
            const response = await this.client.post('/auth/refresh', {
                refreshToken: this.refreshToken,
            });
            const { token, refreshToken } = response.data;
            this.setAuthToken(token, refreshToken);
        }
        catch (error) {
            throw ApiError.authenticationError('Failed to refresh token');
        }
    }
    /**
     * Sleep for a specified duration
     * @param ms - Duration in milliseconds
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=BaseApiClient.js.map