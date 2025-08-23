import type { ApiTodo } from '@todo/services';
import type { TodoData as Todo } from '@/components/todo/TodoItem';

/**
 * Convert API Todo to component Todo format
 */
export function apiTodoToTodo(apiTodo: Partial<ApiTodo>): Todo {
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
  };
}

/**
 * Create mock Todo for testing
 */
export function createMockTodo(overrides: Partial<Todo> = {}): Todo {
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
