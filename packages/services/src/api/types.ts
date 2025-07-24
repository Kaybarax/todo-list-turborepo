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
export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
  timestamp: z.string().optional(),
});

/**
 * API error response type
 */
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

/**
 * Todo schema for API responses
 */
export const todoSchema = z.object({
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
 * Todo type
 */
export type Todo = z.infer<typeof todoSchema>;

/**
 * Create todo input schema
 */
export const createTodoSchema = todoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

/**
 * Create todo input type
 */
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

/**
 * Update todo input schema
 */
export const updateTodoSchema = createTodoSchema.partial();

/**
 * Update todo input type
 */
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

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
 * User type
 */
export type User = z.infer<typeof userSchema>;

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
 * Authentication response type
 */
export type AuthResponse = z.infer<typeof authResponseSchema>;

/**
 * Login input schema
 */
export const loginInputSchema = z.object({
  email: z.string().email().optional(),
  walletAddress: z.string().optional(),
  signature: z.string().optional(),
  message: z.string().optional(),
}).refine(
  (data) => data.email || (data.walletAddress && data.signature && data.message),
  {
    message: "Either email or wallet authentication is required",
  }
);

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