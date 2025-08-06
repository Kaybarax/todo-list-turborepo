import { BlockchainNetwork } from './types';
/**
 * Network display information for UI components
 */
export interface NetworkDisplayInfo {
    id: BlockchainNetwork;
    name: string;
    displayName: string;
    icon?: string;
    color: string;
    isTestnet: boolean;
    isEVM: boolean;
    chainId: number;
    description: string;
}
/**
 * Network display configurations for UI components
 */
export declare const NETWORK_DISPLAY_INFO: Record<BlockchainNetwork, NetworkDisplayInfo>;
/**
 * Get network display information
 */
export declare function getNetworkDisplayInfo(network: BlockchainNetwork): NetworkDisplayInfo;
/**
 * Get all mainnet networks
 */
export declare function getMainnetNetworkDisplayInfo(): NetworkDisplayInfo[];
/**
 * Get all testnet networks
 */
export declare function getTestnetNetworkDisplayInfo(): NetworkDisplayInfo[];
/**
 * Get all EVM networks
 */
export declare function getEVMNetworkDisplayInfo(): NetworkDisplayInfo[];
/**
 * Get network color for UI components
 */
export declare function getNetworkColor(network: BlockchainNetwork | string): string;
/**
 * Get supported networks for wallet connection (simplified names)
 */
export declare function getSupportedWalletNetworks(): ('solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base')[];
/**
 * Map wallet network name to BlockchainNetwork enum
 */
export declare function mapWalletNetworkToBlockchainNetwork(walletNetwork: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base'): BlockchainNetwork;
/**
 * Map BlockchainNetwork enum to wallet network name
 */
export declare function mapBlockchainNetworkToWalletNetwork(blockchainNetwork: BlockchainNetwork): 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base' | null;
/**
 * Get wallet connection URLs for different networks
 */
export declare function getWalletConnectionUrls(): Record<string, string>;
/**
 * Generate mock address for testing
 */
export declare function generateMockAddress(network: string): string;
//# sourceMappingURL=networkConfig.d.ts.map