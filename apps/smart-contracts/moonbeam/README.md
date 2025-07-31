# Moonbeam Smart Contracts

This directory contains smart contracts for the Todo application deployed on Moonbeam, a Polkadot parachain with full Ethereum compatibility.

## Overview

Moonbeam is an Ethereum-compatible smart contract platform on Polkadot that makes it easy to build natively interoperable applications. This allows developers to deploy existing Solidity smart contracts and DApp frontends to Moonbeam with minimal changes.

## Contracts

- **TodoList.sol**: Main contract for managing todo items
- **TodoListFactory.sol**: Factory contract for creating TodoList instances

## Networks

### Moonbeam Mainnet
- **Chain ID**: 1284
- **Native Token**: GLMR (Glimmer)
- **RPC URL**: https://rpc.api.moonbeam.network
- **Explorer**: https://moonscan.io

### Moonbase Alpha (Testnet)
- **Chain ID**: 1287
- **Native Token**: DEV
- **RPC URL**: https://rpc.api.moonbase.moonbeam.network
- **Explorer**: https://moonbase.moonscan.io

### Local Development
- **Chain ID**: 1281
- **RPC URL**: http://localhost:9933 (when running local node)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
   - `MOONBEAM_PRIVATE_KEY`: Your private key for deployment
   - `MOONSCAN_API_KEY`: API key for contract verification
   - Network RPC URLs (optional, defaults provided)

## Usage

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Deploy to Networks

#### Local Development
```bash
npm run deploy:local
```

#### Moonbase Alpha (Testnet)
```bash
npm run deploy:moonbase
```

#### Moonbeam Mainnet
```bash
npm run deploy:moonbeam
```

### Create TodoList Instance
After deploying the factory, create a TodoList for your account:
```bash
npx hardhat run scripts/create-todo-list.js --network moonbase
```

### Create Sample Data
Populate your TodoList with sample todos:
```bash
npx hardhat run scripts/create-sample-todos.js --network moonbase
```

### Verify Contracts
Verify deployed contracts on Moonscan:
```bash
npm run verify:moonbase
# or
npm run verify:moonbeam
```

## Development

### Local Moonbeam Node
To run a local Moonbeam development node:
```bash
# Using Docker
docker run --rm -it --network host \
  purestake/moonbeam:latest \
  --dev --ws-external --rpc-external
```

Then deploy to local node:
```bash
npm run deploy:dev
```

### Gas Optimization
Moonbeam uses GLMR tokens for gas fees. The contracts are optimized for:
- Efficient storage usage
- Minimal gas consumption
- Batch operations where possible

### Moonbeam-Specific Features
- **Ethereum Compatibility**: Full compatibility with Ethereum tooling
- **Polkadot Integration**: Access to Polkadot's cross-chain features
- **Substrate Features**: Access to Substrate pallets and runtime upgrades

## Contract Addresses

After deployment, contract addresses will be saved in `deployments/{network}.json`.

## Testing

Run the test suite:
```bash
npm test
```

Generate coverage report:
```bash
npm run coverage
```

## Verification

Contracts can be verified on Moonscan using:
```bash
npx hardhat verify --network moonbase <CONTRACT_ADDRESS>
```

## Resources

- [Moonbeam Documentation](https://docs.moonbeam.network/)
- [Moonbeam GitHub](https://github.com/moonbeam-foundation/moonbeam)
- [Polkadot Documentation](https://polkadot.network/documentation/)
- [Moonscan Explorer](https://moonscan.io/)

## Support

For Moonbeam-specific issues:
- [Moonbeam Discord](https://discord.gg/PfpUATX)
- [Moonbeam Telegram](https://t.me/Moonbeam_Official)