import { BaseApiClient } from './BaseApiClient';
import { ApiClientConfig, ApiResponse, User, AuthResponse, LoginInput } from './types';
/**
 * Authentication API client
 */
export declare class AuthApiClient extends BaseApiClient {
    /**
     * Create a new AuthApiClient
     * @param config - API client configuration
     */
    constructor(config: ApiClientConfig);
    /**
     * Login with email and password or wallet signature
     * @param credentials - Login credentials
     */
    login(credentials: LoginInput): Promise<ApiResponse<AuthResponse>>;
    /**
     * Register a new user
     * @param userData - User registration data
     */
    register(userData: {
        email?: string;
        walletAddress?: string;
        signature?: string;
        message?: string;
    }): Promise<ApiResponse<AuthResponse>>;
    /**
     * Logout the current user
     */
    logout(): Promise<ApiResponse<void>>;
    /**
     * Refresh the authentication token
     */
    refreshUserToken(): Promise<ApiResponse<AuthResponse>>;
    /**
     * Get the current user profile
     */
    getProfile(): Promise<ApiResponse<User>>;
    /**
     * Update the current user profile
     * @param userData - Updated user data
     */
    updateProfile(userData: Partial<User>): Promise<ApiResponse<User>>;
    /**
     * Request password reset
     * @param email - User email
     */
    requestPasswordReset(email: string): Promise<ApiResponse<void>>;
    /**
     * Reset password with token
     * @param token - Reset token
     * @param newPassword - New password
     */
    resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>>;
    /**
     * Verify email address
     * @param token - Verification token
     */
    verifyEmail(token: string): Promise<ApiResponse<void>>;
    /**
     * Get wallet authentication message
     * @param walletAddress - Wallet address
     */
    getWalletAuthMessage(walletAddress: string): Promise<ApiResponse<{
        message: string;
    }>>;
    /**
     * Get refresh token (private method for internal use)
     */
    private getRefreshToken;
}
//# sourceMappingURL=AuthApiClient.d.ts.map