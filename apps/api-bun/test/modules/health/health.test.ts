import { describe, expect, it, beforeAll, afterAll, spyOn } from 'bun:test';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { app } from '../../../src/app';
import { cache } from '../../../src/cache';
import { type HealthResponse, type ReadinessResponse } from '../../../src/schemas/health';

describe('Health Module', () => {
  // ── All-up state: DB + Cache both connected ──────────────────────────────
  describe('all-up state (DB + Cache connected)', () => {
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      await cache.initialize();
    });

    afterAll(async () => {
      await cache.quit();
      await mongoose.disconnect();
      await mongod.stop();
    });

    describe('GET /api/v1/health', () => {
      it('should return 200 with both dependencies reported connected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as HealthResponse;

        expect(data.status).toBe('ok');
        expect(data.timestamp).toBeDefined();
        expect(data.uptime).toBeGreaterThan(0);
        expect(data.database.status).toBe('connected');
        expect(data.cache.status).toBe('connected');
        expect(data.memory).toBeDefined();
        expect(data.version).toBeDefined();
        expect(data.telemetry).toBeDefined();
      });
    });

    describe('GET /api/v1/health/ready', () => {
      it('should return ready when both dependencies are connected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as ReadinessResponse;

        expect(data.status).toBe('ready');
        expect(data.timestamp).toBeDefined();
        expect(data.checks.database).toBe(true);
        expect(data.checks.cache).toBe(true);
      });
    });
  });

  // ── Partial-down state: DB disconnected, Cache connected ─────────────────
  describe('partial-down state (DB disconnected, Cache connected)', () => {
    beforeAll(async () => {
      // Only initialise cache – do NOT connect to MongoDB
      await cache.initialize();
    });

    afterAll(async () => {
      await cache.quit();
    });

    describe('GET /api/v1/health', () => {
      it('should return 200 with database reported disconnected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as HealthResponse;

        expect(data.status).toBe('ok');
        expect(data.database.status).toBe('disconnected');
        expect(data.database.name).toBeDefined();
        expect(data.cache.status).toBe('connected');
      });
    });

    describe('GET /api/v1/health/ready', () => {
      it('should return not ready when database is disconnected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as ReadinessResponse;

        expect(data.status).toBe('not ready');
        expect(data.checks.database).toBe(false);
        expect(data.checks.cache).toBe(true);
      });
    });
  });

  // ── Partial-down state: DB connected, Cache disconnected ─────────────────
  describe('partial-down state (DB connected, Cache disconnected)', () => {
    let mongod: MongoMemoryServer;
    let cachePingSpy: ReturnType<typeof spyOn>;

    beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      // Do NOT initialise real cache; stub ping() to simulate disconnect
      cachePingSpy = spyOn(cache, 'ping').mockImplementation(async () => false);
    });

    afterAll(async () => {
      cachePingSpy.mockRestore();
      await mongoose.disconnect();
      await mongod.stop();
    });

    describe('GET /api/v1/health', () => {
      it('should return 200 with cache reported disconnected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as HealthResponse;

        expect(data.status).toBe('ok');
        expect(data.database.status).toBe('connected');
        expect(data.cache.status).toBe('disconnected');
      });
    });

    describe('GET /api/v1/health/ready', () => {
      it('should return not ready when cache is disconnected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as ReadinessResponse;

        expect(data.status).toBe('not ready');
        expect(data.checks.database).toBe(true);
        expect(data.checks.cache).toBe(false);
      });
    });
  });

  // ── All-down state: DB + Cache both disconnected ─────────────────────────
  describe('all-down state (DB disconnected, Cache disconnected)', () => {
    let cachePingSpy: ReturnType<typeof spyOn>;

    beforeAll(async () => {
      // Do NOT connect to MongoDB and do NOT initialise cache
      // Stub cache.ping() to simulate disconnect
      cachePingSpy = spyOn(cache, 'ping').mockImplementation(async () => false);
    });

    afterAll(async () => {
      cachePingSpy.mockRestore();
    });

    describe('GET /api/v1/health', () => {
      it('should return 200 with both dependencies reported disconnected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as HealthResponse;

        expect(data.status).toBe('ok');
        expect(data.database.status).toBe('disconnected');
        expect(data.database.name).toBeDefined();
        expect(data.cache.status).toBe('disconnected');
      });
    });

    describe('GET /api/v1/health/ready', () => {
      it('should return not ready when both dependencies are disconnected', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/health/ready'));

        expect(response.status).toBe(200);
        const data = (await response.json()) as ReadinessResponse;

        expect(data.status).toBe('not ready');
        expect(data.checks.database).toBe(false);
        expect(data.checks.cache).toBe(false);
      });
    });
  });
});
