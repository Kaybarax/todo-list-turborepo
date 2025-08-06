import { z } from 'zod';
/**
 * Todo priority levels
 */
export var TodoPriority;
(function (TodoPriority) {
    TodoPriority["LOW"] = "low";
    TodoPriority["MEDIUM"] = "medium";
    TodoPriority["HIGH"] = "high";
})(TodoPriority || (TodoPriority = {}));
/**
 * Todo status options
 */
export var TodoStatus;
(function (TodoStatus) {
    TodoStatus["TODO"] = "todo";
    TodoStatus["IN_PROGRESS"] = "in_progress";
    TodoStatus["DONE"] = "done";
})(TodoStatus || (TodoStatus = {}));
/**
 * Schema for validating todo items
 */
export const todoSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
    status: z.nativeEnum(TodoStatus).default(TodoStatus.TODO),
    priority: z.nativeEnum(TodoPriority).default(TodoPriority.MEDIUM),
    dueDate: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    userId: z.string().optional(),
    tags: z.array(z.string()).default([]),
});
/**
 * Schema for creating a new todo
 */
export const createTodoSchema = todoSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
/**
 * Schema for updating an existing todo
 */
export const updateTodoSchema = createTodoSchema.partial();
/**
 * Schema for todo query parameters
 */
export const todoQuerySchema = z.object({
    status: z.nativeEnum(TodoStatus).optional(),
    priority: z.nativeEnum(TodoPriority).optional(),
    userId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    search: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(10),
    sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority']).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=types.js.map