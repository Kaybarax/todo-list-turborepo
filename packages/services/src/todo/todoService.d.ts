import { Todo, CreateTodoInput, UpdateTodoInput, TodoQueryParams } from './types';
/**
 * Service for interacting with the Todo API
 */
export declare class TodoService {
  private apiClient;
  /**
   * Create a new TodoService instance
   * @param baseUrl - The base URL of the Todo API
   */
  constructor(baseUrl: string);
  /**
   * Get all todos with optional filtering
   * @param params - Query parameters for filtering todos
   * @returns Promise with array of todos
   */
  getTodos(params?: Partial<TodoQueryParams>): Promise<Todo[]>;
  /**
   * Get a single todo by ID
   * @param id - The todo ID
   * @returns Promise with the todo
   */
  getTodoById(id: string): Promise<Todo>;
  /**
   * Create a new todo
   * @param todo - The todo data
   * @returns Promise with the created todo
   */
  createTodo(todo: CreateTodoInput): Promise<Todo>;
  /**
   * Update an existing todo
   * @param id - The todo ID
   * @param todo - The updated todo data
   * @returns Promise with the updated todo
   */
  updateTodo(id: string, todo: UpdateTodoInput): Promise<Todo>;
  /**
   * Delete a todo
   * @param id - The todo ID
   * @returns Promise with success status
   */
  deleteTodo(id: string): Promise<boolean>;
}
//# sourceMappingURL=todoService.d.ts.map
