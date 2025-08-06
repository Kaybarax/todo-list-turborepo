import { BlockchainErrorType } from '../types';
/**
 * Custom error class for blockchain operations
 */
export class BlockchainError extends Error {
    type;
    originalError;
    transactionHash;
    network;
    /**
     * Create a new BlockchainError
     * @param type - Error type
     * @param message - Error message
     * @param options - Additional error options
     */
    constructor(type, message, options) {
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
    static walletConnectionFailed(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.WALLET_CONNECTION_FAILED, message, { originalError, network });
    }
    /**
     * Create a wallet not connected error
     * @param message - Error message
     * @param network - Blockchain network
     */
    static walletNotConnected(message = 'Wallet is not connected', network) {
        return new BlockchainError(BlockchainErrorType.WALLET_NOT_CONNECTED, message, { network });
    }
    /**
     * Create a transaction failed error
     * @param message - Error message
     * @param transactionHash - Transaction hash
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static transactionFailed(message, transactionHash, originalError, network) {
        return new BlockchainError(BlockchainErrorType.TRANSACTION_FAILED, message, { originalError, transactionHash, network });
    }
    /**
     * Create a network error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static networkError(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.NETWORK_ERROR, message, { originalError, network });
    }
    /**
     * Create a contract error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static contractError(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.CONTRACT_ERROR, message, { originalError, network });
    }
    /**
     * Create an insufficient funds error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static insufficientFunds(message = 'Insufficient funds for transaction', originalError, network) {
        return new BlockchainError(BlockchainErrorType.INSUFFICIENT_FUNDS, message, { originalError, network });
    }
    /**
     * Create a user rejected error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static userRejected(message = 'User rejected the transaction', originalError, network) {
        return new BlockchainError(BlockchainErrorType.USER_REJECTED, message, { originalError, network });
    }
    /**
     * Create a wallet not found error
     * @param message - Error message
     * @param network - Blockchain network
     * @param originalError - Original error object
     */
    static walletNotFound(message, network, originalError) {
        return new BlockchainError(BlockchainErrorType.WALLET_CONNECTION_FAILED, message, { originalError, network });
    }
    /**
     * Create a connection failed error
     * @param message - Error message
     * @param network - Blockchain network
     * @param options - Additional error options
     */
    static connectionFailed(message, network, options) {
        return new BlockchainError(BlockchainErrorType.WALLET_CONNECTION_FAILED, message, { originalError: options?.originalError, network });
    }
    /**
     * Create an unknown error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static unknownError(message = 'An unknown error occurred', originalError, network) {
        return new BlockchainError(BlockchainErrorType.UNKNOWN_ERROR, message, { originalError, network });
    }
    /**
     * Create a Moonbeam connection failed error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static moonbeamConnectionFailed(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.MOONBEAM_CONNECTION_FAILED, message, { originalError, network });
    }
    /**
     * Create a Moonbeam Substrate error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static moonbeamSubstrateError(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.MOONBEAM_SUBSTRATE_ERROR, message, { originalError, network });
    }
    /**
     * Create a Moonbeam EVM error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static moonbeamEvmError(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.MOONBEAM_EVM_ERROR, message, { originalError, network });
    }
    /**
     * Create a network switch required error
     * @param message - Error message
     * @param network - Blockchain network
     * @param originalError - Original error object
     */
    static networkSwitchRequired(message, network, originalError) {
        return new BlockchainError(BlockchainErrorType.NETWORK_SWITCH_REQUIRED, message, { originalError, network });
    }
    /**
     * Create an unsupported wallet error
     * @param message - Error message
     * @param network - Blockchain network
     * @param originalError - Original error object
     */
    static unsupportedWallet(message, network, originalError) {
        return new BlockchainError(BlockchainErrorType.UNSUPPORTED_WALLET, message, { originalError, network });
    }
    /**
     * Create a Base L2 error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static baseL2Error(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.BASE_L2_ERROR, message, { originalError, network });
    }
    /**
     * Create a Base sequencer error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static baseSequencerError(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.BASE_SEQUENCER_ERROR, message, { originalError, network });
    }
    /**
     * Create a Base bridge error
     * @param message - Error message
     * @param originalError - Original error object
     * @param network - Blockchain network
     */
    static baseBridgeError(message, originalError, network) {
        return new BlockchainError(BlockchainErrorType.BASE_BRIDGE_ERROR, message, { originalError, network });
    }
}
//# sourceMappingURL=BlockchainError.js.map