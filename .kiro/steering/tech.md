# Technology Stack & Build System

## Build System

- **Package Manager**: pnpm 9.12.0 (required for workspace management)
- **Monorepo**: pnpm workspaces with Turborepo orchestration
- **Node.js**: 20+ (see .nvmrc for exact version)
- **TypeScript**: 5.3.3 across all packages

## Core Technologies

### Frontend

- **Web**: Next.js 14 with App Router, React 18, TypeScript
- **Mobile**: Expo React Native with TypeScript
- **Styling**: Tailwind CSS for web, React Native StyleSheet for mobile
- **State Management**: Zustand for client state
- **UI Libraries**: Custom component libraries (@todo/ui-web, @todo/ui-mobile)

### Backend

- **API**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for performance optimization
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator and Zod schemas

### Blockchain

- **Polygon**: Solidity contracts with Hardhat
- **Solana**: Rust programs with Anchor framework
- **Polkadot**: Substrate pallets with Rust
- **Wallet Integration**: WalletConnect v2

### Testing

- **Unit/Integration**: Jest across all packages
- **E2E Web**: Playwright
- **E2E Mobile**: React Native testing frameworks
- **Contract Testing**: Hardhat (Polygon), Anchor (Solana), Substrate (Polkadot)

### DevOps & Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with production-ready manifests
- **Monitoring**: OpenTelemetry, Jaeger tracing, Prometheus/Grafana
- **CI/CD**: GitHub Actions with automated testing and deployment

## Common Commands

### Development

```bash
# Install dependencies
pnpm install

# Start all development servers
pnpm dev

# Start specific services
pnpm dev:web          # Next.js web app
pnpm dev:api          # NestJS API
pnpm dev:mobile       # React Native/Expo
pnpm dev:ingestion    # Ingestion service
pnpm dev:contracts    # Hardhat node for contracts
```

### Building

```bash
# Full build (all apps, packages, and contracts)
pnpm build

# Quick development build
pnpm build:quick

# Production build with security scanning
pnpm build:production

# Build specific components
pnpm build:packages    # Shared packages only
pnpm build:apps        # Applications only
pnpm build:contracts   # Blockchain contracts only
```

### Testing

```bash
# Run all tests
pnpm test

# Specific test types
pnpm test:unit        # Unit tests
pnpm test:integration # Integration tests
pnpm test:e2e         # End-to-end tests
pnpm test:contracts   # Blockchain contract tests
```

### Code Quality

```bash
# Lint and fix issues
pnpm lint
pnpm lint:fix

# Format code
pnpm format

# Type checking
pnpm typecheck
```

### Database Management

```bash
# Complete database setup
pnpm db:setup

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed

# Reset database
pnpm db:reset
```

### Blockchain Development

```bash
# Compile all contracts
pnpm contracts:compile

# Network-specific builds
pnpm contracts:polygon   # Solidity contracts
pnpm contracts:solana    # Rust programs
pnpm contracts:polkadot  # Substrate pallets

# Deploy contracts
pnpm contracts:deploy
```

## Configuration Standards

### ESLint

- Shared configurations in `packages/config-eslint/`
- Framework-specific configs: nextjs.js, nestjs.js, react.js, react-native.js, solidity.js
- Security and accessibility rules enforced

### TypeScript

- Shared configurations in `packages/config-ts/`
- Strict mode enabled with comprehensive type checking
- Path mapping configured for monorepo packages

### Jest

- Shared configurations in `packages/config-jest/`
- Framework-specific setups for different environments
- Coverage thresholds enforced (minimum 80%)

## Environment Requirements

- **Node.js**: 20+ (specified in .nvmrc)
- **pnpm**: 9+ (required for workspace management)
- **Docker**: For containerized development and deployment
- **Rust**: For Solana and Polkadot development
- **Solana CLI**: For Solana program deployment
- **Anchor CLI**: For Solana program development
