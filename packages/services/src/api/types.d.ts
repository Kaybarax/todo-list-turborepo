import { z } from 'zod';
/**
 * API response wrapper schema
 */
export declare const apiResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    error?: string | undefined;
    message?: string | undefined;
    data?: unknown;
    timestamp?: string | undefined;
}, {
    success: boolean;
    error?: string | undefined;
    message?: string | undefined;
    data?: unknown;
    timestamp?: string | undefined;
}>;
/**
 * API response type
 */
export type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp?: string;
};
/**
 * API error response schema
 */
export declare const apiErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    statusCode: z.ZodOptional<z.ZodNumber>;
    timestamp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
    message?: string | undefined;
    timestamp?: string | undefined;
    statusCode?: number | undefined;
}, {
    success: false;
    error: string;
    message?: string | undefined;
    timestamp?: string | undefined;
    statusCode?: number | undefined;
}>;
/**
 * API error response type
 */
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
/**
 * API Todo schema for API responses
 */
export declare const apiTodoSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    completed: z.ZodDefault<z.ZodBoolean>;
    priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    dueDate: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    priority: "medium" | "low" | "high";
    createdAt: string;
    updatedAt: string;
    userId: string;
    tags: string[];
    completed: boolean;
    description?: string | undefined;
    dueDate?: string | undefined;
}, {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    description?: string | undefined;
    priority?: "medium" | "low" | "high" | undefined;
    dueDate?: string | undefined;
    tags?: string[] | undefined;
    completed?: boolean | undefined;
}>;
/**
 * API Todo type
 */
export type ApiTodo = z.infer<typeof apiTodoSchema>;
/**
 * Create API todo input schema
 */
export declare const createApiTodoSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    completed: z.ZodDefault<z.ZodBoolean>;
    priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    dueDate: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    userId: z.ZodString;
}, "id" | "createdAt" | "updatedAt" | "userId">, "strip", z.ZodTypeAny, {
    title: string;
    priority: "medium" | "low" | "high";
    tags: string[];
    completed: boolean;
    description?: string | undefined;
    dueDate?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
    priority?: "medium" | "low" | "high" | undefined;
    dueDate?: string | undefined;
    tags?: string[] | undefined;
    completed?: boolean | undefined;
}>;
/**
 * Create API todo input type
 */
export type CreateApiTodoInput = z.infer<typeof createApiTodoSchema>;
/**
 * Update API todo input schema
 */
export declare const updateApiTodoSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    completed: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    priority?: "medium" | "low" | "high" | undefined;
    dueDate?: string | undefined;
    tags?: string[] | undefined;
    completed?: boolean | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    priority?: "medium" | "low" | "high" | undefined;
    dueDate?: string | undefined;
    tags?: string[] | undefined;
    completed?: boolean | undefined;
}>;
/**
 * Update API todo input type
 */
export type UpdateApiTodoInput = z.infer<typeof updateApiTodoSchema>;
/**
 * User schema for API responses
 */
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    walletAddress: z.ZodOptional<z.ZodString>;
    preferredNetwork: z.ZodOptional<z.ZodEnum<["solana", "polkadot", "polygon"]>>;
    settings: z.ZodObject<{
        theme: z.ZodDefault<z.ZodEnum<["light", "dark"]>>;
        notifications: z.ZodDefault<z.ZodBoolean>;
        defaultPriority: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        theme: "light" | "dark";
        notifications: boolean;
        defaultPriority: "medium" | "low" | "high";
    }, {
        theme?: "light" | "dark" | undefined;
        notifications?: boolean | undefined;
        defaultPriority?: "medium" | "low" | "high" | undefined;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    settings: {
        theme: "light" | "dark";
        notifications: boolean;
        defaultPriority: "medium" | "low" | "high";
    };
    email?: string | undefined;
    walletAddress?: string | undefined;
    preferredNetwork?: "polygon" | "solana" | "polkadot" | undefined;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    settings: {
        theme?: "light" | "dark" | undefined;
        notifications?: boolean | undefined;
        defaultPriority?: "medium" | "low" | "high" | undefined;
    };
    email?: string | undefined;
    walletAddress?: string | undefined;
    preferredNetwork?: "polygon" | "solana" | "polkadot" | undefined;
}>;
/**
 * User type
 */
export type User = z.infer<typeof userSchema>;
/**
 * Authentication response schema
 */
export declare const authResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        walletAddress: z.ZodOptional<z.ZodString>;
        preferredNetwork: z.ZodOptional<z.ZodEnum<["solana", "polkadot", "polygon"]>>;
        settings: z.ZodObject<{
            theme: z.ZodDefault<z.ZodEnum<["light", "dark"]>>;
            notifications: z.ZodDefault<z.ZodBoolean>;
            defaultPriority: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
        }, "strip", z.ZodTypeAny, {
            theme: "light" | "dark";
            notifications: boolean;
            defaultPriority: "medium" | "low" | "high";
        }, {
            theme?: "light" | "dark" | undefined;
            notifications?: boolean | undefined;
            defaultPriority?: "medium" | "low" | "high" | undefined;
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        updatedAt: string;
        settings: {
            theme: "light" | "dark";
            notifications: boolean;
            defaultPriority: "medium" | "low" | "high";
        };
        email?: string | undefined;
        walletAddress?: string | undefined;
        preferredNetwork?: "polygon" | "solana" | "polkadot" | undefined;
    }, {
        id: string;
        createdAt: string;
        updatedAt: string;
        settings: {
            theme?: "light" | "dark" | undefined;
            notifications?: boolean | undefined;
            defaultPriority?: "medium" | "low" | "high" | undefined;
        };
        email?: string | undefined;
        walletAddress?: string | undefined;
        preferredNetwork?: "polygon" | "solana" | "polkadot" | undefined;
    }>;
    token: z.ZodString;
    refreshToken: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        createdAt: string;
        updatedAt: string;
        settings: {
            theme: "light" | "dark";
            notifications: boolean;
            defaultPriority: "medium" | "low" | "high";
        };
        email?: string | undefined;
        walletAddress?: string | undefined;
        preferredNetwork?: "polygon" | "solana" | "polkadot" | undefined;
    };
    token: string;
    expiresAt: string;
    refreshToken?: string | undefined;
}, {
    user: {
        id: string;
        createdAt: string;
        updatedAt: string;
        settings: {
            theme?: "light" | "dark" | undefined;
            notifications?: boolean | undefined;
            defaultPriority?: "medium" | "low" | "high" | undefined;
        };
        email?: string | undefined;
        walletAddress?: string | undefined;
        preferredNetwork?: "polygon" | "solana" | "polkadot" | undefined;
    };
    token: string;
    expiresAt: string;
    refreshToken?: string | undefined;
}>;
/**
 * Authentication response type
 */
export type AuthResponse = z.infer<typeof authResponseSchema>;
/**
 * Login input schema
 */
export declare const loginInputSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    walletAddress: z.ZodOptional<z.ZodString>;
    signature: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    message?: string | undefined;
    walletAddress?: string | undefined;
    signature?: string | undefined;
}, {
    email?: string | undefined;
    message?: string | undefined;
    walletAddress?: string | undefined;
    signature?: string | undefined;
}>, {
    email?: string | undefined;
    message?: string | undefined;
    walletAddress?: string | undefined;
    signature?: string | undefined;
}, {
    email?: string | undefined;
    message?: string | undefined;
    walletAddress?: string | undefined;
    signature?: string | undefined;
}>;
/**
 * Login input type
 */
export type LoginInput = z.infer<typeof loginInputSchema>;
/**
 * API client configuration
 */
export interface ApiClientConfig {
    baseUrl: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
    defaultHeaders?: Record<string, string>;
}
/**
 * Request interceptor function type
 */
export type RequestInterceptor = (config: any) => any | Promise<any>;
/**
 * Response interceptor function type
 */
export type ResponseInterceptor = (response: any) => any | Promise<any>;
/**
 * Error interceptor function type
 */
export type ErrorInterceptor = (error: any) => any | Promise<any>;
/**
 * Retry configuration
 */
export interface RetryConfig {
    attempts: number;
    delay: number;
    backoff?: 'linear' | 'exponential';
    retryCondition?: (error: any) => boolean;
}
//# sourceMappingURL=types.d.ts.map