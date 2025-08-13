import { TransactionStatus, TransactionReceipt, BlockchainNetwork } from '../types';
/**
 * Options for transaction monitoring
 */
export interface TransactionMonitorOptions {
  /** Maximum number of attempts to check transaction status */
  maxAttempts?: number;
  /** Interval between status checks in milliseconds */
  pollingInterval?: number;
  /** Callback for status updates */
  onStatusChange?: (status: TransactionStatus, receipt?: TransactionReceipt) => void;
  /** Timeout in milliseconds */
  timeout?: number;
}
/**
 * Utility class for monitoring blockchain transactions
 */
export declare class TransactionMonitor {
  private options;
  private transactionHashes;
  /**
   * Create a new TransactionMonitor
   * @param options - Monitoring options
   */
  constructor(options?: TransactionMonitorOptions);
  /**
   * Start monitoring a transaction
   * @param txHash - Transaction hash
   * @param network - Blockchain network
   * @param getStatusFn - Function to get transaction status
   * @param options - Transaction-specific options (overrides global options)
   * @returns Promise that resolves with the final transaction receipt
   */
  monitorTransaction(
    txHash: string,
    network: BlockchainNetwork,
    getStatusFn: (hash: string) => Promise<TransactionReceipt | null>,
    options?: TransactionMonitorOptions,
  ): Promise<TransactionReceipt>;
  /**
   * Get the current status of a transaction
   * @param txHash - Transaction hash
   */
  getStatus(txHash: string): TransactionStatus;
  /**
   * Get the receipt for a transaction
   * @param txHash - Transaction hash
   */
  getReceipt(txHash: string): TransactionReceipt | undefined;
  /**
   * Stop monitoring a transaction
   * @param txHash - Transaction hash
   */
  stopMonitoring(txHash: string): void;
  /**
   * Clean up resources for a transaction
   * @param txHash - Transaction hash
   */
  private cleanupTransaction;
}
//# sourceMappingURL=TransactionMonitor.d.ts.map
