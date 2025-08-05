# Todo API

A modern NestJS API server with MongoDB, Redis, and comprehensive blockchain integration for the Todo App monorepo.

## 🚀 Features

### Core API Features
- **NestJS Framework**: Modern, scalable Node.js framework with TypeScript
- **MongoDB Integration**: Document database with Mongoose ODM
- **Redis Caching**: High-performance caching and session management
- **JWT Authentication**: Secure authentication with refresh tokens
- **Input Validation**: Comprehensive validation using Zod schemas
- **OpenAPI Documentation**: Auto-generated Swagger documentation

### Blockchain Integration
- **Multi-Network Support**: Polygon, Solana, Polkadot, Moonbeam, and Base integration
- **Wallet Authentication**: WalletConnect-based authentication
- **Transaction Tracking**: Comprehensive blockchain transaction monitoring
- **Contract Interaction**: Smart contract integration for decentralized storage

### Observability & Monitoring
- **OpenTelemetry**: Distributed tracing and metrics
- **Health Checks**: Comprehensive health monitoring endpoints
- **Structured Logging**: JSON-structured logging with correlation IDs
- **Prometheus Metrics**: Application and business metrics

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── wallet.strategy.ts
│   ├── todo/                # Todo management module
│   │   ├── todo.controller.ts
│   │   ├── todo.service.ts
│   │   ├── todo.schema.ts
│   │   └── dto/
│   ├── user/                # User management module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.schema.ts
│   ├── blockchain/          # Blockchain integration module
│   │   ├── blockchain.controller.ts
│   │   ├── blockchain.service.ts
│   │   └── networks/
│   ├── common/              # Shared utilities and decorators
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/              # Configuration management
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── blockchain.config.ts
│   ├── app.module.ts        # Main application module
│   └── main.ts              # Application entry point
├── test/                    # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── Dockerfile               # Docker configuration
├── package.json
└── README.md
```

## 🛠️ Development

### Prerequisites
- Node.js 20+
- MongoDB (local or containerized)
- Redis (local or containerized)
- pnpm package manager

### Quick Start

#### Using Development Scripts
```bash
# Start API with dependencies (recommended)
pnpm dev:api

# Or start backend services
pnpm dev:backend
```

#### Manual Setup
```bash
# Install dependencies
pnpm install

# Start databases
docker-compose -f docker-compose.dev.yml up -d mongodb redis

# Setup database
pnpm db:setup

# Start development server
cd apps/api
pnpm dev
```

### Environment Configuration

Create `.env.development` in the project root:

```bash
# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/todo-app?authSource=admin
REDIS_URI=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# API Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Blockchain
POLYGON_RPC_URL=http://localhost:8545
SOLANA_RPC_URL=http://localhost:8899
POLKADOT_RPC_URL=ws://localhost:9944
MOONBEAM_RPC_URL=http://localhost:8545
BASE_RPC_URL=http://localhost:8545

# Monitoring
JAEGER_ENDPOINT=http://localhost:14268/api/traces
```

### Available Scripts

```bash
# Development
pnpm dev                    # Start development server with hot reload
pnpm start:debug           # Start with debugging enabled

# Building
pnpm build                 # Build for production
pnpm start                 # Start production server

# Testing
pnpm test                  # Run unit tests
pnpm test:watch           # Run tests in watch mode
pnpm test:integration     # Run integration tests
pnpm test:e2e             # Run end-to-end tests
pnpm test:cov             # Run tests with coverage

# Code Quality
pnpm lint                 # Run ESLint
pnpm lint:fix             # Fix ESLint issues
pnpm format               # Format code with Prettier
pnpm typecheck            # Run TypeScript type checking
```

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:3001/api
- **OpenAPI JSON**: http://localhost:3001/api-json

### Authentication

#### JWT Authentication
```bash
# Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### Wallet Authentication
```bash
# Wallet login
POST /auth/wallet/login
{
  "address": "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  "signature": "0x...",
  "message": "Sign this message to authenticate",
  "network": "polygon"
}
```

### Todo Management

#### Get Todos
```bash
GET /todos?page=1&limit=10&completed=false&priority=high

# Response
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439021",
      "title": "Complete project",
      "description": "Finish the todo application",
      "completed": false,
      "priority": "high",
      "dueDate": "2024-02-01T00:00:00Z",
      "tags": ["work", "urgent"],
      "userId": "507f1f77bcf86cd799439011",
      "blockchainNetwork": "polygon",
      "transactionHash": "0x...",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Create Todo
```bash
POST /todos
{
  "title": "New todo item",
  "description": "Description of the todo",
  "priority": "medium",
  "dueDate": "2024-02-01T00:00:00Z",
  "tags": ["personal"],
  "blockchainNetwork": "polygon"
}
```

#### Update Todo
```bash
PUT /todos/:id
{
  "title": "Updated todo item",
  "completed": true,
  "priority": "low"
}
```

#### Delete Todo
```bash
DELETE /todos/:id
```

### Blockchain Integration

#### Get Blockchain Networks
```bash
GET /blockchain/networks

# Response
{
  "networks": [
    {
      "name": "polygon",
      "status": "online",
      "blockHeight": 12345678,
      "gasPrice": "30000000000",
      "contractAddress": "0x..."
    }
  ]
}
```

#### Sync Todo to Blockchain
```bash
POST /blockchain/sync/:todoId
{
  "network": "polygon"
}

# Response
{
  "transactionHash": "0x...",
  "status": "pending",
  "network": "polygon"
}
```

### Health & Monitoring

#### Health Check
```bash
GET /health

# Response
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "blockchain": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "blockchain": { "status": "up" }
  }
}
```

#### Metrics
```bash
GET /metrics
# Prometheus-formatted metrics
```

## 🧪 Testing

### Test Structure
```
test/
├── unit/                   # Unit tests
│   ├── auth/
│   ├── todo/
│   └── user/
├── integration/            # Integration tests
│   ├── auth.integration.spec.ts
│   ├── todo.integration.spec.ts
│   └── blockchain.integration.spec.ts
└── e2e/                   # End-to-end tests
    ├── auth.e2e-spec.ts
    ├── todo.e2e-spec.ts
    └── blockchain.e2e-spec.ts
```

### Running Tests

#### Unit Tests
```bash
# Run all unit tests
pnpm test

# Run specific test file
pnpm test auth.service.spec.ts

# Run tests with coverage
pnpm test:cov
```

#### Integration Tests
```bash
# Run integration tests
pnpm test:integration

# Run with test database
TEST_DATABASE_URL=mongodb://localhost:27017/todo-app-test pnpm test:integration
```

#### E2E Tests
```bash
# Run e2e tests
pnpm test:e2e

# Run against specific environment
NODE_ENV=test pnpm test:e2e
```

### Test Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t todo-api:latest -f apps/api/Dockerfile .

# Run container
docker run -p 3001:3001 \
  -e MONGODB_URI=mongodb://mongodb:27017/todo-app \
  -e REDIS_URI=redis://redis:6379 \
  todo-api:latest
```

### Kubernetes Deployment
```bash
# Deploy to Kubernetes
kubectl apply -f infra/k8s/deployments/api.yaml
kubectl apply -f infra/k8s/services/database-services.yaml

# Check deployment status
kubectl get pods -l app.kubernetes.io/component=api
```

### Environment Variables

#### Production Environment
```bash
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo-app
REDIS_URI=redis://redis-cluster:6379
JWT_SECRET=your-production-jwt-secret

# Optional
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://todo-app.com
LOG_LEVEL=info

# Blockchain
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_PRIVATE_KEY=0x...
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
MOONBEAM_RPC_URL=https://rpc.api.moonbeam.network
MOONBEAM_PRIVATE_KEY=0x...
BASE_RPC_URL=https://mainnet.base.org
BASE_PRIVATE_KEY=0x...

# Monitoring
JAEGER_ENDPOINT=http://jaeger-collector:14268/api/traces
PROMETHEUS_METRICS=true
```

## 🔧 Configuration

### Database Configuration
```typescript
// src/config/database.config.ts
export const databaseConfig = {
  uri: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
```

### Redis Configuration
```typescript
// src/config/redis.config.ts
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB) || 0,
  keyPrefix: 'todo-app:',
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};
```

### Blockchain Configuration
```typescript
// src/config/blockchain.config.ts
export const blockchainConfig = {
  polygon: {
    rpcUrl: process.env.POLYGON_RPC_URL,
    contractAddress: process.env.POLYGON_CONTRACT_ADDRESS,
    privateKey: process.env.POLYGON_PRIVATE_KEY,
  },
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL,
    programId: process.env.SOLANA_PROGRAM_ID,
  },
  polkadot: {
    rpcUrl: process.env.POLKADOT_RPC_URL,
  },
  moonbeam: {
    rpcUrl: process.env.MOONBEAM_RPC_URL,
    contractAddress: process.env.MOONBEAM_CONTRACT_ADDRESS,
    privateKey: process.env.MOONBEAM_PRIVATE_KEY,
  },
  base: {
    rpcUrl: process.env.BASE_RPC_URL,
    contractAddress: process.env.BASE_CONTRACT_ADDRESS,
    privateKey: process.env.BASE_PRIVATE_KEY,
  },
};
```

## 🔍 Monitoring & Debugging

### Logging
```typescript
// Structured logging example
this.logger.log('Todo created', {
  todoId: todo.id,
  userId: user.id,
  correlationId: req.correlationId,
});
```

### Metrics
```typescript
// Custom metrics example
@Histogram('todo_creation_duration_seconds', 'Time to create a todo')
async createTodo(createTodoDto: CreateTodoDto) {
  const timer = this.todoCreationHistogram.startTimer();
  try {
    const todo = await this.todoService.create(createTodoDto);
    timer({ status: 'success' });
    return todo;
  } catch (error) {
    timer({ status: 'error' });
    throw error;
  }
}
```

### Tracing
```typescript
// OpenTelemetry tracing
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('todo-api');
const span = tracer.startSpan('create-todo');
span.setAttributes({
  'todo.title': createTodoDto.title,
  'user.id': userId,
});
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB connection
mongosh $MONGODB_URI

# Check Redis connection
redis-cli -u $REDIS_URI ping

# View database logs
docker-compose logs mongodb redis
```

#### Authentication Issues
```bash
# Verify JWT secret
echo $JWT_SECRET | base64

# Test authentication endpoint
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Performance Issues
```bash
# Check application metrics
curl http://localhost:3001/metrics

# Monitor database performance
mongosh --eval "db.todos.getIndexes()"

# Check Redis memory usage
redis-cli info memory
```

### Debug Mode
```bash
# Start in debug mode
pnpm start:debug

# Attach debugger (VS Code)
# Use "Attach to Node.js" configuration on port 9229
```

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Swagger/OpenAPI Documentation](https://swagger.io/docs/)

## 🤝 Contributing

1. Follow the established code structure and patterns
2. Write comprehensive tests for new features
3. Update documentation for API changes
4. Use conventional commits for version control
5. Ensure all tests pass before submitting PRs

## 📄 License

This project is part of the Todo App monorepo. See the main project LICENSE file for details.