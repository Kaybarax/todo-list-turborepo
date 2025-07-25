import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { TodoApiClient } from '@todo/services';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';

// Mock server setup
const server = setupServer(
  rest.get('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '1';
    const limit = req.url.searchParams.get('limit') || '10';
    const search = req.url.searchParams.get('search');
    const completed = req.url.searchParams.get('completed');
    const priority = req.url.searchParams.get('priority');

    let todos = mockTodos;

    // Apply filters
    if (search) {
      todos = todos.filter(todo => 
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (completed !== null) {
      todos = todos.filter(todo => todo.completed === (completed === 'true'));
    }

    if (priority && priority !== 'all') {
      todos = todos.filter(todo => todo.priority === priority);
    }

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedTodos = todos.slice(startIndex, endIndex);

    return res(
      ctx.json({
        success: true,
        data: {
          todos: paginatedTodos,
          total: todos.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(todos.length / parseInt(limit)),
        },
      })
    );
  }),

  rest.get('http://localhost:3001/api/v1/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    const todo = mockTodos.find(t => t.id === id);

    if (!todo) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Todo not found',
        })
      );
    }

    return res(
      ctx.json({
        success: true,
        data: todo,
      })
    );
  }),

  rest.post('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
    const newTodo = {
      id: `todo-${Date.now()}`,
      ...req.body,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'test-user',
    };

    mockTodos.push(newTodo);

    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: newTodo,
      })
    );
  }),

  rest.put('http://localhost:3001/api/v1/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    const todoIndex = mockTodos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Todo not found',
        })
      );
    }

    mockTodos[todoIndex] = {
      ...mockTodos[todoIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res(
      ctx.json({
        success: true,
        data: mockTodos[todoIndex],
      })
    );
  }),

  rest.patch('http://localhost:3001/api/v1/todos/:id/toggle', (req, res, ctx) => {
    const { id } = req.params;
    const todoIndex = mockTodos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Todo not found',
        })
      );
    }

    mockTodos[todoIndex] = {
      ...mockTodos[todoIndex],
      completed: !mockTodos[todoIndex].completed,
      updatedAt: new Date().toISOString(),
    };

    return res(
      ctx.json({
        success: true,
        data: mockTodos[todoIndex],
      })
    );
  }),

  rest.delete('http://localhost:3001/api/v1/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    const todoIndex = mockTodos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Todo not found',
        })
      );
    }

    mockTodos.splice(todoIndex, 1);

    return res(
      ctx.json({
        success: true,
      })
    );
  }),

  rest.get('http://localhost:3001/api/v1/todos/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const completed = req.url.searchParams.get('completed');
    const priority = req.url.searchParams.get('priority');

    let filteredTodos = mockTodos.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase()) ||
      todo.description.toLowerCase().includes(query.toLowerCase())
    );

    if (completed !== null) {
      filteredTodos = filteredTodos.filter(todo => todo.completed === (completed === 'true'));
    }

    if (priority && priority !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.priority === priority);
    }

    return res(
      ctx.json({
        success: true,
        data: filteredTodos,
      })
    );
  }),

  // Error scenarios
  rest.get('http://localhost:3001/api/v1/todos/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        error: 'Internal server error',
      })
    );
  }),

  rest.post('http://localhost:3001/api/v1/todos/validation-error', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        error: 'Validation failed',
        details: {
          title: 'Title is required',
        },
      })
    );
  })
);

// Mock data
let mockTodos = [
  {
    id: '1',
    title: 'First Todo',
    description: 'First todo description',
    completed: false,
    priority: 'high',
    dueDate: '2024-12-31',
    tags: ['work', 'urgent'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: 'test-user',
  },
  {
    id: '2',
    title: 'Second Todo',
    description: 'Second todo description',
    completed: true,
    priority: 'medium',
    dueDate: '2024-11-30',
    tags: ['personal'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    userId: 'test-user',
  },
  {
    id: '3',
    title: 'Third Todo',
    description: 'Third todo description',
    completed: false,
    priority: 'low',
    dueDate: '2024-10-15',
    tags: ['hobby'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    userId: 'test-user',
  },
];

// Test setup
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  // Reset mock data
  mockTodos = [
    {
      id: '1',
      title: 'First Todo',
      description: 'First todo description',
      completed: false,
      priority: 'high',
      dueDate: '2024-12-31',
      tags: ['work', 'urgent'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'test-user',
    },
    {
      id: '2',
      title: 'Second Todo',
      description: 'Second todo description',
      completed: true,
      priority: 'medium',
      dueDate: '2024-11-30',
      tags: ['personal'],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      userId: 'test-user',
    },
    {
      id: '3',
      title: 'Third Todo',
      description: 'Third todo description',
      completed: false,
      priority: 'low',
      dueDate: '2024-10-15',
      tags: ['hobby'],
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
      userId: 'test-user',
    },
  ];
});
afterAll(() => server.close());

describe('API Integration Tests', () => {
  let apiClient: TodoApiClient;

  beforeEach(() => {
    apiClient = new TodoApiClient({
      baseUrl: 'http://localhost:3001/api/v1',
      timeout: 5000,
    });
  });

  describe('TodoApiClient Integration', () => {
    it('should fetch todos successfully', async () => {
      const result = await apiClient.getTodos();

      expect(result.success).toBe(true);
      expect(result.data.todos).toHaveLength(3);
      expect(result.data.total).toBe(3);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    });

    it('should fetch todos with pagination', async () => {
      const result = await apiClient.getTodos({
        page: 1,
        limit: 2,
      });

      expect(result.success).toBe(true);
      expect(result.data.todos).toHaveLength(2);
      expect(result.data.total).toBe(3);
      expect(result.data.totalPages).toBe(2);
    });

    it('should filter todos by completion status', async () => {
      const result = await apiClient.getTodos({
        completed: false,
      });

      expect(result.success).toBe(true);
      expect(result.data.todos).toHaveLength(2);
      expect(result.data.todos.every(todo => !todo.completed)).toBe(true);
    });

    it('should filter todos by priority', async () => {
      const result = await apiClient.getTodos({
        priority: 'high',
      });

      expect(result.success).toBe(true);
      expect(result.data.todos).toHaveLength(1);
      expect(result.data.todos[0].priority).toBe('high');
    });

    it('should search todos', async () => {
      const result = await apiClient.getTodos({
        search: 'First',
      });

      expect(result.success).toBe(true);
      expect(result.data.todos).toHaveLength(1);
      expect(result.data.todos[0].title).toContain('First');
    });

    it('should get todo by ID', async () => {
      const result = await apiClient.getTodoById('1');

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('1');
      expect(result.data.title).toBe('First Todo');
    });

    it('should handle todo not found', async () => {
      const result = await apiClient.getTodoById('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Todo not found');
    });

    it('should create todo successfully', async () => {
      const newTodo = {
        title: 'New Todo',
        description: 'New todo description',
        priority: 'medium' as const,
        dueDate: '2024-12-31',
        tags: ['new'],
      };

      const result = await apiClient.createTodo(newTodo);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe(newTodo.title);
      expect(result.data.description).toBe(newTodo.description);
      expect(result.data.priority).toBe(newTodo.priority);
      expect(result.data.completed).toBe(false);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('createdAt');
      expect(result.data).toHaveProperty('updatedAt');
    });

    it('should update todo successfully', async () => {
      const updateData = {
        title: 'Updated Todo',
        description: 'Updated description',
        completed: true,
      };

      const result = await apiClient.updateTodo('1', updateData);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe(updateData.title);
      expect(result.data.description).toBe(updateData.description);
      expect(result.data.completed).toBe(updateData.completed);
    });

    it('should toggle todo completion', async () => {
      // Get initial state
      const initialResult = await apiClient.getTodoById('1');
      const initialCompleted = initialResult.data.completed;

      // Toggle completion
      const result = await apiClient.toggleTodo('1');

      expect(result.success).toBe(true);
      expect(result.data.completed).toBe(!initialCompleted);
    });

    it('should delete todo successfully', async () => {
      const result = await apiClient.deleteTodo('1');

      expect(result.success).toBe(true);

      // Verify todo is deleted
      const getResult = await apiClient.getTodoById('1');
      expect(getResult.success).toBe(false);
    });

    it('should search todos with filters', async () => {
      const result = await apiClient.searchTodos('todo', {
        completed: false,
        priority: 'high',
      });

      expect(result.success).toBe(true);
      expect(result.data.every(todo => !todo.completed)).toBe(true);
      expect(result.data.every(todo => todo.priority === 'high')).toBe(true);
    });
  });

  describe('Component-API Integration', () => {
    const mockHandlers = {
      onToggle: jest.fn(),
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      onLoadMore: jest.fn(),
      onSearch: jest.fn(),
      onFilter: jest.fn(),
      onSort: jest.fn(),
    };

    beforeEach(() => {
      Object.values(mockHandlers).forEach(handler => handler.mockClear());
    });

    it('should integrate TodoList with API data', async () => {
      // Fetch data from API
      const apiResult = await apiClient.getTodos();
      
      render(
        <TodoList
          todos={apiResult.data.todos}
          totalCount={apiResult.data.total}
          hasMore={apiResult.data.page < apiResult.data.totalPages}
          isLoading={false}
          {...mockHandlers}
        />
      );

      // Verify todos are rendered
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.getByText('Second Todo')).toBeInTheDocument();
      expect(screen.getByText('Third Todo')).toBeInTheDocument();
      expect(screen.getByText('Showing 3 of 3 todos')).toBeInTheDocument();
    });

    it('should handle search integration', async () => {
      const apiResult = await apiClient.getTodos();
      
      render(
        <TodoList
          todos={apiResult.data.todos}
          totalCount={apiResult.data.total}
          hasMore={false}
          isLoading={false}
          {...mockHandlers}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search todos...');
      fireEvent.change(searchInput, { target: { value: 'First' } });

      expect(mockHandlers.onSearch).toHaveBeenCalledWith('First');
    });

    it('should handle filter integration', async () => {
      const apiResult = await apiClient.getTodos();
      
      render(
        <TodoList
          todos={apiResult.data.todos}
          totalCount={apiResult.data.total}
          hasMore={false}
          isLoading={false}
          {...mockHandlers}
        />
      );

      const filterSelect = screen.getByDisplayValue('all');
      fireEvent.change(filterSelect, { target: { value: 'completed' } });

      expect(mockHandlers.onFilter).toHaveBeenCalledWith('completed');
    });

    it('should integrate TodoForm with API creation', async () => {
      const mockOnSubmit = jest.fn(async (data) => {
        const result = await apiClient.createTodo(data);
        return result;
      });

      render(
        <TodoForm
          onSubmit={mockOnSubmit}
          onCancel={jest.fn()}
        />
      );

      // Fill form
      fireEvent.change(screen.getByPlaceholderText('Enter todo title'), {
        target: { value: 'Integration Test Todo' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter description (optional)'), {
        target: { value: 'Testing integration' }
      });

      // Submit form
      fireEvent.click(screen.getByText('Create Todo'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Integration Test Todo',
          description: 'Testing integration',
          priority: 'medium',
          dueDate: '',
          tags: [],
        });
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API server errors', async () => {
      server.use(
        rest.get('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              success: false,
              error: 'Internal server error',
            })
          );
        })
      );

      await expect(apiClient.getTodos()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      server.use(
        rest.get('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      await expect(apiClient.getTodos()).rejects.toThrow();
    });

    it('should handle validation errors', async () => {
      server.use(
        rest.post('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              success: false,
              error: 'Validation failed',
              details: {
                title: 'Title is required',
              },
            })
          );
        })
      );

      await expect(apiClient.createTodo({
        title: '',
        description: 'Test',
        priority: 'medium',
      })).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      server.use(
        rest.get('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
          return res(ctx.delay(10000)); // Delay longer than timeout
        })
      );

      const shortTimeoutClient = new TodoApiClient({
        baseUrl: 'http://localhost:3001/api/v1',
        timeout: 1000, // 1 second timeout
      });

      await expect(shortTimeoutClient.getTodos()).rejects.toThrow();
    });
  });

  describe('Real-time Updates Integration', () => {
    it('should handle optimistic updates', async () => {
      // Simulate optimistic update scenario
      const optimisticTodo = {
        id: 'temp-id',
        title: 'Optimistic Todo',
        description: 'This should update optimistically',
        completed: false,
        priority: 'medium' as const,
        dueDate: '2024-12-31',
        tags: ['optimistic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'test-user',
      };

      // Add optimistic todo to list
      const todosWithOptimistic = [...mockTodos, optimisticTodo];

      render(
        <TodoList
          todos={todosWithOptimistic}
          totalCount={todosWithOptimistic.length}
          hasMore={false}
          isLoading={false}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Optimistic Todo')).toBeInTheDocument();

      // Simulate API call completion
      const result = await apiClient.createTodo({
        title: optimisticTodo.title,
        description: optimisticTodo.description,
        priority: optimisticTodo.priority,
        dueDate: optimisticTodo.dueDate,
        tags: optimisticTodo.tags,
      });

      expect(result.success).toBe(true);
      expect(result.data.title).toBe(optimisticTodo.title);
    });

    it('should handle rollback on API failure', async () => {
      server.use(
        rest.post('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              success: false,
              error: 'Server error',
            })
          );
        })
      );

      try {
        await apiClient.createTodo({
          title: 'Failed Todo',
          description: 'This should fail',
          priority: 'medium',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Verify original data is unchanged
      const result = await apiClient.getTodos();
      expect(result.data.todos.find(todo => todo.title === 'Failed Todo')).toBeUndefined();
    });
  });

  describe('Performance Integration', () => {
    it('should handle large datasets efficiently', async () => {
      // Create large dataset
      const largeMockTodos = Array.from({ length: 1000 }, (_, i) => ({
        id: `large-todo-${i}`,
        title: `Large Todo ${i}`,
        description: `Description for todo ${i}`,
        completed: i % 2 === 0,
        priority: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high',
        dueDate: '2024-12-31',
        tags: [`tag-${i % 5}`],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'test-user',
      }));

      server.use(
        rest.get('http://localhost:3001/api/v1/todos', (req, res, ctx) => {
          const page = parseInt(req.url.searchParams.get('page') || '1');
          const limit = parseInt(req.url.searchParams.get('limit') || '10');
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;

          return res(
            ctx.json({
              success: true,
              data: {
                todos: largeMockTodos.slice(startIndex, endIndex),
                total: largeMockTodos.length,
                page,
                limit,
                totalPages: Math.ceil(largeMockTodos.length / limit),
              },
            })
          );
        })
      );

      const startTime = Date.now();
      const result = await apiClient.getTodos({ page: 1, limit: 50 });
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(result.data.todos).toHaveLength(50);
      expect(result.data.total).toBe(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent requests efficiently', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        apiClient.getTodos({ page: i + 1, limit: 10 })
      );

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });
});