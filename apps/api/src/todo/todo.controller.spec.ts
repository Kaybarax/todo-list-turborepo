import { Test, type TestingModule } from '@nestjs/testing';

import { type CreateTodoDto } from './dto/create-todo.dto';
import { type QueryTodoDto } from './dto/query-todo.dto';
import { type UpdateTodoDto } from './dto/update-todo.dto';
import { type Todo } from './schemas/todo.schema';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: jest.Mocked<TodoService>;

  const mockTodo: Todo = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-12-31'),
    tags: ['test'],
    userId: 'user123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    blockchainNetwork: 'polygon',
    transactionHash: '0x123',
  } as Todo;

  const mockUser = { id: 'user123' };

  const mockPaginatedTodos = {
    todos: [mockTodo],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const mockStats = {
    total: 10,
    completed: 5,
    active: 5,
    overdue: 2,
    byPriority: { high: 3, medium: 4, low: 3 },
    byBlockchainNetwork: { polygon: 2, solana: 1 },
  };

  beforeEach(async () => {
    const mockTodoService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getStats: jest.fn(),
      toggleComplete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get(TodoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a todo successfully', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'New Todo',
        description: 'New Description',
        priority: 'high',
        dueDate: '2024-12-31',
        tags: ['new'],
      };

      todoService.create.mockResolvedValue(mockTodo);

      const result = await controller.create(createTodoDto, mockUser);

      expect(todoService.create).toHaveBeenCalledWith(createTodoDto, mockUser.id);
      expect(result).toEqual(mockTodo);
    });

    it('should handle create with minimal data', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Simple Todo',
      };

      todoService.create.mockResolvedValue(mockTodo);

      const result = await controller.create(createTodoDto, mockUser);

      expect(todoService.create).toHaveBeenCalledWith(createTodoDto, mockUser.id);
      expect(result).toEqual(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return paginated todos with default query', async () => {
      const queryDto: QueryTodoDto = {};

      todoService.findAll.mockResolvedValue(mockPaginatedTodos);

      const result = await controller.findAll(queryDto, mockUser);

      expect(todoService.findAll).toHaveBeenCalledWith(queryDto, mockUser.id);
      expect(result).toEqual(mockPaginatedTodos);
    });

    it('should return paginated todos with filters', async () => {
      const queryDto: QueryTodoDto = {
        page: 2,
        limit: 5,
        completed: true,
        priority: 'high',
        search: 'important',
        tag: 'work',
        sortBy: 'dueDate',
        sortOrder: 'asc',
      };

      todoService.findAll.mockResolvedValue(mockPaginatedTodos);

      const result = await controller.findAll(queryDto, mockUser);

      expect(todoService.findAll).toHaveBeenCalledWith(queryDto, mockUser.id);
      expect(result).toEqual(mockPaginatedTodos);
    });

    it('should handle blockchain network filter', async () => {
      const queryDto: QueryTodoDto = {
        blockchainNetwork: 'solana',
      };

      todoService.findAll.mockResolvedValue(mockPaginatedTodos);

      const result = await controller.findAll(queryDto, mockUser);

      expect(todoService.findAll).toHaveBeenCalledWith(queryDto, mockUser.id);
      expect(result).toEqual(mockPaginatedTodos);
    });
  });

  describe('getStats', () => {
    it('should return todo statistics', async () => {
      todoService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(mockUser);

      expect(todoService.getStats).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockStats);
    });
  });

  describe('findOne', () => {
    it('should return a todo by ID', async () => {
      const todoId = 'todo123';

      todoService.findOne.mockResolvedValue(mockTodo);

      const result = await controller.findOne(todoId, mockUser);

      expect(todoService.findOne).toHaveBeenCalledWith(todoId, mockUser.id);
      expect(result).toEqual(mockTodo);
    });

    it('should handle non-existent todo ID', async () => {
      const todoId = 'nonexistent';

      todoService.findOne.mockRejectedValue(new Error('Todo not found'));

      await expect(controller.findOne(todoId, mockUser)).rejects.toThrow('Todo not found');
      expect(todoService.findOne).toHaveBeenCalledWith(todoId, mockUser.id);
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const todoId = 'todo123';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        completed: true,
        priority: 'low',
      };

      const updatedTodo = { ...mockTodo, ...updateTodoDto } as Todo;
      todoService.update.mockResolvedValue(updatedTodo);

      const result = await controller.update(todoId, updateTodoDto, mockUser);

      expect(todoService.update).toHaveBeenCalledWith(todoId, updateTodoDto, mockUser.id);
      expect(result).toEqual(updatedTodo);
    });

    it('should handle partial updates', async () => {
      const todoId = 'todo123';
      const updateTodoDto: UpdateTodoDto = {
        completed: true,
      };

      const updatedTodo = { ...mockTodo, completed: true };
      todoService.update.mockResolvedValue(updatedTodo);

      const result = await controller.update(todoId, updateTodoDto, mockUser);

      expect(todoService.update).toHaveBeenCalledWith(todoId, updateTodoDto, mockUser.id);
      expect(result).toEqual(updatedTodo);
    });

    it('should handle blockchain-related updates', async () => {
      const todoId = 'todo123';
      const updateTodoDto: UpdateTodoDto = {
        blockchainNetwork: 'solana',
        transactionHash: '0xabc123',
      };

      const updatedTodo = { ...mockTodo, ...updateTodoDto } as Todo;
      todoService.update.mockResolvedValue(updatedTodo);

      const result = await controller.update(todoId, updateTodoDto, mockUser);

      expect(todoService.update).toHaveBeenCalledWith(todoId, updateTodoDto, mockUser.id);
      expect(result).toEqual(updatedTodo);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', async () => {
      const todoId = 'todo123';
      const toggledTodo = { ...mockTodo, completed: true };

      todoService.toggleComplete.mockResolvedValue(toggledTodo);

      const result = await controller.toggleComplete(todoId, mockUser);

      expect(todoService.toggleComplete).toHaveBeenCalledWith(todoId, mockUser.id);
      expect(result).toEqual(toggledTodo);
    });

    it('should handle toggle from completed to incomplete', async () => {
      const todoId = 'todo123';
      // const completedTodo = { ...mockTodo, completed: true };
      const toggledTodo = { ...mockTodo, completed: false };

      todoService.toggleComplete.mockResolvedValue(toggledTodo);

      const result = await controller.toggleComplete(todoId, mockUser);

      expect(todoService.toggleComplete).toHaveBeenCalledWith(todoId, mockUser.id);
      expect(result).toEqual(toggledTodo);
    });
  });

  describe('remove', () => {
    it('should remove a todo successfully', async () => {
      const todoId = 'todo123';

      todoService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(todoId, mockUser);

      expect(todoService.remove).toHaveBeenCalledWith(todoId, mockUser.id);
      expect(result).toBeUndefined();
    });

    it('should handle removal of non-existent todo', async () => {
      const todoId = 'nonexistent';

      todoService.remove.mockRejectedValue(new Error('Todo not found'));

      await expect(controller.remove(todoId, mockUser)).rejects.toThrow('Todo not found');
      expect(todoService.remove).toHaveBeenCalledWith(todoId, mockUser.id);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
      };

      todoService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createTodoDto, mockUser)).rejects.toThrow('Database error');
    });

    it('should handle authentication errors', async () => {
      const queryDto: QueryTodoDto = {};

      todoService.findAll.mockRejectedValue(new Error('Unauthorized'));

      await expect(controller.findAll(queryDto, mockUser)).rejects.toThrow('Unauthorized');
    });
  });

  describe('input validation', () => {
    it('should handle empty query parameters', async () => {
      const queryDto: QueryTodoDto = {};

      todoService.findAll.mockResolvedValue(mockPaginatedTodos);

      const result = await controller.findAll(queryDto, mockUser);

      expect(todoService.findAll).toHaveBeenCalledWith({}, mockUser.id);
      expect(result).toEqual(mockPaginatedTodos);
    });

    it('should handle invalid user context', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
      };
      const invalidUser = { id: '' };

      todoService.create.mockRejectedValue(new Error('Invalid user'));

      await expect(controller.create(createTodoDto, invalidUser)).rejects.toThrow('Invalid user');
    });
  });
});
