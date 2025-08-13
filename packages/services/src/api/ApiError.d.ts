import { ApiErrorResponse } from './types';
/**
 * API error types
 */
export declare enum ApiErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  AUTHORIZATION_ERROR = 'authorization_error',
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND_ERROR = 'not_found_error',
  SERVER_ERROR = 'server_error',
  UNKNOWN_ERROR = 'unknown_error',
}
/**
 * Custom API error class
 */
export declare class ApiError extends Error {
  type: ApiErrorType;
  statusCode?: number;
  originalError?: unknown;
  response?: ApiErrorResponse;
  /**
   * Create a new ApiError
   * @param type - Error type
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param originalError - Original error object
   * @param response - API error response
   */
  constructor(
    type: ApiErrorType,
    message: string,
    statusCode?: number,
    originalError?: unknown,
    response?: ApiErrorResponse,
  );
  /**
   * Create a network error
   * @param message - Error message
   * @param originalError - Original error object
   */
  static networkError(message: string, originalError?: unknown): ApiError;
  /**
   * Create a timeout error
   * @param message - Error message
   * @param originalError - Original error object
   */
  static timeoutError(message: string, originalError?: unknown): ApiError;
  /**
   * Create an authentication error
   * @param message - Error message
   * @param response - API error response
   */
  static authenticationError(message: string, response?: ApiErrorResponse): ApiError;
  /**
   * Create an authorization error
   * @param message - Error message
   * @param response - API error response
   */
  static authorizationError(message: string, response?: ApiErrorResponse): ApiError;
  /**
   * Create a validation error
   * @param message - Error message
   * @param response - API error response
   */
  static validationError(message: string, response?: ApiErrorResponse): ApiError;
  /**
   * Create a not found error
   * @param message - Error message
   * @param response - API error response
   */
  static notFoundError(message: string, response?: ApiErrorResponse): ApiError;
  /**
   * Create a server error
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param response - API error response
   */
  static serverError(message: string, statusCode?: number, response?: ApiErrorResponse): ApiError;
  /**
   * Create an unknown error
   * @param message - Error message
   * @param originalError - Original error object
   */
  static unknownError(message: string, originalError?: unknown): ApiError;
  /**
   * Create an ApiError from an HTTP response
   * @param status - HTTP status code
   * @param data - Response data
   * @param originalError - Original error object
   */
  static fromResponse(status: number, data: any, originalError?: unknown): ApiError;
}
//# sourceMappingURL=ApiError.d.ts.map
