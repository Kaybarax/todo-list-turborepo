import { BlockchainErrorType, BlockchainNetwork } from '../types';
/**
 * Custom error class for blockchain operations
 */
export declare class BlockchainError extends Error {
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
    },
  );
  /**
   * Create a wallet connection error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static walletConnectionFailed(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a wallet not connected error
   * @param message - Error message
   * @param network - Blockchain network
   */
  static walletNotConnected(message?: string, network?: BlockchainNetwork): BlockchainError;
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
    network?: BlockchainNetwork,
  ): BlockchainError;
  /**
   * Create a network error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static networkError(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a contract error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static contractError(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create an insufficient funds error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static insufficientFunds(message?: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a user rejected error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static userRejected(message?: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a wallet not found error
   * @param message - Error message
   * @param network - Blockchain network
   * @param originalError - Original error object
   */
  static walletNotFound(message: string, network?: BlockchainNetwork, originalError?: unknown): BlockchainError;
  /**
   * Create a connection failed error
   * @param message - Error message
   * @param network - Blockchain network
   * @param options - Additional error options
   */
  static connectionFailed(
    message: string,
    network?: BlockchainNetwork,
    options?: {
      originalError?: unknown;
    },
  ): BlockchainError;
  /**
   * Create an unknown error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static unknownError(message?: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a Moonbeam connection failed error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static moonbeamConnectionFailed(
    message: string,
    originalError?: unknown,
    network?: BlockchainNetwork,
  ): BlockchainError;
  /**
   * Create a Moonbeam Substrate error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static moonbeamSubstrateError(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a Moonbeam EVM error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static moonbeamEvmError(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a network switch required error
   * @param message - Error message
   * @param network - Blockchain network
   * @param originalError - Original error object
   */
  static networkSwitchRequired(message: string, network?: BlockchainNetwork, originalError?: unknown): BlockchainError;
  /**
   * Create an unsupported wallet error
   * @param message - Error message
   * @param network - Blockchain network
   * @param originalError - Original error object
   */
  static unsupportedWallet(message: string, network?: BlockchainNetwork, originalError?: unknown): BlockchainError;
  /**
   * Create a Base L2 error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static baseL2Error(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a Base sequencer error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static baseSequencerError(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
  /**
   * Create a Base bridge error
   * @param message - Error message
   * @param originalError - Original error object
   * @param network - Blockchain network
   */
  static baseBridgeError(message: string, originalError?: unknown, network?: BlockchainNetwork): BlockchainError;
}
//# sourceMappingURL=BlockchainError.d.ts.map
