# Troubleshooting Guide

This guide provides solutions to common issues you might encounter while developing, testing, or deploying the Todo App monorepo.

## 🚨 Common Issues

### Development Environment Issues

#### Node.js Version Mismatch

**Problem**: Build or runtime errors due to Node.js version incompatibility.

**Symptoms**:
```bash
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check current Node.js version
node --version

# Install correct version (see .nvmrc)
nvm install
nvm use

# Or using n
n $(cat .nvmrc)

# Verify version
node --version  # Should match .nvmrc
```

#### pnpm Installation Issues

**Problem**: Package installation fails or dependencies are missing.

**Symptoms**:
```bash
ERR_PNPM_PEER_DEP_ISSUES
Module not found errors
```

**Solution**:
```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Reinstall dependencies
pnpm install

# If still failing, try legacy peer deps
pnpm install --legacy-peer-deps
```

#### Turborepo Cache Issues

**Problem**: Stale cache causing build inconsistencies.

**Symptoms**:
```bash
Build outputs don't reflect recent changes
Inconsistent build results
```

**Solution**:
```bash
# Clear Turborepo cache
pnpm turbo clean

# Or clear specific app cache
pnpm turbo clean --filter=@todo/web

# Force rebuild without cache
pnpm build --force
```

### Database Issues

#### MongoDB Connection Failed

**Problem**: Cannot connect to MongoDB database.

**Symptoms**:
```bash
MongoNetworkError: failed to connect to server
MongooseServerSelectionError
```

**Solution**:
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# or
systemctl status mongod

# Start MongoDB service
brew services start mongodb-community
# or
sudo systemctl start mongod

# Check connection string
echo $DATABASE_URL

# Test connection manually
mongosh "mongodb://localhost:27017/todoapp"

# For Docker setup
docker-compose up -d mongodb
docker-compose logs mongodb
```

#### MongoDB Authentication Issues

**Problem**: Authentication failed when connecting to MongoDB.

**Symptoms**:
```bash
MongoServerError: Authentication failed
```

**Solution**:
```bash
# Check credentials in environment
echo $DATABASE_USER
echo $DATABASE_PASSWORD

# Connect with admin credentials
mongosh "mongodb://admin:password@localhost:27017/todoapp?authSource=admin"

# Reset MongoDB authentication (development only)
docker-compose down mongodb
docker volume rm todo-list-turborepo_mongodb_data
docker-compose up -d mongodb
```

#### Redis Connection Issues

**Problem**: Cannot connect to Redis server.

**Symptoms**:
```bash
Error: Redis connection to localhost:6379 failed
ECONNREFUSED
```

**Solution**:
```bash
# Check if Redis is running
brew services list | grep redis
# or
systemctl status redis

# Start Redis service
brew services start redis
# or
sudo systemctl start redis

# Test Redis connection
redis-cli ping
# Should return: PONG

# For Docker setup
docker-compose up -d redis
docker-compose logs redis

# Check Redis configuration
redis-cli config get "*"
```

### Application Issues

#### API Server Won't Start

**Problem**: NestJS API server fails to start.

**Symptoms**:
```bash
Error: Cannot find module
TypeError: Cannot read property of undefined
Port already in use
```

**Solution**:
```bash
# Check for missing environment variables
cat apps/api/.env

# Kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Check for TypeScript compilation errors
cd apps/api
pnpm typecheck

# Start with debug logging
DEBUG=* pnpm dev:api

# Check dependencies
pnpm install --filter @todo/api
```

#### Web App Build Failures

**Problem**: Next.js build fails with various errors.

**Symptoms**:
```bash
Module not found
Type errors
Build optimization failed
```

**Solution**:
```bash
# Clear Next.js cache
cd apps/web
rm -rf .next

# Check TypeScript errors
pnpm typecheck

# Check for missing dependencies
pnpm install --filter @todo/web

# Build with verbose output
pnpm build --debug

# Check environment variables
cat apps/web/.env.local
```

#### Mobile App Issues

**Problem**: Expo/React Native app won't start or build.

**Symptoms**:
```bash
Metro bundler errors
Native module linking issues
Simulator/device connection problems
```

**Solution**:
```bash
# Clear Metro cache
cd apps/mobile
npx expo start --clear

# Reset Expo cache
npx expo install --fix

# Check Expo CLI version
npx expo --version

# For iOS simulator issues
npx expo run:ios --device

# For Android emulator issues
npx expo run:android --device

# Check native dependencies
npx expo doctor
```

### Blockchain Issues

#### Wallet Connection Failed

**Problem**: WalletConnect or wallet integration not working.

**Symptoms**:
```bash
Wallet connection timeout
Invalid project ID
Network mismatch errors
```

**Solution**:
```bash
# Check WalletConnect project ID
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# Verify project ID at walletconnect.com
# Check network configuration
echo $NEXT_PUBLIC_POLYGON_RPC_URL
echo $NEXT_PUBLIC_SOLANA_RPC_URL

# Test RPC endpoints
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  $NEXT_PUBLIC_POLYGON_RPC_URL

# Clear wallet cache in browser
# Disconnect and reconnect wallet
```

#### Smart Contract Deployment Failed

**Problem**: Contract deployment to blockchain networks fails.

**Symptoms**:
```bash
Insufficient funds for gas
Network connection timeout
Contract compilation errors
```

**Solution**:
```bash
# Check account balance
# For Polygon
cast balance $WALLET_ADDRESS --rpc-url $POLYGON_RPC_URL

# Check gas prices
cast gas-price --rpc-url $POLYGON_RPC_URL

# Verify private key format
echo $POLYGON_PRIVATE_KEY | wc -c  # Should be 66 chars

# Test network connection
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  $POLYGON_RPC_URL

# Compile contracts
cd apps/smart-contracts/polygon
pnpm compile

# Deploy with verbose logging
pnpm deploy --network polygon --verbose
```

#### Transaction Stuck or Failed

**Problem**: Blockchain transactions not confirming or failing.

**Symptoms**:
```bash
Transaction pending for long time
Transaction reverted
Nonce too low/high errors
```

**Solution**:
```bash
# Check transaction status
cast tx $TX_HASH --rpc-url $POLYGON_RPC_URL

# Check account nonce
cast nonce $WALLET_ADDRESS --rpc-url $POLYGON_RPC_URL

# Speed up transaction (increase gas price)
# Cancel transaction (send 0 ETH to self with same nonce)

# For Solana
solana transaction $TX_SIGNATURE

# Check Solana account
solana account $WALLET_ADDRESS
```

### Testing Issues

#### Tests Failing Unexpectedly

**Problem**: Tests that previously passed are now failing.

**Symptoms**:
```bash
Timeout errors
Database connection issues in tests
Mock function errors
```

**Solution**:
```bash
# Clear test cache
pnpm test --clearCache

# Run tests with verbose output
pnpm test --verbose

# Run specific test file
pnpm test todo.service.spec.ts

# Check test database connection
# Ensure test database is separate from development

# Reset test database
pnpm db:reset --env=test

# Check for async/await issues
# Ensure all promises are properly awaited
```

#### E2E Tests Failing

**Problem**: End-to-end tests failing in CI or locally.

**Symptoms**:
```bash
Browser launch failures
Element not found errors
Timeout waiting for elements
```

**Solution**:
```bash
# Install browser dependencies
npx playwright install

# Run tests in headed mode for debugging
pnpm test:e2e --headed

# Check test environment
echo $CI
echo $HEADLESS

# Update browser snapshots
pnpm test:e2e --update-snapshots

# Run tests with debug output
DEBUG=pw:api pnpm test:e2e

# Check for race conditions
# Add proper wait conditions
```

### Deployment Issues

#### Docker Build Failures

**Problem**: Docker images fail to build.

**Symptoms**:
```bash
npm install failures in Docker
File not found errors
Permission denied errors
```

**Solution**:
```bash
# Check Dockerfile syntax
docker build --no-cache -t todo-web ./apps/web

# Check .dockerignore file
cat apps/web/.dockerignore

# Build with verbose output
docker build --progress=plain -t todo-web ./apps/web

# Check base image
docker pull node:20-alpine

# Clear Docker cache
docker system prune -a

# Check file permissions
ls -la apps/web/
```

#### Kubernetes Deployment Issues

**Problem**: Pods failing to start or crashing.

**Symptoms**:
```bash
ImagePullBackOff
CrashLoopBackOff
Pending pod status
```

**Solution**:
```bash
# Check pod status
kubectl get pods -n todo-app

# Describe pod for events
kubectl describe pod <pod-name> -n todo-app

# Check pod logs
kubectl logs <pod-name> -n todo-app

# Check resource limits
kubectl top pods -n todo-app

# Verify secrets and configmaps
kubectl get secrets -n todo-app
kubectl get configmaps -n todo-app

# Check service endpoints
kubectl get endpoints -n todo-app

# Port forward for debugging
kubectl port-forward pod/<pod-name> 3001:3001 -n todo-app
```

#### SSL/TLS Certificate Issues

**Problem**: HTTPS not working or certificate errors.

**Symptoms**:
```bash
Certificate expired
Certificate not trusted
SSL handshake failures
```

**Solution**:
```bash
# Check certificate status
kubectl get certificate -n todo-app

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Verify DNS records
nslookup todo-app.example.com

# Test certificate
openssl s_client -connect todo-app.example.com:443

# Force certificate renewal
kubectl delete certificate todo-app-tls -n todo-app
kubectl apply -f infra/k8s/ingress.yml
```

### Performance Issues

#### Slow API Response Times

**Problem**: API endpoints responding slowly.

**Symptoms**:
```bash
High response times (>2s)
Database query timeouts
Memory usage spikes
```

**Solution**:
```bash
# Check API metrics
curl http://localhost:3001/metrics

# Monitor database queries
# Enable MongoDB profiling
mongosh --eval "db.setProfilingLevel(2, {slowms: 100})"

# Check slow queries
mongosh --eval "db.system.profile.find().sort({ts: -1}).limit(5)"

# Monitor Redis performance
redis-cli --latency-history

# Check memory usage
kubectl top pods -n todo-app

# Scale up replicas
kubectl scale deployment api-deployment --replicas=5 -n todo-app
```

#### High Memory Usage

**Problem**: Applications consuming excessive memory.

**Symptoms**:
```bash
Out of memory errors
Pod restarts due to memory limits
Slow garbage collection
```

**Solution**:
```bash
# Check memory usage
kubectl top pods -n todo-app

# Analyze memory leaks
node --inspect apps/api/dist/main.js

# Increase memory limits
# Update Kubernetes resource limits

# Check for memory leaks in code
# Use heap snapshots and profiling

# Optimize database queries
# Add proper indexes
# Use pagination
```

#### Database Performance Issues

**Problem**: Database queries are slow or timing out.

**Symptoms**:
```bash
Query timeout errors
High database CPU usage
Slow response times
```

**Solution**:
```bash
# Check database performance
mongosh --eval "db.runCommand({serverStatus: 1})"

# Analyze slow queries
mongosh --eval "db.setProfilingLevel(2, {slowms: 100})"
mongosh --eval "db.system.profile.find().sort({ts: -1}).limit(10)"

# Check indexes
mongosh --eval "db.todos.getIndexes()"

# Add missing indexes
mongosh --eval "db.todos.createIndex({userId: 1, createdAt: -1})"

# Check connection pool
# Increase connection pool size in configuration

# Monitor database metrics
# Use MongoDB Compass or similar tools
```

## 🔧 Debug Tools and Commands

### General Debugging

```bash
# Check all services status
pnpm health-check

# View all logs
docker-compose logs -f

# Check environment variables
printenv | grep -E "(DATABASE|REDIS|JWT|BLOCKCHAIN)"

# Test API endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/todos

# Check network connectivity
ping google.com
nslookup todo-app.example.com
```

### Database Debugging

```bash
# MongoDB debugging
mongosh "mongodb://localhost:27017/todoapp"
> db.todos.find().limit(5)
> db.users.countDocuments()
> db.runCommand({serverStatus: 1})

# Redis debugging
redis-cli
> ping
> keys *
> info memory
> monitor
```

### Blockchain Debugging

```bash
# Ethereum/Polygon debugging
cast block latest --rpc-url $POLYGON_RPC_URL
cast balance $WALLET_ADDRESS --rpc-url $POLYGON_RPC_URL
cast nonce $WALLET_ADDRESS --rpc-url $POLYGON_RPC_URL

# Solana debugging
solana cluster-version
solana balance $WALLET_ADDRESS
solana account $WALLET_ADDRESS
```

### Kubernetes Debugging

```bash
# Cluster debugging
kubectl cluster-info
kubectl get nodes
kubectl get pods --all-namespaces

# Application debugging
kubectl get all -n todo-app
kubectl describe deployment api-deployment -n todo-app
kubectl logs -f deployment/api-deployment -n todo-app

# Network debugging
kubectl get ingress -n todo-app
kubectl get services -n todo-app
kubectl get endpoints -n todo-app
```

## 📊 Monitoring and Alerting

### Health Check Endpoints

```bash
# API health check
curl http://localhost:3001/health

# Detailed health check
curl http://localhost:3001/health/detailed

# Database health
curl http://localhost:3001/health/database

# Redis health
curl http://localhost:3001/health/redis

# Blockchain health
curl http://localhost:3001/health/blockchain
```

### Metrics Collection

```bash
# Prometheus metrics
curl http://localhost:3001/metrics

# Application metrics
curl http://localhost:3001/metrics/app

# Custom business metrics
curl http://localhost:3001/metrics/todos
```

### Log Analysis

```bash
# View application logs
kubectl logs -f deployment/api-deployment -n todo-app

# Search logs for errors
kubectl logs deployment/api-deployment -n todo-app | grep ERROR

# View logs from specific time
kubectl logs deployment/api-deployment -n todo-app --since=1h

# Export logs for analysis
kubectl logs deployment/api-deployment -n todo-app > api-logs.txt
```

## 🚨 Emergency Procedures

### Service Recovery

#### API Server Down

```bash
# Check pod status
kubectl get pods -n todo-app

# Restart deployment
kubectl rollout restart deployment/api-deployment -n todo-app

# Scale up replicas
kubectl scale deployment api-deployment --replicas=3 -n todo-app

# Check recent changes
kubectl rollout history deployment/api-deployment -n todo-app

# Rollback if needed
kubectl rollout undo deployment/api-deployment -n todo-app
```

#### Database Issues

```bash
# Check database connectivity
mongosh "mongodb://localhost:27017/todoapp" --eval "db.runCommand({ping: 1})"

# Restart database (development only)
docker-compose restart mongodb

# Check database disk space
df -h

# Backup database before recovery
mongodump --uri="mongodb://localhost:27017/todoapp" --out=/backup/$(date +%Y%m%d)

# Restore from backup if needed
mongorestore --uri="mongodb://localhost:27017/todoapp" /backup/20240115
```

#### Complete System Recovery

```bash
# Stop all services
docker-compose down

# Clear all data (development only)
docker-compose down -v

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d

# Verify all services
curl http://localhost:3001/health
curl http://localhost:3000
```

## 📞 Getting Help

### Internal Resources

1. **Check Documentation**: Review `/docs` directory for detailed guides
2. **Search Issues**: Look through GitHub issues for similar problems
3. **Team Chat**: Ask in the development team chat/Discord
4. **Code Review**: Request help during code review process

### External Resources

1. **Stack Overflow**: Search for framework-specific issues
2. **GitHub Issues**: Check framework repositories for known issues
3. **Documentation**: Refer to official framework documentation
4. **Community Forums**: Ask in relevant community forums

### Escalation Process

1. **Level 1**: Try troubleshooting steps in this guide
2. **Level 2**: Ask team members or senior developers
3. **Level 3**: Create detailed issue with reproduction steps
4. **Level 4**: Contact framework maintainers or external support

### Creating Bug Reports

When reporting issues, include:

```markdown
## Environment
- OS: macOS 14.0
- Node.js: v20.10.0
- pnpm: 9.12.0
- Browser: Chrome 120.0

## Steps to Reproduce
1. Start development server
2. Navigate to /todos
3. Click create button
4. Error occurs

## Expected Behavior
Todo should be created successfully

## Actual Behavior
Error: "Cannot read property 'title' of undefined"

## Error Logs
```
[Error logs here]
```

## Additional Context
- This started happening after updating dependencies
- Only occurs in development environment
- Works fine in production
```

## 🔄 Preventive Measures

### Regular Maintenance

```bash
# Update dependencies monthly
pnpm update

# Clear caches weekly
pnpm turbo clean
docker system prune

# Run security audits
pnpm audit
npm audit fix

# Update Docker images
docker-compose pull
```

### Monitoring Setup

```bash
# Set up health check monitoring
# Configure alerts for:
# - API response time > 2s
# - Error rate > 5%
# - Memory usage > 80%
# - Database connection failures

# Set up log monitoring
# Configure alerts for:
# - ERROR level logs
# - Database query timeouts
# - Authentication failures
```

### Backup Procedures

```bash
# Daily database backups
mongodump --uri="$DATABASE_URL" --out="/backup/$(date +%Y%m%d)"

# Weekly full system backup
tar -czf "backup-$(date +%Y%m%d).tar.gz" \
  --exclude=node_modules \
  --exclude=.git \
  .

# Test backup restoration monthly
mongorestore --uri="$TEST_DATABASE_URL" /backup/latest
```

This troubleshooting guide should help you resolve most common issues. Keep it updated as new issues are discovered and resolved.