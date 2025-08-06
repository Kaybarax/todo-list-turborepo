import { TransactionStatus, TransactionReceipt, BlockchainTodo, CreateBlockchainTodoInput, UpdateBlockchainTodoInput, WalletInfo } from '../types';
import { BaseBlockchainService } from './BaseBlockchainService';
import { TransactionMonitorOptions } from '../utils/TransactionMonitor';
/**
 * Options for Moonbeam blockchain service
 */
export interface MoonbeamBlockchainServiceOptions {
    /** Contract address for the TodoList factory */
    todoListFactoryAddress: string;
    /** RPC URL for the Moonbeam network */
    rpcUrl: string;
    /** Chain ID for the Moonbeam network */
    chainId: number;
    /** Explorer base URL */
    explorerBaseUrl: string;
    /** Transaction monitoring options */
    monitorOptions?: TransactionMonitorOptions;
}
/**
 * Moonbeam blockchain service implementation
 * Moonbeam is a Polkadot parachain with full Ethereum compatibility
 */
export declare class MoonbeamBlockchainService extends BaseBlockchainService {
    private todoListFactoryAddress;
    private rpcUrl;
    private chainId;
    private provider;
    private signer;
    private todoListFactory;
    private todoLists;
    /**
     * Create a new MoonbeamBlockchainService
     * @param options - Service options
     */
    constructor(options: MoonbeamBlockchainServiceOptions);
    /**
     * Connect to a wallet using WalletConnect or other provider
     * @param provider - Ethereum provider (e.g., from WalletConnect)
     */
    connectWallet(_provider: any): Promise<WalletInfo>;
    /**
     * Disconnect from the currently connected wallet
     */
    disconnectWallet(): Promise<void>;
    /**
     * Get the balance of the connected wallet
     * @param tokenAddress - Optional ERC20 token address
     */
    getWalletBalance(tokenAddress?: string): Promise<string>;
    /**
     * Get all todos for the connected wallet
     */
    getTodos(): Promise<BlockchainTodo[]>;
    /**
     * Get a specific todo by ID
     * @param id - Todo ID
     */
    getTodoById(id: string): Promise<BlockchainTodo | null>;
    /**
     * Create a new todo on the blockchain
     * @param todo - Todo data to create
     */
    createTodo(_todo: CreateBlockchainTodoInput): Promise<TransactionReceipt>;
    /**
     * Update an existing todo on the blockchain
     * @param id - Todo ID
     * @param todo - Updated todo data
     */
    updateTodo(id: string, _todo: UpdateBlockchainTodoInput): Promise<TransactionReceipt>;
    /**
     * Delete a todo from the blockchain
     * @param id - Todo ID
     */
    deleteTodo(id: string): Promise<TransactionReceipt>;
    /**
     * Get the status of a transaction
     * @param txHash - Transaction hash
     */
    getTransactionStatus(txHash: string): Promise<TransactionStatus>;
    /**
     * Get the receipt for a transaction
     * @param txHash - Transaction hash
     */
    getTransactionReceipt(txHash: string): Promise<TransactionReceipt | null>;
    /**
     * Initialize contracts
     */
    private initializeContracts;
    /**
     * Check if an error is Moonbeam-specific
     * @param error - Error to check
     */
    private isMoonbeamSpecificError;
}
//# sourceMappingURL=MoonbeamBlockchainService.d.ts.map