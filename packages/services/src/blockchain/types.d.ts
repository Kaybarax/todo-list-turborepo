import { z } from 'zod';
/**
 * Supported blockchain networks
 */
export declare enum BlockchainNetwork {
    POLYGON = "polygon",
    POLYGON_MUMBAI = "polygon_mumbai",
    SOLANA = "solana",
    SOLANA_DEVNET = "solana_devnet",
    POLKADOT = "polkadot",
    POLKADOT_TESTNET = "polkadot_testnet",
    MOONBEAM = "moonbeam",
    MOONBEAM_TESTNET = "moonbeam_testnet",
    BASE = "base",
    BASE_TESTNET = "base_testnet"
}
/**
 * Transaction status
 */
export declare enum TransactionStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    FAILED = "failed",
    UNKNOWN = "unknown"
}
/**
 * Todo status on blockchain
 */
export declare enum BlockchainTodoStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done"
}
/**
 * Schema for wallet information
 */
export declare const walletInfoSchema: z.ZodObject<{
    address: z.ZodString;
    network: z.ZodNativeEnum<typeof BlockchainNetwork>;
    balance: z.ZodOptional<z.ZodString>;
    isConnected: z.ZodDefault<z.ZodBoolean>;
    chainId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    publicKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    address: string;
    network: BlockchainNetwork;
    isConnected: boolean;
    balance?: string | undefined;
    chainId?: string | number | undefined;
    publicKey?: string | undefined;
}, {
    address: string;
    network: BlockchainNetwork;
    balance?: string | undefined;
    isConnected?: boolean | undefined;
    chainId?: string | number | undefined;
    publicKey?: string | undefined;
}>;
/**
 * Type for wallet information
 */
export type WalletInfo = z.infer<typeof walletInfoSchema>;
/**
 * Schema for transaction receipt
 */
export declare const transactionReceiptSchema: z.ZodObject<{
    transactionHash: z.ZodString;
    blockNumber: z.ZodOptional<z.ZodNumber>;
    blockHash: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodDate>;
    status: z.ZodNativeEnum<typeof TransactionStatus>;
    from: z.ZodString;
    to: z.ZodOptional<z.ZodString>;
    gasUsed: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    effectiveGasPrice: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    network: z.ZodNativeEnum<typeof BlockchainNetwork>;
    fee: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: TransactionStatus;
    network: BlockchainNetwork;
    transactionHash: string;
    from: string;
    blockNumber?: number | undefined;
    blockHash?: string | undefined;
    timestamp?: Date | undefined;
    to?: string | undefined;
    gasUsed?: string | number | undefined;
    effectiveGasPrice?: string | number | undefined;
    fee?: string | undefined;
}, {
    status: TransactionStatus;
    network: BlockchainNetwork;
    transactionHash: string;
    from: string;
    blockNumber?: number | undefined;
    blockHash?: string | undefined;
    timestamp?: Date | undefined;
    to?: string | undefined;
    gasUsed?: string | number | undefined;
    effectiveGasPrice?: string | number | undefined;
    fee?: string | undefined;
}>;
/**
 * Type for transaction receipt
 */
export type TransactionReceipt = z.infer<typeof transactionReceiptSchema>;
/**
 * Schema for blockchain todo
 */
export declare const blockchainTodoSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof BlockchainTodoStatus>>;
    completed: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    owner: z.ZodString;
    transactionHash: z.ZodOptional<z.ZodString>;
    network: z.ZodNativeEnum<typeof BlockchainNetwork>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    status: BlockchainTodoStatus;
    network: BlockchainNetwork;
    completed: boolean;
    owner: string;
    description?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    transactionHash?: string | undefined;
}, {
    id: string;
    title: string;
    network: BlockchainNetwork;
    owner: string;
    description?: string | undefined;
    status?: BlockchainTodoStatus | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    transactionHash?: string | undefined;
    completed?: boolean | undefined;
}>;
/**
 * Type for blockchain todo
 */
export type BlockchainTodo = z.infer<typeof blockchainTodoSchema>;
/**
 * Schema for creating a blockchain todo
 */
export declare const createBlockchainTodoSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof BlockchainTodoStatus>>;
    completed: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    owner: z.ZodString;
    transactionHash: z.ZodOptional<z.ZodString>;
    network: z.ZodNativeEnum<typeof BlockchainNetwork>;
}, "id" | "createdAt" | "updatedAt" | "network" | "transactionHash" | "owner">, "strip", z.ZodTypeAny, {
    title: string;
    status: BlockchainTodoStatus;
    completed: boolean;
    description?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
    status?: BlockchainTodoStatus | undefined;
    completed?: boolean | undefined;
}>;
/**
 * Type for creating a blockchain todo
 */
export type CreateBlockchainTodoInput = z.infer<typeof createBlockchainTodoSchema>;
/**
 * Schema for updating a blockchain todo
 */
export declare const updateBlockchainTodoSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof BlockchainTodoStatus>>>;
    completed: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    status?: BlockchainTodoStatus | undefined;
    completed?: boolean | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    status?: BlockchainTodoStatus | undefined;
    completed?: boolean | undefined;
}>;
/**
 * Type for updating a blockchain todo
 */
export type UpdateBlockchainTodoInput = z.infer<typeof updateBlockchainTodoSchema>;
/**
 * Error types for blockchain operations
 */
export declare enum BlockchainErrorType {
    WALLET_CONNECTION_FAILED = "wallet_connection_failed",
    WALLET_NOT_CONNECTED = "wallet_not_connected",
    TRANSACTION_FAILED = "transaction_failed",
    NETWORK_ERROR = "network_error",
    CONTRACT_ERROR = "contract_error",
    INSUFFICIENT_FUNDS = "insufficient_funds",
    USER_REJECTED = "user_rejected",
    UNKNOWN_ERROR = "unknown_error",
    MOONBEAM_CONNECTION_FAILED = "moonbeam_connection_failed",
    MOONBEAM_SUBSTRATE_ERROR = "moonbeam_substrate_error",
    MOONBEAM_EVM_ERROR = "moonbeam_evm_error",
    BASE_L2_ERROR = "base_l2_error",
    BASE_SEQUENCER_ERROR = "base_sequencer_error",
    BASE_BRIDGE_ERROR = "base_bridge_error",
    NETWORK_SWITCH_REQUIRED = "network_switch_required",
    UNSUPPORTED_WALLET = "unsupported_wallet"
}
/**
 * Schema for blockchain error
 */
export declare const blockchainErrorSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof BlockchainErrorType>;
    message: z.ZodString;
    originalError: z.ZodOptional<z.ZodUnknown>;
    transactionHash: z.ZodOptional<z.ZodString>;
    network: z.ZodOptional<z.ZodNativeEnum<typeof BlockchainNetwork>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: BlockchainErrorType;
    network?: BlockchainNetwork | undefined;
    transactionHash?: string | undefined;
    originalError?: unknown;
}, {
    message: string;
    type: BlockchainErrorType;
    network?: BlockchainNetwork | undefined;
    transactionHash?: string | undefined;
    originalError?: unknown;
}>;
/**
 * Type for blockchain error
 */
export type BlockchainError = z.infer<typeof blockchainErrorSchema>;
/**
 * Schema for network configuration
 */
export declare const networkConfigSchema: z.ZodObject<{
    name: z.ZodString;
    chainId: z.ZodNumber;
    rpcUrl: z.ZodString;
    explorerUrl: z.ZodString;
    nativeCurrency: z.ZodObject<{
        name: z.ZodString;
        symbol: z.ZodString;
        decimals: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        name: string;
        decimals: number;
    }, {
        symbol: string;
        name: string;
        decimals: number;
    }>;
    contractAddresses: z.ZodObject<{
        todoListFactory: z.ZodOptional<z.ZodString>;
        todoList: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        todoListFactory?: string | undefined;
        todoList?: string | undefined;
    }, {
        todoListFactory?: string | undefined;
        todoList?: string | undefined;
    }>;
    isTestnet: z.ZodDefault<z.ZodBoolean>;
    isEVM: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    name: string;
    rpcUrl: string;
    explorerUrl: string;
    nativeCurrency: {
        symbol: string;
        name: string;
        decimals: number;
    };
    contractAddresses: {
        todoListFactory?: string | undefined;
        todoList?: string | undefined;
    };
    isTestnet: boolean;
    isEVM: boolean;
}, {
    chainId: number;
    name: string;
    rpcUrl: string;
    explorerUrl: string;
    nativeCurrency: {
        symbol: string;
        name: string;
        decimals: number;
    };
    contractAddresses: {
        todoListFactory?: string | undefined;
        todoList?: string | undefined;
    };
    isTestnet?: boolean | undefined;
    isEVM?: boolean | undefined;
}>;
/**
 * Type for network configuration
 */
export type NetworkConfig = z.infer<typeof networkConfigSchema>;
/**
 * Schema for EVM-compatible network service options
 */
export declare const evmServiceOptionsSchema: z.ZodObject<{
    rpcUrl: z.ZodString;
    chainId: z.ZodNumber;
    contractAddresses: z.ZodObject<{
        todoListFactory: z.ZodString;
        todoList: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        todoListFactory: string;
        todoList?: string | undefined;
    }, {
        todoListFactory: string;
        todoList?: string | undefined;
    }>;
    gasLimit: z.ZodOptional<z.ZodNumber>;
    gasPrice: z.ZodOptional<z.ZodString>;
    maxFeePerGas: z.ZodOptional<z.ZodString>;
    maxPriorityFeePerGas: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    rpcUrl: string;
    contractAddresses: {
        todoListFactory: string;
        todoList?: string | undefined;
    };
    gasLimit?: number | undefined;
    gasPrice?: string | undefined;
    maxFeePerGas?: string | undefined;
    maxPriorityFeePerGas?: string | undefined;
}, {
    chainId: number;
    rpcUrl: string;
    contractAddresses: {
        todoListFactory: string;
        todoList?: string | undefined;
    };
    gasLimit?: number | undefined;
    gasPrice?: string | undefined;
    maxFeePerGas?: string | undefined;
    maxPriorityFeePerGas?: string | undefined;
}>;
/**
 * Type for EVM-compatible network service options
 */
export type EVMServiceOptions = z.infer<typeof evmServiceOptionsSchema>;
/**
 * All network configurations
 */
export declare const NETWORK_CONFIGS: Record<BlockchainNetwork, NetworkConfig>;
/**
 * Helper function to get network configuration
 */
export declare function getNetworkConfig(network: BlockchainNetwork): NetworkConfig;
/**
 * Helper function to check if network is EVM compatible
 */
export declare function isEVMNetwork(network: BlockchainNetwork): boolean;
/**
 * Helper function to check if network is testnet
 */
export declare function isTestnetNetwork(network: BlockchainNetwork): boolean;
/**
 * Helper function to get all EVM networks
 */
export declare function getEVMNetworks(): BlockchainNetwork[];
/**
 * Helper function to get all mainnet networks
 */
export declare function getMainnetNetworks(): BlockchainNetwork[];
/**
 * Helper function to get all testnet networks
 */
export declare function getTestnetNetworks(): BlockchainNetwork[];
//# sourceMappingURL=types.d.ts.map