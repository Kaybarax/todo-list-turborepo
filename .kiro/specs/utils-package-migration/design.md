# Design Document

## Overview

The utils package migration involves creating a new `@todo/utils` package that consolidates all utility functions from across the monorepo into a single, well-organized package. This design ensures proper separation of concerns, eliminates code duplication, and provides a scalable structure for future utility additions.

## Architecture

### Package Structure

```
packages/utils/
├── src/
│   ├── common/           # Common utilities used across multiple packages
│   │   ├── env.ts        # Environment variable utilities
│   │   ├── type-guards.ts # Type guard utilities
│   │   ├── validation.ts  # Common validation utilities
│   │   └── index.ts      # Common utilities exports
│   ├── blockchain/       # Blockchain-specific utilities
│   │   ├── errors.ts     # BlockchainError class
│   │   ├── monitoring.ts # TransactionMonitor class
│   │   └── index.ts      # Blockchain utilities exports
│   ├── ui/              # UI-related utilities
│   │   ├── web/         # Web-specific UI utilities
│   │   │   ├── a11y.ts  # Accessibility utilities
│   │   │   ├── cva.ts   # Class variance authority utilities
│   │   │   ├── responsive.ts # Responsive utilities
│   │   │   ├── tokens.ts # Token utilities
│   │   │   └── index.ts # Web UI utilities exports
│   │   ├── mobile/      # Mobile-specific UI utilities
│   │   │   └── index.ts # Mobile UI utilities exports
│   │   └── index.ts     # All UI utilities exports
│   ├── testing/         # Testing utilities
│   │   ├── web.ts       # Web testing utilities
│   │   ├── mobile.ts    # Mobile testing utilities (Eva test utils)
│   │   ├── api.ts       # API testing utilities
│   │   └── index.ts     # Testing utilities exports
│   ├── api/             # API-related utilities
│   │   ├── transforms.ts # Data transformation utilities
│   │   └── index.ts     # API utilities exports
│   ├── logging/         # Logging utilities
│   │   ├── winston.ts   # Winston logger configuration
│   │   └── index.ts     # Logging utilities exports
│   └── index.ts         # Main package exports
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

### Import Strategy

The package will support multiple import patterns:

1. **Named imports from specific modules:**

   ```typescript
   import { getEnvVar } from '@todo/utils/common';
   import { BlockchainError } from '@todo/utils/blockchain';
   import { cn, ariaAttr } from '@todo/utils/ui/web';
   ```

2. **Category-based imports:**

   ```typescript
   import { common, blockchain, ui } from '@todo/utils';
   ```

3. **Direct imports for tree-shaking:**
   ```typescript
   import { getEnvVar } from '@todo/utils/common/env';
   import { BlockchainError } from '@todo/utils/blockchain/errors';
   ```

## Components and Interfaces

### 1. Common Utilities Module

**Purpose:** Houses utilities used across multiple packages and domains.

**Components:**

- `env.ts`: Environment variable access utilities
- `type-guards.ts`: TypeScript type guard functions
- `validation.ts`: Common validation functions

**Key Functions:**

```typescript
// Environment utilities
export function getEnvVar(key: string, defaultValue?: string): string;

// Type guards
export function isDefined<T>(value: T | null | undefined): value is T;
export function isString(value: unknown): value is string;
export function assertNever(x: never, message?: string): never;
```

### 2. Blockchain Utilities Module

**Purpose:** Blockchain-specific utilities for error handling and transaction monitoring.

**Components:**

- `errors.ts`: BlockchainError class with static factory methods
- `monitoring.ts`: TransactionMonitor class for transaction status tracking

**Key Classes:**

```typescript
export class BlockchainError extends Error {
  static walletConnectionFailed(message: string, originalError?: unknown): BlockchainError;
  static transactionFailed(message: string, txHash?: string): BlockchainError;
  // ... other static factory methods
}

export class TransactionMonitor {
  async monitorTransaction(txHash: string, network: BlockchainNetwork): Promise<TransactionReceipt>;
  getStatus(txHash: string): TransactionStatus;
  stopMonitoring(txHash: string): void;
}
```

### 3. UI Utilities Module

**Purpose:** UI-related utilities split between web and mobile platforms.

**Web Utilities:**

- `a11y.ts`: Accessibility helpers (ariaAttr, mergeRefs, isFocusable)
- `cva.ts`: Class variance authority utilities
- `responsive.ts`: Responsive design utilities
- `tokens.ts`: Design token access utilities

**Mobile Utilities:**

- Testing utilities for Eva Design System integration

**Key Functions:**

```typescript
// Web utilities
export function cn(...inputs: ClassValue[]): string;
export function ariaAttr(value?: boolean | null): 'true' | undefined;
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (value: T) => void;

// Responsive utilities
export function mqUp(bp: BreakpointKey): string;
export function isUp(bp: BreakpointKey): boolean;
```

### 4. Testing Utilities Module

**Purpose:** Testing helpers and utilities for different platforms and testing scenarios.

**Components:**

- `web.ts`: Web-specific testing utilities
- `mobile.ts`: Mobile testing utilities with Eva Design providers
- `api.ts`: API testing utilities and mock data creators

**Key Functions:**

```typescript
// API testing utilities
export function createMockTodo(overrides?: Partial<Todo>): Todo;
export function apiTodoToTodo(apiTodo: Partial<ApiTodo>): Todo;

// Mobile testing utilities
export function render(ui: React.ReactElement, options?: RenderOptions): RenderResult;
export function testAccessibility(component: React.ReactElement): Promise<AccessibilityHelpers>;
```

### 5. Logging Utilities Module

**Purpose:** Centralized logging configuration and utilities.

**Components:**

- `winston.ts`: Winston logger configuration with environment-specific settings

## Data Models

### Utility Categories

```typescript
export interface UtilityCategories {
  common: {
    env: typeof import('./common/env');
    typeGuards: typeof import('./common/type-guards');
    validation: typeof import('./common/validation');
  };
  blockchain: {
    errors: typeof import('./blockchain/errors');
    monitoring: typeof import('./blockchain/monitoring');
  };
  ui: {
    web: typeof import('./ui/web');
    mobile: typeof import('./ui/mobile');
  };
  testing: {
    web: typeof import('./testing/web');
    mobile: typeof import('./testing/mobile');
    api: typeof import('./testing/api');
  };
  api: {
    transforms: typeof import('./api/transforms');
  };
  logging: {
    winston: typeof import('./logging/winston');
  };
}
```

### Migration Mapping

```typescript
export interface MigrationMapping {
  // Source -> Target mapping
  'packages/services/src/utils/env.ts': '@todo/utils/common/env';
  'packages/services/src/blockchain/utils/BlockchainError.ts': '@todo/utils/blockchain/errors';
  'packages/services/src/blockchain/utils/TransactionMonitor.ts': '@todo/utils/blockchain/monitoring';
  'packages/ui-web/src/utils/': '@todo/utils/ui/web/';
  'packages/ui-mobile/src/test/utils/eva-test-utils.tsx': '@todo/utils/testing/mobile';
  'apps/web/src/__tests__/test-utils.ts': '@todo/utils/testing/api';
  'apps/ingestion/src/utils/logger.ts': '@todo/utils/logging/winston';
}
```

## Error Handling

### Migration Error Handling

1. **Import Resolution Errors:** Provide clear error messages when imports fail during migration
2. **Type Compatibility:** Ensure all migrated utilities maintain their original TypeScript signatures
3. **Dependency Conflicts:** Handle cases where utilities have conflicting dependencies

### Runtime Error Handling

1. **Graceful Degradation:** Utilities should fail gracefully with meaningful error messages
2. **Environment Detection:** Handle cases where utilities are used in different environments (Node.js vs browser)
3. **Validation Errors:** Provide clear validation error messages for utility functions

## Testing Strategy

### Unit Testing

1. **Individual Utility Testing:** Each utility function will have comprehensive unit tests
2. **Cross-Platform Testing:** UI utilities will be tested in both web and mobile contexts
3. **Error Scenario Testing:** All error handling paths will be tested

### Integration Testing

1. **Package Integration:** Test that utilities work correctly when imported by other packages
2. **Build Integration:** Ensure the utils package builds correctly and generates proper declarations
3. **Migration Testing:** Verify that migrated utilities work identically to their original implementations

### Test Structure

```
packages/utils/src/__tests__/
├── common/
│   ├── env.test.ts
│   ├── type-guards.test.ts
│   └── validation.test.ts
├── blockchain/
│   ├── errors.test.ts
│   └── monitoring.test.ts
├── ui/
│   ├── web/
│   │   ├── a11y.test.ts
│   │   ├── cva.test.ts
│   │   └── responsive.test.ts
│   └── mobile/
│       └── eva-test-utils.test.tsx
├── testing/
│   ├── web.test.ts
│   ├── mobile.test.tsx
│   └── api.test.ts
└── integration/
    ├── package-imports.test.ts
    └── migration-compatibility.test.ts
```

### Coverage Requirements

- Minimum 90% code coverage for all utility functions
- 100% coverage for critical utilities (error handling, validation)
- Integration test coverage for all public APIs

## Implementation Considerations

### Build Configuration

1. **TypeScript Configuration:** Strict TypeScript settings with proper declaration generation
2. **Tree Shaking:** Ensure proper ESM exports for optimal tree shaking
3. **Dual Package Hazard:** Avoid dual package hazard by providing consistent module formats

### Dependency Management

1. **Peer Dependencies:** UI utilities will use peer dependencies for React and related packages
2. **Optional Dependencies:** Some utilities may have optional dependencies for enhanced functionality
3. **Version Compatibility:** Ensure compatibility with existing package versions in the monorepo

### Performance Considerations

1. **Lazy Loading:** Support lazy loading of utility modules where appropriate
2. **Bundle Size:** Minimize bundle size impact through proper tree shaking and modular exports
3. **Runtime Performance:** Ensure utilities don't introduce performance regressions

### Migration Strategy

1. **Gradual Migration:** Migrate utilities in phases to minimize disruption
2. **Backward Compatibility:** Maintain temporary backward compatibility during migration
3. **Automated Migration:** Provide scripts to automate import path updates where possible
