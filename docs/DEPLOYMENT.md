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
  -p=\'[{"op": "replace", "path": "/spec/replicas", "value": 1}]\'

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
  curl -s -o /dev/null -w "%{{http_code}}
" https://api.todo-app.com/health
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

# 🏗️ Deployment Architecture

### Environment Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│ • Local Docker  │    │ • K8s Cluster   │    │ • K8s Cluster   │
│ • Hot Reload    │    │ • CI/CD Deploy  │    │ • Blue/Green    │
│ • Mock Services │    │ • Real Services │    │ • Auto Scaling  │
│ • Debug Mode    │    │ • Load Testing  │    │ • Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Infrastructure Components

- **Container Orchestration**: Kubernetes
- **Service Mesh**: Istio (Production)
- **Load Balancer**: NGINX Ingress Controller
- **Database**: MongoDB Atlas / Self-hosted MongoDB
- **Cache**: Redis Cluster
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **CI/CD**: GitHub Actions

## 🐳 Containerization

### Docker Images

#### Multi-stage Dockerfile Example

```dockerfile
# apps/web/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

#### API Server Dockerfile

```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs
EXPOSE 3001

CMD ["node", "dist/main"]
```

### Docker Compose for Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    depends_on:
      - api

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongodb:27017/todoapp
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-key
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    depends_on:
      - mongodb
      - redis

  mobile:
    build:
      context: ./apps/mobile
      dockerfile: Dockerfile
    ports:
      - '19000:19000'
      - '19001:19001'
      - '19002:19002'
    environment:
      - EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
    volumes:
      - ./apps/mobile:/app
      - /app/node_modules

  ingestion:
    build:
      context: ./apps/ingestion
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongodb:27017/todoapp
      - REDIS_URL=redis://redis:6379
      - POLYGON_RPC_URL=https://polygon-rpc.com
      - SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:5.0
    ports:
      - '27017:27017'
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=todoapp
    volumes:
      - mongodb_data:/data/db
      - ./db/init-scripts:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./infra/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api

volumes:
  mongodb_data:
  redis_data:
```

## ☸️ Kubernetes Deployment

### Namespace Configuration

```yaml
# infra/k8s/namespace.yml
apiVersion: v1
kind: Namespace
metadata:
  name: todo-app
  labels:
    name: todo-app
    environment: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: todo-app-staging
  labels:
    name: todo-app-staging
    environment: staging
```

### ConfigMap and Secrets

```yaml
# infra/k8s/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: todo-app-config
  namespace: todo-app
data:
  NODE_ENV: 'production'
  API_URL: 'https://api.todo-app.example.com'
  WEB_URL: 'https://todo-app.example.com'
  REDIS_HOST: 'redis-service'
  REDIS_PORT: '6379'
  MONGODB_HOST: 'mongodb-service'
  MONGODB_PORT: '27017'
  MONGODB_DATABASE: 'todoapp'
---
apiVersion: v1
kind: Secret
metadata:
  name: todo-app-secrets
  namespace: todo-app
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
  MONGODB_USERNAME: <base64-encoded-username>
  MONGODB_PASSWORD: <base64-encoded-password>
  REDIS_PASSWORD: <base64-encoded-password>
  POLYGON_PRIVATE_KEY: <base64-encoded-key>
  SOLANA_PRIVATE_KEY: <base64-encoded-key>
```

### Web Application Deployment

```yaml
# infra/k8s/web-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
  namespace: todo-app
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: todo-app/web:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: NODE_ENV
            - name: NEXT_PUBLIC_API_URL
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: API_URL
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
  namespace: todo-app
spec:
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

### API Server Deployment

```yaml
# infra/k8s/api-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  namespace: todo-app
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: todo-app/api:latest
          ports:
            - containerPort: 3001
          env:
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: NODE_ENV
            - name: DATABASE_URL
              value: 'mongodb://$(MONGODB_USERNAME):$(MONGODB_PASSWORD)@$(MONGODB_HOST):$(MONGODB_PORT)/$(MONGODB_DATABASE)'
            - name: MONGODB_HOST
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: MONGODB_HOST
            - name: MONGODB_PORT
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: MONGODB_PORT
            - name: MONGODB_DATABASE
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: MONGODB_DATABASE
            - name: MONGODB_USERNAME
              valueFrom:
                secretKeyRef:
                  name: todo-app-secrets
                  key: MONGODB_USERNAME
            - name: MONGODB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: todo-app-secrets
                  key: MONGODB_PASSWORD
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: todo-app-secrets
                  key: JWT_SECRET
            - name: REDIS_URL
              value: 'redis://$(REDIS_HOST):$(REDIS_PORT)'
            - name: REDIS_HOST
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: REDIS_HOST
            - name: REDIS_PORT
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: REDIS_PORT
          resources:
            requests:
              memory: '512Mi'
              cpu: '500m'
            limits:
              memory: '1Gi'
              cpu: '1000m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: todo-app
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: ClusterIP
```

### Database Deployments

```yaml
# infra/k8s/mongodb-deployment.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
  namespace: todo-app
spec:
  serviceName: mongodb-service
  replicas: 3
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongodb
          image: mongo:5.0
          ports:
            - containerPort: 27017
          env:
            - name: MONGO_INITDB_ROOT_USERNAME
              valueFrom:
                secretKeyRef:
                  name: todo-app-secrets
                  key: MONGODB_USERNAME
            - name: MONGO_INITDB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: todo-app-secrets
                  key: MONGODB_PASSWORD
            - name: MONGO_INITDB_DATABASE
              valueFrom:
                configMapKeyRef:
                  name: todo-app-config
                  key: MONGODB_DATABASE
          volumeMounts:
            - name: mongodb-storage
              mountPath: /data/db
          resources:
            requests:
              memory: '1Gi'
              cpu: '500m'
            limits:
              memory: '2Gi'
              cpu: '1000m'
  volumeClaimTemplates:
    - metadata:
        name: mongodb-storage
      spec:
        accessModes: ['ReadWriteOnce']
        resources:
          requests:
            storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
  namespace: todo-app
spec:
  selector:
    app: mongodb
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
  clusterIP: None
```

### Redis Deployment

```yaml
# infra/k8s/redis-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-deployment
  namespace: todo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          volumeMounts:
            - name: redis-storage
              mountPath: /data
      volumes:
        - name: redis-storage
          persistentVolumeClaim:
            claimName: redis-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: todo-app
spec:
  selector:
    app: redis
  ports:
    - protocol: TCP
      port: 6379
      targetPort: 6379
  type: ClusterIP
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: todo-app
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

### Ingress Configuration

```yaml
# infra/k8s/ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: todo-app-ingress
  namespace: todo-app
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: 'true'
    nginx.ingress.kubernetes.io/use-regex: 'true'
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  tls:
    - hosts:
        - todo-app.example.com
        - api.todo-app.example.com
      secretName: todo-app-tls
  rules:
    - host: todo-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
    - host: api.todo-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [web, api, mobile, ingestion]
    steps:
      - uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/${{ matrix.app }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./apps/${{ matrix.app }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    environment: staging
    steps:
      - uses: actions/checkout@v3

      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.24.0'

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig

      - name: Deploy to staging
        run: |
          export KUBECONFIG=kubeconfig
          kubectl set image deployment/web-deployment web=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/web:${{ github.sha }} -n todo-app-staging
          kubectl set image deployment/api-deployment api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/api:${{ github.sha }} -n todo-app-staging
          kubectl rollout status deployment/web-deployment -n todo-app-staging
          kubectl rollout status deployment/api-deployment -n todo-app-staging

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3

      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.24.0'

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig

      - name: Deploy to production
        run: |
          export KUBECONFIG=kubeconfig
          kubectl set image deployment/web-deployment web=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/web:${{ github.sha }} -n todo-app
          kubectl set image deployment/api-deployment api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/api:${{ github.sha }} -n todo-app
          kubectl rollout status deployment/web-deployment -n todo-app
          kubectl rollout status deployment/api-deployment -n todo-app

      - name: Run smoke tests
        run: |
          curl -f https://todo-app.example.com/api/health
          curl -f https://api.todo-app.example.com/health

  blockchain-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd apps/smart-contracts/polygon
          npm ci

      - name: Deploy Polygon contracts
        run: |
          cd apps/smart-contracts/polygon
          npx hardhat deploy --network polygon
        env:
          POLYGON_PRIVATE_KEY: ${{ secrets.POLYGON_PRIVATE_KEY }}
          POLYGON_RPC_URL: ${{ secrets.POLYGON_RPC_URL }}

      - name: Deploy Solana programs
        run: |
          cd apps/smart-contracts/solana
          anchor deploy
        env:
          SOLANA_PRIVATE_KEY: ${{ secrets.SOLANA_PRIVATE_KEY }}
          SOLANA_RPC_URL: ${{ secrets.SOLANA_RPC_URL }}
```

## 🔧 Environment Configuration

### Development Environment

```bash
# scripts/dev-setup.sh
#!/bin/bash

echo "Setting up development environment..."

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start databases
docker-compose up -d mongodb redis

# Wait for databases to start...
echo "Waiting for databases to start..."
sleep 10

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

### Staging Environment

```bash
# scripts/staging-deploy.sh
#!/bin/bash

echo "Deploying to staging environment..."

# Build and push images
docker build -t todo-app/web:staging ./apps/web
docker build -t todo-app/api:staging ./apps/api
docker push todo-app/web:staging
docker push todo-app/api:staging

# Deploy to Kubernetes
kubectl apply -f infra/k8s/staging/
kubectl set image deployment/web-deployment web=todo-app/web:staging -n todo-app-staging
kubectl set image deployment/api-deployment api=todo-app/api:staging -n todo-app-staging

# Wait for rollout
kubectl rollout status deployment/web-deployment -n todo-app-staging
kubectl rollout status deployment/api-deployment -n todo-app-staging

echo "Staging deployment complete!"
```

### Production Environment

```bash
# scripts/production-deploy.sh
#!/bin/bash

echo "Deploying to production environment..."

# Backup database
kubectl exec -it mongodb-0 -n todo-app -- mongodump --out /tmp/backup-$(date +%Y%m%d)

# Blue-green deployment
kubectl apply -f infra/k8s/production/

# Update images
kubectl set image deployment/web-deployment web=todo-app/web:latest -n todo-app
kubectl set image deployment/api-deployment api=todo-app/api:latest -n todo-app

# Wait for rollout
kubectl rollout status deployment/web-deployment -n todo-app
kubectl rollout status deployment/api-deployment -n todo-app

# Run health checks
curl -f https://todo-app.example.com/api/health
curl -f https://api.todo-app.example.com/health

echo "Production deployment complete!"
```

## 📊 Monitoring and Observability

### Prometheus Configuration

```yaml
# infra/monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - 'alert_rules.yml'

scrape_configs:
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels:
          [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  - job_name: 'todo-app'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093
```

### Grafana Dashboards

```json
{
  "dashboard": {
    "title": "Todo App Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      }
    ]
  }
}
```

## 🔒 Security Considerations

### SSL/TLS Configuration

```nginx
# infra/nginx/ssl.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### Network Policies

```yaml
# infra/k8s/network-policy.yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: todo-app-network-policy
  namespace: todo-app
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
        - protocol: TCP
          port: 3001
    - from:
        - podSelector:
            matchLabels:
              app: api
        - podSelector:
            matchLabels:
              app: web
      ports:
        - protocol: TCP
          port: 27017
        - protocol: TCP
          port: 6379
  egress:
    - to: []
      ports:
        - protocol: TCP
          port: 53
        - protocol: UDP
          port: 53
    - to: []
      ports:
        - protocol: TCP
          port: 443
        - protocol: TCP
          port: 80
```

## 🔄 Backup and Recovery

### Database Backup Strategy

```bash
# scripts/backup.sh
#!/bin/bash

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# MongoDB backup
kubectl exec -it mongodb-0 -n todo-app -- mongodump --out /tmp/backup
kubectl cp todo-app/mongodb-0:/tmp/backup $BACKUP_DIR/mongodb

# Redis backup
kubectl exec -it redis-deployment-xxx -n todo-app -- redis-cli BGSAVE
kubectl cp todo-app/redis-deployment-xxx:/data/dump.rdb $BACKUP_DIR/redis/

# Upload to cloud storage
aws s3 sync $BACKUP_DIR s3://todo-app-backups/$(date +%Y%m%d)/

echo "Backup completed: $BACKUP_DIR"
```

### Disaster Recovery Plan

```bash
# scripts/restore.sh
#!/bin/bash

BACKUP_DATE=$1
if [ -z "$BACKUP_DATE" ]; then
  echo "Usage: $0 <backup-date>"
  exit 1
fi

BACKUP_DIR="/backups/$BACKUP_DATE"

# Download from cloud storage
aws s3 sync s3://todo-app-backups/$BACKUP_DATE/ $BACKUP_DIR/

# Restore MongoDB
kubectl cp $BACKUP_DIR/mongodb todo-app/mongodb-0:/tmp/restore
kubectl exec -it mongodb-0 -n todo-app -- mongorestore /tmp/restore

# Restore Redis
kubectl cp $BACKUP_DIR/redis/dump.rdb todo-app/redis-deployment-xxx:/data/
kubectl delete pod -l app=redis -n todo-app

echo "Restore completed from backup: $BACKUP_DATE"
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] Code review completed
- [ ] Tests passing (unit, integration, e2e)
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Monitoring alerts configured

### Deployment

- [ ] Backup current database
- [ ] Deploy to staging first
- [ ] Run smoke tests on staging
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-deployment

- [ ] Verify all services running
- [ ] Check application logs
- [ ] Monitor user traffic
- [ ] Validate business metrics
- [ ] Update documentation
- [ ] Notify stakeholders

## 🚨 Troubleshooting

### Common Issues

#### Pod Startup Issues

```bash
# Check pod status
kubectl get pods -n todo-app

# Check pod logs
kubectl logs <pod-name> -n todo-app

# Describe pod for events
kubectl describe pod <pod-name> -n todo-app
```

#### Database Connection Issues

```bash
# Test MongoDB connection
kubectl exec -it mongodb-0 -n todo-app -- mongo --eval "db.adminCommand('ismaster')"

# Test Redis connection
kubectl exec -it redis-deployment-xxx -n todo-app -- redis-cli ping
```

#### SSL Certificate Issues

```bash
# Check certificate status
kubectl get certificate -n todo-app

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager
```

### Performance Issues

#### High Memory Usage

```bash
# Check resource usage
kubectl top pods -n todo-app

# Scale deployment
kubectl scale deployment api-deployment --replicas=5 -n todo-app
```

#### Database Performance

```bash
# Check MongoDB performance
kubectl exec -it mongodb-0 -n todo-app -- mongo --eval "db.runCommand({serverStatus: 1})"

# Check slow queries
kubectl exec -it mongodb-0 -n todo-app -- mongo --eval "db.setProfilingLevel(2, {slowms: 100})"
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [MongoDB on Kubernetes](https://docs.mongodb.com/kubernetes-operator/)

This deployment guide provides comprehensive coverage for deploying the Todo App monorepo across different environments with proper monitoring, security, and backup strategies.
