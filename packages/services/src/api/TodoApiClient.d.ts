import { BaseApiClient } from './BaseApiClient';
import { ApiClientConfig, ApiResponse, ApiTodo, CreateApiTodoInput, UpdateApiTodoInput } from './types';
/**
 * Todo API client for managing todos
 */
export declare class TodoApiClient extends BaseApiClient {
  /**
   * Create a new TodoApiClient
   * @param config - API client configuration
   */
  constructor(config: ApiClientConfig);
  /**
   * Get all todos for the authenticated user
   * @param params - Query parameters
   */
  getTodos(params?: {
    page?: number;
    limit?: number;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    search?: string;
    tags?: string[];
  }): Promise<ApiResponse<ApiTodo[]>>;
  /**
   * Get a specific todo by ID
   * @param id - Todo ID
   */
  getTodoById(id: string): Promise<ApiResponse<ApiTodo>>;
  /**
   * Create a new todo
   * @param todo - Todo data to create
   */
  createTodo(todo: CreateApiTodoInput): Promise<ApiResponse<ApiTodo>>;
  /**
   * Update an existing todo
   * @param id - Todo ID
   * @param todo - Updated todo data
   */
  updateTodo(id: string, todo: UpdateApiTodoInput): Promise<ApiResponse<ApiTodo>>;
  /**
   * Delete a todo
   * @param id - Todo ID
   */
  deleteTodo(id: string): Promise<ApiResponse<void>>;
  /**
   * Toggle todo completion status
   * @param id - Todo ID
   */
  toggleTodo(id: string): Promise<ApiResponse<ApiTodo>>;
  /**
   * Bulk update todos
   * @param updates - Array of todo updates
   */
  bulkUpdateTodos(
    updates: Array<{
      id: string;
      data: UpdateApiTodoInput;
    }>,
  ): Promise<ApiResponse<ApiTodo[]>>;
  /**
   * Search todos
   * @param query - Search query
   * @param filters - Additional filters
   */
  searchTodos(
    query: string,
    filters?: {
      completed?: boolean;
      priority?: 'low' | 'medium' | 'high';
      tags?: string[];
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<ApiResponse<ApiTodo[]>>;
}
//# sourceMappingURL=TodoApiClient.d.ts.map
