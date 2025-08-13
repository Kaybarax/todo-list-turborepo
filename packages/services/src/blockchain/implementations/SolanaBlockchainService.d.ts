import {
  TransactionStatus,
  TransactionReceipt,
  BlockchainTodo,
  CreateBlockchainTodoInput,
  UpdateBlockchainTodoInput,
  WalletInfo,
} from '../types';
import { BaseBlockchainService } from './BaseBlockchainService';
/**
 * Solana blockchain service implementation
 */
export declare class SolanaBlockchainService extends BaseBlockchainService {
  private connection;
  private wallet;
  private program;
  constructor();
  /**
   * Connect to a Solana wallet
   * @param options - Solana connection options
   */
  connectWallet(options?: { rpcUrl?: string; walletAdapter?: any }): Promise<WalletInfo>;
  /**
   * Disconnect from Solana wallet
   */
  disconnectWallet(): Promise<void>;
  /**
   * Get SOL balance of the connected wallet
   * @param tokenAddress - Optional SPL token address
   */
  getWalletBalance(tokenAddress?: string): Promise<string>;
  /**
   * Get all todos from Solana program
   */
  getTodos(): Promise<BlockchainTodo[]>;
  /**
   * Get a specific todo by ID from Solana program
   * @param id - Todo account public key
   */
  getTodoById(_id: string): Promise<BlockchainTodo | null>;
  /**
   * Create a new todo on Solana
   * @param todo - Todo data to create
   */
  createTodo(_todo: CreateBlockchainTodoInput): Promise<TransactionReceipt>;
  /**
   * Update an existing todo on Solana
   * @param id - Todo account public key
   * @param todo - Updated todo data
   */
  updateTodo(_id: string, _todo: UpdateBlockchainTodoInput): Promise<TransactionReceipt>;
  /**
   * Delete a todo from Solana
   * @param id - Todo account public key
   */
  deleteTodo(_id: string): Promise<TransactionReceipt>;
  /**
   * Get Solana transaction status
   * @param txHash - Transaction signature
   */
  getTransactionStatus(txHash: string): Promise<TransactionStatus>;
  /**
   * Get Solana transaction receipt
   * @param txHash - Transaction signature
   */
  getTransactionReceipt(txHash: string): Promise<TransactionReceipt | null>;
  /**
   * Get Solana explorer URL for transaction
   * @param txHash - Transaction signature
   */
  getTransactionExplorerUrl(txHash: string): string;
  /**
   * Get Solana explorer URL for address
   * @param address - Public key address
   */
  getAddressExplorerUrl(address: string): string;
}
//# sourceMappingURL=SolanaBlockchainService.d.ts.map
