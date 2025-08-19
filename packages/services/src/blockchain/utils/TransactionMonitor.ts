import { TransactionStatus, type TransactionReceipt, type BlockchainNetwork, BlockchainErrorType } from '../types';
import { BlockchainError } from './BlockchainError';

/**
 * Options for transaction monitoring
 */
export interface TransactionMonitorOptions {
  /** Maximum number of attempts to check transaction status */
  maxAttempts?: number;
  /** Interval between status checks in milliseconds */
  pollingInterval?: number;
  /** Callback for status updates */
  // eslint-disable-next-line no-unused-vars -- Callback signature must include parameters for consumer implementations
  onStatusChange?: (status: TransactionStatus, receipt?: TransactionReceipt) => void;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Default options for transaction monitoring
 */
const DEFAULT_OPTIONS: Required<TransactionMonitorOptions> = {
  maxAttempts: 30,
  pollingInterval: 5000,
  onStatusChange: () => {},
  timeout: 300000, // 5 minutes
};

/**
 * Utility class for monitoring blockchain transactions
 */
export class TransactionMonitor {
  private options: Required<TransactionMonitorOptions>;
  private transactionHashes: Map<
    string,
    {
      status: TransactionStatus;
      receipt?: TransactionReceipt;
      attempts: number;
      startTime: number;
      timeoutId?: ReturnType<typeof setTimeout>;
    }
  >;

  /**
   * Create a new TransactionMonitor
   * @param options - Monitoring options
   */
  constructor(options?: TransactionMonitorOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.transactionHashes = new Map();
  }

  /**
   * Start monitoring a transaction
   * @param txHash - Transaction hash
   * @param network - Blockchain network
   * @param getStatusFn - Function to get transaction status
   * @param options - Transaction-specific options (overrides global options)
   * @returns Promise that resolves with the final transaction receipt
   */
  async monitorTransaction(
    txHash: string,
    network: BlockchainNetwork,
    // eslint-disable-next-line no-unused-vars -- hash parameter required for callback function signature
    getStatusFn: (hash: string) => Promise<TransactionReceipt | null>,
    options?: TransactionMonitorOptions,
  ): Promise<TransactionReceipt> {
    const txOptions = { ...this.options, ...options };

    // Initialize transaction tracking
    this.transactionHashes.set(txHash, {
      status: TransactionStatus.PENDING,
      attempts: 0,
      startTime: Date.now(),
    });

    // Set up timeout
    const timeoutPromise = new Promise<never>((_resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.transactionHashes.delete(txHash);
        reject(
          new BlockchainError(
            BlockchainErrorType.TRANSACTION_FAILED,
            `Transaction monitoring timed out after ${txOptions.timeout}ms`,
            { transactionHash: txHash, network },
          ),
        );
      }, txOptions.timeout);

      // Store timeout ID to clear it later
      const txData = this.transactionHashes.get(txHash);
      if (txData) {
        this.transactionHashes.set(txHash, {
          ...txData,
          timeoutId,
        });
      }
    });

    // Set up polling
    const pollingPromise = new Promise<TransactionReceipt>((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const txData = this.transactionHashes.get(txHash);
          if (!txData) return;

          // Increment attempts
          const attempts = txData.attempts + 1;
          this.transactionHashes.set(txHash, {
            ...txData,
            attempts,
          });

          // Check if max attempts reached
          if (attempts > txOptions.maxAttempts) {
            this.cleanupTransaction(txHash);
            reject(
              new BlockchainError(
                BlockchainErrorType.TRANSACTION_FAILED,
                `Transaction monitoring exceeded maximum attempts (${txOptions.maxAttempts})`,
                { transactionHash: txHash, network },
              ),
            );
            return;
          }

          // Get transaction status
          const receipt = await getStatusFn(txHash);

          if (receipt) {
            // Update status
            this.transactionHashes.set(txHash, {
              ...txData,
              status: receipt.status,
              receipt,
              attempts,
            });

            // Notify status change
            txOptions.onStatusChange(receipt.status, receipt);

            // Handle final states
            if (receipt.status === TransactionStatus.CONFIRMED) {
              this.cleanupTransaction(txHash);
              resolve(receipt);
              return;
            } else if (receipt.status === TransactionStatus.FAILED) {
              this.cleanupTransaction(txHash);
              reject(
                new BlockchainError(BlockchainErrorType.TRANSACTION_FAILED, 'Transaction failed on the blockchain', {
                  transactionHash: txHash,
                  network,
                }),
              );
              return;
            }
          }

          // Continue polling
          setTimeout(() => void checkStatus(), txOptions.pollingInterval);
        } catch (error) {
          this.cleanupTransaction(txHash);
          reject(
            new BlockchainError(BlockchainErrorType.UNKNOWN_ERROR, 'Error monitoring transaction', {
              originalError: error,
              transactionHash: txHash,
              network,
            }),
          );
        }
      };

      // Start polling
      void checkStatus();
    });

    // Race between polling and timeout
    return Promise.race([pollingPromise, timeoutPromise]);
  }

  /**
   * Get the current status of a transaction
   * @param txHash - Transaction hash
   */
  getStatus(txHash: string): TransactionStatus {
    const txData = this.transactionHashes.get(txHash);
    return txData?.status ?? TransactionStatus.UNKNOWN;
  }

  /**
   * Get the receipt for a transaction
   * @param txHash - Transaction hash
   */
  getReceipt(txHash: string): TransactionReceipt | undefined {
    return this.transactionHashes.get(txHash)?.receipt;
  }

  /**
   * Stop monitoring a transaction
   * @param txHash - Transaction hash
   */
  stopMonitoring(txHash: string): void {
    this.cleanupTransaction(txHash);
  }

  /**
   * Clean up resources for a transaction
   * @param txHash - Transaction hash
   */
  private cleanupTransaction(txHash: string): void {
    const txData = this.transactionHashes.get(txHash);
    if (txData?.timeoutId) {
      clearTimeout(txData.timeoutId);
    }
    this.transactionHashes.delete(txHash);
  }
}
