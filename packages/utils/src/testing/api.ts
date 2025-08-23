import type { ApiTodo } from '@todo/services';

// Define TodoData interface to match the ui-web package
export interface TodoData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  blockchainNetwork?: string;
  transactionHash?: string;
  blockchainAddress?: string;
}

/**
 * Convert API Todo to component Todo format
 * Transforms API response data to the format expected by UI components
 * @param apiTodo - Partial API todo data
 * @returns TodoData object for UI components
 */
export function apiTodoToTodo(apiTodo: Partial<ApiTodo>): TodoData {
  return {
    id: apiTodo.id ?? '1',
    title: apiTodo.title ?? 'Test Todo',
    description: apiTodo.description,
    completed: apiTodo.completed ?? false,
    priority: apiTodo.priority ?? 'medium',
    dueDate: apiTodo.dueDate ? new Date(apiTodo.dueDate) : undefined,
    tags: apiTodo.tags ?? [],
    createdAt: new Date(apiTodo.createdAt ?? '2024-01-01T00:00:00Z'),
    updatedAt: new Date(apiTodo.updatedAt ?? '2024-01-01T00:00:00Z'),
    userId: apiTodo.userId ?? 'user1',
    blockchainNetwork: apiTodo.blockchainNetwork,
    transactionHash: apiTodo.transactionHash,
    blockchainAddress: apiTodo.blockchainAddress,
  };
}

/**
 * Create mock Todo for testing
 * Generates a complete TodoData object with sensible defaults
 * @param overrides - Properties to override in the mock todo
 * @returns Complete TodoData object for testing
 */
export function createMockTodo(overrides: Partial<TodoData> = {}): TodoData {
  return {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-12-31'),
    tags: ['work', 'urgent'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userId: 'user1',
    ...overrides,
  };
}

/**
 * Create mock API Todo for testing API responses
 * Generates a complete ApiTodo object with sensible defaults
 * @param overrides - Properties to override in the mock API todo
 * @returns Complete ApiTodo object for testing
 */
export function createMockApiTodo(overrides: Partial<ApiTodo> = {}): ApiTodo {
  return {
    id: '1',
    title: 'Test API Todo',
    description: 'Test API Description',
    completed: false,
    priority: 'medium',
    dueDate: '2024-12-31T00:00:00Z',
    tags: ['api', 'test'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: 'user1',
    ...overrides,
  };
}

/**
 * Create multiple mock todos for list testing
 * @param count - Number of todos to create
 * @param baseOverrides - Base overrides to apply to all todos
 * @returns Array of TodoData objects
 */
export function createMockTodos(count: number, baseOverrides: Partial<TodoData> = {}): TodoData[] {
  return Array.from({ length: count }, (_, index) =>
    createMockTodo({
      id: `todo-${index + 1}`,
      title: `Test Todo ${index + 1}`,
      ...baseOverrides,
    }),
  );
}

/**
 * Create multiple mock API todos for list testing
 * @param count - Number of API todos to create
 * @param baseOverrides - Base overrides to apply to all API todos
 * @returns Array of ApiTodo objects
 */
export function createMockApiTodos(count: number, baseOverrides: Partial<ApiTodo> = {}): ApiTodo[] {
  return Array.from({ length: count }, (_, index) =>
    createMockApiTodo({
      id: `api-todo-${index + 1}`,
      title: `Test API Todo ${index + 1}`,
      ...baseOverrides,
    }),
  );
}

/**
 * Create mock todo with specific completion status
 * @param completed - Whether the todo should be completed
 * @param overrides - Additional overrides
 * @returns TodoData object with specified completion status
 */
export function createMockTodoWithStatus(completed: boolean, overrides: Partial<TodoData> = {}): TodoData {
  return createMockTodo({
    completed,
    updatedAt: completed ? new Date() : new Date('2024-01-01'),
    ...overrides,
  });
}

/**
 * Create mock todo with specific priority
 * @param priority - Priority level for the todo
 * @param overrides - Additional overrides
 * @returns TodoData object with specified priority
 */
export function createMockTodoWithPriority(
  priority: 'low' | 'medium' | 'high',
  overrides: Partial<TodoData> = {},
): TodoData {
  const priorityTags = {
    low: ['low-priority'],
    medium: ['work'],
    high: ['urgent', 'important'],
  };

  return createMockTodo({
    priority,
    tags: priorityTags[priority],
    ...overrides,
  });
}

/**
 * Create mock todo with due date
 * @param daysFromNow - Number of days from now for the due date (negative for past dates)
 * @param overrides - Additional overrides
 * @returns TodoData object with specified due date
 */
export function createMockTodoWithDueDate(daysFromNow: number, overrides: Partial<TodoData> = {}): TodoData {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysFromNow);

  return createMockTodo({
    dueDate,
    ...overrides,
  });
}

/**
 * Create mock todo with blockchain data
 * @param network - Blockchain network
 * @param overrides - Additional overrides
 * @returns TodoData object with blockchain information
 */
export function createMockTodoWithBlockchain(network: string, overrides: Partial<TodoData> = {}): TodoData {
  // Generate a proper 64-character hex string for transaction hash
  const generateHex = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
  };

  return createMockTodo({
    blockchainNetwork: network,
    transactionHash: `0x${generateHex(64)}`,
    blockchainAddress: `0x${generateHex(40)}`,
    tags: ['blockchain', network],
    ...overrides,
  });
}
