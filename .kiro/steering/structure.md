# Project Structure & Organization

## Monorepo Architecture

This project follows a monorepo structure with clear separation of concerns:

```
.
├── apps/                    # Applications
├── packages/               # Shared packages and libraries
├── db/                     # Database setup and migrations
├── infra/                  # Infrastructure configurations
├── scripts/                # Build and deployment scripts
└── docs/                   # Documentation
```

## Applications (`apps/`)

### `apps/web/` - Next.js Web Application
- **Framework**: Next.js 14 with App Router
- **Structure**: Standard Next.js app directory structure
- **Key Directories**:
  - `src/app/` - App Router pages and layouts
  - `src/components/` - React components
  - `src/lib/` - Utility functions and configurations
  - `src/services/` - API and blockchain service integrations
  - `e2e/` - Playwright end-to-end tests

### `apps/api/` - NestJS Backend API
- **Framework**: NestJS with TypeScript
- **Structure**: Modular NestJS architecture
- **Key Directories**:
  - `src/auth/` - Authentication module (JWT, guards, strategies)
  - `src/todo/` - Todo business logic (controller, service, repository)
  - `src/user/` - User management module
  - `src/database/` - Database configuration and connection
  - `src/cache/` - Redis caching module
  - `src/health/` - Health check endpoints
  - `test/` - Integration tests

### `apps/mobile/` - React Native Mobile App
- **Framework**: Expo React Native
- **Structure**: Expo Router with TypeScript
- **Key Directories**:
  - `app/` - Expo Router pages
  - `src/components/` - React Native components
  - `src/providers/` - Context providers (wallet, auth)
  - `src/services/` - API and blockchain integrations
  - `src/store/` - Zustand state management

### `apps/ingestion/` - Background Processing Service
- **Purpose**: Blockchain data synchronization
- **Structure**: Node.js service with TypeScript
- **Key Directories**:
  - `src/services/` - Core ingestion logic
  - `src/models/` - Data models
  - `src/utils/` - Logging and utilities

### `apps/smart-contracts/` - Multi-Network Smart Contracts
- **Structure**: Organized by blockchain network
- **Networks**:
  - `polygon/` - Solidity contracts with Hardhat
  - `solana/` - Rust programs with Anchor
  - `polkadot/` - Substrate pallets

## Shared Packages (`packages/`)

### `packages/ui-web/` - Web Component Library
- **Purpose**: Shared React components for web applications
- **Structure**: Component-based with Storybook
- **Key Features**: Tailwind CSS, TypeScript, accessibility compliance

### `packages/ui-mobile/` - Mobile Component Library
- **Purpose**: Shared React Native components
- **Structure**: Component-based with Storybook
- **Key Features**: Cross-platform compatibility, theme system

### `packages/services/` - Shared Business Logic
- **Purpose**: API clients and blockchain services
- **Structure**:
  - `src/api/` - HTTP API clients with error handling
  - `src/blockchain/` - Multi-network blockchain services
  - `src/todo/` - Shared todo business logic

### Configuration Packages
- `packages/config-eslint/` - ESLint configurations for all frameworks
- `packages/config-ts/` - TypeScript configurations
- `packages/config-jest/` - Jest testing configurations
- `packages/config-release/` - Release and versioning configurations

## Infrastructure (`infra/`)

### `infra/k8s/` - Kubernetes Manifests
- Production-ready Kubernetes configurations
- Includes deployments, services, ingress, monitoring

### `infra/kubernetes/` - Alternative K8s Setup
- Additional Kubernetes configurations
- RBAC, secrets, resource management

### Configuration Directories
- `infra/nginx/` - NGINX reverse proxy configurations
- `infra/redis/` - Redis configurations
- `infra/prometheus/` - Monitoring configurations
- `infra/otel-collector/` - OpenTelemetry collector setup

## Database (`db/`)

- `migrations/` - MongoDB migration files with schema validation
- `setup.js` - Database initialization and setup
- `migrate.js` - Migration runner with CLI interface
- `seed-todos.js` - Sample data seeding

## Scripts (`scripts/`)

### Build Scripts
- `build.sh` - Comprehensive build script with multi-env support
- `build-quick.sh` - Fast development builds
- `build-production.sh` - Production builds with security scanning
- `build-contracts.sh` - Blockchain contract compilation

### Development Scripts
- `startDev.sh` - Start all development servers
- `dev-frontend.sh` - Frontend-only development
- `dev-backend.sh` - Backend-only development
- `dev-blockchain.sh` - Blockchain development environment

### Deployment Scripts
- `deploy.sh` - Main deployment script
- `deploy-development.sh` - Development environment deployment
- `deploy-staging.sh` - Staging environment deployment
- `deploy-production.sh` - Production deployment

## Naming Conventions

### Package Names
- All packages use `@todo/` namespace
- Kebab-case for package names: `@todo/ui-web`, `@todo/config-eslint`

### File Naming
- **Components**: PascalCase - `TodoItem.tsx`, `WalletConnect.tsx`
- **Utilities**: camelCase - `apiClient.ts`, `blockchainService.ts`
- **Configuration**: kebab-case - `jest.config.js`, `tailwind.config.js`
- **Tests**: Match source file with `.test.` or `.spec.` suffix

### Directory Structure
- **Components**: Group by feature, include tests and stories in same directory
- **Services**: Separate by domain (api, blockchain, todo)
- **Types**: Co-locate with implementation or in dedicated `types/` directory

## Import Patterns

### Path Mapping
- Use `@todo/*` for cross-package imports
- Relative imports for same-package files
- Absolute imports for external dependencies

### Example Import Structure
```typescript
// External dependencies
import React from 'react';
import { NextPage } from 'next';

// Internal packages
import { TodoApiClient } from '@todo/services';
import { Button, Card } from '@todo/ui-web';

// Relative imports
import { TodoForm } from '../components/TodoForm';
import { useTodos } from './hooks/useTodos';
```

## Testing Organization

### Test Placement
- **Unit Tests**: Co-located with source files (`Component.test.tsx`)
- **Integration Tests**: In `test/` or `__tests__/` directories
- **E2E Tests**: In dedicated `e2e/` directories
- **Contract Tests**: In blockchain app `test/` directories

### Test Naming
- Unit tests: `[ComponentName].test.[ts|tsx]`
- Integration tests: `[feature].integration.test.[ts|tsx]`
- E2E tests: `[workflow].spec.[ts|tsx]`