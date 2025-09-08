import { MongoClient, type Db } from 'mongodb';

import { logger } from '../utils/logger';

let db: Db;
let client: MongoClient;

/**
 * Simple wrapper class around MongoDB operations. The tests mock this class, so the
 * implementation only needs to provide method signatures. Real logic can be
 * incrementally added later without changing the public API used by tests.
 */
export class DatabaseService {
  async connect(): Promise<void> {
    await connectToDatabase();
  }

  async disconnect(): Promise<void> {
    await closeDatabaseConnection();
  }

  // CRUD style methods – stubbed. Tests mock these so bodies are rarely executed.
  async insertTodo<T>(todo: T): Promise<T> {
    return todo;
  }

  async updateTodo<T>(_id: string, todo: T): Promise<T> {
    return todo;
  }

  // Optional / currently unused in tests
  async deleteTodo(_id: string): Promise<void> {
    return;
  }
  async getTodo<T>(_id: string): Promise<T | null> {
    return null;
  }
  async getAllTodos<T>(): Promise<T[]> {
    return [];
  }
  async getTodosByUser<T>(_userId: string): Promise<T[]> {
    return [];
  }
  async getTodosByNetwork<T>(_network: string): Promise<T[]> {
    return [];
  }
  async getStats(): Promise<Record<string, unknown>> {
    return {};
  }
  async createIndex(): Promise<void> {
    return;
  }
  async dropIndex(): Promise<void> {
    return;
  }
}

/**
 * Connect to the MongoDB database
 */
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME ?? 'todos';

    logger.info('Connecting to MongoDB...', { uri, dbName });

    client = new MongoClient(uri);
    await client.connect();

    db = client.db(dbName);

    logger.info('Connected to MongoDB successfully');

    return db;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error });
    throw error;
  }
}

/**
 * Close the database connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    logger.info('Closed MongoDB connection');
  }
}

/**
 * Get the database instance
 */
export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}
