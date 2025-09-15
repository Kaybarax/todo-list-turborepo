import { type Collection } from 'mongodb';

import { getDb, DatabaseService } from './database';
import { createTodo, type Todo } from '../models/todo';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Legacy exported functions (retained for any existing runtime usage)
// ---------------------------------------------------------------------------
export async function startIngestion(): Promise<void> {
  logger.info('Starting data ingestion process');
  const db = getDb();
  const todosCollection: Collection<Todo> = db.collection('todos');
  await setupIndexes(todosCollection);
  setupPeriodicIngestion(todosCollection);
  logger.info('Data ingestion process initialized');
}

// ---------------------------------------------------------------------------
// New IngestionService class (API exercised by tests)
// ---------------------------------------------------------------------------

export interface IngestionConfig {
  batchSize?: number;
  retryAttempts?: number;
  retryDelay?: number; // ms
  rateLimit?: { maxOperations: number; windowMs: number };
}

interface BatchResult<T> {
  successful: number;
  failed: number;
  results: Array<{ item: T; success: boolean; error?: string }>;
}

interface Metrics {
  totalIngested: number;
  totalFailed: number;
  successRate: number; // percentage
}

export class IngestionService {
  private config: Required<Omit<IngestionConfig, 'rateLimit'>> & {
    rateLimit?: { maxOperations: number; windowMs: number };
  };
  private metrics: { totalIngested: number; totalFailed: number } = { totalIngested: 0, totalFailed: 0 };
  private operationTimestamps: number[] = []; // For rate limiting
  private dbService: DatabaseService;
  private connected = false;
  private rateLimitQueue: Promise<void> = Promise.resolve();
  private connecting: Promise<void> | null = null;

  constructor(config?: IngestionConfig) {
    this.config = {
      batchSize: config?.batchSize ?? 100,
      retryAttempts: config?.retryAttempts ?? 3,
      retryDelay: config?.retryDelay ?? 1000,
      rateLimit: config?.rateLimit,
    };
    this.dbService = new DatabaseService();
  }

  async start(): Promise<void> {
    try {
      await this.establishConnectionOnce();
      logger.info('Ingestion service started');
    } catch (error) {
      logger.error('Failed to start ingestion service:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await this.dbService.disconnect();
      this.connected = false;
      logger.info('Ingestion service stopped');
    } catch (error) {
      logger.error('Failed to stop ingestion service:', error);
      throw error;
    }
  }

  getMetrics(): Metrics {
    const { totalIngested, totalFailed } = this.metrics;
    const total = totalIngested + totalFailed;
    return {
      totalIngested,
      totalFailed,
      successRate: total === 0 ? 0 : Math.round((totalIngested / total) * 100),
    };
  }

  resetMetrics(): void {
    this.metrics = { totalIngested: 0, totalFailed: 0 };
  }

  async ingestTodo(todo: any): Promise<any> {
    await this.applyRateLimit();
    this.validateTodo(todo);

    // Connection should be established in start(); if not, attempt once.
    if (!this.connected) {
      await this.establishConnectionOnce();
    }

    try {
      const result = await this.executeWithRetry(todo, async () => {
        return await this.dbService.insertTodo(todo);
      });
      this.metrics.totalIngested += 1;
      logger.info('Ingested todo:', todo.id);
      return result;
    } catch (error: any) {
      if (error?.code === 11000 || error?.message?.includes('Duplicate key')) {
        logger.warn('Todo already exists, updating:', todo.id);
        try {
          const updated = await this.dbService.updateTodo(todo.id, todo);
          this.metrics.totalIngested += 1;
          return updated;
        } catch (updateError) {
          this.metrics.totalFailed += 1;
          logger.error('Failed to ingest todo:', todo.id, updateError);
          throw updateError;
        }
      }
      this.metrics.totalFailed += 1;
      logger.error('Failed to ingest todo:', todo.id, error);
      throw error;
    }
  }

  async ingestTodoBatch(todos: any[]): Promise<BatchResult<any>> {
    const results: BatchResult<any> = { successful: 0, failed: 0, results: [] };
    for (const todo of todos) {
      await this.applyRateLimit();
      try {
        this.validateTodo(todo);
        const inserted = await this.dbService.insertTodo(todo);
        this.metrics.totalIngested += 1;
        results.results.push({ item: inserted, success: true });
        results.successful += 1;
      } catch (e: any) {
        this.metrics.totalFailed += 1;
        results.results.push({ item: todo, success: false, error: e.message });
        results.failed += 1;
      }
    }

    logger.info(`Batch ingestion completed: ${results.successful} successful, ${results.failed} failed`);
    return results;
  }

  async ingestFromBlockchain(blockchainService: any): Promise<BatchResult<any>> {
    const data = await blockchainService.getAllTodos();
    if (!data.success) {
      const error = new Error(`Failed to fetch todos from blockchain: ${data.error}`);
      logger.error('Failed to ingest from blockchain:', error);
      throw error;
    }
    const transformed = data.data.map((t: any) => ({
      ...t,
      userId: t.owner,
      tags: [],
      updatedAt: new Date().toISOString(),
    }));
    const result = await this.ingestTodoBatch(transformed);
    logger.info(`Blockchain ingestion completed: ${result.successful} successful, ${result.failed} failed`);
    return result;
  }

  async ingestFromAPI(apiClient: any): Promise<BatchResult<any>> {
    const aggregated: any[] = [];
    let page = 1;
    while (true) {
      const resp = await apiClient.getTodos({ page });
      if (!resp.success) {
        throw new Error(`Failed to fetch todos from API: ${resp.error}`);
      }
      aggregated.push(...resp.data);
      if (!resp.hasMore) break;
      page = resp.nextPage ?? page + 1;
    }
    return this.ingestTodoBatch(aggregated);
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  private validateTodo(todo: any): void {
    if (!todo?.id || !todo.title || !todo.userId) {
      throw new Error('Invalid todo data');
    }
    if (typeof todo.completed !== 'boolean' && todo.completed !== undefined) {
      throw new Error('Invalid todo data');
    }
    // Basic sanitisation for tests stripping script/markup tags & on* attributes
    if (todo.title)
      todo.title = todo.title
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    if (todo.description)
      todo.description = todo.description
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
  }

  private async executeWithRetry<T>(todo: any, fn: () => Promise<T>): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (e: any) {
        if (e.name === 'ValidationError') throw e;
        if (attempt >= this.config.retryAttempts) throw e;
        logger.warn('Retrying ingestion for todo:', todo.id, `Attempt ${attempt + 1}`);
        attempt += 1;
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
      }
    }
  }

  private async establishConnectionOnce(): Promise<void> {
    if (this.connected) return;
    if (this.connecting) {
      await this.connecting;
      return;
    }
    this.connecting = (async () => {
      try {
        await this.dbService.connect();
        this.connected = true;
      } catch (e) {
        logger.error('Failed to start ingestion service:', e);
        throw e;
      } finally {
        this.connecting = null;
      }
    })();
    await this.connecting;
  }

  private async applyRateLimit(): Promise<void> {
    const rl = this.config.rateLimit;
    if (!rl) return;
    this.rateLimitQueue = this.rateLimitQueue.then(async () => {
      const now = Date.now();
      this.operationTimestamps = this.operationTimestamps.filter(ts => now - ts < rl.windowMs);
      if (this.operationTimestamps.length >= rl.maxOperations) {
        const wait = rl.windowMs - (now - this.operationTimestamps[0]);
        await new Promise(resolve => setTimeout(resolve, wait));
      }
      this.operationTimestamps.push(Date.now());
    });
    return this.rateLimitQueue;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers used by legacy startIngestion route
// ---------------------------------------------------------------------------
async function setupIndexes(collection: Collection<Todo>): Promise<void> {
  try {
    await collection.createIndex({ userId: 1 });
    await collection.createIndex({ completed: 1 });
    await collection.createIndex({ createdAt: 1 });
    await collection.createIndex({ dueDate: 1 });
    await collection.createIndex({ tags: 1 });
  } catch (error) {
    logger.error('Failed to create indexes', { error });
    throw error;
  }
}

function setupPeriodicIngestion(collection: Collection<Todo>): void {
  const INGESTION_INTERVAL = parseInt(process.env.INGESTION_INTERVAL ?? '60000', 10);
  setInterval(() => {
    void (async () => {
      try {
        await processIncomingData(collection);
      } catch (error) {
        logger.error('Error during periodic ingestion', { error });
      }
    })();
  }, INGESTION_INTERVAL);
}

async function processIncomingData(collection: Collection<Todo>): Promise<void> {
  const sampleTodo = createTodo({
    title: `Sample Todo ${new Date().toISOString()}`,
    description: 'This is a sample todo created by the ingestion service',
    userId: 'system',
    priority: 'medium',
  });
  await collection.insertOne(sampleTodo);
}
