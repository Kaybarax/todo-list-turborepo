# @todo/utils

A centralized utilities package for the Todo monorepo, providing common utility functions across all applications and packages.

## Installation

```bash
pnpm add @todo/utils
```

## Usage

### Named imports from specific modules

```typescript
import { getEnvVar } from '@todo/utils/common';
import { BlockchainError } from '@todo/utils/blockchain';
import { cn, ariaAttr } from '@todo/utils/ui/web';
```

### Category-based imports

```typescript
import { common, blockchain, ui } from '@todo/utils';
```

### Direct imports for tree-shaking

```typescript
import { getEnvVar } from '@todo/utils/common/env';
import { BlockchainError } from '@todo/utils/blockchain/errors';
```

## Available Utilities

### Common Utilities (`@todo/utils/common`)

- Environment variable utilities
- Type guard functions
- Common validation utilities

### Blockchain Utilities (`@todo/utils/blockchain`)

- BlockchainError class with static factory methods
- TransactionMonitor for transaction status tracking

### UI Utilities (`@todo/utils/ui`)

- Web-specific utilities (`@todo/utils/ui/web`)
- Mobile-specific utilities (`@todo/utils/ui/mobile`)

### Testing Utilities (`@todo/utils/testing`)

- Web testing helpers
- Mobile testing utilities with Eva Design integration
- API testing utilities and mock data creators

### API Utilities (`@todo/utils/api`)

- Data transformation utilities
- API client helpers

### Logging Utilities (`@todo/utils/logging`)

- Winston logger configuration
- Environment-specific logging setups

## Development

```bash
# Build the package
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Contributing

When adding new utilities:

1. Place them in the appropriate category directory
2. Add comprehensive tests
3. Update the relevant index.ts file with exports
4. Add JSDoc documentation
5. Update this README with usage examples

## Migration Guide

This package consolidates utilities from across the monorepo. See the migration guide for updating import paths from old utility locations to the new centralized package.
