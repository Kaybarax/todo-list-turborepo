# Troubleshooting Guide

This guide covers common issues and solutions for the Todo List monorepo, including network-specific blockchain issues.

## 🔧 General Issues

### Build Issues

#### pnpm Installation Fails
```bash
# Error: Cannot resolve workspace protocol
# Solution: Ensure you're using pnpm 9+
npm install -g pnpm@latest
pnpm --version  # Should be 9.0.0+
```

#### Turbo Build Failures
```bash
# Error: Turbo command not found
# Solution: Install turbo globally or use npx
npm install -g turbo
# OR
npx turbo build
```

#### TypeScript Compilation Errors
```bash
# Error: Cannot find module '@todo/services'
# Solution: Build packages first
pnpm build:packages
pnpm typecheck
```

### Development Server Issues

#### Port Already in Use
```bash
# Error: EADDRINUSE: address already in use :::3000
# Solution: Kill process or use different port
lsof -ti:3000 | xargs kill -9
# OR
PORT=3001 pnpm dev:web
```

#### Database Connection Issues
```bash
# Error: MongoNetworkError: failed to connect to server
# Solution: Ensure MongoDB is running
docker-compose up -d mongodb
# OR
pnpm db:setup
```

#### Redis Connection Issues
```bash
# Error: Redis connection failed
# Solution: Start Redis server
docker-compose up -d redis
# OR
redis-server
```

## ⛓️ Blockchain Network Issues

### Polygon Network

#### RPC Connection Issues
```bash
# Error: Could not connect to Polygon RPC
# Solution: Check RPC URL and network status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  https://polygon-rpc.com

# Alternative RPC URLs:
# - https://rpc-mainnet.maticvigil.com
# - https://polygon-mainnet.infura.io/v3/YOUR-PROJECT-ID
# - https://polygon-rpc.com
```

#### Gas Estimation Failures
```bash
# Error: Gas estimation failed
# Solution: Adjust gas settings in hardhat.config.js
networks: {
  polygon: {
    gasPrice: 30000000000, // 30 gwei
    gas: 5000000
  }
}
```

#### Contract Verification Issues
```bash
# Error: Contract verification failed on Polygonscan
# Solution: Ensure correct constructor arguments
pnpm hardhat verify --network polygon CONTRACT_ADDRESS "arg1" "arg2"

# Check if contract is already verified
# Visit: https://polygonscan.com/address/CONTRACT_ADDRESS
```

### Solana Network

#### Anchor Build Failures
```bash
# Error: Anchor not found
# Solution: Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

#### Program Deployment Issues
```bash
# Error: Insufficient funds for deployment
# Solution: Ensure wallet has enough SOL
solana balance
solana airdrop 2  # For devnet only

# Error: Program deployment failed
# Solution: Check program size and account limits
anchor build
ls -la target/deploy/  # Check program size
```

#### RPC Connection Issues
```bash
# Error: Connection refused to Solana RPC
# Solution: Check RPC endpoint and network status
solana config get
solana cluster-version

# Alternative RPC URLs:
# Mainnet: https://api.mainnet-beta.solana.com
# Devnet: https://api.devnet.solana.com
# Testnet: https://api.testnet.solana.com
```

### Polkadot Network

#### Substrate Node Issues
```bash
# Error: Failed to start Polkadot node
# Solution: Check Rust installation and build
rustup update
cargo build --release

# Error: WebSocket connection failed
# Solution: Check node is running and ports are open
./target/release/node-template --dev --ws-external
```

#### Runtime Compilation Issues
```bash
# Error: Runtime compilation failed
# Solution: Update Rust and dependencies
rustup update
cargo update
cargo build --release
```

### Moonbeam Network

#### EVM Compatibility Issues
```bash
# Error: Transaction reverted without reason
# Solution: Check gas limits and contract state
# Moonbeam has different gas costs than Ethereum
networks: {
  moonbeam: {
    gasPrice: 1000000000, // 1 gwei
    gas: 5000000
  }
}
```

#### Precompile Issues
```bash
# Error: Precompile call failed
# Solution: Check Moonbeam-specific precompiles
# Moonbeam has unique precompiles for cross-chain functionality
# See: https://docs.moonbeam.network/builders/pallets-precompiles/
```

#### Network Configuration Issues
```bash
# Error: Wrong chain ID
# Solution: Verify network configuration
# Moonbeam Mainnet: Chain ID 1284
# Moonbase Alpha: Chain ID 1287
```

### Base Network

#### L2 Transaction Issues
```bash
# Error: Transaction not found
# Solution: L2 transactions may take time to appear
# Wait 10-30 seconds and check again
# Use Base block explorer: https://basescan.org
```

#### Bridge Issues
```bash
# Error: Bridge transaction failed
# Solution: Check bridge status and allowances
# Visit: https://bridge.base.org
# Ensure sufficient ETH for gas on both L1 and L2
```

#### Gas Estimation Issues
```bash
# Error: Gas estimation failed on Base
# Solution: L2 gas estimation can be different
networks: {
  base: {
    gasPrice: 1000000000, // 1 gwei
    gas: 5000000
  }
}
```

## 🔐 Wallet Connection Issues

### MetaMask Issues

#### Network Not Added
```bash
# Solution: Add network manually to MetaMask
# Polygon: Chain ID 137, RPC: https://polygon-rpc.com
# Moonbeam: Chain ID 1284, RPC: https://rpc.api.moonbeam.network
# Base: Chain ID 8453, RPC: https://mainnet.base.org
```

#### Transaction Stuck
```bash
# Solution: Reset account or increase gas price
# MetaMask > Settings > Advanced > Reset Account
# OR increase gas price for next transaction
```

### WalletConnect Issues

#### Connection Timeout
```bash
# Error: WalletConnect session timeout
# Solution: Check network connectivity and try again
# Ensure firewall allows WebSocket connections
```

#### QR Code Not Scanning
```bash
# Solution: Refresh page and try again
# Ensure mobile wallet supports WalletConnect v2
```

## 🐳 Docker Issues

### Container Build Failures

#### Docker Build Context Too Large
```bash
# Error: Docker build context is too large
# Solution: Use .dockerignore to exclude files
echo "node_modules" >> .dockerignore
echo ".git" >> .dockerignore
echo "*.log" >> .dockerignore
```

#### Multi-stage Build Issues
```bash
# Error: Stage not found
# Solution: Check Dockerfile stage names
docker build --target development .
```

### Container Runtime Issues

#### Port Binding Failures
```bash
# Error: Port already in use
# Solution: Stop conflicting containers
docker ps
docker stop CONTAINER_ID
# OR use different ports
docker run -p 3001:3000 app
```

#### Volume Mount Issues
```bash
# Error: Volume mount failed
# Solution: Check file permissions and paths
# On macOS/Windows, ensure Docker has file access permissions
```

## ☸️ Kubernetes Issues

### Deployment Issues

#### Pod Stuck in Pending
```bash
# Check node resources and scheduling
kubectl describe pod POD_NAME
kubectl get nodes
kubectl top nodes
```

#### ImagePullBackOff
```bash
# Error: Failed to pull image
# Solution: Check image name and registry access
kubectl describe pod POD_NAME
# Verify image exists in registry
docker pull IMAGE_NAME
```

#### ConfigMap/Secret Issues
```bash
# Error: ConfigMap not found
# Solution: Ensure ConfigMaps are created first
kubectl apply -f configmaps/
kubectl get configmaps
```

### Service Issues

#### Service Not Accessible
```bash
# Check service and endpoints
kubectl get services
kubectl get endpoints
kubectl describe service SERVICE_NAME
```

#### Ingress Issues
```bash
# Error: Ingress not working
# Solution: Check ingress controller and rules
kubectl get ingress
kubectl describe ingress INGRESS_NAME
# Ensure ingress controller is running
kubectl get pods -n ingress-nginx
```

## 🧪 Testing Issues

### Unit Test Failures

#### Jest Configuration Issues
```bash
# Error: Jest cannot find modules
# Solution: Check Jest configuration and module paths
# Ensure @todo/* packages are built
pnpm build:packages
```

#### Mock Issues
```bash
# Error: Module mocking failed
# Solution: Check mock implementations
# Ensure mocks are in __mocks__ directory
```

### Integration Test Issues

#### Database Test Issues
```bash
# Error: Database connection failed in tests
# Solution: Use test database or containers
# Set NODE_ENV=test
export NODE_ENV=test
pnpm test:integration
```

#### Blockchain Test Issues
```bash
# Error: Contract deployment failed in tests
# Solution: Use local blockchain networks
# Start local nodes before running tests
pnpm dev:contracts  # Start local blockchain nodes
pnpm test:contracts
```

### E2E Test Issues

#### Playwright Issues
```bash
# Error: Browser not found
# Solution: Install Playwright browsers
npx playwright install
npx playwright install-deps
```

#### Test Timeout Issues
```bash
# Error: Test timeout
# Solution: Increase timeout or optimize tests
# In playwright.config.ts:
timeout: 60000  // 60 seconds
```

## 📊 Performance Issues

### Build Performance

#### Slow Builds
```bash
# Solution: Use build cache and parallel builds
# Enable Turbo cache
export TURBO_TOKEN=your-token
export TURBO_TEAM=your-team

# Use parallel builds
pnpm build --parallel
```

#### Memory Issues
```bash
# Error: JavaScript heap out of memory
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

### Runtime Performance

#### Slow API Responses
```bash
# Check database indexes and query performance
# Monitor with OpenTelemetry traces
# Visit: http://localhost:16686 (Jaeger UI)
```

#### High Memory Usage
```bash
# Check for memory leaks
# Use Node.js profiling tools
node --inspect app.js
# Visit: chrome://inspect
```

## 🔍 Debugging Tools

### Blockchain Debugging

#### Transaction Debugging
```bash
# Ethereum/EVM networks
# Use block explorers:
# - Polygon: https://polygonscan.com
# - Moonbeam: https://moonscan.io
# - Base: https://basescan.org

# Solana
# Use Solana Explorer: https://explorer.solana.com
solana transaction TRANSACTION_SIGNATURE

# Polkadot
# Use Subscan: https://polkadot.subscan.io
```

#### Contract Debugging
```bash
# Hardhat console for EVM networks
cd apps/smart-contracts/polygon
npx hardhat console --network polygon

# Solana program debugging
cd apps/smart-contracts/solana
anchor test --skip-local-validator
```

### Application Debugging

#### API Debugging
```bash
# Enable debug logging
export LOG_LEVEL=debug
pnpm dev:api

# Use API documentation
# Visit: http://localhost:3001/api/docs
```

#### Frontend Debugging
```bash
# Enable React DevTools
# Install browser extension

# Enable Next.js debugging
export DEBUG=*
pnpm dev:web
```

## 📞 Getting Help

### Community Support
- **Discord**: Join our development Discord server
- **GitHub Issues**: Report bugs and feature requests
- **Stack Overflow**: Tag questions with relevant technologies

### Network-Specific Support
- **Polygon**: [Polygon Discord](https://discord.gg/polygon)
- **Solana**: [Solana Discord](https://discord.gg/solana)
- **Polkadot**: [Polkadot Discord](https://discord.gg/polkadot)
- **Moonbeam**: [Moonbeam Discord](https://discord.gg/PfpUATX)
- **Base**: [Base Discord](https://discord.gg/buildonbase)

### Documentation
- **Project Docs**: Check `/docs` directory
- **Network Docs**: See network-specific setup guides
- **API Docs**: Visit `/api/docs` when running the API

### Emergency Contacts
- **Critical Issues**: Create GitHub issue with "critical" label
- **Security Issues**: Follow responsible disclosure in SECURITY.md
- **Infrastructure Issues**: Check status pages of service providers