# Deployment Guide

This document provides comprehensive guidance for deploying the Todo App monorepo across different environments, including development, staging, and production deployments.

## 🏗️ Deployment Architecture

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
      - "3000:3000"
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
      - "3001:3001"
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
      - "19000:19000"
      - "19001:19001"
      - "19002:19002"
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
      - "27017:27017"
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
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
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
  NODE_ENV: "production"
  API_URL: "https://api.todo-app.example.com"
  WEB_URL: "https://todo-app.example.com"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  MONGODB_HOST: "mongodb-service"
  MONGODB_PORT: "27017"
  MONGODB_DATABASE: "todoapp"
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
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
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
          value: "mongodb://$(MONGODB_USERNAME):$(MONGODB_PASSWORD)@$(MONGODB_HOST):$(MONGODB_PORT)/$(MONGODB_DATABASE)"
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
          value: "redis://$(REDIS_HOST):$(REDIS_PORT)"
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
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
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
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
  volumeClaimTemplates:
  - metadata:
      name: mongodb-storage
    spec:
      accessModes: ["ReadWriteOnce"]
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
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
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
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
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
          cd apps/blockchain-smart-contracts/polygon
          npm ci
      
      - name: Deploy Polygon contracts
        run: |
          cd apps/blockchain-smart-contracts/polygon
          npx hardhat deploy --network polygon
        env:
          POLYGON_PRIVATE_KEY: ${{ secrets.POLYGON_PRIVATE_KEY }}
          POLYGON_RPC_URL: ${{ secrets.POLYGON_RPC_URL }}
      
      - name: Deploy Solana programs
        run: |
          cd apps/blockchain-smart-contracts/solana
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

# Wait for databases to be ready
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
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
    - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
    - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
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