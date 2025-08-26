/**
 * @todo/utils - Centralized Utility Package
 *
 * This package provides a comprehensive collection of utility functions
 * organized by their purpose and the packages they serve. It eliminates
 * code duplication and provides a single source of truth for common
 * utility functions across the monorepo.
 *
 * @example
 * ```typescript
 * // Named imports from specific modules
 * import { getEnvVar, isDefined } from '@todo/utils/common';
 * import { BlockchainError } from '@todo/utils/blockchain';
 * import { cn, ariaAttr } from '@todo/utils/ui/web';
 *
 * // Category-based imports
 * import { common, blockchain, ui } from '@todo/utils';
 * const envVar = common.getEnvVar('NODE_ENV');
 * const error = new blockchain.BlockchainError('Connection failed');
 * const className = ui.web.cn('btn', 'btn-primary');
 *
 * // Direct imports for optimal tree-shaking
 * import { getEnvVar } from '@todo/utils/common/env';
 * import { BlockchainError } from '@todo/utils/blockchain/errors';
 * ```
 */

// =============================================================================
// CATEGORY-BASED EXPORTS
// =============================================================================
// These exports allow importing entire categories of utilities
// Example: import { common, blockchain } from '@todo/utils';

/**
 * Common utilities used across multiple packages and domains
 * Includes environment variables, type guards, and validation functions
 */
export * as common from './common';

/**
 * Blockchain-specific utilities for error handling and transaction monitoring
 * Supports multiple networks including Polygon, Solana, and Polkadot
 */
export * as blockchain from './blockchain';

/**
 * UI-related utilities split between web and mobile platforms
 * Includes accessibility helpers, styling utilities, and responsive design tools
 */
export * as ui from './ui';

/**
 * Testing utilities and helpers for different platforms and testing scenarios
 * Includes mock data creators, testing helpers, and platform-specific utilities
 */
export * as testing from './testing';

/**
 * API-related utilities for data transformation and HTTP operations
 * Currently a placeholder for future API utilities
 */
export * as api from './api';

/**
 * Logging utilities with Winston configuration for different application types
 * Provides pre-configured loggers for API, ingestion, and web applications
 */
export * as logging from './logging';

// =============================================================================
// NAMED EXPORTS FOR COMMON UTILITIES
// =============================================================================
// These exports allow direct named imports of frequently used utilities
// Example: import { getEnvVar, isDefined, cn } from '@todo/utils';

// Common utilities - most frequently used across the monorepo
export {
  // Environment utilities
  getEnvVar,
  requireEnvVar,
  getEnvVarAsBoolean,
  getEnvVarAsNumber,
  isDevelopment,
  isProduction,
  isTest,

  // Type guard utilities
  isDefined,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isNull,
  isUndefined,
  isNullish,
  isNonEmptyString,
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isDate,
  isPromise,
  isError,
  assertNever,
  invariant,
  hasProperty,
  hasPropertyOfType,
  isNonEmptyArray,
  isArrayOf,
  isValidUrl,
  isValidEmail,
} from './common';

// Blockchain utilities - commonly used error handling
export {
  BlockchainError,
  BlockchainErrorType,
  BlockchainNetwork,
  TransactionMonitor,
  TransactionStatus,
  type TransactionReceipt,
  type TransactionMonitorOptions,
} from './blockchain';

// UI utilities - most commonly used web utilities
export {
  // Accessibility
  ariaAttr,
  dataAttr,
  mergeRefs,
  isFocusable,

  // Class utilities
  cn,
  cv,
  cvm,

  // Responsive
  breakpoints,
  mqUp,
  mqDown,
  matches,
  isUp,
  isDown,

  // Tokens
  getToken,
  getTokenWithFallback,
  generateCSSCustomProperties,
  validateTokenStructure,
  mergeTokenThemes,
  TOKEN_CATEGORIES,
  COLOR_SHADES,
  SPACING_SCALE,
} from './ui';

// Logging utilities - commonly used logger functions
export {
  createLogger,
  createIngestionLogger,
  createApiLogger,
  createWebLogger,
  logger,
  LOG_LEVELS,
  type LoggerOptions,
  type LogLevel,
} from './logging';

// Testing utilities - commonly used testing functions
export {
  // Mobile testing
  mobileRender,
  mobileRenderDark,
  customRender,
  customRenderDark,
  createMockTheme,
  testAccessibility,
  testThemeSwitch,
  measureRenderTime,

  // API testing
  apiTodoToTodo,
  createMockTodo,
  createMockApiTodo,
  createMockTodos,
  createMockApiTodos,
  createMockTodoWithStatus,
  createMockTodoWithPriority,
  createMockTodoWithDueDate,
  createMockTodoWithBlockchain,
} from './testing';

// =============================================================================
// TYPE EXPORTS
// =============================================================================
// Export commonly used types for TypeScript support

// Common types
export type { BreakpointKey } from './ui/web/responsive';
export type { BasicDesignTokens } from './ui/web/tokens';
export type { VariantProps } from './ui/web/cva';

// Testing types
export type {
  EvaTheme,
  AccessibilityHelpers,
  ThemeTestResult,
  PerformanceTestResult,
  RenderOptions,
  RenderResult,
  TodoData,
} from './testing';

// =============================================================================
// UTILITY CATEGORIES INTERFACE
// =============================================================================
// This interface documents the structure of the utility categories
// for better TypeScript support and documentation

/**
 * Interface describing the structure of utility categories
 * This is primarily for documentation and type safety
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
export interface UtilityCategories {
  common: typeof import('./common');
  blockchain: typeof import('./blockchain');
  ui: typeof import('./ui');
  testing: typeof import('./testing');
  api: typeof import('./api');
  logging: typeof import('./logging');
}
/* eslint-enable @typescript-eslint/consistent-type-imports */

// =============================================================================
// MIGRATION MAPPING
// =============================================================================
// This constant documents the migration paths from old imports to new ones
// Useful for automated migration tools and documentation

/**
 * Migration mapping from old import paths to new @todo/utils paths
 * This is exported for documentation and potential automated migration tools
 */
export const MIGRATION_MAPPING = {
  // Services package migrations
  'packages/services/src/utils/env.ts': '@todo/utils/common/env',
  'packages/services/src/blockchain/utils/BlockchainError.ts': '@todo/utils/blockchain/errors',
  'packages/services/src/blockchain/utils/TransactionMonitor.ts': '@todo/utils/blockchain/monitoring',

  // UI package migrations
  'packages/ui-web/src/utils/': '@todo/utils/ui/web/',
  'packages/ui-web/src/utils/type-guards.ts': '@todo/utils/common/type-guards',

  // Testing utilities migrations
  'packages/ui-mobile/src/test/utils/eva-test-utils.tsx': '@todo/utils/testing/mobile',
  'apps/web/src/__tests__/test-utils.ts': '@todo/utils/testing/api',

  // App-specific migrations
  'apps/ingestion/src/utils/logger.ts': '@todo/utils/logging/winston',
} as const;

/**
 * Version information for the utils package
 * Updated automatically during build process
 */
export const VERSION = '1.0.0';

/**
 * Package metadata
 */
export const PACKAGE_INFO = {
  name: '@todo/utils',
  version: VERSION,
  description: 'Centralized utility package for the Todo monorepo',
  categories: ['common', 'blockchain', 'ui', 'testing', 'api', 'logging'] as const,
} as const;
