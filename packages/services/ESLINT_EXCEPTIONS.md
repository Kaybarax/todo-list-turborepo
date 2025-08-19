# ESLint Exceptions Documentation

This document explains the legitimate unused declarations that have been marked with ESLint exceptions in the services package.

## Interface Method Signatures

### BlockchainService Interface (`src/blockchain/interfaces/BlockchainService.ts`)

The following parameters are marked as unused because they are required by the interface contract but may not be used in all implementations:

- `connectWallet(options?: unknown)` - `options` parameter required for implementation flexibility
- `getWalletBalance(tokenAddress?: string)` - `tokenAddress` parameter required for multi-token support
- `getTodoById(id: string)` - `id` parameter required for todo lookup
- `createTodo(todo: CreateBlockchainTodoInput)` - `todo` parameter required for creation
- `updateTodo(id: string, todo: UpdateBlockchainTodoInput)` - Both parameters required for updates
- `deleteTodo(id: string)` - `id` parameter required for deletion
- `getTransactionStatus(txHash: string)` - `txHash` parameter required for transaction lookup
- `getTransactionReceipt(txHash: string)` - `txHash` parameter required for receipt lookup
- `getTransactionExplorerUrl(txHash: string)` - `txHash` parameter required for URL generation
- `getAddressExplorerUrl(address: string)` - `address` parameter required for URL generation

## Abstract Method Signatures

### BaseBlockchainService (`src/blockchain/implementations/BaseBlockchainService.ts`)

Abstract methods must match the interface signature even if parameters aren't used in the base class:

- All abstract method parameters are marked as unused because they will be used by concrete implementations

## Callback Function Signatures

### TransactionMonitor (`src/blockchain/utils/TransactionMonitor.ts`)

- `onStatusChange?: (status: TransactionStatus, receipt?: TransactionReceipt) => void` - Callback parameters must be included for consumer implementations
- `getStatusFn: (hash: string) => Promise<TransactionReceipt | null>` - `hash` parameter required for callback function signature

## Mock/Stub Implementations

### Blockchain Service Implementations

All blockchain service implementations contain mock/stub methods with unused parameters that will be used in the full implementation:

#### SolanaBlockchainService (`src/blockchain/implementations/SolanaBlockchainService.ts`)

- `_rpcUrl` - Will be used for Solana connection
- `_id` parameters - Will be used for Solana program account lookups
- `_todo` parameters - Will be used for Solana program instructions

#### PolkadotBlockchainService (`src/blockchain/implementations/PolkadotBlockchainService.ts`)

- `_wsEndpoint` - Will be used for Polkadot API connection
- `_id` parameters - Will be used for pallet storage queries
- `_todo` parameters - Will be used for pallet extrinsics

#### Network-based Services (Polygon, Moonbeam, Base)

- `_provider` parameters - Will be used for wallet connections
- `_todo` parameters - Will be used for smart contract interactions
- `_todoListAddress` variables - Will be used for contract instantiation

## Justification

These unused parameters are legitimate because:

1. **Interface Compliance**: Parameters are required to match interface signatures
2. **Future Implementation**: Parameters are reserved for full implementation of blockchain functionality
3. **Callback Signatures**: Parameters must be included for proper callback function typing
4. **Mock Implementation**: Current implementations are stubs/mocks that will be replaced with full functionality

All ESLint exceptions include detailed comments explaining why the parameter is unused but necessary.
