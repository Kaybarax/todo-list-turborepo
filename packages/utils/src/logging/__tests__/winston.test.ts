import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createLogger,
  createIngestionLogger,
  createApiLogger,
  createWebLogger,
  logger,
  LOG_LEVELS,
  LoggerOptions,
} from '../winston';

describe('Winston Logger Utilities', () => {
  describe('createLogger', () => {
    it('should create a logger instance', () => {
      const result = createLogger();
      expect(result).toBeDefined();
      expect(typeof result.info).toBe('function');
      expect(typeof result.error).toBe('function');
      expect(typeof result.warn).toBe('function');
      expect(typeof result.debug).toBe('function');
    });

    it('should create a logger with custom service name', () => {
      const result = createLogger({ service: 'test-service' });
      expect(result).toBeDefined();
    });

    it('should create a logger with custom log level', () => {
      const result = createLogger({ level: 'debug' });
      expect(result).toBeDefined();
    });

    it('should create a logger with file logging disabled', () => {
      const result = createLogger({ enableFileLogging: false });
      expect(result).toBeDefined();
    });

    it('should create a logger with console logging disabled', () => {
      const result = createLogger({ enableConsoleLogging: false });
      expect(result).toBeDefined();
    });

    it('should create a logger with custom log directory', () => {
      const result = createLogger({
        enableFileLogging: true,
        logDirectory: 'custom-logs',
      });
      expect(result).toBeDefined();
    });

    it('should create a logger with custom default metadata', () => {
      const result = createLogger({
        defaultMeta: { version: '1.0.0', environment: 'test' },
      });
      expect(result).toBeDefined();
    });

    it('should respect LOG_LEVEL environment variable', () => {
      const originalLogLevel = process.env.LOG_LEVEL;
      process.env.LOG_LEVEL = 'warn';

      const result = createLogger();
      expect(result).toBeDefined();

      // Restore original value
      if (originalLogLevel !== undefined) {
        process.env.LOG_LEVEL = originalLogLevel;
      } else {
        delete process.env.LOG_LEVEL;
      }
    });
  });

  describe('createIngestionLogger', () => {
    it('should create a logger with ingestion service name', () => {
      const result = createIngestionLogger();
      expect(result).toBeDefined();
      expect(typeof result.info).toBe('function');
    });

    it('should allow overriding options', () => {
      const result = createIngestionLogger({ level: 'debug' });
      expect(result).toBeDefined();
    });
  });

  describe('createApiLogger', () => {
    it('should create a logger with api service name', () => {
      const result = createApiLogger();
      expect(result).toBeDefined();
      expect(typeof result.info).toBe('function');
    });

    it('should allow overriding options', () => {
      const result = createApiLogger({ level: 'error' });
      expect(result).toBeDefined();
    });
  });

  describe('createWebLogger', () => {
    it('should create a logger with web app service name', () => {
      const result = createWebLogger();
      expect(result).toBeDefined();
      expect(typeof result.info).toBe('function');
    });

    it('should allow overriding options', () => {
      const result = createWebLogger({ level: 'debug' });
      expect(result).toBeDefined();
    });
  });

  describe('default logger', () => {
    it('should export a default logger instance', () => {
      expect(logger).toBeDefined();
    });
  });

  describe('LOG_LEVELS', () => {
    it('should export Winston log levels', () => {
      expect(LOG_LEVELS).toEqual({
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      });
    });
  });
});
