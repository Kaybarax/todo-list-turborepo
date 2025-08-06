import { z } from 'zod';
/**
 * API response wrapper schema
 */
export const apiResponseSchema = z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z.string().optional(),
});
/**
 * API error response schema
 */
export const apiErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
    message: z.string().optional(),
    statusCode: z.number().optional(),
    timestamp: z.string().optional(),
});
/**
 * API Todo schema for API responses
 */
export const apiTodoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    completed: z.boolean().default(false),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    dueDate: z.string().optional(),
    tags: z.array(z.string()).default([]),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.string(),
});
/**
 * Create API todo input schema
 */
export const createApiTodoSchema = apiTodoSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
});
/**
 * Update API todo input schema
 */
export const updateApiTodoSchema = createApiTodoSchema.partial();
/**
 * User schema for API responses
 */
export const userSchema = z.object({
    id: z.string(),
    email: z.string().email().optional(),
    walletAddress: z.string().optional(),
    preferredNetwork: z.enum(['solana', 'polkadot', 'polygon']).optional(),
    settings: z.object({
        theme: z.enum(['light', 'dark']).default('light'),
        notifications: z.boolean().default(true),
        defaultPriority: z.enum(['low', 'medium', 'high']).default('medium'),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
});
/**
 * Authentication response schema
 */
export const authResponseSchema = z.object({
    user: userSchema,
    token: z.string(),
    refreshToken: z.string().optional(),
    expiresAt: z.string(),
});
/**
 * Login input schema
 */
export const loginInputSchema = z.object({
    email: z.string().email().optional(),
    walletAddress: z.string().optional(),
    signature: z.string().optional(),
    message: z.string().optional(),
}).refine((data) => data.email || (data.walletAddress && data.signature && data.message), {
    message: "Either email or wallet authentication is required",
});
//# sourceMappingURL=types.js.map