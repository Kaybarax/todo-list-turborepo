# Base Smart Contracts

This directory contains smart contracts for the Todo application deployed on Base, Coinbase's Ethereum L2 optimistic rollup.

## Overview

Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain. It's built on Optimism's OP Stack and offers full EVM compatibility with significantly lower gas costs than Ethereum mainnet.

## Contracts

- **TodoList.sol**: Main contract for managing todo items
- **TodoListFactory.sol**: Factory contract for creating TodoList instances

## Networks

### Base Mainnet

- **Chain ID**: 8453
- **Native Token**: ETH
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org

### Base Sepolia (Testnet)

- **Chain ID**: 84532
- **Native Token**: ETH
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org

### Local Development

- **Chain ID**: 8453
- **RPC URL**: http://localhost:8545 (when running local node)

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
   - `BASE_PRIVATE_KEY`: Your private key for deployment
   - `BASESCAN_API_KEY`: API key for contract verification
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

#### Base Sepolia (Testnet)

```bash
npm run deploy:sepolia
```

#### Base Mainnet

```bash
npm run deploy:base
```

### Create TodoList Instance

After deploying the factory, create a TodoList for your account:

```bash
npx hardhat run scripts/create-todo-list.js --network base_sepolia
```

### Create Sample Data

Populate your TodoList with sample todos:

```bash
npx hardhat run scripts/create-sample-todos.js --network base_sepolia
```

### Verify Contracts

Verify deployed contracts on Basescan:

```bash
npm run verify:sepolia
# or
npm run verify:base
```

## Development

### Local Base Node

To run a local Base development environment, you can use a standard Ethereum development node like Hardhat Network or Ganache, configured with Base's chain ID.

Then deploy to local node:

```bash
npm run deploy:dev
```

### Gas Optimization

Base offers significantly lower gas costs than Ethereum mainnet. The contracts are optimized for:

- Efficient storage usage
- Minimal gas consumption
- Batch operations where possible
- L2-specific optimizations

### Base-Specific Features

- **Low Gas Costs**: Transactions cost a fraction of Ethereum mainnet
- **Fast Finality**: Near-instant transaction confirmation
- **EVM Compatibility**: Full compatibility with Ethereum tooling
- **Optimistic Rollup**: Inherits Ethereum's security with L2 efficiency

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

Contracts can be verified on Basescan using:

```bash
npx hardhat verify --network base_sepolia <CONTRACT_ADDRESS>
```

## Resources

- [Base Documentation](https://docs.base.org/)
- [Base GitHub](https://github.com/base-org)
- [OP Stack Documentation](https://stack.optimism.io/)
- [Basescan Explorer](https://basescan.org/)

## Support

For Base-specific issues:

- [Base Discord](https://discord.gg/buildonbase)
- [Base Twitter](https://twitter.com/base)
- [Base GitHub Discussions](https://github.com/base-org/base-contracts/discussions)
