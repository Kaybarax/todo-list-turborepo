import { BlockchainError } from '../utils/BlockchainError';
import { TransactionMonitor } from '../utils/TransactionMonitor';
/**
 * Base abstract class for blockchain service implementations
 * Provides common functionality and enforces the BlockchainService interface
 */
export class BaseBlockchainService {
    network;
    walletInfo = null;
    transactionMonitor;
    explorerBaseUrl;
    /**
     * Create a new BaseBlockchainService
     * @param network - Blockchain network
     * @param explorerBaseUrl - Base URL for the blockchain explorer
     * @param monitorOptions - Transaction monitoring options
     */
    constructor(network, explorerBaseUrl, monitorOptions) {
        this.network = network;
        this.explorerBaseUrl = explorerBaseUrl;
        this.transactionMonitor = new TransactionMonitor(monitorOptions);
    }
    /**
     * Get the network this service is connected to
     */
    getNetwork() {
        return this.network;
    }
    /**
     * Check if a wallet is connected
     */
    async isWalletConnected() {
        return this.walletInfo !== null && this.walletInfo.isConnected;
    }
    /**
     * Get information about the connected wallet
     */
    async getWalletInfo() {
        return this.walletInfo;
    }
    /**
     * Get the explorer URL for a transaction
     * @param txHash - Transaction hash or identifier
     */
    getTransactionExplorerUrl(txHash) {
        return `${this.explorerBaseUrl}/tx/${txHash}`;
    }
    /**
     * Get the explorer URL for an address
     * @param address - Wallet or contract address
     */
    getAddressExplorerUrl(address) {
        return `${this.explorerBaseUrl}/address/${address}`;
    }
    /**
     * Ensure a wallet is connected before performing operations
     * @throws BlockchainError if wallet is not connected
     */
    ensureWalletConnected() {
        if (!this.walletInfo || !this.walletInfo.isConnected) {
            throw BlockchainError.walletNotConnected('Wallet is not connected. Please connect a wallet before performing this operation.', this.network);
        }
    }
    /**
     * Monitor a transaction until it completes
     * @param txHash - Transaction hash
     * @param options - Transaction monitoring options
     */
    monitorTransaction(txHash, options) {
        return this.transactionMonitor.monitorTransaction(txHash, this.network, (hash) => this.getTransactionReceipt(hash), options);
    }
}
//# sourceMappingURL=BaseBlockchainService.js.map