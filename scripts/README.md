# Build Scripts Documentation

This directory contains a comprehensive build system for the Todo App monorepo, featuring enterprise-grade build scripts that handle the complete build process for all applications, packages, and blockchain contracts across multiple environments.

## 🎯 Key Accomplishments

### Enterprise Build System

- **Multi-Environment Support**: Seamless builds for development, staging, and production
- **Security Integration**: Vulnerability scanning, container security, and code quality enforcement
- **Performance Optimization**: Parallel builds, caching, and resource management
- **Build Validation**: Comprehensive artifact validation and reporting

### Blockchain Build Integration

- **Multi-Network Compilation**: Automated compilation for Polygon, Solana, and Polkadot
- **Contract Testing**: Integrated testing for all smart contracts and programs
- **Deployment Preparation**: Contract artifact generation and deployment scripts
- **Network Validation**: Cross-network contract validation and verification

### Developer Productivity

- **Quick Builds**: Fast development builds for rapid iteration
- **Comprehensive Logging**: Detailed build logs with error categorization
- **CLI Interface**: User-friendly command-line interface with help system
- **CI/CD Ready**: Optimized for continuous integration and deployment pipelines

## Available Scripts

### Main Build Scripts

#### `build.sh`

The primary build script that handles the complete build process.

```bash
# Default build (development)
./scripts/build.sh

# Production build
./scripts/build.sh --environment production --version v1.0.0

# Build without Docker images
./scripts/build.sh --skip-docker

# Build without tests
./scripts/build.sh --skip-tests

# Clean build with registry push
./scripts/build.sh --clean --push --registry my.registry.com
```

**Features:**

- Builds all packages and applications
- Compiles blockchain contracts
- Runs comprehensive tests
- Creates Docker images
- Supports multiple environments
- Parallel builds for performance
- Build reporting and validation

**Options:**

- `--environment ENV`: Set build environment (development, staging, production)
- `--version VERSION`: Set version tag for Docker images
- `--skip-docker`: Skip Docker image builds
- `--skip-contracts`: Skip blockchain contract compilation
- `--skip-tests`: Skip running tests
- `--no-parallel`: Disable parallel builds
- `--clean`: Clean previous builds before starting
- `--push`: Push Docker images to registry
- `--registry REGISTRY`: Docker registry URL

#### `build-quick.sh`

Fast build script for development iteration.

```bash
./scripts/build-quick.sh
```

**Features:**

- Builds only packages and applications
- Skips Docker images, contracts, and tests
- Optimized for development speed
- Parallel builds enabled

#### `build-production.sh`

Production-ready build script with security checks and optimizations.

```bash
# Set required environment variables
export VERSION=v1.0.0
export DOCKER_REGISTRY=my.registry.com

./scripts/build-production.sh
```

**Features:**

- Security vulnerability scanning
- Lint and type checking enforcement
- Production optimizations
- Container security scanning
- Build manifest generation
- Deployment preparation

#### `build-contracts.sh`

Specialized script for blockchain contract compilation.

```bash
# Build all contracts
./scripts/build-contracts.sh

# Build specific network
./scripts/build-contracts.sh --network polygon

# Build with documentation
./scripts/build-contracts.sh --generate-docs

# Build and verify contracts
./scripts/build-contracts.sh --verify
```

**Features:**

- Multi-network support (Polygon, Solana, Polkadot)
- Contract testing
- Documentation generation
- Contract verification
- Artifact management

## Package.json Scripts

The root `package.json` includes convenient npm/pnpm scripts:

### Build Scripts

```bash
# Main builds (no Docker)
pnpm build                    # Full build (apps, packages, contracts)
pnpm build:quick             # Quick development build
pnpm build:production        # Production build with security checks

# Specific builds
pnpm build:packages          # Build only shared packages
pnpm build:apps              # Build only applications
pnpm build:contracts         # Build blockchain contracts
```

### Development Scripts

```bash
# Start development servers
pnpm dev                     # All applications
pnpm dev:web                 # Next.js web app
pnpm dev:api                 # NestJS API
pnpm dev:mobile              # React Native/Expo
pnpm dev:ingestion           # Ingestion service
pnpm dev:contracts           # Hardhat node
```

### Contract Scripts

```bash
# Contract operations
pnpm contracts:compile       # Compile all contracts
pnpm contracts:test          # Test all contracts
pnpm contracts:deploy        # Deploy contracts
pnpm contracts:polygon       # Polygon-specific build
pnpm contracts:solana        # Solana-specific build
pnpm contracts:polkadot      # Polkadot-specific build
```

### Database Scripts

```bash
# Database operations
pnpm db:setup               # Complete database setup
pnpm db:migrate             # Run migrations
pnpm db:seed                # Seed with sample data
pnpm db:reset               # Reset database
```

### Docker Scripts

```bash
# Docker operations
pnpm docker:build           # Build Docker images (dev)
pnpm docker:build:prod      # Build Docker images (prod)
pnpm docker:clean           # Clean Docker resources (safe)
```

### Utility Scripts

```bash
# Code quality
pnpm lint                   # Run linting
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code
pnpm typecheck              # Type checking

# Testing
pnpm test                   # All tests
pnpm test:unit              # Unit tests
pnpm test:integration       # Integration tests
pnpm test:e2e               # End-to-end tests
pnpm test:contracts         # Contract tests

# Maintenance
pnpm clean                  # Clean build artifacts
```

## Build Process Overview

### 1. Prerequisites Check

- Validates Node.js version (≥18.0.0)
- Checks pnpm availability
- Verifies Turbo installation
- Validates Docker (if building images)

### 2. Dependency Installation

- Installs all workspace dependencies
- Uses frozen lockfile for production
- Optimizes for environment

### 3. Package Building

- Builds shared packages first
- Respects dependency order
- Supports parallel builds

### 4. Contract Compilation

- **Polygon**: Solidity contracts with Hardhat
- **Solana**: Rust programs with Anchor
- **Polkadot**: Substrate pallets with Cargo

### 5. Application Building

- **API**: NestJS with TypeScript compilation
- **Web**: Next.js with static optimization
- **Mobile**: React Native/Expo bundle
- **Ingestion**: Node.js service compilation

### 6. Testing

- Unit tests for all components
- Integration tests for APIs
- Contract tests for blockchain code
- E2E tests for user flows

### 7. Docker Image Creation

- Multi-stage builds for optimization
- Security-hardened base images
- Environment-specific configurations
- Registry tagging and pushing

### 8. Validation & Reporting

- Build artifact verification
- Security scanning
- Performance analysis
- Build manifest generation

## Environment Configuration

### Development

```bash
export ENVIRONMENT=development
export BUILD_DOCKER=true
export BUILD_CONTRACTS=true
export SKIP_TESTS=false
```

### Staging

```bash
export ENVIRONMENT=staging
export BUILD_DOCKER=true
export BUILD_CONTRACTS=true
export SKIP_TESTS=false
export DOCKER_REGISTRY=staging.registry.com
```

### Production

```bash
export ENVIRONMENT=production
export BUILD_DOCKER=true
export BUILD_CONTRACTS=true
export SKIP_TESTS=false
export DOCKER_REGISTRY=prod.registry.com
export VERSION=v1.0.0
export PUSH_IMAGES=true
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build production
        env:
          VERSION: ${{ github.sha }}
          DOCKER_REGISTRY: ${{ secrets.DOCKER_REGISTRY }}
        run: ./scripts/build-production.sh

      - name: Push images
        env:
          PUSH_IMAGES: true
        run: echo "Images pushed to registry"
```

### GitLab CI Example

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - ./scripts/build-production.sh
  variables:
    VERSION: $CI_COMMIT_SHA
    DOCKER_REGISTRY: $CI_REGISTRY
  artifacts:
    paths:
      - build/
      - production-build-manifest.json
```

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check prerequisites
node --version
pnpm --version
docker --version

# Clean and retry
pnpm clean
./scripts/build.sh --clean
```

#### Docker Issues

```bash
# Check Docker daemon
docker info

# Clean Docker resources
pnpm docker:clean

# Rebuild images
./scripts/build.sh --skip-tests --clean
```

#### Contract Compilation Issues

```bash
# Check blockchain tools
anchor --version
solana --version
cargo --version

# Build contracts separately
./scripts/build-contracts.sh --network polygon
```

#### Memory Issues

```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=8192"

# Disable parallel builds
./scripts/build.sh --no-parallel
```

### Performance Optimization

#### Parallel Builds

- Enabled by default for faster builds
- Can be disabled with `--no-parallel`
- Respects dependency order

#### Caching

- Turbo cache for incremental builds
- Docker layer caching
- pnpm store caching

#### Resource Management

- Memory limits for Node.js processes
- CPU core utilization
- Disk space monitoring

## Security Considerations

### Production Builds

- Security vulnerability scanning
- Container security analysis
- Dependency audit
- Code quality enforcement

### Secrets Management

- Environment variables for sensitive data
- Docker registry authentication
- API key management
- Certificate handling

### Image Security

- Non-root user execution
- Minimal base images
- Security patches
- Vulnerability scanning

## Monitoring and Logging

### Build Metrics

- Build duration tracking
- Resource usage monitoring
- Success/failure rates
- Performance trends

### Logging

- Structured log output
- Error categorization
- Debug information
- Build artifacts tracking

## Best Practices

1. **Always use version tags** for production builds
2. **Run security scans** before deployment
3. **Test builds locally** before CI/CD
4. **Monitor build performance** and optimize
5. **Keep dependencies updated** regularly
6. **Use parallel builds** for development
7. **Clean builds** for production releases
8. **Validate artifacts** after building

## Support

For build-related issues:

1. Check this documentation
2. Review build logs for errors
3. Validate environment configuration
4. Test individual components
5. Contact the development team

## Contributing

When modifying build scripts:

1. Test changes thoroughly
2. Update documentation
3. Consider backward compatibility
4. Add appropriate error handling
5. Follow shell scripting best practices
