import {
  type BlockchainNetwork,
  type TransactionStatus,
  type TransactionReceipt,
  type BlockchainTodo,
  type CreateBlockchainTodoInput,
  type UpdateBlockchainTodoInput,
  type WalletInfo,
} from '../types';

/**
 * Interface for blockchain service implementations
 * Provides a unified API for interacting with different blockchain networks
 */
export interface BlockchainService {
  /**
   * Get the network this service is connected to
   */
  getNetwork(): BlockchainNetwork;

  /**
   * Connect to a wallet
   * @param options - Connection options specific to the blockchain
   * @returns Wallet information
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connectWallet(options?: unknown): Promise<WalletInfo>;

  /**
   * Disconnect from the currently connected wallet
   */
  disconnectWallet(): Promise<void>;

  /**
   * Check if a wallet is connected
   */
  isWalletConnected(): Promise<boolean>;

  /**
   * Get information about the connected wallet
   */
  getWalletInfo(): Promise<WalletInfo | null>;

  /**
   * Get the balance of the connected wallet
   * @param tokenAddress - Optional token address for non-native tokens
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWalletBalance(tokenAddress?: string): Promise<string>;

  /**
   * Get all todos for the connected wallet
   */
  getTodos(): Promise<BlockchainTodo[]>;

  /**
   * Get a specific todo by ID
   * @param id - Todo ID or identifier on the blockchain
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTodoById(id: string): Promise<BlockchainTodo | null>;

  /**
   * Create a new todo on the blockchain
   * @param todo - Todo data to create
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createTodo(todo: CreateBlockchainTodoInput): Promise<TransactionReceipt>;

  /**
   * Update an existing todo on the blockchain
   * @param id - Todo ID or identifier
   * @param todo - Updated todo data
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateTodo(id: string, todo: UpdateBlockchainTodoInput): Promise<TransactionReceipt>;

  /**
   * Delete a todo from the blockchain
   * @param id - Todo ID or identifier
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteTodo(id: string): Promise<TransactionReceipt>;

  /**
   * Get the status of a transaction
   * @param txHash - Transaction hash or identifier
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTransactionStatus(txHash: string): Promise<TransactionStatus>;

  /**
   * Get the receipt for a transaction
   * @param txHash - Transaction hash or identifier
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTransactionReceipt(txHash: string): Promise<TransactionReceipt | null>;

  /**
   * Get the explorer URL for a transaction
   * @param txHash - Transaction hash or identifier
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTransactionExplorerUrl(txHash: string): string;

  /**
   * Get the explorer URL for an address
   * @param address - Wallet or contract address
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAddressExplorerUrl(address: string): string;
}
