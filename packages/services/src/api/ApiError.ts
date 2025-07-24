import { ApiErrorResponse } from './types';

/**
 * API error types
 */
export enum ApiErrorType {
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
export class ApiError extends Error {
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
    response?: ApiErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.response = response;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Create a network error
   * @param message - Error message
   * @param originalError - Original error object
   */
  static networkError(message: string, originalError?: unknown): ApiError {
    return new ApiError(
      ApiErrorType.NETWORK_ERROR,
      message,
      undefined,
      originalError
    );
  }

  /**
   * Create a timeout error
   * @param message - Error message
   * @param originalError - Original error object
   */
  static timeoutError(message: string, originalError?: unknown): ApiError {
    return new ApiError(
      ApiErrorType.TIMEOUT_ERROR,
      message,
      408,
      originalError
    );
  }

  /**
   * Create an authentication error
   * @param message - Error message
   * @param response - API error response
   */
  static authenticationError(message: string, response?: ApiErrorResponse): ApiError {
    return new ApiError(
      ApiErrorType.AUTHENTICATION_ERROR,
      message,
      401,
      undefined,
      response
    );
  }

  /**
   * Create an authorization error
   * @param message - Error message
   * @param response - API error response
   */
  static authorizationError(message: string, response?: ApiErrorResponse): ApiError {
    return new ApiError(
      ApiErrorType.AUTHORIZATION_ERROR,
      message,
      403,
      undefined,
      response
    );
  }

  /**
   * Create a validation error
   * @param message - Error message
   * @param response - API error response
   */
  static validationError(message: string, response?: ApiErrorResponse): ApiError {
    return new ApiError(
      ApiErrorType.VALIDATION_ERROR,
      message,
      400,
      undefined,
      response
    );
  }

  /**
   * Create a not found error
   * @param message - Error message
   * @param response - API error response
   */
  static notFoundError(message: string, response?: ApiErrorResponse): ApiError {
    return new ApiError(
      ApiErrorType.NOT_FOUND_ERROR,
      message,
      404,
      undefined,
      response
    );
  }

  /**
   * Create a server error
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param response - API error response
   */
  static serverError(message: string, statusCode = 500, response?: ApiErrorResponse): ApiError {
    return new ApiError(
      ApiErrorType.SERVER_ERROR,
      message,
      statusCode,
      undefined,
      response
    );
  }

  /**
   * Create an unknown error
   * @param message - Error message
   * @param originalError - Original error object
   */
  static unknownError(message: string, originalError?: unknown): ApiError {
    return new ApiError(
      ApiErrorType.UNKNOWN_ERROR,
      message,
      undefined,
      originalError
    );
  }

  /**
   * Create an ApiError from an HTTP response
   * @param status - HTTP status code
   * @param data - Response data
   * @param originalError - Original error object
   */
  static fromResponse(status: number, data: any, originalError?: unknown): ApiError {
    const response = data as ApiErrorResponse;
    const message = response?.error || response?.message || 'An error occurred';

    if (status === 401) {
      return ApiError.authenticationError(message, response);
    } else if (status === 403) {
      return ApiError.authorizationError(message, response);
    } else if (status === 400) {
      return ApiError.validationError(message, response);
    } else if (status === 404) {
      return ApiError.notFoundError(message, response);
    } else if (status >= 500) {
      return ApiError.serverError(message, status, response);
    } else {
      return ApiError.unknownError(message, originalError);
    }
  }
}