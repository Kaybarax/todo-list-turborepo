import { IngestionService } from '../ingestion';
import { DatabaseService } from '../database';
import { logger } from '../../utils/logger';

// Mock dependencies
jest.mock('../database');
jest.mock('../../utils/logger');

describe('IngestionService', () => {
  let ingestionService: IngestionService;
  let mockDatabaseService: jest.Mocked<DatabaseService>;

  const mockTodoData = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    dueDate: '2024-12-31',
    tags: ['test'],
    userId: 'user1',
    blockchainNetwork: 'polygon',
    transactionHash: '0x123abc',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockDatabaseService = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      insertTodo: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn(),
      getTodo: jest.fn(),
      getAllTodos: jest.fn(),
      getTodosByUser: jest.fn(),
      getTodosByNetwork: jest.fn(),
      getStats: jest.fn(),
      createIndex: jest.fn(),
      dropIndex: jest.fn(),
    } as any;

    (DatabaseService as jest.MockedClass<typeof DatabaseService>).mockImplementation(() => mockDatabaseService);

    ingestionService = new IngestionService({
      batchSize: 100,
      retryAttempts: 3,
      retryDelay: 1000,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      const service = new IngestionService();
      expect(service).toBeInstanceOf(IngestionService);
    });

    it('should initialize with custom configuration', () => {
      const config = {
        batchSize: 50,
        retryAttempts: 5,
        retryDelay: 2000,
      };

      const service = new IngestionService(config);
      expect(service).toBeInstanceOf(IngestionService);
    });
  });

  describe('start', () => {
    it('should start ingestion service successfully', async () => {
      mockDatabaseService.connect.mockResolvedValue(undefined);

      await ingestionService.start();

      expect(mockDatabaseService.connect).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Ingestion service started');
    });

    it('should handle database connection errors', async () => {
      const error = new Error('Database connection failed');
      mockDatabaseService.connect.mockRejectedValue(error);

      await expect(ingestionService.start()).rejects.toThrow('Database connection failed');
      expect(logger.error).toHaveBeenCalledWith('Failed to start ingestion service:', error);
    });
  });

  describe('stop', () => {
    it('should stop ingestion service successfully', async () => {
      mockDatabaseService.disconnect.mockResolvedValue(undefined);

      await ingestionService.stop();

      expect(mockDatabaseService.disconnect).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Ingestion service stopped');
    });

    it('should handle database disconnection errors', async () => {
      const error = new Error('Database disconnection failed');
      mockDatabaseService.disconnect.mockRejectedValue(error);

      await expect(ingestionService.stop()).rejects.toThrow('Database disconnection failed');
      expect(logger.error).toHaveBeenCalledWith('Failed to stop ingestion service:', error);
    });
  });

  describe('ingestTodo', () => {
    it('should ingest single todo successfully', async () => {
      mockDatabaseService.insertTodo.mockResolvedValue(mockTodoData);

      const result = await ingestionService.ingestTodo(mockTodoData);

      expect(mockDatabaseService.insertTodo).toHaveBeenCalledWith(mockTodoData);
      expect(result).toEqual(mockTodoData);
      expect(logger.info).toHaveBeenCalledWith('Ingested todo:', mockTodoData.id);
    });

    it('should handle duplicate todo ingestion', async () => {
      const duplicateError = new Error('Duplicate key error');
      duplicateError.name = 'MongoError';
      (duplicateError as any).code = 11000;

      mockDatabaseService.insertTodo.mockRejectedValue(duplicateError);
      mockDatabaseService.updateTodo.mockResolvedValue(mockTodoData);

      const result = await ingestionService.ingestTodo(mockTodoData);

      expect(mockDatabaseService.insertTodo).toHaveBeenCalledWith(mockTodoData);
      expect(mockDatabaseService.updateTodo).toHaveBeenCalledWith(mockTodoData.id, mockTodoData);
      expect(result).toEqual(mockTodoData);
      expect(logger.warn).toHaveBeenCalledWith('Todo already exists, updating:', mockTodoData.id);
    });

    it('should handle ingestion errors', async () => {
      const error = new Error('Ingestion failed');
      mockDatabaseService.insertTodo.mockRejectedValue(error);

      await expect(ingestionService.ingestTodo(mockTodoData)).rejects.toThrow('Ingestion failed');
      expect(logger.error).toHaveBeenCalledWith('Failed to ingest todo:', mockTodoData.id, error);
    });

    it('should validate todo data before ingestion', async () => {
      const invalidTodo = { ...mockTodoData, title: '' };

      await expect(ingestionService.ingestTodo(invalidTodo)).rejects.toThrow('Invalid todo data');
      expect(mockDatabaseService.insertTodo).not.toHaveBeenCalled();
    });
  });

  describe('ingestTodoBatch', () => {
    it('should ingest batch of todos successfully', async () => {
      const todos = [
        mockTodoData,
        { ...mockTodoData, id: '2', title: 'Todo 2' },
        { ...mockTodoData, id: '3', title: 'Todo 3' },
      ];

      mockDatabaseService.insertTodo
        .mockResolvedValueOnce(todos[0])
        .mockResolvedValueOnce(todos[1])
        .mockResolvedValueOnce(todos[2]);

      const result = await ingestionService.ingestTodoBatch(todos);

      expect(mockDatabaseService.insertTodo).toHaveBeenCalledTimes(3);
      expect(result.successful).toBe(3);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(3);
      expect(logger.info).toHaveBeenCalledWith('Batch ingestion completed: 3 successful, 0 failed');
    });

    it('should handle partial batch failures', async () => {
      const todos = [
        mockTodoData,
        { ...mockTodoData, id: '2', title: 'Todo 2' },
        { ...mockTodoData, id: '3', title: 'Todo 3' },
      ];

      mockDatabaseService.insertTodo
        .mockResolvedValueOnce(todos[0])
        .mockRejectedValueOnce(new Error('Failed to insert'))
        .mockResolvedValueOnce(todos[2]);

      const result = await ingestionService.ingestTodoBatch(todos);

      expect(result.successful).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.results).toHaveLength(3);
      expect(result.results[1].success).toBe(false);
      expect(result.results[1].error).toBe('Failed to insert');
    });

    it('should process large batches in chunks', async () => {
      const largeBatch = Array.from({ length: 250 }, (_, i) => ({
        ...mockTodoData,
        id: `todo-${i}`,
        title: `Todo ${i}`,
      }));

      mockDatabaseService.insertTodo.mockResolvedValue(mockTodoData);

      const result = await ingestionService.ingestTodoBatch(largeBatch);

      expect(mockDatabaseService.insertTodo).toHaveBeenCalledTimes(250);
      expect(result.successful).toBe(250);
      expect(result.failed).toBe(0);
    });

    it('should handle empty batch', async () => {
      const result = await ingestionService.ingestTodoBatch([]);

      expect(result.successful).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(mockDatabaseService.insertTodo).not.toHaveBeenCalled();
    });
  });

  describe('ingestFromBlockchain', () => {
    it('should ingest todos from blockchain successfully', async () => {
      const blockchainTodos = [
        {
          id: 'blockchain-1',
          title: 'Blockchain Todo 1',
          description: 'From blockchain',
          completed: false,
          priority: 'high',
          dueDate: '2024-12-31',
          blockchainNetwork: 'polygon',
          transactionHash: '0x123',
          owner: '0xowner',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'blockchain-2',
          title: 'Blockchain Todo 2',
          description: 'From blockchain',
          completed: true,
          priority: 'medium',
          dueDate: '2024-11-30',
          blockchainNetwork: 'polygon',
          transactionHash: '0x456',
          owner: '0xowner',
          createdAt: '2024-01-02T00:00:00Z',
        },
      ];

      // Mock blockchain service
      const mockBlockchainService = {
        getAllTodos: jest.fn().mockResolvedValue({
          success: true,
          data: blockchainTodos,
        }),
      };

      mockDatabaseService.insertTodo
        .mockResolvedValueOnce(blockchainTodos[0])
        .mockResolvedValueOnce(blockchainTodos[1]);

      const result = await ingestionService.ingestFromBlockchain(mockBlockchainService);

      expect(mockBlockchainService.getAllTodos).toHaveBeenCalled();
      expect(mockDatabaseService.insertTodo).toHaveBeenCalledTimes(2);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(logger.info).toHaveBeenCalledWith('Blockchain ingestion completed: 2 successful, 0 failed');
    });

    it('should handle blockchain service errors', async () => {
      const mockBlockchainService = {
        getAllTodos: jest.fn().mockResolvedValue({
          success: false,
          error: 'Blockchain error',
        }),
      };

      await expect(ingestionService.ingestFromBlockchain(mockBlockchainService)).rejects.toThrow(
        'Failed to fetch todos from blockchain: Blockchain error',
      );

      expect(logger.error).toHaveBeenCalledWith('Failed to ingest from blockchain:', expect.any(Error));
    });

    it('should transform blockchain data correctly', async () => {
      const blockchainTodo = {
        id: 'blockchain-1',
        title: 'Blockchain Todo',
        description: 'From blockchain',
        completed: false,
        priority: 'high',
        dueDate: '2024-12-31',
        blockchainNetwork: 'polygon',
        transactionHash: '0x123',
        owner: '0xowner',
        createdAt: '2024-01-01T00:00:00Z',
      };

      const mockBlockchainService = {
        getAllTodos: jest.fn().mockResolvedValue({
          success: true,
          data: [blockchainTodo],
        }),
      };

      mockDatabaseService.insertTodo.mockResolvedValue(blockchainTodo);

      await ingestionService.ingestFromBlockchain(mockBlockchainService);

      expect(mockDatabaseService.insertTodo).toHaveBeenCalledWith({
        ...blockchainTodo,
        userId: blockchainTodo.owner,
        tags: [],
        updatedAt: expect.any(String),
      });
    });
  });

  describe('ingestFromAPI', () => {
    it('should ingest todos from API successfully', async () => {
      const apiTodos = [mockTodoData];

      // Mock API client
      const mockApiClient = {
        getTodos: jest.fn().mockResolvedValue({
          success: true,
          data: apiTodos,
        }),
      };

      mockDatabaseService.insertTodo.mockResolvedValue(mockTodoData);

      const result = await ingestionService.ingestFromAPI(mockApiClient);

      expect(mockApiClient.getTodos).toHaveBeenCalled();
      expect(mockDatabaseService.insertTodo).toHaveBeenCalledWith(mockTodoData);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('should handle API client errors', async () => {
      const mockApiClient = {
        getTodos: jest.fn().mockResolvedValue({
          success: false,
          error: 'API error',
        }),
      };

      await expect(ingestionService.ingestFromAPI(mockApiClient)).rejects.toThrow(
        'Failed to fetch todos from API: API error',
      );
    });

    it('should handle API pagination', async () => {
      const mockApiClient = {
        getTodos: jest
          .fn()
          .mockResolvedValueOnce({
            success: true,
            data: [mockTodoData],
            hasMore: true,
            nextPage: 2,
          })
          .mockResolvedValueOnce({
            success: true,
            data: [{ ...mockTodoData, id: '2' }],
            hasMore: false,
          }),
      };

      mockDatabaseService.insertTodo
        .mockResolvedValueOnce(mockTodoData)
        .mockResolvedValueOnce({ ...mockTodoData, id: '2' });

      const result = await ingestionService.ingestFromAPI(mockApiClient);

      expect(mockApiClient.getTodos).toHaveBeenCalledTimes(2);
      expect(mockDatabaseService.insertTodo).toHaveBeenCalledTimes(2);
      expect(result.successful).toBe(2);
    });
  });

  describe('retry mechanism', () => {
    it('should retry failed operations', async () => {
      mockDatabaseService.insertTodo
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockResolvedValueOnce(mockTodoData);

      const result = await ingestionService.ingestTodo(mockTodoData);

      expect(mockDatabaseService.insertTodo).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockTodoData);
      expect(logger.warn).toHaveBeenCalledWith('Retrying ingestion for todo:', mockTodoData.id, 'Attempt 1');
    });

    it('should fail after max retry attempts', async () => {
      const error = new Error('Persistent error');
      mockDatabaseService.insertTodo.mockRejectedValue(error);

      await expect(ingestionService.ingestTodo(mockTodoData)).rejects.toThrow('Persistent error');
      expect(mockDatabaseService.insertTodo).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should not retry certain types of errors', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      mockDatabaseService.insertTodo.mockRejectedValue(validationError);

      await expect(ingestionService.ingestTodo(mockTodoData)).rejects.toThrow('Validation error');
      expect(mockDatabaseService.insertTodo).toHaveBeenCalledTimes(1); // No retries for validation errors
    });
  });

  describe('monitoring and metrics', () => {
    it('should track ingestion metrics', async () => {
      mockDatabaseService.insertTodo.mockResolvedValue(mockTodoData);

      await ingestionService.ingestTodo(mockTodoData);

      const metrics = ingestionService.getMetrics();
      expect(metrics.totalIngested).toBe(1);
      expect(metrics.totalFailed).toBe(0);
      expect(metrics.successRate).toBe(100);
    });

    it('should track failure metrics', async () => {
      mockDatabaseService.insertTodo.mockRejectedValue(new Error('Ingestion failed'));

      try {
        await ingestionService.ingestTodo(mockTodoData);
      } catch (error) {
        // Expected to fail
      }

      const metrics = ingestionService.getMetrics();
      expect(metrics.totalIngested).toBe(0);
      expect(metrics.totalFailed).toBe(1);
      expect(metrics.successRate).toBe(0);
    });

    it('should reset metrics', () => {
      ingestionService.resetMetrics();

      const metrics = ingestionService.getMetrics();
      expect(metrics.totalIngested).toBe(0);
      expect(metrics.totalFailed).toBe(0);
      expect(metrics.successRate).toBe(0);
    });
  });

  describe('data validation', () => {
    it('should validate required fields', async () => {
      const invalidTodos = [
        { ...mockTodoData, id: '' },
        { ...mockTodoData, title: '' },
        { ...mockTodoData, userId: '' },
      ];

      for (const invalidTodo of invalidTodos) {
        await expect(ingestionService.ingestTodo(invalidTodo)).rejects.toThrow('Invalid todo data');
      }
    });

    it('should validate data types', async () => {
      const invalidTodo = {
        ...mockTodoData,
        completed: 'not-boolean',
        priority: 'invalid-priority',
      };

      await expect(ingestionService.ingestTodo(invalidTodo)).rejects.toThrow('Invalid todo data');
    });

    it('should sanitize input data', async () => {
      const todoWithScripts = {
        ...mockTodoData,
        title: '<script>alert("xss")</script>Clean Title',
        description: '<img src="x" onerror="alert(1)">Clean Description',
      };

      mockDatabaseService.insertTodo.mockResolvedValue(todoWithScripts);

      const result = await ingestionService.ingestTodo(todoWithScripts);

      expect(mockDatabaseService.insertTodo).toHaveBeenCalledWith({
        ...todoWithScripts,
        title: 'Clean Title',
        description: 'Clean Description',
      });
    });
  });

  describe('performance optimization', () => {
    it('should use connection pooling', async () => {
      // Multiple concurrent ingestions should reuse database connections
      const promises = Array.from({ length: 10 }, (_, i) =>
        ingestionService.ingestTodo({ ...mockTodoData, id: `todo-${i}` }),
      );

      mockDatabaseService.insertTodo.mockResolvedValue(mockTodoData);

      await Promise.all(promises);

      expect(mockDatabaseService.connect).toHaveBeenCalledTimes(1); // Connection reused
    });

    it('should implement rate limiting', async () => {
      const startTime = Date.now();

      // Configure rate limiting (e.g., max 5 operations per second)
      const rateLimitedService = new IngestionService({
        rateLimit: { maxOperations: 5, windowMs: 1000 },
      });

      const promises = Array.from({ length: 10 }, (_, i) =>
        rateLimitedService.ingestTodo({ ...mockTodoData, id: `todo-${i}` }),
      );

      mockDatabaseService.insertTodo.mockResolvedValue(mockTodoData);

      await Promise.all(promises);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should take at least 1 second due to rate limiting
      expect(duration).toBeGreaterThan(1000);
    });
  });
});
