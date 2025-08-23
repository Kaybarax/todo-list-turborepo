import { describe, it, expect } from 'vitest';
import * as loggingUtils from '../index';

describe('Logging Index Exports', () => {
  it('should export createLogger function', () => {
    expect(typeof loggingUtils.createLogger).toBe('function');
  });

  it('should export createIngestionLogger function', () => {
    expect(typeof loggingUtils.createIngestionLogger).toBe('function');
  });

  it('should export createApiLogger function', () => {
    expect(typeof loggingUtils.createApiLogger).toBe('function');
  });

  it('should export createWebLogger function', () => {
    expect(typeof loggingUtils.createWebLogger).toBe('function');
  });

  it('should export default logger instance', () => {
    expect(loggingUtils.logger).toBeDefined();
    expect(typeof loggingUtils.logger.info).toBe('function');
    expect(typeof loggingUtils.logger.error).toBe('function');
    expect(typeof loggingUtils.logger.warn).toBe('function');
    expect(typeof loggingUtils.logger.debug).toBe('function');
  });

  it('should export LOG_LEVELS constant', () => {
    expect(loggingUtils.LOG_LEVELS).toBeDefined();
    expect(typeof loggingUtils.LOG_LEVELS).toBe('object');
    expect(loggingUtils.LOG_LEVELS.error).toBe(0);
    expect(loggingUtils.LOG_LEVELS.warn).toBe(1);
    expect(loggingUtils.LOG_LEVELS.info).toBe(2);
    expect(loggingUtils.LOG_LEVELS.http).toBe(3);
    expect(loggingUtils.LOG_LEVELS.verbose).toBe(4);
    expect(loggingUtils.LOG_LEVELS.debug).toBe(5);
    expect(loggingUtils.LOG_LEVELS.silly).toBe(6);
  });

  it('should allow creating loggers through exported functions', () => {
    const customLogger = loggingUtils.createLogger({
      service: 'test-service',
      level: 'debug',
    });
    expect(customLogger).toBeDefined();
    expect(typeof customLogger.info).toBe('function');

    const apiLogger = loggingUtils.createApiLogger();
    expect(apiLogger).toBeDefined();
    expect(typeof apiLogger.info).toBe('function');

    const ingestionLogger = loggingUtils.createIngestionLogger();
    expect(ingestionLogger).toBeDefined();
    expect(typeof ingestionLogger.info).toBe('function');

    const webLogger = loggingUtils.createWebLogger();
    expect(webLogger).toBeDefined();
    expect(typeof webLogger.info).toBe('function');
  });

  it('should export all expected utilities', () => {
    const expectedExports = [
      'createLogger',
      'createIngestionLogger',
      'createApiLogger',
      'createWebLogger',
      'logger',
      'LOG_LEVELS',
    ];

    expectedExports.forEach(exportName => {
      expect(loggingUtils).toHaveProperty(exportName);
    });
  });
});
