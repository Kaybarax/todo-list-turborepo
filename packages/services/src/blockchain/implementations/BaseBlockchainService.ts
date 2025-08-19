import { type BlockchainService } from '../interfaces/BlockchainService';
import {
  type BlockchainNetwork,
  type TransactionStatus,
  type TransactionReceipt,
  type BlockchainTodo,
  type CreateBlockchainTodoInput,
  type UpdateBlockchainTodoInput,
  type WalletInfo,
} from '../types';
import { BlockchainError } from '../utils/BlockchainError';
import { TransactionMonitor, type TransactionMonitorOptions } from '../utils/TransactionMonitor';

/**
 * Base abstract class for blockchain service implementations
 * Provides common functionality and enforces the BlockchainService interface
 */
export abstract class BaseBlockchainService implements BlockchainService {
  protected network: BlockchainNetwork;
  protected walletInfo: WalletInfo | null = null;
  protected transactionMonitor: TransactionMonitor;
  protected explorerBaseUrl: string;

  /**
   * Create a new BaseBlockchainService
   * @param network - Blockchain network
   * @param explorerBaseUrl - Base URL for the blockchain explorer
   * @param monitorOptions - Transaction monitoring options
   */
  constructor(network: BlockchainNetwork, explorerBaseUrl: string, monitorOptions?: TransactionMonitorOptions) {
    this.network = network;
    this.explorerBaseUrl = explorerBaseUrl;
    this.transactionMonitor = new TransactionMonitor(monitorOptions);
  }

  /**
   * Get the network this service is connected to
   */
  getNetwork(): BlockchainNetwork {
    return this.network;
  }

  /**
   * Connect to a wallet - must be implemented by subclasses
   * @param options - Connection options specific to the blockchain
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, options used by implementations
  abstract connectWallet(options?: unknown): Promise<WalletInfo>;

  /**
   * Disconnect from the currently connected wallet - must be implemented by subclasses
   */
  abstract disconnectWallet(): Promise<void>;

  /**
   * Check if a wallet is connected
   */
  async isWalletConnected(): Promise<boolean> {
    return this.walletInfo?.isConnected ?? false;
  }

  /**
   * Get information about the connected wallet
   */
  async getWalletInfo(): Promise<WalletInfo | null> {
    return this.walletInfo;
  }

  /**
   * Get the balance of the connected wallet - must be implemented by subclasses
   * @param tokenAddress - Optional token address for non-native tokens
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, tokenAddress used by implementations
  abstract getWalletBalance(tokenAddress?: string): Promise<string>;

  /**
   * Get all todos for the connected wallet - must be implemented by subclasses
   */
  abstract getTodos(): Promise<BlockchainTodo[]>;

  /**
   * Get a specific todo by ID - must be implemented by subclasses
   * @param id - Todo ID or identifier on the blockchain
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, id used by implementations
  abstract getTodoById(id: string): Promise<BlockchainTodo | null>;

  /**
   * Create a new todo on the blockchain - must be implemented by subclasses
   * @param todo - Todo data to create
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, todo used by implementations
  abstract createTodo(todo: CreateBlockchainTodoInput): Promise<TransactionReceipt>;

  /**
   * Update an existing todo on the blockchain - must be implemented by subclasses
   * @param id - Todo ID or identifier
   * @param todo - Updated todo data
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, parameters used by implementations
  abstract updateTodo(id: string, todo: UpdateBlockchainTodoInput): Promise<TransactionReceipt>;

  /**
   * Delete a todo from the blockchain - must be implemented by subclasses
   * @param id - Todo ID or identifier
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, id used by implementations
  abstract deleteTodo(id: string): Promise<TransactionReceipt>;

  /**
   * Get the status of a transaction - must be implemented by subclasses
   * @param txHash - Transaction hash or identifier
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, txHash used by implementations
  abstract getTransactionStatus(txHash: string): Promise<TransactionStatus>;

  /**
   * Get the receipt for a transaction - must be implemented by subclasses
   * @param txHash - Transaction hash or identifier
   */
  // eslint-disable-next-line no-unused-vars -- Abstract method signature must match interface, txHash used by implementations
  abstract getTransactionReceipt(txHash: string): Promise<TransactionReceipt | null>;

  /**
   * Get the explorer URL for a transaction
   * @param txHash - Transaction hash or identifier
   */
  getTransactionExplorerUrl(txHash: string): string {
    return `${this.explorerBaseUrl}/tx/${txHash}`;
  }

  /**
   * Get the explorer URL for an address
   * @param address - Wallet or contract address
   */
  getAddressExplorerUrl(address: string): string {
    return `${this.explorerBaseUrl}/address/${address}`;
  }

  /**
   * Ensure a wallet is connected before performing operations
   * @throws BlockchainError if wallet is not connected
   */
  protected ensureWalletConnected(): void {
    if (!this.walletInfo?.isConnected) {
      throw BlockchainError.walletNotConnected(
        'Wallet is not connected. Please connect a wallet before performing this operation.',
        this.network,
      );
    }
  }

  /**
   * Monitor a transaction until it completes
   * @param txHash - Transaction hash
   * @param options - Transaction monitoring options
   */
  protected monitorTransaction(txHash: string, options?: TransactionMonitorOptions): Promise<TransactionReceipt> {
    return this.transactionMonitor.monitorTransaction(
      txHash,
      this.network,
      hash => this.getTransactionReceipt(hash),
      options,
    );
  }
}
