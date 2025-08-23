import winston from 'winston';

export interface LoggerOptions {
  /**
   * Service name to include in log metadata
   */
  service?: string;
  /**
   * Log level (default: 'info')
   */
  level?: string;
  /**
   * Whether to enable file logging (default: true)
   */
  enableFileLogging?: boolean;
  /**
   * Directory for log files (default: 'logs')
   */
  logDirectory?: string;
  /**
   * Whether to enable console logging (default: true)
   */
  enableConsoleLogging?: boolean;
  /**
   * Additional metadata to include in all logs
   */
  defaultMeta?: Record<string, any>;
}

/**
 * Creates a Winston logger instance with configurable options
 * @param options Configuration options for the logger
 * @returns Configured Winston logger instance
 */
export function createLogger(options: LoggerOptions = {}): winston.Logger {
  const {
    service = 'application',
    level = process.env.LOG_LEVEL ?? 'info',
    enableFileLogging = true,
    logDirectory = 'logs',
    enableConsoleLogging = true,
    defaultMeta = {},
  } = options;

  const transports: winston.transport[] = [];

  // Console transport
  if (enableConsoleLogging) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      }),
    );
  }

  // File transports
  if (enableFileLogging) {
    // Error log file
    transports.push(
      new winston.transports.File({
        filename: `${logDirectory}/error.log`,
        level: 'error',
      }),
    );

    // Combined log file
    transports.push(
      new winston.transports.File({
        filename: `${logDirectory}/combined.log`,
      }),
    );
  }

  const logger = winston.createLogger({
    level,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    defaultMeta: {
      service,
      ...defaultMeta,
    },
    transports,
  });

  // Add additional console transport for non-production environments
  if (process.env.NODE_ENV !== 'production' && enableConsoleLogging) {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      }),
    );
  }

  return logger;
}

/**
 * Default logger instance for backward compatibility
 */
export const logger = createLogger({
  service: 'default-service',
});

/**
 * Creates a logger specifically configured for ingestion services
 */
export function createIngestionLogger(options: Partial<LoggerOptions> = {}): winston.Logger {
  return createLogger({
    service: 'ingestion-service',
    ...options,
  });
}

/**
 * Creates a logger specifically configured for API services
 */
export function createApiLogger(options: Partial<LoggerOptions> = {}): winston.Logger {
  return createLogger({
    service: 'api-service',
    ...options,
  });
}

/**
 * Creates a logger specifically configured for web applications
 */
export function createWebLogger(options: Partial<LoggerOptions> = {}): winston.Logger {
  return createLogger({
    service: 'web-app',
    enableFileLogging: false, // Web apps typically don't write to files
    ...options,
  });
}

/**
 * Log levels available in Winston
 */
export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;
