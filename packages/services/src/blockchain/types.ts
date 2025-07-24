import { z } from 'zod';

/**
 * Supported blockchain networks
 */
export enum BlockchainNetwork {
  POLYGON = 'polygon',
  POLYGON_MUMBAI = 'polygon_mumbai',
  SOLANA = 'solana',
  SOLANA_DEVNET = 'solana_devnet',
  POLKADOT = 'polkadot',
  POLKADOT_TESTNET = 'polkadot_testnet',
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  UNKNOWN = 'unknown',
}

/**
 * Todo status on blockchain
 */
export enum BlockchainTodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

/**
 * Schema for wallet information
 */
export const walletInfoSchema = z.object({
  address: z.string(),
  network: z.nativeEnum(BlockchainNetwork),
  balance: z.string().optional(),
  isConnected: z.boolean().default(true),
  chainId: z.string().or(z.number()).optional(),
  publicKey: z.string().optional(),
});

/**
 * Type for wallet information
 */
export type WalletInfo = z.infer<typeof walletInfoSchema>;

/**
 * Schema for transaction receipt
 */
export const transactionReceiptSchema = z.object({
  transactionHash: z.string(),
  blockNumber: z.number().optional(),
  blockHash: z.string().optional(),
  timestamp: z.date().optional(),
  status: z.nativeEnum(TransactionStatus),
  from: z.string(),
  to: z.string().optional(),
  gasUsed: z.string().or(z.number()).optional(),
  effectiveGasPrice: z.string().or(z.number()).optional(),
  network: z.nativeEnum(BlockchainNetwork),
  fee: z.string().optional(),
});

/**
 * Type for transaction receipt
 */
export type TransactionReceipt = z.infer<typeof transactionReceiptSchema>;

/**
 * Schema for blockchain todo
 */
export const blockchainTodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(BlockchainTodoStatus).default(BlockchainTodoStatus.TODO),
  completed: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  owner: z.string(),
  transactionHash: z.string().optional(),
  network: z.nativeEnum(BlockchainNetwork),
});

/**
 * Type for blockchain todo
 */
export type BlockchainTodo = z.infer<typeof blockchainTodoSchema>;

/**
 * Schema for creating a blockchain todo
 */
export const createBlockchainTodoSchema = blockchainTodoSchema.omit({
  id: true,
  owner: true,
  transactionHash: true,
  network: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Type for creating a blockchain todo
 */
export type CreateBlockchainTodoInput = z.infer<typeof createBlockchainTodoSchema>;

/**
 * Schema for updating a blockchain todo
 */
export const updateBlockchainTodoSchema = createBlockchainTodoSchema.partial();

/**
 * Type for updating a blockchain todo
 */
export type UpdateBlockchainTodoInput = z.infer<typeof updateBlockchainTodoSchema>;

/**
 * Error types for blockchain operations
 */
export enum BlockchainErrorType {
  WALLET_CONNECTION_FAILED = 'wallet_connection_failed',
  WALLET_NOT_CONNECTED = 'wallet_not_connected',
  TRANSACTION_FAILED = 'transaction_failed',
  NETWORK_ERROR = 'network_error',
  CONTRACT_ERROR = 'contract_error',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  USER_REJECTED = 'user_rejected',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Schema for blockchain error
 */
export const blockchainErrorSchema = z.object({
  type: z.nativeEnum(BlockchainErrorType),
  message: z.string(),
  originalError: z.unknown().optional(),
  transactionHash: z.string().optional(),
  network: z.nativeEnum(BlockchainNetwork).optional(),
});

/**
 * Type for blockchain error
 */
export type BlockchainError = z.infer<typeof blockchainErrorSchema>;