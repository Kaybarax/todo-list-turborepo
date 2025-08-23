# @todo/utils

A centralized utilities package for the Todo monorepo, providing common utility functions across all applications and packages. This package eliminates code duplication and provides a single source of truth for utility functions, organized by their purpose and the packages they serve.

## 🚀 Quick Start

### Installation

```bash
# In the monorepo, this package is automatically available
pnpm add @todo/utils
```

### Basic Usage

```typescript
// Named imports (recommended for most use cases)
import { getEnvVar, isDefined, cn } from '@todo/utils';

// Category-based imports
import { common, blockchain, ui } from '@todo/utils';

// Direct imports for optimal tree-shaking
import { getEnvVar } from '@todo/utils/common/env';
import { BlockchainError } from '@todo/utils/blockchain/errors';
```

## 📦 Available Utilities

### 🔧 Common Utilities (`@todo/utils/common`)

Essential utilities used across multiple packages and domains.

#### Environment Variables

```typescript
import { getEnvVar, requireEnvVar, isDevelopment } from '@todo/utils/common';

// Get environment variable with optional default
const apiUrl = getEnvVar('API_URL', 'http://localhost:3000');

// Require environment variable (throws if not found)
const dbUrl = requireEnvVar('DATABASE_URL');

// Environment checks
if (isDevelopment()) {
  console.log('Running in development mode');
}
```

#### Type Guards

```typescript
import { isDefined, isString, isNonEmptyArray } from '@todo/utils/common';

// Safe type checking
if (isDefined(user?.email) && isString(user.email)) {
  sendEmail(user.email);
}

// Array validation
if (isNonEmptyArray(todos)) {
  renderTodoList(todos);
}

// Runtime assertions
import { invariant, assertNever } from '@todo/utils/common';

invariant(user, 'User must be defined');

switch (status) {
  case 'loading':
    return <Spinner />;
  case 'error':
    return <Error />;
  case 'success':
    return <Data />;
  default:
    assertNever(status); // TypeScript will catch unhandled cases
}
```

### ⛓️ Blockchain Utilities (`@todo/utils/blockchain`)

Blockchain-specific utilities for error handling and transaction monitoring across multiple networks (Polygon, Solana, Polkadot).

#### Error Handling

```typescript
import { BlockchainError, BlockchainErrorType } from '@todo/utils/blockchain';

// Create specific blockchain errors
throw BlockchainError.walletConnectionFailed('Failed to connect to MetaMask', originalError);

throw BlockchainError.transactionFailed('Transaction reverted', '0x123...');

// Handle blockchain errors
try {
  await sendTransaction();
} catch (error) {
  if (error instanceof BlockchainError) {
    console.log('Blockchain error:', error.type, error.message);
  }
}
```

#### Transaction Monitoring

```typescript
import { TransactionMonitor, BlockchainNetwork } from '@todo/utils/blockchain';

const monitor = new TransactionMonitor();

// Monitor a transaction
const receipt = await monitor.monitorTransaction('0x123...', BlockchainNetwork.POLYGON);

// Check transaction status
const status = monitor.getStatus('0x123...');
console.log('Transaction status:', status);
```

### 🎨 UI Utilities (`@todo/utils/ui`)

UI-related utilities split between web and mobile platforms.

#### Web UI Utilities

```typescript
import { cn, ariaAttr, mergeRefs, mqUp } from '@todo/utils/ui/web';

// Class name utility (clsx + tailwind-merge)
const buttonClass = cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
);

// Accessibility helpers
<button aria-expanded={ariaAttr(isOpen)}>
  Toggle Menu
</button>

// Ref merging for compound components
const combinedRef = mergeRefs(ref1, ref2, ref3);

// Responsive utilities
const styles = {
  [mqUp('md')]: {
    fontSize: '1.2rem',
  },
};
```

#### Design Tokens

```typescript
import { getToken, generateCSSCustomProperties } from '@todo/utils/ui/web';

// Access design tokens
const primaryColor = getToken('colors.primary.500');
const spacing = getToken('spacing.4');

// Generate CSS custom properties
const cssVars = generateCSSCustomProperties({
  colors: { primary: '#3b82f6' },
  spacing: { 4: '1rem' },
});
```

### 🧪 Testing Utilities (`@todo/utils/testing`)

Testing helpers and utilities for different platforms and testing scenarios.

#### Mobile Testing (React Native + Eva Design)

```typescript
import { mobileRender, createMockTheme, testAccessibility } from '@todo/utils/testing/mobile';

// Render React Native components with Eva Design
const { getByText } = mobileRender(<MyComponent />);

// Test with custom theme
const mockTheme = createMockTheme({ primaryColor: '#ff0000' });
const { getByText } = mobileRender(<MyComponent />, { theme: mockTheme });

// Accessibility testing
await testAccessibility(<MyComponent />);
```

#### API Testing

```typescript
import { createMockTodo, apiTodoToTodo } from '@todo/utils/testing/api';

// Create mock data
const mockTodo = createMockTodo({
  title: 'Test Todo',
  completed: false,
});

// Create specialized mocks
const urgentTodo = createMockTodoWithPriority('high');
const blockchainTodo = createMockTodoWithBlockchain('polygon');

// Transform API data
const todo = apiTodoToTodo(apiResponse);
```

### 📝 Logging Utilities (`@todo/utils/logging`)

Centralized logging functionality using Winston with pre-configured loggers for different application types.

```typescript
import { logger, createApiLogger, createIngestionLogger } from '@todo/utils/logging';

// Use default logger
logger.info('Application started');
logger.error('Something went wrong', { error: err });

// Create service-specific loggers
const apiLogger = createApiLogger({ level: 'debug' });
const ingestionLogger = createIngestionLogger();

// Custom logger configuration
const customLogger = createLogger({
  service: 'my-service',
  level: 'info',
  enableFileLogging: true,
  logDirectory: 'logs',
});
```

## 🔄 Import Patterns

The package supports multiple import patterns to suit different needs:

### 1. Named Imports (Recommended)

Best for most use cases, provides good tree-shaking and clear dependencies:

```typescript
import { getEnvVar, isDefined, cn, BlockchainError } from '@todo/utils';
```

### 2. Category-Based Imports

Good for organizing imports by domain:

```typescript
import { common, blockchain, ui } from '@todo/utils';

const envVar = common.getEnvVar('NODE_ENV');
const error = new blockchain.BlockchainError('Connection failed');
const className = ui.web.cn('btn', 'btn-primary');
```

### 3. Direct Module Imports

Best for tree-shaking and when you need many utilities from one module:

```typescript
import { getEnvVar, requireEnvVar } from '@todo/utils/common/env';
import { BlockchainError, TransactionMonitor } from '@todo/utils/blockchain';
import { cn, ariaAttr, mergeRefs } from '@todo/utils/ui/web';
```

### 4. Specific File Imports

Most granular, optimal for tree-shaking:

```typescript
import { getEnvVar } from '@todo/utils/common/env';
import { BlockchainError } from '@todo/utils/blockchain/errors';
import { cn } from '@todo/utils/ui/web/cva';
```

## 📋 Migration Guide

This package consolidates utilities from across the monorepo. Use this guide to update your import paths:

### From Services Package

```typescript
// ❌ Old
import { getEnvVar } from '../utils/env';
import { BlockchainError } from './blockchain/utils/BlockchainError';

// ✅ New
import { getEnvVar, BlockchainError } from '@todo/utils';
// or
import { getEnvVar } from '@todo/utils/common/env';
import { BlockchainError } from '@todo/utils/blockchain/errors';
```

### From UI Packages

```typescript
// ❌ Old (ui-web)
import { cn } from '../utils/cva';
import { ariaAttr } from '../utils/a11y';

// ✅ New
import { cn, ariaAttr } from '@todo/utils/ui/web';
// or
import { cn, ariaAttr } from '@todo/utils';
```

### From Testing Files

```typescript
// ❌ Old
import { render } from '../test/utils/eva-test-utils';
import { createMockTodo } from './__tests__/test-utils';

// ✅ New
import { mobileRender, createMockTodo } from '@todo/utils/testing';
// or
import { mobileRender } from '@todo/utils/testing/mobile';
import { createMockTodo } from '@todo/utils/testing/api';
```

### From App-Specific Utils

```typescript
// ❌ Old (ingestion app)
import { logger } from '../utils/logger';

// ✅ New
import { createIngestionLogger } from '@todo/utils/logging';
const logger = createIngestionLogger();
```

### Complete Migration Mapping

| Old Path                                                       | New Path                            |
| -------------------------------------------------------------- | ----------------------------------- |
| `packages/services/src/utils/env.ts`                           | `@todo/utils/common/env`            |
| `packages/services/src/blockchain/utils/BlockchainError.ts`    | `@todo/utils/blockchain/errors`     |
| `packages/services/src/blockchain/utils/TransactionMonitor.ts` | `@todo/utils/blockchain/monitoring` |
| `packages/ui-web/src/utils/`                                   | `@todo/utils/ui/web/`               |
| `packages/ui-web/src/utils/type-guards.ts`                     | `@todo/utils/common/type-guards`    |
| `packages/ui-mobile/src/test/utils/eva-test-utils.tsx`         | `@todo/utils/testing/mobile`        |
| `apps/web/src/__tests__/test-utils.ts`                         | `@todo/utils/testing/api`           |
| `apps/ingestion/src/utils/logger.ts`                           | `@todo/utils/logging/winston`       |

## 🛠️ Development

### Building

```bash
# Build the package
pnpm build

# Build in watch mode
pnpm build:watch
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- common/env.test.ts
```

### Code Quality

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

## 📝 Contributing

### Adding New Utilities

1. **Choose the right category**: Place utilities in the appropriate directory (`common`, `blockchain`, `ui`, `testing`, `api`, `logging`)

2. **Create the utility file**:

   ````typescript
   // packages/utils/src/common/my-utility.ts

   /**
    * Description of what this utility does
    * @param param1 - Description of parameter
    * @returns Description of return value
    * @example
    * ```typescript
    * const result = myUtility('example');
    * console.log(result); // Expected output
    * ```
    */
   export function myUtility(param1: string): string {
     // Implementation
   }
   ````

3. **Add comprehensive tests**:

   ```typescript
   // packages/utils/src/common/__tests__/my-utility.test.ts

   import { myUtility } from '../my-utility';

   describe('myUtility', () => {
     it('should handle basic case', () => {
       expect(myUtility('input')).toBe('expected');
     });

     it('should handle edge cases', () => {
       // Test edge cases
     });
   });
   ```

4. **Update exports**: Add to the appropriate `index.ts` file:

   ```typescript
   // packages/utils/src/common/index.ts
   export { myUtility } from './my-utility';
   ```

5. **Update main exports** (if commonly used):

   ```typescript
   // packages/utils/src/index.ts
   export { myUtility } from './common';
   ```

6. **Update documentation**: Add usage examples to this README

### Guidelines

- **TypeScript**: Use strict TypeScript with proper type annotations
- **Documentation**: Add JSDoc comments with examples
- **Testing**: Aim for 90%+ code coverage
- **Performance**: Consider performance implications, especially for frequently used utilities
- **Dependencies**: Minimize external dependencies; prefer peer dependencies for UI utilities
- **Naming**: Use clear, descriptive names that indicate the utility's purpose
- **Exports**: Ensure proper tree-shaking support with ESM exports

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc documentation for all public APIs
- Include usage examples in documentation
- Write comprehensive tests with edge cases
- Use meaningful variable and function names

## 📄 License

This package is part of the Todo monorepo and follows the same license terms.

## 🔗 Related Packages

- [`@todo/ui-web`](../ui-web/README.md) - Web component library
- [`@todo/ui-mobile`](../ui-mobile/README.md) - Mobile component library
- [`@todo/services`](../services/README.md) - Shared business logic and API clients
- [`@todo/config-*`](../config-eslint/README.md) - Configuration packages

---

**Note**: This package is designed for use within the Todo monorepo. While it can be used independently, it's optimized for the specific needs and architecture of this project.
