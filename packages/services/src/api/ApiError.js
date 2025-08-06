/**
 * API error types
 */
export var ApiErrorType;
(function (ApiErrorType) {
    ApiErrorType["NETWORK_ERROR"] = "network_error";
    ApiErrorType["TIMEOUT_ERROR"] = "timeout_error";
    ApiErrorType["AUTHENTICATION_ERROR"] = "authentication_error";
    ApiErrorType["AUTHORIZATION_ERROR"] = "authorization_error";
    ApiErrorType["VALIDATION_ERROR"] = "validation_error";
    ApiErrorType["NOT_FOUND_ERROR"] = "not_found_error";
    ApiErrorType["SERVER_ERROR"] = "server_error";
    ApiErrorType["UNKNOWN_ERROR"] = "unknown_error";
})(ApiErrorType || (ApiErrorType = {}));
/**
 * Custom API error class
 */
export class ApiError extends Error {
    type;
    statusCode;
    originalError;
    response;
    /**
     * Create a new ApiError
     * @param type - Error type
     * @param message - Error message
     * @param statusCode - HTTP status code
     * @param originalError - Original error object
     * @param response - API error response
     */
    constructor(type, message, statusCode, originalError, response) {
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
    static networkError(message, originalError) {
        return new ApiError(ApiErrorType.NETWORK_ERROR, message, undefined, originalError);
    }
    /**
     * Create a timeout error
     * @param message - Error message
     * @param originalError - Original error object
     */
    static timeoutError(message, originalError) {
        return new ApiError(ApiErrorType.TIMEOUT_ERROR, message, 408, originalError);
    }
    /**
     * Create an authentication error
     * @param message - Error message
     * @param response - API error response
     */
    static authenticationError(message, response) {
        return new ApiError(ApiErrorType.AUTHENTICATION_ERROR, message, 401, undefined, response);
    }
    /**
     * Create an authorization error
     * @param message - Error message
     * @param response - API error response
     */
    static authorizationError(message, response) {
        return new ApiError(ApiErrorType.AUTHORIZATION_ERROR, message, 403, undefined, response);
    }
    /**
     * Create a validation error
     * @param message - Error message
     * @param response - API error response
     */
    static validationError(message, response) {
        return new ApiError(ApiErrorType.VALIDATION_ERROR, message, 400, undefined, response);
    }
    /**
     * Create a not found error
     * @param message - Error message
     * @param response - API error response
     */
    static notFoundError(message, response) {
        return new ApiError(ApiErrorType.NOT_FOUND_ERROR, message, 404, undefined, response);
    }
    /**
     * Create a server error
     * @param message - Error message
     * @param statusCode - HTTP status code
     * @param response - API error response
     */
    static serverError(message, statusCode = 500, response) {
        return new ApiError(ApiErrorType.SERVER_ERROR, message, statusCode, undefined, response);
    }
    /**
     * Create an unknown error
     * @param message - Error message
     * @param originalError - Original error object
     */
    static unknownError(message, originalError) {
        return new ApiError(ApiErrorType.UNKNOWN_ERROR, message, undefined, originalError);
    }
    /**
     * Create an ApiError from an HTTP response
     * @param status - HTTP status code
     * @param data - Response data
     * @param originalError - Original error object
     */
    static fromResponse(status, data, originalError) {
        const response = data;
        const message = response?.error || response?.message || 'An error occurred';
        if (status === 401) {
            return ApiError.authenticationError(message, response);
        }
        else if (status === 403) {
            return ApiError.authorizationError(message, response);
        }
        else if (status === 400) {
            return ApiError.validationError(message, response);
        }
        else if (status === 404) {
            return ApiError.notFoundError(message, response);
        }
        else if (status >= 500) {
            return ApiError.serverError(message, status, response);
        }
        else {
            return ApiError.unknownError(message, originalError);
        }
    }
}
//# sourceMappingURL=ApiError.js.map