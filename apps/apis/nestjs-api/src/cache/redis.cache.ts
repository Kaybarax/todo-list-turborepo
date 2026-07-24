import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { type RedisClientType } from 'redis';

import { type CachePort } from './cache.port';

@Injectable()
export class RedisCacheService implements CachePort {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly client?: RedisClientType;

  constructor(@Optional() @Inject('REDIS_CLIENT') client?: RedisClientType) {
    this.client = client;
  }

  private ensureClient(): asserts this is { client: RedisClientType } {
    if (!this.client) {
      throw new Error('Redis client not available');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      this.logger.warn(`Redis GET failed for key ${key}: ${String(err)}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    if (!this.client) return;
    try {
      const payload = JSON.stringify(value ?? null);
      if (ttlSeconds > 0) {
        await this.client.set(key, payload, { EX: ttlSeconds });
      } else {
        await this.client.set(key, payload);
      }
    } catch (err) {
      this.logger.warn(`Redis SET failed for key ${key}: ${String(err)}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.warn(`Redis DEL failed for key ${key}: ${String(err)}`);
    }
  }

  async delPattern(prefix: string): Promise<void> {
    if (!this.client) return;
    try {
      // Iterate with SCAN to delete keys with the prefix
      let cursor = 0;
      do {
        // Using MATCH with prefix*
        const res = await this.client.scan(cursor, {
          MATCH: `${prefix}*`,
          COUNT: 100,
        });
        cursor = res.cursor;
        const keys = res.keys ?? [];
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } while (cursor !== 0);
    } catch (err) {
      this.logger.warn(`Redis DEL pattern failed for prefix ${prefix}: ${String(err)}`);
    }
  }

  generateUserTodosKey(userId: string, page: number | string, filterString: string): string {
    return `user:${userId}:todos:page:${page}:filter:${filterString}`;
  }

  generateTodoKey(todoId: string): string {
    return `todo:${todoId}`;
  }

  generateUserStatsKey(userId: string): string {
    return `user:${userId}:stats`;
  }

  generateUserPattern(userId: string): string {
    return `user:${userId}:`;
  }
}
