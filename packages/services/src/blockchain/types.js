import { z } from 'zod';
/**
 * Supported blockchain networks
 */
export var BlockchainNetwork;
(function (BlockchainNetwork) {
    BlockchainNetwork["POLYGON"] = "polygon";
    BlockchainNetwork["POLYGON_MUMBAI"] = "polygon_mumbai";
    BlockchainNetwork["SOLANA"] = "solana";
    BlockchainNetwork["SOLANA_DEVNET"] = "solana_devnet";
    BlockchainNetwork["POLKADOT"] = "polkadot";
    BlockchainNetwork["POLKADOT_TESTNET"] = "polkadot_testnet";
    BlockchainNetwork["MOONBEAM"] = "moonbeam";
    BlockchainNetwork["MOONBEAM_TESTNET"] = "moonbeam_testnet";
    BlockchainNetwork["BASE"] = "base";
    BlockchainNetwork["BASE_TESTNET"] = "base_testnet";
})(BlockchainNetwork || (BlockchainNetwork = {}));
/**
 * Transaction status
 */
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["CONFIRMED"] = "confirmed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["UNKNOWN"] = "unknown";
})(TransactionStatus || (TransactionStatus = {}));
/**
 * Todo status on blockchain
 */
export var BlockchainTodoStatus;
(function (BlockchainTodoStatus) {
    BlockchainTodoStatus["TODO"] = "todo";
    BlockchainTodoStatus["IN_PROGRESS"] = "in_progress";
    BlockchainTodoStatus["DONE"] = "done";
})(BlockchainTodoStatus || (BlockchainTodoStatus = {}));
/**
 * Schema for wallet information
 */
export const walletInfoSchema = z.object({
    address: z.string(),
    network: z.nativeEnum(BlockchainNetwork),
    balance: z.string().optional(),
    isConnected: z.boolean().default(true),
    chainId: z.string().or(z.number()).optional(),
    publicKey: z.string().optional(),
});
/**
 * Schema for transaction receipt
 */
export const transactionReceiptSchema = z.object({
    transactionHash: z.string(),
    blockNumber: z.number().optional(),
    blockHash: z.string().optional(),
    timestamp: z.date().optional(),
    status: z.nativeEnum(TransactionStatus),
    from: z.string(),
    to: z.string().optional(),
    gasUsed: z.string().or(z.number()).optional(),
    effectiveGasPrice: z.string().or(z.number()).optional(),
    network: z.nativeEnum(BlockchainNetwork),
    fee: z.string().optional(),
});
/**
 * Schema for blockchain todo
 */
export const blockchainTodoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    status: z.nativeEnum(BlockchainTodoStatus).default(BlockchainTodoStatus.TODO),
    completed: z.boolean().default(false),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    owner: z.string(),
    transactionHash: z.string().optional(),
    network: z.nativeEnum(BlockchainNetwork),
});
/**
 * Schema for creating a blockchain todo
 */
export const createBlockchainTodoSchema = blockchainTodoSchema.omit({
    id: true,
    owner: true,
    transactionHash: true,
    network: true,
    createdAt: true,
    updatedAt: true,
});
/**
 * Schema for updating a blockchain todo
 */
export const updateBlockchainTodoSchema = createBlockchainTodoSchema.partial();
/**
 * Error types for blockchain operations
 */
export var BlockchainErrorType;
(function (BlockchainErrorType) {
    BlockchainErrorType["WALLET_CONNECTION_FAILED"] = "wallet_connection_failed";
    BlockchainErrorType["WALLET_NOT_CONNECTED"] = "wallet_not_connected";
    BlockchainErrorType["TRANSACTION_FAILED"] = "transaction_failed";
    BlockchainErrorType["NETWORK_ERROR"] = "network_error";
    BlockchainErrorType["CONTRACT_ERROR"] = "contract_error";
    BlockchainErrorType["INSUFFICIENT_FUNDS"] = "insufficient_funds";
    BlockchainErrorType["USER_REJECTED"] = "user_rejected";
    BlockchainErrorType["UNKNOWN_ERROR"] = "unknown_error";
    // Moonbeam-specific errors
    BlockchainErrorType["MOONBEAM_CONNECTION_FAILED"] = "moonbeam_connection_failed";
    BlockchainErrorType["MOONBEAM_SUBSTRATE_ERROR"] = "moonbeam_substrate_error";
    BlockchainErrorType["MOONBEAM_EVM_ERROR"] = "moonbeam_evm_error";
    // Base-specific errors
    BlockchainErrorType["BASE_L2_ERROR"] = "base_l2_error";
    BlockchainErrorType["BASE_SEQUENCER_ERROR"] = "base_sequencer_error";
    BlockchainErrorType["BASE_BRIDGE_ERROR"] = "base_bridge_error";
    // General network switching errors
    BlockchainErrorType["NETWORK_SWITCH_REQUIRED"] = "network_switch_required";
    BlockchainErrorType["UNSUPPORTED_WALLET"] = "unsupported_wallet";
})(BlockchainErrorType || (BlockchainErrorType = {}));
/**
 * Schema for blockchain error
 */
export const blockchainErrorSchema = z.object({
    type: z.nativeEnum(BlockchainErrorType),
    message: z.string(),
    originalError: z.unknown().optional(),
    transactionHash: z.string().optional(),
    network: z.nativeEnum(BlockchainNetwork).optional(),
});
/**
 * Schema for network configuration
 */
export const networkConfigSchema = z.object({
    name: z.string(),
    chainId: z.number(),
    rpcUrl: z.string().url(),
    explorerUrl: z.string().url(),
    nativeCurrency: z.object({
        name: z.string(),
        symbol: z.string(),
        decimals: z.number(),
    }),
    contractAddresses: z.object({
        todoListFactory: z.string().optional(),
        todoList: z.string().optional(),
    }),
    isTestnet: z.boolean().default(false),
    isEVM: z.boolean().default(false),
});
/**
 * Schema for EVM-compatible network service options
 */
export const evmServiceOptionsSchema = z.object({
    rpcUrl: z.string().url(),
    chainId: z.number(),
    contractAddresses: z.object({
        todoListFactory: z.string(),
        todoList: z.string().optional(),
    }),
    gasLimit: z.number().optional(),
    gasPrice: z.string().optional(),
    maxFeePerGas: z.string().optional(),
    maxPriorityFeePerGas: z.string().optional(),
});
/**
 * All network configurations
 */
export const NETWORK_CONFIGS = {
    // Existing networks (these would need to be defined elsewhere or imported)
    [BlockchainNetwork.POLYGON]: {
        name: 'Polygon',
        chainId: 137,
        rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
        explorerUrl: 'https://polygonscan.com',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        contractAddresses: { todoListFactory: process.env.POLYGON_TODO_FACTORY_ADDRESS || '' },
        isTestnet: false,
        isEVM: true,
    },
    [BlockchainNetwork.POLYGON_MUMBAI]: {
        name: 'Polygon Mumbai',
        chainId: 80001,
        rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
        explorerUrl: 'https://mumbai.polygonscan.com',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        contractAddresses: { todoListFactory: process.env.POLYGON_MUMBAI_TODO_FACTORY_ADDRESS || '' },
        isTestnet: true,
        isEVM: true,
    },
    [BlockchainNetwork.SOLANA]: {
        name: 'Solana',
        chainId: 101, // Solana doesn't use chain IDs like EVM, but we'll use cluster ID
        rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        explorerUrl: 'https://explorer.solana.com',
        nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
        contractAddresses: { todoListFactory: process.env.SOLANA_PROGRAM_ID || '' },
        isTestnet: false,
        isEVM: false,
    },
    [BlockchainNetwork.SOLANA_DEVNET]: {
        name: 'Solana Devnet',
        chainId: 103,
        rpcUrl: process.env.SOLANA_DEVNET_RPC_URL || 'https://api.devnet.solana.com',
        explorerUrl: 'https://explorer.solana.com?cluster=devnet',
        nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
        contractAddresses: { todoListFactory: process.env.SOLANA_DEVNET_PROGRAM_ID || '' },
        isTestnet: true,
        isEVM: false,
    },
    [BlockchainNetwork.POLKADOT]: {
        name: 'Polkadot',
        chainId: 0, // Polkadot doesn't use chain IDs
        rpcUrl: process.env.POLKADOT_RPC_URL || 'wss://rpc.polkadot.io',
        explorerUrl: 'https://polkadot.subscan.io',
        nativeCurrency: { name: 'Polkadot', symbol: 'DOT', decimals: 10 },
        contractAddresses: { todoListFactory: '' }, // Polkadot uses pallets, not contracts
        isTestnet: false,
        isEVM: false,
    },
    [BlockchainNetwork.POLKADOT_TESTNET]: {
        name: 'Westend',
        chainId: 0,
        rpcUrl: process.env.POLKADOT_TESTNET_RPC_URL || 'wss://westend-rpc.polkadot.io',
        explorerUrl: 'https://westend.subscan.io',
        nativeCurrency: { name: 'Westend', symbol: 'WND', decimals: 12 },
        contractAddresses: { todoListFactory: '' },
        isTestnet: true,
        isEVM: false,
    },
    // New networks - Moonbeam
    [BlockchainNetwork.MOONBEAM]: {
        name: 'Moonbeam',
        chainId: 1284,
        rpcUrl: process.env.MOONBEAM_RPC_URL || 'https://rpc.api.moonbeam.network',
        explorerUrl: 'https://moonscan.io',
        nativeCurrency: {
            name: 'Glimmer',
            symbol: 'GLMR',
            decimals: 18,
        },
        contractAddresses: {
            todoListFactory: process.env.MOONBEAM_TODO_FACTORY_ADDRESS || '',
        },
        isTestnet: false,
        isEVM: true,
    },
    [BlockchainNetwork.MOONBEAM_TESTNET]: {
        name: 'Moonbase Alpha',
        chainId: 1287,
        rpcUrl: process.env.MOONBEAM_TESTNET_RPC_URL || 'https://rpc.api.moonbase.moonbeam.network',
        explorerUrl: 'https://moonbase.moonscan.io',
        nativeCurrency: {
            name: 'Dev',
            symbol: 'DEV',
            decimals: 18,
        },
        contractAddresses: {
            todoListFactory: process.env.MOONBEAM_TESTNET_TODO_FACTORY_ADDRESS || '',
        },
        isTestnet: true,
        isEVM: true,
    },
    // New networks - Base
    [BlockchainNetwork.BASE]: {
        name: 'Base',
        chainId: 8453,
        rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
        explorerUrl: 'https://basescan.org',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        contractAddresses: {
            todoListFactory: process.env.BASE_TODO_FACTORY_ADDRESS || '',
        },
        isTestnet: false,
        isEVM: true,
    },
    [BlockchainNetwork.BASE_TESTNET]: {
        name: 'Base Sepolia',
        chainId: 84532,
        rpcUrl: process.env.BASE_TESTNET_RPC_URL || 'https://sepolia.base.org',
        explorerUrl: 'https://sepolia.basescan.org',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        contractAddresses: {
            todoListFactory: process.env.BASE_TESTNET_TODO_FACTORY_ADDRESS || '',
        },
        isTestnet: true,
        isEVM: true,
    },
};
/**
 * Helper function to get network configuration
 */
export function getNetworkConfig(network) {
    const config = NETWORK_CONFIGS[network];
    if (!config) {
        throw new Error(`Network configuration not found for ${network}`);
    }
    return config;
}
/**
 * Helper function to check if network is EVM compatible
 */
export function isEVMNetwork(network) {
    return getNetworkConfig(network).isEVM;
}
/**
 * Helper function to check if network is testnet
 */
export function isTestnetNetwork(network) {
    return getNetworkConfig(network).isTestnet;
}
/**
 * Helper function to get all EVM networks
 */
export function getEVMNetworks() {
    return Object.keys(NETWORK_CONFIGS).filter(network => NETWORK_CONFIGS[network].isEVM);
}
/**
 * Helper function to get all mainnet networks
 */
export function getMainnetNetworks() {
    return Object.keys(NETWORK_CONFIGS).filter(network => !NETWORK_CONFIGS[network].isTestnet);
}
/**
 * Helper function to get all testnet networks
 */
export function getTestnetNetworks() {
    return Object.keys(NETWORK_CONFIGS).filter(network => NETWORK_CONFIGS[network].isTestnet);
}
//# sourceMappingURL=types.js.map