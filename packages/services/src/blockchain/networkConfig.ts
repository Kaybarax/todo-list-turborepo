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
export const NETWORK_DISPLAY_INFO: Record<BlockchainNetwork, NetworkDisplayInfo> = {
  [BlockchainNetwork.SOLANA]: {
    id: BlockchainNetwork.SOLANA,
    name: 'solana',
    displayName: 'Solana',
    color: '#9333ea',
    isTestnet: false,
    isEVM: false,
    chainId: 101,
    description: 'High-performance blockchain with low fees and fast transactions',
  },
  [BlockchainNetwork.SOLANA_DEVNET]: {
    id: BlockchainNetwork.SOLANA_DEVNET,
    name: 'solana_devnet',
    displayName: 'Solana Devnet',
    color: '#a855f7',
    isTestnet: true,
    isEVM: false,
    chainId: 103,
    description: 'Solana development network for testing',
  },
  [BlockchainNetwork.POLKADOT]: {
    id: BlockchainNetwork.POLKADOT,
    name: 'polkadot',
    displayName: 'Polkadot',
    color: '#ec4899',
    isTestnet: false,
    isEVM: false,
    chainId: 0,
    description: 'Interoperable blockchain network with shared security',
  },
  [BlockchainNetwork.POLKADOT_TESTNET]: {
    id: BlockchainNetwork.POLKADOT_TESTNET,
    name: 'polkadot_testnet',
    displayName: 'Westend',
    color: '#f472b6',
    isTestnet: true,
    isEVM: false,
    chainId: 0,
    description: 'Polkadot test network (Westend)',
  },
  [BlockchainNetwork.POLYGON]: {
    id: BlockchainNetwork.POLYGON,
    name: 'polygon',
    displayName: 'Polygon',
    color: '#6366f1',
    isTestnet: false,
    isEVM: true,
    chainId: 137,
    description: 'Ethereum-compatible scaling solution with low fees',
  },
  [BlockchainNetwork.POLYGON_MUMBAI]: {
    id: BlockchainNetwork.POLYGON_MUMBAI,
    name: 'polygon_mumbai',
    displayName: 'Polygon Mumbai',
    color: '#818cf8',
    isTestnet: true,
    isEVM: true,
    chainId: 80001,
    description: 'Polygon test network (Mumbai)',
  },
  [BlockchainNetwork.MOONBEAM]: {
    id: BlockchainNetwork.MOONBEAM,
    name: 'moonbeam',
    displayName: 'Moonbeam',
    color: '#14b8a6',
    isTestnet: false,
    isEVM: true,
    chainId: 1284,
    description: 'Ethereum-compatible smart contract platform on Polkadot',
  },
  [BlockchainNetwork.MOONBEAM_TESTNET]: {
    id: BlockchainNetwork.MOONBEAM_TESTNET,
    name: 'moonbeam_testnet',
    displayName: 'Moonbase Alpha',
    color: '#5eead4',
    isTestnet: true,
    isEVM: true,
    chainId: 1287,
    description: 'Moonbeam test network (Moonbase Alpha)',
  },
  [BlockchainNetwork.BASE]: {
    id: BlockchainNetwork.BASE,
    name: 'base',
    displayName: 'Base',
    color: '#3b82f6',
    isTestnet: false,
    isEVM: true,
    chainId: 8453,
    description: "Coinbase's Layer 2 solution built on Ethereum",
  },
  [BlockchainNetwork.BASE_TESTNET]: {
    id: BlockchainNetwork.BASE_TESTNET,
    name: 'base_testnet',
    displayName: 'Base Sepolia',
    color: '#93c5fd',
    isTestnet: true,
    isEVM: true,
    chainId: 84532,
    description: 'Base test network (Sepolia)',
  },
};

/**
 * Get network display information
 */
export function getNetworkDisplayInfo(network: BlockchainNetwork): NetworkDisplayInfo {
  const info = NETWORK_DISPLAY_INFO[network];
  if (!info) {
    throw new Error(`Network display info not found for ${network}`);
  }
  return info;
}

/**
 * Get all mainnet networks
 */
export function getMainnetNetworkDisplayInfo(): NetworkDisplayInfo[] {
  return Object.values(NETWORK_DISPLAY_INFO).filter(info => !info.isTestnet);
}

/**
 * Get all testnet networks
 */
export function getTestnetNetworkDisplayInfo(): NetworkDisplayInfo[] {
  return Object.values(NETWORK_DISPLAY_INFO).filter(info => info.isTestnet);
}

/**
 * Get all EVM networks
 */
export function getEVMNetworkDisplayInfo(): NetworkDisplayInfo[] {
  return Object.values(NETWORK_DISPLAY_INFO).filter(info => info.isEVM);
}

/**
 * Get network color for UI components
 */
export function getNetworkColor(network: BlockchainNetwork | string): string {
  if (typeof network === 'string') {
    // Handle legacy string network names
    const legacyMapping: Record<string, BlockchainNetwork> = {
      solana: BlockchainNetwork.SOLANA,
      polkadot: BlockchainNetwork.POLKADOT,
      polygon: BlockchainNetwork.POLYGON,
      moonbeam: BlockchainNetwork.MOONBEAM,
      base: BlockchainNetwork.BASE,
    };

    const mappedNetwork = legacyMapping[network];
    if (mappedNetwork && NETWORK_DISPLAY_INFO[mappedNetwork]) {
      return NETWORK_DISPLAY_INFO[mappedNetwork].color;
    }
    return '#6b7280'; // Default gray color
  }

  const info = NETWORK_DISPLAY_INFO[network as BlockchainNetwork];
  return info ? info.color : '#6b7280';
}

/**
 * Get supported networks for wallet connection (simplified names)
 */
export function getSupportedWalletNetworks(): ('solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base')[] {
  return ['solana', 'polkadot', 'polygon', 'moonbeam', 'base'];
}

/**
 * Map wallet network name to BlockchainNetwork enum
 */
export function mapWalletNetworkToBlockchainNetwork(
  walletNetwork: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base',
): BlockchainNetwork {
  const mapping: Record<string, BlockchainNetwork> = {
    solana: BlockchainNetwork.SOLANA,
    polkadot: BlockchainNetwork.POLKADOT,
    polygon: BlockchainNetwork.POLYGON,
    moonbeam: BlockchainNetwork.MOONBEAM,
    base: BlockchainNetwork.BASE,
  };

  return mapping[walletNetwork];
}

/**
 * Map BlockchainNetwork enum to wallet network name
 */
export function mapBlockchainNetworkToWalletNetwork(
  blockchainNetwork: BlockchainNetwork,
): 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base' | null {
  const mapping: Record<BlockchainNetwork, string> = {
    [BlockchainNetwork.SOLANA]: 'solana',
    [BlockchainNetwork.SOLANA_DEVNET]: 'solana',
    [BlockchainNetwork.POLKADOT]: 'polkadot',
    [BlockchainNetwork.POLKADOT_TESTNET]: 'polkadot',
    [BlockchainNetwork.POLYGON]: 'polygon',
    [BlockchainNetwork.POLYGON_MUMBAI]: 'polygon',
    [BlockchainNetwork.MOONBEAM]: 'moonbeam',
    [BlockchainNetwork.MOONBEAM_TESTNET]: 'moonbeam',
    [BlockchainNetwork.BASE]: 'base',
    [BlockchainNetwork.BASE_TESTNET]: 'base',
  };

  return mapping[blockchainNetwork] as 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base' | null;
}

/**
 * Get wallet connection URLs for different networks
 */
export function getWalletConnectionUrls(): Record<string, string> {
  return {
    solana: 'phantom://connect',
    polkadot: 'polkadot://connect',
    polygon: 'metamask://connect',
    moonbeam: 'metamask://connect', // Moonbeam uses MetaMask-compatible wallets
    base: 'metamask://connect', // Base uses MetaMask-compatible wallets
  };
}

/**
 * Generate mock address for testing
 */
export function generateMockAddress(network: string): string {
  const prefixes = {
    solana: '1A1z',
    polkadot: '5G',
    polygon: '0x',
    moonbeam: '0x',
    base: '0x',
  };

  const prefix = prefixes[network as keyof typeof prefixes] || '0x';
  const randomPart = Math.random().toString(16).substr(2, 40);

  return `${prefix}${randomPart}`;
}
