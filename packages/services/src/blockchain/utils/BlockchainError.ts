import { BlockchainErrorType, BlockchainNetwork } from '../types';

/**
 * Custom error class for blockchain operations
 */
export class BlockchainError extends Error {
  type: BlockchainErrorType;
  originalError?: unknown;
  transactionHash?: string;
  network?: BlockchainNetwork;

  /**
   * Create a new BlockchainError
   * @param type - Error type
   * @param message - Error message
   * @param options - Additional error options
   */
  constructor(
    type: BlockchainErrorType,
    message: string,
    options?: {
      originalError?: unknown;
      transactionHash?: string;
      network?: BlockchainNetwork;
    }
  ) {
    super(message);
    this.name = 'BlockchainError';
    this.type = type;
    this.originalError = options?.originalError;
    this.transactionHash = options?.transactionHash;
    this.network = options?.network;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, BlockchainError.prototype);
  }

  /**
   * Create a wallet connection error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static walletConnectionFailed(
    message: string,
    originalError?: unknown,
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.WALLET_CONNECTION_FAILED,
      message,
      { originalError, network }
    );
  }

  /**
   * Create a wallet not connected error
   * @param message - Error message
   * @param network - Blockchain network
   */
  static walletNotConnected(
    message = 'Wallet is not connected',
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.WALLET_NOT_CONNECTED,
      message,
      { network }
    );
  }

  /**
   * Create a transaction failed error
   * @param message - Error message
   * @param transactionHash - Transaction hash
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static transactionFailed(
    message: string,
    transactionHash?: string,
    originalError?: unknown,
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.TRANSACTION_FAILED,
      message,
      { originalError, transactionHash, network }
    );
  }

  /**
   * Create a network error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static networkError(
    message: string,
    originalError?: unknown,
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.NETWORK_ERROR,
      message,
      { originalError, network }
    );
  }

  /**
   * Create a contract error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static contractError(
    message: string,
    originalError?: unknown,
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.CONTRACT_ERROR,
      message,
      { originalError, network }
    );
  }

  /**
   * Create an insufficient funds error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static insufficientFunds(
    message = 'Insufficient funds for transaction',
    originalError?: unknown,
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.INSUFFICIENT_FUNDS,
      message,
      { originalError, network }
    );
  }

  /**
   * Create a user rejected error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static userRejected(
    message = 'User rejected the transaction',
    originalError?: unknown,
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.USER_REJECTED,
      message,
      { originalError, network }
    );
  }

  /**
   * Create a wallet not found error
   * @param message - Error message
   * @param network - Blockchain network
   * @param originalError - Original error object
   */
  static walletNotFound(
    message: string,
    network?: BlockchainNetwork,
    originalError?: unknown
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.WALLET_CONNECTION_FAILED,
      message,
      { originalError, network }
    );
  }

  /**
   * Create a connection failed error
   * @param message - Error message
   * @param network - Blockchain network
   * @param options - Additional error options
   */
  static connectionFailed(
    message: string,
    network?: BlockchainNetwork,
    options?: { originalError?: unknown }
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.WALLET_CONNECTION_FAILED,
      message,
      { originalError: options?.originalError, network }
    );
  }

  /**
   * Create an unknown error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static unknownError(
    message = 'An unknown error occurred',
    originalError?: unknown,
    network?: BlockchainNetwork
  ): BlockchainError {
    return new BlockchainError(
      BlockchainErrorType.UNKNOWN_ERROR,
      message,
      { originalError, network }
    );
  }
}