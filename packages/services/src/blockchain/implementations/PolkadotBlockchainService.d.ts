import { TransactionStatus, TransactionReceipt, BlockchainTodo, CreateBlockchainTodoInput, UpdateBlockchainTodoInput, WalletInfo } from '../types';
import { BaseBlockchainService } from './BaseBlockchainService';
/**
 * Polkadot blockchain service implementation
 */
export declare class PolkadotBlockchainService extends BaseBlockchainService {
    private api;
    private keyring;
    private signer;
    constructor();
    /**
     * Connect to a Polkadot wallet
     * @param options - Polkadot connection options
     */
    connectWallet(options?: {
        wsEndpoint?: string;
        walletExtension?: any;
        account?: any;
    }): Promise<WalletInfo>;
    /**
     * Disconnect from Polkadot wallet
     */
    disconnectWallet(): Promise<void>;
    /**
     * Get DOT balance of the connected wallet
     * @param tokenAddress - Optional parachain token identifier
     */
    getWalletBalance(tokenAddress?: string): Promise<string>;
    /**
     * Get all todos from Polkadot pallet
     */
    getTodos(): Promise<BlockchainTodo[]>;
    /**
     * Get a specific todo by ID from Polkadot pallet
     * @param id - Todo ID in the pallet storage
     */
    getTodoById(_id: string): Promise<BlockchainTodo | null>;
    /**
     * Create a new todo on Polkadot
     * @param todo - Todo data to create
     */
    createTodo(_todo: CreateBlockchainTodoInput): Promise<TransactionReceipt>;
    /**
     * Update an existing todo on Polkadot
     * @param id - Todo ID in pallet storage
     * @param todo - Updated todo data
     */
    updateTodo(_id: string, _todo: UpdateBlockchainTodoInput): Promise<TransactionReceipt>;
    /**
     * Delete a todo from Polkadot
     * @param id - Todo ID in pallet storage
     */
    deleteTodo(_id: string): Promise<TransactionReceipt>;
    /**
     * Get Polkadot transaction status
     * @param txHash - Transaction hash
     */
    getTransactionStatus(txHash: string): Promise<TransactionStatus>;
    /**
     * Get Polkadot transaction receipt
     * @param txHash - Transaction hash
     */
    getTransactionReceipt(txHash: string): Promise<TransactionReceipt | null>;
    /**
     * Get Polkadot explorer URL for transaction
     * @param txHash - Transaction hash
     */
    getTransactionExplorerUrl(txHash: string): string;
    /**
     * Get Polkadot explorer URL for address
     * @param address - Account address
     */
    getAddressExplorerUrl(address: string): string;
}
//# sourceMappingURL=PolkadotBlockchainService.d.ts.map