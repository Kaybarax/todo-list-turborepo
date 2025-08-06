import { z } from 'zod';
/**
 * Todo priority levels
 */
export declare enum TodoPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
/**
 * Todo status options
 */
export declare enum TodoStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done"
}
/**
 * Schema for validating todo items
 */
export declare const todoSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof TodoStatus>>;
    priority: z.ZodDefault<z.ZodNativeEnum<typeof TodoPriority>>;
    dueDate: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    userId: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: TodoStatus;
    title: string;
    priority: TodoPriority;
    tags: string[];
    id?: string | undefined;
    description?: string | undefined;
    dueDate?: Date | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    userId?: string | undefined;
}, {
    title: string;
    status?: TodoStatus | undefined;
    id?: string | undefined;
    description?: string | undefined;
    priority?: TodoPriority | undefined;
    dueDate?: Date | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    userId?: string | undefined;
    tags?: string[] | undefined;
}>;
/**
 * Type definition for a todo item
 */
export type Todo = z.infer<typeof todoSchema>;
/**
 * Schema for creating a new todo
 */
export declare const createTodoSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof TodoStatus>>;
    priority: z.ZodDefault<z.ZodNativeEnum<typeof TodoPriority>>;
    dueDate: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    userId: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    status: TodoStatus;
    title: string;
    priority: TodoPriority;
    tags: string[];
    description?: string | undefined;
    dueDate?: Date | undefined;
    userId?: string | undefined;
}, {
    title: string;
    status?: TodoStatus | undefined;
    description?: string | undefined;
    priority?: TodoPriority | undefined;
    dueDate?: Date | undefined;
    userId?: string | undefined;
    tags?: string[] | undefined;
}>;
/**
 * Type for creating a new todo
 */
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
/**
 * Schema for updating an existing todo
 */
export declare const updateTodoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TodoStatus>>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TodoPriority>>>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    userId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    status?: TodoStatus | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: TodoPriority | undefined;
    dueDate?: Date | undefined;
    userId?: string | undefined;
    tags?: string[] | undefined;
}, {
    status?: TodoStatus | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: TodoPriority | undefined;
    dueDate?: Date | undefined;
    userId?: string | undefined;
    tags?: string[] | undefined;
}>;
/**
 * Type for updating an existing todo
 */
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
/**
 * Schema for todo query parameters
 */
export declare const todoQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<typeof TodoStatus>>;
    priority: z.ZodOptional<z.ZodNativeEnum<typeof TodoPriority>>;
    userId: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodEnum<["createdAt", "updatedAt", "dueDate", "priority"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    status?: TodoStatus | undefined;
    search?: string | undefined;
    priority?: TodoPriority | undefined;
    userId?: string | undefined;
    tags?: string[] | undefined;
    sortBy?: "priority" | "dueDate" | "createdAt" | "updatedAt" | undefined;
}, {
    status?: TodoStatus | undefined;
    search?: string | undefined;
    priority?: TodoPriority | undefined;
    userId?: string | undefined;
    tags?: string[] | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "priority" | "dueDate" | "createdAt" | "updatedAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
/**
 * Type for todo query parameters
 */
export type TodoQueryParams = z.infer<typeof todoQuerySchema>;
//# sourceMappingURL=types.d.ts.map