/**
 * Logging utilities for the @todo/utils package
 *
 * This module provides centralized logging functionality using Winston,
 * with pre-configured loggers for different application types and use cases.
 *
 * @example
 * ```typescript
 * // Basic usage with default logger
 * import { logger } from '@todo/utils/logging';
 * logger.info('Application started');
 *
 * // Create a custom logger
 * import { createLogger } from '@todo/utils/logging';
 * const customLogger = createLogger({
 *   service: 'my-service',
 *   level: 'debug',
 *   enableFileLogging: true,
 * });
 *
 * // Use pre-configured loggers
 * import { createApiLogger, createIngestionLogger } from '@todo/utils/logging';
 * const apiLogger = createApiLogger();
 * const ingestionLogger = createIngestionLogger();
 * ```
 */

// Export all winston utilities
export {
  createLogger,
  createIngestionLogger,
  createApiLogger,
  createWebLogger,
  logger,
  LOG_LEVELS,
  type LoggerOptions,
  type LogLevel,
} from './winston';

/**
 * Logger Usage Patterns
 *
 * ## Basic Logger Creation
 *
 * ```typescript
 * import { createLogger } from '@todo/utils/logging';
 *
 * const logger = createLogger({
 *   service: 'my-service',
 *   level: 'info',
 *   enableFileLogging: true,
 *   logDirectory: 'logs',
 * });
 * ```
 *
 * ## Service-Specific Loggers
 *
 * ### API Services
 * ```typescript
 * import { createApiLogger } from '@todo/utils/logging';
 * const apiLogger = createApiLogger({ level: 'debug' });
 * ```
 *
 * ### Ingestion Services
 * ```typescript
 * import { createIngestionLogger } from '@todo/utils/logging';
 * const ingestionLogger = createIngestionLogger();
 * ```
 *
 * ### Web Applications
 * ```typescript
 * import { createWebLogger } from '@todo/utils/logging';
 * const webLogger = createWebLogger(); // File logging disabled by default
 * ```
 *
 * ## Configuration Options
 *
 * - `service`: Service name for log metadata
 * - `level`: Log level (error, warn, info, http, verbose, debug, silly)
 * - `enableFileLogging`: Enable/disable file output (default: true)
 * - `logDirectory`: Directory for log files (default: 'logs')
 * - `enableConsoleLogging`: Enable/disable console output (default: true)
 * - `defaultMeta`: Additional metadata for all log entries
 *
 * ## Environment Variables
 *
 * - `LOG_LEVEL`: Override the default log level
 * - `NODE_ENV`: Affects console logging behavior (additional console transport in non-production)
 *
 * ## Log Levels
 *
 * Winston log levels in order of priority:
 * - error (0): Error conditions
 * - warn (1): Warning conditions
 * - info (2): Informational messages
 * - http (3): HTTP request logging
 * - verbose (4): Verbose informational messages
 * - debug (5): Debug-level messages
 * - silly (6): Very detailed debug information
 */
