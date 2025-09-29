type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const ENABLE_DEBUG = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = { level, message, ...context };
  const ts = new Date().toISOString();
  // eslint-disable-next-line no-console
  if (level === 'error') console.error(`[mobile][${ts}]`, payload);
  else if (level === 'warn') console.warn(`[mobile][${ts}]`, payload);
  else if (ENABLE_DEBUG) console.log(`[mobile][${ts}]`, payload);
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};

export default logger;
