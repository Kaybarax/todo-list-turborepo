# Todo List Monorepo

**A comprehensive monorepo template designed to empower developers with a powerful, yet simple-to-use foundation for end-to-end enterprise-grade development.** This template provides all batteries included across multiple fronts - web, mobile, backend, blockchain, DevOps, and infrastructure - while maintaining an opinionated approach with carefully selected, modern technologies.

A modern, full-stack Todo application built as a comprehensive monorepo showcasing best practices for enterprise-grade development with blockchain integration.

## 🚀 Features

### Core Applications

- **Web App**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Mobile App**: Expo React Native with cross-platform support
- **API**: NestJS with MongoDB, Redis, and comprehensive validation
- **Ingestion Service**: Background processing for blockchain data

### Blockchain Integration

- **Multi-Network Support**: Polygon, Solana, Polkadot, Moonbeam, and Base integration
- **Smart Contracts**: Solidity, Rust (Anchor), and Substrate pallets across 5 networks
- **Wallet Connectivity**: WalletConnect v2 for seamless Web3 integration
- **Decentralized Storage**: Todo items stored on multiple blockchain networks

### Development Infrastructure

- **Monorepo Management**: pnpm workspaces with Turborepo orchestration
- **Shared Packages**: UI components, services, and configurations
- **Database**: MongoDB with migrations, seeding, and validation
- **Caching**: Redis for performance optimization
- **Testing**: Unit, integration, E2E, and contract testing
- **DevOps**: Docker, Kubernetes, and comprehensive CI/CD

## 📦 Repository Structure

```
.
├── apps/
│   ├── web/                 # Next.js 14 with App Router and Tailwind CSS
│   ├── mobile/              # Expo React Native with TypeScript
│   ├── api/                 # NestJS with MongoDB and Redis
│   ├── ingestion/           # Blockchain data processing service
│   └── smart-contracts/     # Multi-network smart contracts
│       ├── polygon/         # Solidity contracts with Hardhat
│       ├── solana/          # Rust programs with Anchor
│       ├── polkadot/        # Substrate pallets
│       ├── moonbeam/        # Moonbeam EVM contracts with Hardhat
│       └── base/            # Base L2 contracts with Hardhat
├── packages/
│   ├── ui-web/              # React component library with Storybook
│   ├── ui-mobile/           # React Native component library
│   ├── services/            # Shared blockchain and API services
│   ├── config-eslint/       # ESLint configurations for all frameworks
│   ├── config-ts/           # TypeScript configurations
│   └── config-jest/         # Jest testing configurations
├── db/
│   ├── migrations/          # MongoDB migration files with schema validation
│   ├── setup.js             # Database setup and validation script
│   ├── migrate.js           # Migration runner with CLI interface
│   └── seed-todos.js        # Comprehensive seeding with sample data
├── scripts/
│   ├── build.sh             # Comprehensive build script with multi-env support
│   ├── build-quick.sh       # Fast development builds
│   ├── build-production.sh  # Production builds with security scanning
│   └── build-contracts.sh   # Blockchain contract compilation
├── .devcontainer/           # Complete development container setup
│   ├── Dockerfile           # Multi-tool development environment
│   ├── post-create.sh       # Automated environment setup
│   └── devcontainer.json    # VS Code integration with extensions
├── infra/
│   ├── k8s/                 # Kubernetes manifests for all environments
│   ├── nginx/               # NGINX configurations
│   └── redis/               # Redis configurations
├── .github/
│   ├── workflows/           # CI/CD pipelines
│   └── dependabot.yml       # Automated dependency updates
├── turbo.json               # Turborepo build orchestration
├── pnpm-workspace.yaml      # Workspace configuration
├── docker-compose.dev.yml   # Development environment
├── docker-compose.yml       # Production environment
└── README.md
```

## 🏗️ Monorepo Architecture

This project uses a monorepo architecture powered by pnpm workspaces and Turborepo:

### pnpm Workspaces

The monorepo uses pnpm workspaces to manage dependencies across multiple packages and applications. The workspace configuration is defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This allows for:

- Shared dependencies across packages
- Local package linking (packages can depend on each other without publishing)
- Efficient installation with a single `pnpm install` command
- Consistent dependency versions across the entire project

### Turborepo

Turborepo is used for build orchestration and task running. The configuration in `turbo.json` defines:

- Task dependencies (what needs to run before what)
- Caching rules for faster builds
- Output artifacts for each task
- Development mode configurations

Key tasks defined in Turborepo:

- `build`: Builds all packages and applications
- `dev`: Starts development servers
- `test`: Runs tests across the monorepo
- `lint`: Runs linters across the monorepo
- `format`: Formats code using Prettier
- `clean`: Cleans build artifacts
- `deploy`: Handles deployment (depends on build, test, and lint)
- `storybook`: Starts Storybook development servers
- `build-storybook`: Builds static Storybook sites

To run a task for a specific package:

```bash
pnpm --filter <package-name> <task>
```

Example:

```bash
# Run tests only for the web app
pnpm --filter @todo/web test

# Start development server for the API
pnpm --filter @todo/api dev
```

## ✨ Recent Modernization Accomplishments

This monorepo has been comprehensively modernized with enterprise-grade features and blockchain integration:

### 🏗️ Infrastructure Modernization

- **Complete Kubernetes Setup**: Production-ready manifests with auto-scaling, monitoring, and security
- **Development Container**: Fully configured devcontainer with all blockchain tools (Solana CLI, Anchor, Rust)
- **Database Management**: MongoDB with migrations, schema validation, and automated seeding
- **Build System**: Multi-environment build scripts with security scanning and Docker optimization

### ⛓️ Blockchain Integration

- **Multi-Network Support**: Integrated Polygon (Solidity), Solana (Rust/Anchor), Polkadot (Substrate), Moonbeam (EVM), and Base (L2)
- **Smart Contracts**: Complete contract suites for decentralized todo storage across 5 blockchain networks
- **Wallet Integration**: WalletConnect v2 implementation for seamless Web3 connectivity
- **Transaction Management**: Comprehensive blockchain transaction tracking and status monitoring

### 🚀 Application Modernization

- **Next.js 14 Web App**: Rebuilt with App Router, server components, and optimized performance
- **NestJS API**: Complete rewrite with proper architecture, validation, and OpenTelemetry tracing
- **Expo React Native**: Modern mobile app with blockchain wallet integration
- **Shared Libraries**: Rebuilt UI components and services with TypeScript and modern patterns

### 🧪 Testing Excellence

- **Comprehensive Coverage**: Unit, integration, E2E, and contract testing across all applications
- **Blockchain Testing**: Specialized test suites for smart contracts on all supported networks
- **Cross-Platform E2E**: Playwright for web and React Native testing frameworks for mobile
- **Performance Testing**: Load testing and blockchain transaction validation

### 🔧 Developer Experience

- **Advanced Build System**: Multi-stage builds with parallel processing and caching optimization
- **Security Integration**: Vulnerability scanning, container security, and code quality enforcement
- **Documentation**: Comprehensive guides for setup, development, and deployment
- **Automation**: Complete CI/CD pipelines with automated testing and deployment

## 🛠️ Getting Started

### Prerequisites

- **Node.js 20+** (see .nvmrc for exact version)
- **Docker Desktop** or Docker Engine with Docker Compose
- **pnpm 9+** (required for workspace management)
- **Git** for version control

### For Blockchain Development (Optional)

The project includes automated setup for blockchain development tools:

- **Rust** and Cargo for Solana/Polkadot development
- **Solana CLI** for Solana program deployment
- **Anchor CLI** for Solana program development
- **Substrate tools** for Polkadot development

**Quick blockchain setup**: Run `pnpm blockchain:deps:fix` after project installation

### Quick Start

1. **Install pnpm** (if not already installed)

   ```bash
   npm install -g pnpm@9.12.0
   ```

2. **Clone and setup**

   ```bash
   git clone https://github.com/yourusername/todo-list-monorepo.git
   cd todo-list-monorepo
   pnpm install
   ```

3. **Setup blockchain development (optional)**

   ```bash
   # Automated blockchain tools installation
   pnpm blockchain:deps:fix

   # Or check what's needed first
   pnpm blockchain:deps:check
   ```

4. **Start development environment**

   ```bash
   # Option 1: Use development container (recommended)
   # Open in VS Code and select "Reopen in Container"

   # Option 2: Local development
   docker-compose -f docker-compose.dev.yml up -d
   pnpm db:setup  # Setup database with sample data
   pnpm dev       # Start all development servers
   ```

5. **Access applications**
   - **Web App**: http://localhost:3000
   - **API**: http://localhost:3001
   - **Mobile (Expo)**: http://localhost:19000
   - **Jaeger Tracing**: http://localhost:16686
   - **MailHog**: http://localhost:8025

### Development Container (Recommended)

The project includes a fully configured development container with all tools pre-installed:

```bash
# Open in VS Code
code .

# Select "Reopen in Container" when prompted
# Or use Command Palette: "Dev Containers: Reopen in Container"
```

The devcontainer includes:

- Node.js 20, pnpm, and all JavaScript tools
- Rust, Solana CLI, and Anchor for blockchain development
- Docker-in-Docker for container management
- kubectl and Helm for Kubernetes development
- All VS Code extensions for the tech stack

### Development Workflow

#### Building

```bash
# Full build (all apps, packages, and contracts)
pnpm build

# Quick development build (skip Docker and tests)
pnpm build:quick

# Production build with security scanning
pnpm build:production

# Build specific components
pnpm build:packages    # Shared packages only
pnpm build:apps        # Applications only
pnpm build:contracts   # Blockchain contracts only
```

#### Development Servers

```bash
# Start all development servers
pnpm dev

# Start individual services
pnpm dev:web          # Next.js web app
pnpm dev:api          # NestJS API
pnpm dev:mobile       # React Native/Expo
pnpm dev:ingestion    # Ingestion service
pnpm dev:contracts    # Hardhat node for contracts
```

#### Testing

```bash
# Run all tests
pnpm test

# Specific test types
pnpm test:unit        # Unit tests
pnpm test:integration # Integration tests
pnpm test:e2e         # End-to-end tests
pnpm test:contracts   # Blockchain contract tests
```

#### Blockchain Development

**Dependency Management**:

```bash
# Check blockchain development environment
pnpm blockchain:deps:check

# Check with detailed output
pnpm blockchain:deps:check:verbose

# Check specific networks
pnpm blockchain:deps:check:polygon
pnpm blockchain:deps:check:solana
pnpm blockchain:deps:check:polkadot

# Automatically install missing dependencies
pnpm blockchain:deps:fix

# Interactive dependency installation
pnpm blockchain:deps:fix:interactive

# Comprehensive environment diagnosis
pnpm blockchain:deps:diagnose
```

**Tool Installation**:

```bash
# Install all blockchain tools
pnpm blockchain:tools:install

# Install specific tools
pnpm blockchain:tools:install:rust
pnpm blockchain:tools:install:solana
pnpm blockchain:tools:install:anchor
pnpm blockchain:tools:install:substrate

# Interactive installation guidance
pnpm blockchain:tools:install:interactive
```

**Contract Compilation** (with automatic dependency checking):

```bash
# Compile all contracts
pnpm contracts:compile

# Network-specific builds
pnpm contracts:polygon   # Solidity contracts
pnpm contracts:solana    # Rust programs
pnpm contracts:polkadot  # Substrate pallets
pnpm contracts:moonbeam  # Moonbeam EVM contracts
pnpm contracts:base      # Base L2 contracts

# Deploy contracts
pnpm contracts:deploy
```

**Help and Troubleshooting**:

```bash
# Get blockchain development help
pnpm blockchain:help

# Interactive help system
pnpm blockchain:help:interactive
```

#### Database Management

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

#### Code Quality

```bash
# Lint and fix issues
pnpm lint
pnpm lint:fix

# Format code
pnpm format

# Type checking
pnpm typecheck
```

## 🧪 Comprehensive Testing Strategy

The project implements enterprise-grade testing across all layers:

### Frontend Testing

- **Unit Tests**: Jest with React Testing Library for components
- **Integration Tests**: API integration with mock servers
- **E2E Tests**: Playwright for complete user journeys
- **Visual Testing**: Component visual regression testing
- **Mobile Testing**: React Native testing with platform-specific scenarios

### Backend Testing

- **Unit Tests**: NestJS services and controllers with comprehensive mocking
- **Integration Tests**: Database integration with test containers
- **API Tests**: Supertest for endpoint validation
- **Performance Tests**: Load testing for critical endpoints

### Blockchain Testing

- **Contract Tests**: Comprehensive smart contract testing on all networks
  - **Polygon**: Hardhat with Chai for Solidity contracts
  - **Solana**: Anchor testing framework for Rust programs
  - **Polkadot**: Substrate testing framework for pallets
- **Integration Tests**: Blockchain service integration with test networks
- **Transaction Tests**: End-to-end transaction flow validation

### Cross-Platform Testing

- **Multi-Environment**: Tests run across development, staging, and production configs
- **Browser Testing**: Cross-browser compatibility with Playwright
- **Mobile Testing**: iOS and Android testing scenarios
- **Network Testing**: Multi-blockchain network testing

### Running Tests

```bash
# All tests with coverage
pnpm test

# Specific test suites
pnpm test:unit           # Unit tests across all apps
pnpm test:integration    # Integration tests
pnpm test:e2e           # End-to-end tests
pnpm test:contracts     # All blockchain contract tests

# Network-specific contract tests
pnpm contracts:polygon --test
pnpm contracts:solana --test
pnpm contracts:polkadot --test
pnpm contracts:moonbeam --test
pnpm contracts:base --test

# Watch mode for development
pnpm test --watch
```

### Test Coverage

- **Minimum 80% coverage** across all applications
- **100% coverage** for critical business logic
- **Contract coverage** for all smart contract functions
- **E2E coverage** for all user workflows

## 📚 Documentation

### Component Documentation

- Component documentation is available through Storybook
  ```bash
  # Start Storybook for web components
  pnpm --filter @todo/ui-web storybook
  ```

### API Documentation

- API documentation is available at `/api/docs` when running the API server

### Blockchain Development

- **[Blockchain Setup Guide](docs/BLOCKCHAIN_SETUP.md)** - Comprehensive setup instructions for blockchain development
- **[Blockchain Commands Reference](docs/BLOCKCHAIN_COMMANDS.md)** - Quick reference for dependency management commands
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Solutions to common development issues

### Additional Guides

- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](SECURITY.md)** - Security guidelines and reporting
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 🚢 Production Deployment

### Kubernetes Infrastructure

The project includes production-ready Kubernetes manifests:

```bash
# Deploy to Kubernetes
cd infra/k8s
./deploy.sh --environment production

# Deploy specific components
kubectl apply -f namespaces/
kubectl apply -f deployments/
kubectl apply -f services/
kubectl apply -f ingress/
```

**Kubernetes Features**:

- **Auto-scaling**: HPA for all services based on CPU/memory
- **Monitoring**: Prometheus and Grafana integration
- **Security**: RBAC, network policies, and pod security standards
- **High Availability**: Multi-replica deployments with health checks

### Docker Deployment

```bash
# Production build with Docker
pnpm build:production

# Deploy with Docker Compose
docker-compose up -d

# Or deploy individual services
docker run -d todo-api:latest
docker run -d todo-web:latest
```

### Environment Configuration

```bash
# Development
export ENVIRONMENT=development
./scripts/build.sh

# Staging
export ENVIRONMENT=staging
export DOCKER_REGISTRY=staging.registry.com
./scripts/build.sh --push

# Production
export ENVIRONMENT=production
export VERSION=v1.0.0
export DOCKER_REGISTRY=prod.registry.com
./scripts/build-production.sh
```

### CI/CD Pipeline

- **Continuous Integration**: Automated testing, linting, and security scanning
- **Continuous Deployment**: Automated deployment to staging and production
- **Security Scanning**: Container and dependency vulnerability scanning
- **Performance Monitoring**: Automated performance regression detection

### Blockchain Deployment

```bash
# Deploy contracts to all networks
pnpm contracts:deploy

# Network-specific deployment
cd apps/smart-contracts/polygon
pnpm deploy:mainnet

cd ../solana
anchor deploy --provider.cluster mainnet

cd ../polkadot
./target/release/node-template --chain=polkadot
```

## 🚨 Troubleshooting

### Blockchain Development Environment Issues

If you encounter issues with blockchain development tools, use our automated troubleshooting system:

```bash
# Check all blockchain dependencies
pnpm blockchain:deps:check

# Automatically fix missing dependencies
pnpm blockchain:deps:fix

# Interactive troubleshooting with guided setup
pnpm blockchain:deps:fix:interactive

# Comprehensive environment diagnosis
pnpm blockchain:deps:diagnose
```

### Common Issues and Solutions

#### Smart Contract Compilation Failures

**Problem**: Contract compilation fails with missing dependencies

```bash
# Solution: Check and install missing blockchain tools
pnpm blockchain:deps:check --verbose
pnpm blockchain:deps:fix
```

**Problem**: Anchor CLI not found or outdated

```bash
# Solution: Install/update Anchor CLI
pnpm blockchain:tools:install:anchor
# Or manually:
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0 && avm use 0.29.0
```

**Problem**: Solana CLI configuration issues

```bash
# Solution: Configure Solana CLI
solana config set --url devnet
solana-keygen new --outfile ~/.config/solana/id.json
```

#### Development Environment Issues

**Problem**: pnpm workspace dependencies not resolving

```bash
# Solution: Clean and reinstall dependencies
pnpm clean
rm -rf node_modules
pnpm install
```

**Problem**: Docker containers failing to start

```bash
# Solution: Reset Docker environment
docker-compose down -v
docker system prune -f
pnpm db:setup
docker-compose -f docker-compose.dev.yml up -d
```

**Problem**: Database connection issues

```bash
# Solution: Reset and setup database
pnpm db:reset
pnpm db:setup
```

#### Network-Specific Issues

**Polygon/Hardhat Issues**:

```bash
# Check Node.js version (requires 20+)
node --version
# Reinstall Hardhat dependencies
cd apps/smart-contracts/polygon && pnpm install
```

**Solana Issues**:

```bash
# Check Rust and Solana CLI versions
pnpm blockchain:deps:check:solana
# Update Solana CLI
solana-install update
```

**Polkadot Issues**:

```bash
# Install missing Substrate tools
pnpm blockchain:tools:install:substrate
# Add WebAssembly target
rustup target add wasm32-unknown-unknown
```

### Getting Help

1. **Automated Diagnostics**: Run `pnpm blockchain:deps:diagnose` for detailed environment analysis
2. **Interactive Help**: Use `pnpm blockchain:help:interactive` for guided troubleshooting
3. **Documentation**: Check [BLOCKCHAIN_SETUP.md](docs/BLOCKCHAIN_SETUP.md) for detailed setup instructions
4. **Platform-Specific Guides**: Review guides in `scripts/troubleshooting/` directory

### Development Container Issues

If you're using the development container and encounter issues:

```bash
# Rebuild the container
# In VS Code: Command Palette > "Dev Containers: Rebuild Container"

# Or manually rebuild
docker build -f .devcontainer/Dockerfile -t todo-devcontainer .
```

### Performance Issues

**Slow builds**:

```bash
# Use quick build for development
pnpm build:quick

# Enable Turborepo caching
export TURBO_CACHE_DIR=.turbo
```

**Memory issues during contract compilation**:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
```

For more detailed troubleshooting information, see:

- [BLOCKCHAIN_SETUP.md](docs/BLOCKCHAIN_SETUP.md) - Blockchain environment setup
- [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - General troubleshooting guide
- `scripts/troubleshooting/` - Platform-specific troubleshooting guides

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 🔒 Security

If you discover a security vulnerability, please follow the guidelines in [SECURITY.md](SECURITY.md).
