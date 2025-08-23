import {
  apiTodoToTodo,
  createMockTodo,
  createMockApiTodo,
  createMockTodos,
  createMockApiTodos,
  createMockTodoWithStatus,
  createMockTodoWithPriority,
  createMockTodoWithDueDate,
  createMockTodoWithBlockchain,
  type TodoData,
} from '../api';

describe('API Testing Utilities', () => {
  describe('apiTodoToTodo', () => {
    it('should convert API todo to TodoData with defaults', () => {
      const apiTodo = {};
      const result = apiTodoToTodo(apiTodo);

      expect(result).toEqual({
        id: '1',
        title: 'Test Todo',
        description: undefined,
        completed: false,
        priority: 'medium',
        dueDate: undefined,
        tags: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        userId: 'user1',
        blockchainNetwork: undefined,
        transactionHash: undefined,
        blockchainAddress: undefined,
      });
    });

    it('should convert API todo with all fields', () => {
      const apiTodo = {
        id: 'api-123',
        title: 'API Todo Title',
        description: 'API Todo Description',
        completed: true,
        priority: 'high' as const,
        dueDate: '2024-06-15T10:30:00Z',
        tags: ['api', 'test', 'important'],
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-20T12:00:00Z',
        userId: 'user-456',
        blockchainNetwork: 'polygon',
        transactionHash: '0xabc123',
        blockchainAddress: '0xdef456',
      };

      const result = apiTodoToTodo(apiTodo);

      expect(result).toEqual({
        id: 'api-123',
        title: 'API Todo Title',
        description: 'API Todo Description',
        completed: true,
        priority: 'high',
        dueDate: new Date('2024-06-15T10:30:00Z'),
        tags: ['api', 'test', 'important'],
        createdAt: new Date('2024-01-15T08:00:00Z'),
        updatedAt: new Date('2024-01-20T12:00:00Z'),
        userId: 'user-456',
        blockchainNetwork: 'polygon',
        transactionHash: '0xabc123',
        blockchainAddress: '0xdef456',
      });
    });

    it('should handle partial API todo data', () => {
      const apiTodo = {
        id: 'partial-123',
        title: 'Partial Todo',
        completed: true,
      };

      const result = apiTodoToTodo(apiTodo);

      expect(result.id).toBe('partial-123');
      expect(result.title).toBe('Partial Todo');
      expect(result.completed).toBe(true);
      expect(result.priority).toBe('medium'); // default
      expect(result.tags).toEqual([]); // default
    });
  });

  describe('createMockTodo', () => {
    it('should create default mock todo', () => {
      const todo = createMockTodo();

      expect(todo).toEqual({
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
      });
    });

    it('should apply overrides to mock todo', () => {
      const overrides: Partial<TodoData> = {
        id: 'custom-id',
        title: 'Custom Title',
        completed: true,
        priority: 'high',
        tags: ['custom', 'test'],
      };

      const todo = createMockTodo(overrides);

      expect(todo.id).toBe('custom-id');
      expect(todo.title).toBe('Custom Title');
      expect(todo.completed).toBe(true);
      expect(todo.priority).toBe('high');
      expect(todo.tags).toEqual(['custom', 'test']);
      // Should keep defaults for non-overridden fields
      expect(todo.description).toBe('Test Description');
      expect(todo.userId).toBe('user1');
    });
  });

  describe('createMockApiTodo', () => {
    it('should create default mock API todo', () => {
      const apiTodo = createMockApiTodo();

      expect(apiTodo).toEqual({
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
      });
    });

    it('should apply overrides to mock API todo', () => {
      const overrides = {
        id: 'api-custom',
        title: 'Custom API Todo',
        completed: true,
        priority: 'low' as const,
      };

      const apiTodo = createMockApiTodo(overrides);

      expect(apiTodo.id).toBe('api-custom');
      expect(apiTodo.title).toBe('Custom API Todo');
      expect(apiTodo.completed).toBe(true);
      expect(apiTodo.priority).toBe('low');
    });
  });

  describe('createMockTodos', () => {
    it('should create multiple mock todos', () => {
      const todos = createMockTodos(3);

      expect(todos).toHaveLength(3);
      expect(todos[0].id).toBe('todo-1');
      expect(todos[0].title).toBe('Test Todo 1');
      expect(todos[1].id).toBe('todo-2');
      expect(todos[1].title).toBe('Test Todo 2');
      expect(todos[2].id).toBe('todo-3');
      expect(todos[2].title).toBe('Test Todo 3');
    });

    it('should apply base overrides to all todos', () => {
      const baseOverrides: Partial<TodoData> = {
        completed: true,
        priority: 'high',
        userId: 'shared-user',
      };

      const todos = createMockTodos(2, baseOverrides);

      expect(todos).toHaveLength(2);
      todos.forEach(todo => {
        expect(todo.completed).toBe(true);
        expect(todo.priority).toBe('high');
        expect(todo.userId).toBe('shared-user');
      });
    });

    it('should create empty array for zero count', () => {
      const todos = createMockTodos(0);
      expect(todos).toEqual([]);
    });
  });

  describe('createMockApiTodos', () => {
    it('should create multiple mock API todos', () => {
      const apiTodos = createMockApiTodos(2);

      expect(apiTodos).toHaveLength(2);
      expect(apiTodos[0].id).toBe('api-todo-1');
      expect(apiTodos[0].title).toBe('Test API Todo 1');
      expect(apiTodos[1].id).toBe('api-todo-2');
      expect(apiTodos[1].title).toBe('Test API Todo 2');
    });

    it('should apply base overrides to all API todos', () => {
      const baseOverrides = {
        completed: true,
        priority: 'low' as const,
      };

      const apiTodos = createMockApiTodos(2, baseOverrides);

      apiTodos.forEach(apiTodo => {
        expect(apiTodo.completed).toBe(true);
        expect(apiTodo.priority).toBe('low');
      });
    });
  });

  describe('createMockTodoWithStatus', () => {
    it('should create completed todo', () => {
      const todo = createMockTodoWithStatus(true);

      expect(todo.completed).toBe(true);
      expect(todo.updatedAt.getTime()).toBeGreaterThan(new Date('2024-01-01').getTime());
    });

    it('should create incomplete todo', () => {
      const todo = createMockTodoWithStatus(false);

      expect(todo.completed).toBe(false);
      expect(todo.updatedAt).toEqual(new Date('2024-01-01'));
    });

    it('should apply additional overrides', () => {
      const todo = createMockTodoWithStatus(true, { title: 'Completed Todo' });

      expect(todo.completed).toBe(true);
      expect(todo.title).toBe('Completed Todo');
    });
  });

  describe('createMockTodoWithPriority', () => {
    it('should create low priority todo', () => {
      const todo = createMockTodoWithPriority('low');

      expect(todo.priority).toBe('low');
      expect(todo.tags).toEqual(['low-priority']);
    });

    it('should create medium priority todo', () => {
      const todo = createMockTodoWithPriority('medium');

      expect(todo.priority).toBe('medium');
      expect(todo.tags).toEqual(['work']);
    });

    it('should create high priority todo', () => {
      const todo = createMockTodoWithPriority('high');

      expect(todo.priority).toBe('high');
      expect(todo.tags).toEqual(['urgent', 'important']);
    });

    it('should apply additional overrides', () => {
      const todo = createMockTodoWithPriority('high', { title: 'High Priority Todo' });

      expect(todo.priority).toBe('high');
      expect(todo.title).toBe('High Priority Todo');
      expect(todo.tags).toEqual(['urgent', 'important']);
    });
  });

  describe('createMockTodoWithDueDate', () => {
    it('should create todo with future due date', () => {
      const todo = createMockTodoWithDueDate(7); // 7 days from now

      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 7);

      expect(todo.dueDate).toBeDefined();
      expect(todo.dueDate!.toDateString()).toBe(expectedDate.toDateString());
    });

    it('should create todo with past due date', () => {
      const todo = createMockTodoWithDueDate(-3); // 3 days ago

      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - 3);

      expect(todo.dueDate).toBeDefined();
      expect(todo.dueDate!.toDateString()).toBe(expectedDate.toDateString());
    });

    it('should apply additional overrides', () => {
      const todo = createMockTodoWithDueDate(1, { title: 'Due Tomorrow' });

      expect(todo.title).toBe('Due Tomorrow');
      expect(todo.dueDate).toBeDefined();
    });
  });

  describe('createMockTodoWithBlockchain', () => {
    it('should create todo with blockchain data', () => {
      const todo = createMockTodoWithBlockchain('polygon');

      expect(todo.blockchainNetwork).toBe('polygon');
      expect(todo.transactionHash).toMatch(/^0x[a-f0-9]{64}$/);
      expect(todo.blockchainAddress).toMatch(/^0x[a-f0-9]{40}$/);
      expect(todo.tags).toEqual(['blockchain', 'polygon']);
    });

    it('should create unique blockchain data for each call', () => {
      const todo1 = createMockTodoWithBlockchain('solana');
      const todo2 = createMockTodoWithBlockchain('solana');

      expect(todo1.transactionHash).not.toBe(todo2.transactionHash);
      expect(todo1.blockchainAddress).not.toBe(todo2.blockchainAddress);
      expect(todo1.blockchainNetwork).toBe(todo2.blockchainNetwork);
    });

    it('should apply additional overrides', () => {
      const todo = createMockTodoWithBlockchain('ethereum', {
        title: 'Blockchain Todo',
        completed: true,
      });

      expect(todo.title).toBe('Blockchain Todo');
      expect(todo.completed).toBe(true);
      expect(todo.blockchainNetwork).toBe('ethereum');
    });
  });
});
