# Deployment Guide

This guide covers the comprehensive deployment process for the Todo App monorepo across different environments and platforms.

## 🚀 Quick Start

### Development Deployment
```bash
# Quick development setup
pnpm deploy:dev

# Or manually
./scripts/deploy-development.sh
```

### Staging Deployment
```bash
# Set required environment variables
export VERSION=v1.0.0-staging
export DOCKER_REGISTRY=staging.registry.com

# Deploy to staging
pnpm deploy:staging
```

### Production Deployment
```bash
# Set required environment variables
export VERSION=v1.0.0
export DOCKER_REGISTRY=prod.registry.com
export MONGODB_URI=mongodb+srv://...
export JWT_SECRET=your-production-secret

# Deploy to production
pnpm deploy:production
```

## 📋 Deployment Scripts Overview

### Main Deployment Script (`deploy.sh`)
Comprehensive deployment script supporting multiple environments and platforms.

**Features:**
- Multi-environment support (development, staging, production)
- Kubernetes and Docker Compose deployment options
- Blockchain contract deployment integration
- Build automation and validation
- Health checks and verification
- Rollback capabilities

**Usage:**
```bash
./scripts/deploy.sh [OPTIONS]

Options:
  --environment ENV     Deployment environment
  --version VERSION     Application version
  --namespace NS        Kubernetes namespace
  --skip-build          Skip building applications
  --skip-contracts      Skip blockchain contract deployment
  --dry-run             Show what would be deployed
  --docker-compose      Use Docker Compose instead of Kubernetes
  --rollback            Rollback to previous deployment
  --cleanup             Remove entire deployment
```

### Environment-Specific Scripts

#### Development (`deploy-development.sh`)
- **Purpose**: Local development environment setup
- **Platform**: Docker Compose
- **Features**: 
  - Quick setup with sample data
  - Local blockchain networks
  - Development tools integration
  - Hot reload support

#### Staging (`deploy-staging.sh`)
- **Purpose**: Staging environment for testing
- **Platform**: Kubernetes
- **Features**:
  - Testnet blockchain deployment
  - Performance validation
  - Security scanning
  - Blue-green deployment preparation

#### Production (`deploy-production.sh`)
- **Purpose**: Production environment deployment
- **Platform**: Kubernetes
- **Features**:
  - High-security validation
  - Blue-green deployment strategy
  - Comprehensive backup creation
  - Performance monitoring
  - Zero-downtime deployment

### Blockchain Deployment (`deploy-contracts.sh`)
Specialized script for blockchain contract deployment across multiple networks.

**Supported Networks:**
- **Polygon**: Solidity contracts with Hardhat
- **Solana**: Rust programs with Anchor
- **Polkadot**: Substrate pallets

**Features:**
- Multi-network deployment
- Environment-specific network selection
- Contract verification
- Deployment artifact management
- Post-deployment testing

## 🌍 Environment Configuration

### Development Environment
```bash
# Environment variables
export ENVIRONMENT=development
export MONGODB_URI=mongodb://admin:password@localhost:27017/todo-app?authSource=admin
export REDIS_URI=redis://localhost:6379
export JWT_SECRET=dev-jwt-secret

# Blockchain networks (local)
export POLYGON_LOCAL_RPC_URL=http://localhost:8545
export SOLANA_LOCAL_RPC_URL=http://localhost:8899
export POLKADOT_LOCAL_RPC_URL=ws://localhost:9944
```

### Staging Environment
```bash
# Environment variables
export ENVIRONMENT=staging
export VERSION=v1.0.0-staging
export DOCKER_REGISTRY=staging.registry.com
export NAMESPACE=todo-app-staging

# Database (staging)
export MONGODB_URI=mongodb+srv://staging-user:password@staging-cluster.mongodb.net/todo-app
export REDIS_URI=redis://staging-redis:6379

# Blockchain networks (testnets)
export POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
export SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com
export POLKADOT_WESTEND_RPC_URL=wss://westend-rpc.polkadot.io

# Security
export JWT_SECRET=staging-jwt-secret
export POLYGON_PRIVATE_KEY=0x...
```

### Production Environment
```bash
# Environment variables
export ENVIRONMENT=production
export VERSION=v1.0.0
export DOCKER_REGISTRY=prod.registry.com
export NAMESPACE=todo-app

# Database (production)
export MONGODB_URI=mongodb+srv://prod-user:password@prod-cluster.mongodb.net/todo-app
export REDIS_URI=redis://prod-redis:6379

# Blockchain networks (mainnets)
export POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com
export SOLANA_MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
export POLKADOT_MAINNET_RPC_URL=wss://rpc.polkadot.io

# Security (use secure secret management)
export JWT_SECRET=production-jwt-secret
export POLYGON_PRIVATE_KEY=0x...
export ETHERSCAN_API_KEY=...
```

## 🐳 Docker Deployment

### Docker Compose (Development)
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Or use deployment script
./scripts/deploy-development.sh
```

### Docker Compose (Production)
```bash
# Build production images
pnpm build:production

# Start production environment
docker-compose up -d

# Or use deployment script
./scripts/deploy.sh --docker-compose --environment production
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (v1.20+)
- kubectl configured
- Docker registry access
- Ingress controller (NGINX recommended)

### Development Cluster
```bash
# Deploy to development cluster
./scripts/deploy.sh --environment development --namespace todo-app-dev
```

### Staging Cluster
```bash
# Deploy to staging cluster
export VERSION=v1.0.0-staging
export DOCKER_REGISTRY=staging.registry.com
./scripts/deploy-staging.sh
```

### Production Cluster
```bash
# Deploy to production cluster
export VERSION=v1.0.0
export DOCKER_REGISTRY=prod.registry.com
./scripts/deploy-production.sh
```

## ⛓️ Blockchain Contract Deployment

### Local Development
```bash
# Deploy all contracts to local networks
./scripts/deploy-contracts.sh --environment development

# Deploy specific network
./scripts/deploy-contracts.sh --network polygon --environment development
```

### Staging (Testnets)
```bash
# Deploy to testnets
export POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
export POLYGON_PRIVATE_KEY=0x...
./scripts/deploy-contracts.sh --environment staging --verify
```

### Production (Mainnets)
```bash
# Deploy to mainnets (requires manual confirmation)
export POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com
export POLYGON_PRIVATE_KEY=0x...
export ETHERSCAN_API_KEY=...
./scripts/deploy-contracts.sh --environment production --verify
```

## 🔄 Deployment Strategies

### Rolling Deployment (Default)
- Gradual replacement of old instances
- Minimal downtime
- Automatic rollback on failure

### Blue-Green Deployment (Production)
- Complete environment switch
- Zero downtime
- Instant rollback capability
- Used automatically in production script

### Canary Deployment
```bash
# Deploy to subset of users first
kubectl patch deployment api -n todo-app --type='json' \
  -p='[{"op": "replace", "path": "/spec/replicas", "value": 1}]'

# Monitor metrics, then scale up
kubectl scale deployment api --replicas=3 -n todo-app
```

## 📊 Monitoring & Validation

### Health Checks
All deployment scripts include comprehensive health checks:

```bash
# API health
curl -f https://api.todo-app.com/health

# Web health
curl -f https://todo-app.com/api/health

# Database connectivity
kubectl exec -n todo-app deployment/api -- node -e "
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(process.env.MONGODB_URI);
  client.connect().then(() => console.log('DB OK')).catch(console.error);
"
```

### Performance Validation
```bash
# Load testing with k6 (if available)
k6 run --duration 60s --vus 50 tests/performance/api-load-test.js

# Or use curl for basic testing
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://api.todo-app.com/health
done
```

### Monitoring Dashboards
- **Grafana**: Application metrics and performance
- **Jaeger**: Distributed tracing
- **Kubernetes Dashboard**: Cluster resources
- **Blockchain Explorers**: Contract interactions

## 🔧 Troubleshooting

### Common Issues

#### Deployment Failures
```bash
# Check pod status
kubectl get pods -n todo-app

# Check pod logs
kubectl logs -f deployment/api -n todo-app

# Check events
kubectl get events -n todo-app --sort-by='.lastTimestamp'
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "mongodb://admin:password@mongodb:27017/todo-app?authSource=admin"

# Test Redis connection
redis-cli -h redis -p 6379 ping
```

#### Contract Deployment Issues
```bash
# Check network connectivity
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  $POLYGON_RPC_URL

# Check Solana network
solana cluster-version

# Verify contract deployment
cast call $CONTRACT_ADDRESS "name()" --rpc-url $POLYGON_RPC_URL
```

### Rollback Procedures

#### Kubernetes Rollback
```bash
# Rollback deployment
kubectl rollout undo deployment/api -n todo-app

# Rollback to specific revision
kubectl rollout undo deployment/api --to-revision=2 -n todo-app

# Check rollback status
kubectl rollout status deployment/api -n todo-app
```

#### Docker Compose Rollback
```bash
# Stop current deployment
docker-compose down

# Restore from backup
docker-compose -f docker-compose.backup.yml up -d
```

#### Contract Rollback
```bash
# Contracts are immutable, but you can:
# 1. Deploy new version with migration
# 2. Update application to use previous contract
# 3. Use proxy pattern for upgradeable contracts
```

## 🔐 Security Considerations

### Production Deployment Security
- Use secure secret management (Kubernetes secrets, HashiCorp Vault)
- Enable network policies and RBAC
- Regular security scanning of images
- TLS/SSL for all communications
- Database encryption at rest and in transit

### Blockchain Security
- Use hardware wallets for mainnet deployments
- Verify contract source code
- Audit smart contracts before mainnet deployment
- Monitor contract interactions
- Implement emergency pause mechanisms

## 📈 Performance Optimization

### Kubernetes Optimization
- Configure resource requests and limits
- Use horizontal pod autoscaling
- Implement pod disruption budgets
- Optimize image sizes and layers

### Database Optimization
- Configure connection pooling
- Implement proper indexing
- Use read replicas for scaling
- Monitor query performance

### Application Optimization
- Enable caching layers (Redis)
- Optimize bundle sizes
- Use CDN for static assets
- Implement proper logging levels

## 🚨 Emergency Procedures

### Service Outage
1. Check monitoring dashboards
2. Review recent deployments
3. Check infrastructure status
4. Implement rollback if necessary
5. Scale resources if needed

### Database Issues
1. Check database connectivity
2. Review database logs
3. Check disk space and resources
4. Restore from backup if necessary
5. Run database repair if needed

### Blockchain Issues
1. Check network status
2. Verify RPC endpoints
3. Check contract interactions
4. Monitor gas prices
5. Switch to backup RPC if needed

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Operations](https://docs.mongodb.com/manual/administration/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [Solana Documentation](https://docs.solana.com/)
- [Polkadot Documentation](https://polkadot.network/documentation/)

## 🤝 Support

For deployment issues:
1. Check this documentation
2. Review deployment logs
3. Check monitoring dashboards
4. Contact the DevOps team
5. Create incident report if needed