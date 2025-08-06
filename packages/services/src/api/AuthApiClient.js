import { BaseApiClient } from './BaseApiClient';
import { userSchema, authResponseSchema, loginInputSchema } from './types';
import { ApiError } from './ApiError';
/**
 * Authentication API client
 */
export class AuthApiClient extends BaseApiClient {
    /**
     * Create a new AuthApiClient
     * @param config - API client configuration
     */
    constructor(config) {
        super(config);
    }
    /**
     * Login with email and password or wallet signature
     * @param credentials - Login credentials
     */
    async login(credentials) {
        try {
            // Validate input data
            const result = loginInputSchema.safeParse(credentials);
            if (!result.success) {
                throw ApiError.validationError(`Invalid login credentials: ${result.error.message}`);
            }
            const response = await this.post('/auth/login', result.data);
            // Validate response data
            if (response.success && response.data) {
                const authResult = authResponseSchema.safeParse(response.data);
                if (!authResult.success) {
                    throw ApiError.validationError(`Invalid auth response: ${authResult.error.message}`);
                }
                // Set the auth token for future requests
                this.setAuthToken(authResult.data.token, authResult.data.refreshToken);
                return {
                    ...response,
                    data: authResult.data,
                };
            }
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to login', error);
        }
    }
    /**
     * Register a new user
     * @param userData - User registration data
     */
    async register(userData) {
        try {
            // Validate input data
            const result = loginInputSchema.safeParse(userData);
            if (!result.success) {
                throw ApiError.validationError(`Invalid registration data: ${result.error.message}`);
            }
            const response = await this.post('/auth/register', result.data);
            // Validate response data
            if (response.success && response.data) {
                const authResult = authResponseSchema.safeParse(response.data);
                if (!authResult.success) {
                    throw ApiError.validationError(`Invalid auth response: ${authResult.error.message}`);
                }
                // Set the auth token for future requests
                this.setAuthToken(authResult.data.token, authResult.data.refreshToken);
                return {
                    ...response,
                    data: authResult.data,
                };
            }
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to register', error);
        }
    }
    /**
     * Logout the current user
     */
    async logout() {
        try {
            const response = await this.post('/auth/logout');
            // Clear the auth token
            this.clearAuthToken();
            return response;
        }
        catch (error) {
            // Clear the auth token even if logout fails
            this.clearAuthToken();
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to logout', error);
        }
    }
    /**
     * Refresh the authentication token
     */
    async refreshUserToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                throw ApiError.authenticationError('No refresh token available');
            }
            const response = await this.post('/auth/refresh', {
                refreshToken,
            });
            // Validate response data
            if (response.success && response.data) {
                const authResult = authResponseSchema.safeParse(response.data);
                if (!authResult.success) {
                    throw ApiError.validationError(`Invalid auth response: ${authResult.error.message}`);
                }
                // Update the auth token
                this.setAuthToken(authResult.data.token, authResult.data.refreshToken);
                return {
                    ...response,
                    data: authResult.data,
                };
            }
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to refresh token', error);
        }
    }
    /**
     * Get the current user profile
     */
    async getProfile() {
        try {
            const response = await this.get('/auth/profile');
            // Validate response data
            if (response.success && response.data) {
                const result = userSchema.safeParse(response.data);
                if (!result.success) {
                    throw ApiError.validationError(`Invalid user data: ${result.error.message}`);
                }
                return {
                    ...response,
                    data: result.data,
                };
            }
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to get user profile', error);
        }
    }
    /**
     * Update the current user profile
     * @param userData - Updated user data
     */
    async updateProfile(userData) {
        try {
            const response = await this.put('/auth/profile', userData);
            // Validate response data
            if (response.success && response.data) {
                const result = userSchema.safeParse(response.data);
                if (!result.success) {
                    throw ApiError.validationError(`Invalid user data: ${result.error.message}`);
                }
                return {
                    ...response,
                    data: result.data,
                };
            }
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to update user profile', error);
        }
    }
    /**
     * Request password reset
     * @param email - User email
     */
    async requestPasswordReset(email) {
        try {
            const response = await this.post('/auth/password-reset', { email });
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to request password reset', error);
        }
    }
    /**
     * Reset password with token
     * @param token - Reset token
     * @param newPassword - New password
     */
    async resetPassword(token, newPassword) {
        try {
            const response = await this.post('/auth/password-reset/confirm', {
                token,
                password: newPassword,
            });
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to reset password', error);
        }
    }
    /**
     * Verify email address
     * @param token - Verification token
     */
    async verifyEmail(token) {
        try {
            const response = await this.post('/auth/verify-email', { token });
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to verify email', error);
        }
    }
    /**
     * Get wallet authentication message
     * @param walletAddress - Wallet address
     */
    async getWalletAuthMessage(walletAddress) {
        try {
            const response = await this.post('/auth/wallet/message', {
                walletAddress,
            });
            return response;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unknownError('Failed to get wallet auth message', error);
        }
    }
    /**
     * Get refresh token (private method for internal use)
     */
    getRefreshToken() {
        // This would typically be stored securely
        // For now, we'll assume it's stored in the base client
        return this.refreshToken || null;
    }
}
//# sourceMappingURL=AuthApiClient.js.map