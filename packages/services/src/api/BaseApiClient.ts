import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  ApiClientConfig,
  ApiResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  RetryConfig,
} from './types';
import { ApiError } from './ApiError';

/**
 * Base API client with authentication, retry logic, and error handling
 */
export class BaseApiClient {
  protected client: AxiosInstance;
  protected config: Required<ApiClientConfig>;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  /**
   * Create a new BaseApiClient
   * @param config - API client configuration
   */
  constructor(config: ApiClientConfig) {
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
  setAuthToken(token: string, refreshToken?: string): void {
    this.authToken = token;
    this.refreshToken = refreshToken || null;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    this.refreshToken = null;
  }

  /**
   * Get current authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Add request interceptor
   * @param interceptor - Request interceptor function
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param interceptor - Response interceptor function
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   * @param interceptor - Error interceptor function
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Make a GET request
   * @param url - Request URL
   * @param config - Request configuration
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  /**
   * Make a POST request
   * @param url - Request URL
   * @param data - Request data
   * @param config - Request configuration
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  /**
   * Make a PUT request
   * @param url - Request URL
   * @param data - Request data
   * @param config - Request configuration
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  /**
   * Make a PATCH request
   * @param url - Request URL
   * @param data - Request data
   * @param config - Request configuration
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  /**
   * Make a DELETE request
   * @param url - Request URL
   * @param config - Request configuration
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  /**
   * Make a request with retry logic
   * @param method - HTTP method
   * @param url - Request URL
   * @param data - Request data
   * @param config - Request configuration
   * @param retryConfig - Retry configuration
   */
  protected async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryConfig?: RetryConfig,
  ): Promise<ApiResponse<T>> {
    const retry = {
      attempts: this.config.retryAttempts,
      delay: this.config.retryDelay,
      backoff: 'exponential' as const,
      retryCondition: this.shouldRetry.bind(this),
      ...retryConfig,
    };

    let lastError: any;

    for (let attempt = 0; attempt <= retry.attempts; attempt++) {
      try {
        const response = await this.client.request({
          method,
          url,
          data,
          ...config,
        });

        return this.handleResponse<T>(response);
      } catch (error) {
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
        const delay = retry.backoff === 'exponential' ? retry.delay * Math.pow(2, attempt) : retry.delay;

        // Wait before retrying
        await this.sleep(delay);
      }
    }

    throw this.handleError(lastError);
  }

  /**
   * Setup axios interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      async config => {
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
      },
      error => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      async response => {
        // Apply custom response interceptors
        let modifiedResponse = response;
        for (const interceptor of this.responseInterceptors) {
          modifiedResponse = await interceptor(modifiedResponse);
        }

        return modifiedResponse;
      },
      async error => {
        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAuthToken();
            // Retry the original request
            return this.client.request(error.config);
          } catch (refreshError) {
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
      },
    );
  }

  /**
   * Handle successful response
   * @param response - Axios response
   */
  private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    const data = response.data;

    // If the response is already in our ApiResponse format
    if (data && typeof data === 'object' && 'success' in data) {
      return data as ApiResponse<T>;
    }

    // Wrap the response in our ApiResponse format
    return {
      success: true,
      data: data as T,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle error response
   * @param error - Error object
   */
  private handleError(error: any): ApiError {
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
  private shouldRetry(error: any): boolean {
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
  private async refreshAuthToken(): Promise<void> {
    if (!this.refreshToken) {
      throw ApiError.authenticationError('No refresh token available');
    }

    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken: this.refreshToken,
      });

      const { token, refreshToken } = response.data;
      this.setAuthToken(token, refreshToken);
    } catch (error) {
      throw ApiError.authenticationError('Failed to refresh token');
    }
  }

  /**
   * Sleep for a specified duration
   * @param ms - Duration in milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
