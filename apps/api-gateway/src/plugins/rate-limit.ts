import { Elysia } from 'elysia';
import Redis from 'ioredis';

import { config } from '../config/env';
import { getCorrelationId, getRequestId } from './request-id';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
let redisClient: Redis | null | undefined;

function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
}

function getRedisClient(): Redis | null {
  if (!config.rateLimiting.redisUrl) return null;
  if (redisClient === undefined) {
    redisClient = new Redis(config.rateLimiting.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }
  return redisClient;
}

async function hitRedisBucket(key: string, now: number): Promise<Bucket | null> {
  const client = getRedisClient();
  if (!client) return null;

  const redisKey = `api-gateway:rate-limit:${key}`;
  try {
    const count = await client.incr(redisKey);
    if (count === 1) {
      await client.pexpire(redisKey, config.rateLimiting.windowMs);
    }
    const ttl = await client.pttl(redisKey);

    return {
      count,
      resetAt: now + (ttl > 0 ? ttl : config.rateLimiting.windowMs),
    };
  } catch {
    return null;
  }
}

function hitMemoryBucket(key: string, now: number): Bucket {
  const existing = buckets.get(key);
  const bucket =
    !existing || existing.resetAt <= now ? { count: 0, resetAt: now + config.rateLimiting.windowMs } : existing;
  bucket.count += 1;
  buckets.set(key, bucket);

  return bucket;
}

export function resetRateLimitBuckets(): void {
  buckets.clear();
}

export const rateLimitPlugin = new Elysia({ name: 'rate-limit' })
  .onRequest(async ({ request, set }) => {
    if (!config.rateLimiting.rateLimitEnabled) return undefined;

    const now = Date.now();
    const key = clientKey(request);
    const bucket = (await hitRedisBucket(key, now)) ?? hitMemoryBucket(key, now);

    set.headers['x-ratelimit-limit'] = String(config.rateLimiting.max);
    set.headers['x-ratelimit-remaining'] = String(Math.max(config.rateLimiting.max - bucket.count, 0));
    set.headers['x-ratelimit-reset'] = String(Math.ceil(bucket.resetAt / 1000));

    if (bucket.count > config.rateLimiting.max) {
      const requestId = getRequestId(request);
      const correlationId = getCorrelationId(request);
      set.status = 429;
      return {
        error: 'Too Many Requests',
        errorCode: 'GW_RATE_LIMITED',
        message: 'Rate limit exceeded',
        requestId,
        correlationId,
      };
    }

    return undefined;
  })
  .as('global');
