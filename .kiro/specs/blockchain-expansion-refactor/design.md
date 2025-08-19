# Design Document

## Overview

This design outlines the expansion of blockchain network support and refactoring of the project structure. The project will be enhanced to support five blockchain networks: Polygon, Solana, Polkadot, Moonbeam (Polkadot EVM), and Base (Coinbase L2). Additionally, the "blockchain-smart-contracts" directory will be renamed to "smart-contracts" for better naming conventions.

The design ensures backward compatibility while adding new network support through a modular architecture that leverages existing patterns and interfaces.

## Architecture

### Directory Structure Refactoring

The current `apps/blockchain-smart-contracts/` directory will be renamed to `apps/smart-contracts/` with the following structure:

```
apps/smart-contracts/
├── package.json                    # Updated package name
├── hardhat.config.ts              # Multi-network Hardhat config
├── polygon/                       # Existing Polygon contracts
├── solana/                        # Existing Solana programs
├── polkadot/                      # Existing Polkadot pallets
├── moonbeam/                      # New Moonbeam EVM contracts
│   ├── contracts/
│   │   ├── TodoList.sol
│   │   └── TodoListFactory.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   └── create-sample-todos.js
│   ├── test/
│   │   ├── TodoList.test.js
│   │   └── TodoListFactory.test.js
│   ├── hardhat.config.js
│   └── package.json
└── base/                          # New Base network contracts
    ├── contracts/
    │   ├── TodoList.sol
    │   └── TodoListFactory.sol
    ├── scripts/
    │   ├── deploy.js
    │   └── create-sample-todos.js
    ├── test/
    │   ├── TodoList.test.js
    │   └── TodoListFactory.test.js
    ├── hardhat.config.js
    └── package.json
```

### Network Configuration Architecture

Each new network will follow the established pattern with network-specific configurations:

#### Moonbeam Network Configuration

- **Network Type**: EVM-compatible (Polkadot parachain)
- **Chain IDs**:
  - Moonbeam Mainnet: 1284
  - Moonbase Alpha Testnet: 1287
  - Moonbeam Development: 1281
- **RPC Endpoints**: Configurable via environment variables
- **Smart Contract Language**: Solidity (same as Polygon)
- **Development Framework**: Hardhat

#### Base Network Configuration

- **Network Type**: Ethereum L2 (Optimistic Rollup)
- **Chain IDs**:
  - Base Mainnet: 8453
  - Base Goerli Testnet: 84531
  - Base Sepolia Testnet: 84532
- **RPC Endpoints**: Configurable via environment variables
- **Smart Contract Language**: Solidity (same as Polygon)
- **Development Framework**: Hardhat

## Components and Interfaces

### 1. Blockchain Service Factory Enhancement

The `BlockchainServiceFactory` will be extended to support the new networks:

```typescript
// Updated BlockchainNetwork enum
export enum BlockchainNetwork {
  // Existing networks
  POLYGON = 'polygon',
  POLYGON_MUMBAI = 'polygon_mumbai',
  SOLANA = 'solana',
  SOLANA_DEVNET = 'solana_devnet',
  POLKADOT = 'polkadot',
  POLKADOT_TESTNET = 'polkadot_testnet',

  // New networks
  MOONBEAM = 'moonbeam',
  MOONBEAM_TESTNET = 'moonbeam_testnet',
  BASE = 'base',
  BASE_TESTNET = 'base_testnet',
}

// Updated configuration interface
export interface BlockchainServiceConfig {
  polygon?: {
    /* existing config */
  };
  solana?: {
    /* existing config */
  };
  polkadot?: {
    /* existing config */
  };

  // New network configurations
  moonbeam?: {
    mainnet?: EthereumLikeServiceOptions;
    testnet?: EthereumLikeServiceOptions;
  };
  base?: {
    mainnet?: EthereumLikeServiceOptions;
    testnet?: EthereumLikeServiceOptions;
  };
}
```

### 2. New Blockchain Service Implementations

#### MoonbeamBlockchainService

- Extends existing EVM-compatible service patterns
- Implements the `BlockchainService` interface
- Handles Moonbeam-specific transaction formatting
- Supports Substrate-based wallet connections

#### BaseBlockchainService

- Extends existing EVM-compatible service patterns
- Implements the `BlockchainService` interface
- Handles Base L2 optimizations
- Supports Ethereum wallet connections

### 3. Smart Contract Architecture

Both Moonbeam and Base will use identical Solidity contracts to Polygon:

#### TodoList.sol

```solidity
// Reusable contract for all EVM networks
contract TodoList {
  struct Todo {
    uint256 id;
    string title;
    string description;
    bool completed;
    address owner;
    uint256 createdAt;
    uint256 updatedAt;
  }

  // Contract implementation remains the same
  // Network-specific deployment configurations
}
```

#### TodoListFactory.sol

```solidity
// Factory pattern for creating TodoList instances
contract TodoListFactory {
  // Implementation remains consistent across EVM networks
  // Network-specific gas optimizations
}
```

### 4. Frontend Integration

#### Network Selection Component

```typescript
interface NetworkOption {
  id: BlockchainNetwork;
  name: string;
  icon: string;
  chainId: number;
  isTestnet: boolean;
  isEVM: boolean;
}

const SUPPORTED_NETWORKS: NetworkOption[] = [
  // Existing networks
  { id: BlockchainNetwork.POLYGON, name: 'Polygon' /* ... */ },
  { id: BlockchainNetwork.SOLANA, name: 'Solana' /* ... */ },
  { id: BlockchainNetwork.POLKADOT, name: 'Polkadot' /* ... */ },

  // New networks
  { id: BlockchainNetwork.MOONBEAM, name: 'Moonbeam', chainId: 1284, isEVM: true },
  { id: BlockchainNetwork.BASE, name: 'Base', chainId: 8453, isEVM: true },
];
```

## Data Models

### Network Configuration Schema

```typescript
interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contractAddresses: {
    todoListFactory: string;
    todoList?: string;
  };
}

const NETWORK_CONFIGS: Record<BlockchainNetwork, NetworkConfig> = {
  [BlockchainNetwork.MOONBEAM]: {
    name: 'Moonbeam',
    chainId: 1284,
    rpcUrl: process.env.MOONBEAM_RPC_URL || 'https://rpc.api.moonbeam.network',
    explorerUrl: 'https://moonscan.io',
    nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
    contractAddresses: { todoListFactory: '' }, // Set during deployment
  },
  [BlockchainNetwork.BASE]: {
    name: 'Base',
    chainId: 8453,
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    contractAddresses: { todoListFactory: '' }, // Set during deployment
  },
};
```

## Error Handling

### Network-Specific Error Handling

```typescript
export enum BlockchainErrorType {
  // Existing error types
  WALLET_CONNECTION_FAILED = 'wallet_connection_failed',
  TRANSACTION_FAILED = 'transaction_failed',

  // New network-specific errors
  MOONBEAM_CONNECTION_FAILED = 'moonbeam_connection_failed',
  BASE_L2_ERROR = 'base_l2_error',
  NETWORK_SWITCH_REQUIRED = 'network_switch_required',
  UNSUPPORTED_WALLET = 'unsupported_wallet',
}

class NetworkErrorHandler {
  static handleMoonbeamError(error: any): BlockchainError {
    // Handle Moonbeam-specific errors
    // Map Substrate errors to common format
  }

  static handleBaseError(error: any): BlockchainError {
    // Handle Base L2-specific errors
    // Map Optimism errors to common format
  }
}
```

## Testing Strategy

### 1. Unit Testing

- Test new blockchain service implementations
- Test network configuration validation
- Test error handling for new networks

### 2. Integration Testing

- Test smart contract deployment on local networks
- Test wallet connection flows for new networks
- Test transaction submission and confirmation

### 3. Contract Testing

- Deploy and test contracts on local Moonbeam development node
- Deploy and test contracts on local Base development environment
- Verify contract functionality matches existing networks

### 4. End-to-End Testing

- Test complete user flows with new networks
- Test network switching functionality
- Test cross-network todo synchronization

### Testing Infrastructure

#### Local Development Networks

```yaml
# docker-compose.dev.yml additions
services:
  moonbeam-dev:
    image: purestake/moonbeam:latest
    ports:
      - '9933:9933'
      - '9944:9944'
    command: --dev --ws-external --rpc-external

  base-dev:
    image: ethereumoptimism/op-geth:latest
    ports:
      - '8545:8545'
      - '8546:8546'
    # Base-specific configuration
```

## Migration Strategy

### Phase 1: Directory Refactoring

1. Rename `apps/blockchain-smart-contracts` to `apps/smart-contracts`
2. Update all file references throughout the codebase
3. Update package.json scripts and configurations
4. Update documentation and README files

### Phase 2: Moonbeam Integration

1. Create Moonbeam directory structure
2. Implement MoonbeamBlockchainService
3. Deploy and test contracts on Moonbase Alpha
4. Update frontend to support Moonbeam selection

### Phase 3: Base Integration

1. Create Base directory structure
2. Implement BaseBlockchainService
3. Deploy and test contracts on Base Goerli
4. Update frontend to support Base selection

### Phase 4: Integration and Testing

1. Update blockchain service factory
2. Comprehensive testing across all networks
3. Documentation updates
4. Deployment pipeline updates

## Deployment Considerations

### Environment Variables

```bash
# Moonbeam configuration
MOONBEAM_RPC_URL=https://rpc.api.moonbeam.network
MOONBEAM_TESTNET_RPC_URL=https://rpc.api.moonbase.moonbeam.network
MOONBEAM_PRIVATE_KEY=
MOONSCAN_API_KEY=

# Base configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_TESTNET_RPC_URL=https://goerli.base.org
BASE_PRIVATE_KEY=
BASESCAN_API_KEY=
```

### Build Script Updates

The existing `build-contracts.sh` script will be enhanced to support the new networks:

```bash
# Function to build Moonbeam contracts
build_moonbeam() {
    if [ ! -d "apps/smart-contracts/moonbeam" ]; then
        print_warning "Moonbeam contracts directory not found, skipping..."
        return
    fi

    print_status "Building Moonbeam contracts..."
    cd apps/smart-contracts/moonbeam
    pnpm compile
    cd ../../..
}

# Function to build Base contracts
build_base() {
    if [ ! -d "apps/smart-contracts/base" ]; then
        print_warning "Base contracts directory not found, skipping..."
        return
    fi

    print_status "Building Base contracts..."
    cd apps/smart-contracts/base
    pnpm compile
    cd ../../..
}
```

### Kubernetes Deployment Updates

Update deployment manifests to reference the new directory structure and support additional networks in environment configurations.

## Security Considerations

### 1. Network Validation

- Validate chain IDs before transaction submission
- Implement network-specific gas estimation
- Add transaction simulation before submission

### 2. Contract Security

- Reuse audited contract code from Polygon implementation
- Implement network-specific access controls
- Add emergency pause functionality

### 3. Wallet Security

- Validate wallet compatibility with selected networks
- Implement secure key management for deployment
- Add transaction signing validation

## Performance Optimizations

### 1. Network-Specific Optimizations

- **Moonbeam**: Leverage Substrate-specific features
- **Base**: Utilize L2 gas optimizations
- **All Networks**: Implement connection pooling

### 2. Caching Strategy

- Cache network configurations
- Cache contract ABIs and addresses
- Implement transaction status caching

### 3. Load Balancing

- Distribute RPC calls across multiple endpoints
- Implement fallback RPC providers
- Add circuit breaker patterns for network failures
