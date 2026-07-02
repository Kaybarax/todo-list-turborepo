import { Test, type TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';

import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  const buildMockConnection = (readyState: number, name = 'test-db') =>
    ({ readyState, name }) as any;

  const buildMockRedisClient = (pingBehavior: 'connected' | 'disconnected' | 'none') => {
    if (pingBehavior === 'none') return undefined;
    if (pingBehavior === 'connected') {
      return { ping: jest.fn().mockResolvedValue('PONG') };
    }
    return { ping: jest.fn().mockRejectedValue(new Error('Redis connection refused')) };
  };

  const compileService = async (
    readyState: number,
    redisBehavior: 'connected' | 'disconnected' | 'none',
  ) => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: getConnectionToken(), useValue: buildMockConnection(readyState) },
        { provide: 'REDIS_CLIENT', useValue: buildMockRedisClient(redisBehavior) },
      ],
    }).compile();
    return module.get<HealthService>(HealthService);
  };

  // ── All-up state ──────────────────────────────────────────────────────────
  describe('all-up state (DB + Cache connected)', () => {
    beforeAll(async () => {
      service = await compileService(1, 'connected');
    });

    describe('getHealth', () => {
      it('should report both dependencies as connected', async () => {
        const result = await service.getHealth();

        expect(result.status).toBe('ok');
        expect(result.database.status).toBe('connected');
        expect(result.cache.status).toBe('connected');
        expect(result.database.name).toBe('test-db');
        expect(result.timestamp).toBeDefined();
        expect(result.uptime).toBeGreaterThan(0);
        expect(result.memory).toBeDefined();
        expect(result.version).toBeDefined();
      });
    });

    describe('getReadiness', () => {
      it('should return ready when both dependencies are connected', async () => {
        const result = await service.getReadiness();

        expect(result.status).toBe('ready');
        expect(result.checks.database).toBe(true);
        expect(result.checks.cache).toBe(true);
      });
    });
  });

  // ── Partial-down: DB disconnected, Cache connected ────────────────────────
  describe('partial-down state (DB disconnected, Cache connected)', () => {
    beforeAll(async () => {
      service = await compileService(0, 'connected');
    });

    describe('getHealth', () => {
      it('should report database as disconnected', async () => {
        const result = await service.getHealth();

        expect(result.status).toBe('ok');
        expect(result.database.status).toBe('disconnected');
        expect(result.cache.status).toBe('connected');
      });
    });

    describe('getReadiness', () => {
      it('should return not ready when database is disconnected', async () => {
        const result = await service.getReadiness();

        expect(result.status).toBe('not ready');
        expect(result.checks.database).toBe(false);
        expect(result.checks.cache).toBe(true);
      });
    });
  });

  // ── Partial-down: DB connected, Cache disconnected ────────────────────────
  describe('partial-down state (DB connected, Cache disconnected)', () => {
    beforeAll(async () => {
      service = await compileService(1, 'disconnected');
    });

    describe('getHealth', () => {
      it('should report cache as disconnected', async () => {
        const result = await service.getHealth();

        expect(result.status).toBe('ok');
        expect(result.database.status).toBe('connected');
        expect(result.cache.status).toBe('disconnected');
      });
    });

    describe('getReadiness', () => {
      it('should return not ready when cache is disconnected', async () => {
        const result = await service.getReadiness();

        expect(result.status).toBe('not ready');
        expect(result.checks.database).toBe(true);
        expect(result.checks.cache).toBe(false);
      });
    });
  });

  // ── All-down: DB + Cache both disconnected ────────────────────────────────
  describe('all-down state (DB disconnected, Cache disconnected)', () => {
    beforeAll(async () => {
      service = await compileService(0, 'disconnected');
    });

    describe('getHealth', () => {
      it('should report both dependencies as disconnected', async () => {
        const result = await service.getHealth();

        expect(result.status).toBe('ok');
        expect(result.database.status).toBe('disconnected');
        expect(result.cache.status).toBe('disconnected');
      });
    });

    describe('getReadiness', () => {
      it('should return not ready when both dependencies are disconnected', async () => {
        const result = await service.getReadiness();

        expect(result.status).toBe('not ready');
        expect(result.checks.database).toBe(false);
        expect(result.checks.cache).toBe(false);
      });
    });
  });

  // ── Edge case: Redis client is undefined ──────────────────────────────────
  describe('edge case: no Redis client configured', () => {
    beforeAll(async () => {
      service = await compileService(1, 'none');
    });

    describe('getHealth', () => {
      it('should report cache as disconnected when no Redis client is available', async () => {
        const result = await service.getHealth();

        expect(result.status).toBe('ok');
        expect(result.database.status).toBe('connected');
        expect(result.cache.status).toBe('disconnected');
      });
    });

    describe('getReadiness', () => {
      it('should report cache check as false when no Redis client is available', async () => {
        const result = await service.getReadiness();

        expect(result.status).toBe('not ready');
        expect(result.checks.database).toBe(true);
        expect(result.checks.cache).toBe(false);
      });
    });
  });

  // ── Response shape ────────────────────────────────────────────────────────
  describe('response shape', () => {
    beforeAll(async () => {
      service = await compileService(1, 'connected');
    });

    it('should return a valid ISO timestamp in getHealth', async () => {
      const result = await service.getHealth();
      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return a valid ISO timestamp in getReadiness', async () => {
      const result = await service.getReadiness();
      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return a positive uptime value', async () => {
      const result = await service.getHealth();
      expect(result.uptime).toBeGreaterThan(0);
    });
  });
});
