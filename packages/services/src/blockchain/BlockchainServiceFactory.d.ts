import { BlockchainNetwork } from './types';
import { BlockchainService } from './interfaces/BlockchainService';
import { PolygonBlockchainServiceOptions } from './implementations/PolygonBlockchainService';
import { MoonbeamBlockchainServiceOptions } from './implementations/MoonbeamBlockchainService';
import { BaseNetworkBlockchainServiceOptions } from './implementations/BaseNetworkBlockchainService';
/**
 * Configuration for blockchain services
 */
export interface BlockchainServiceConfig {
  /** Polygon configuration */
  polygon?: {
    /** Mumbai testnet configuration */
    mumbai?: PolygonBlockchainServiceOptions;
    /** Mainnet configuration */
    mainnet?: PolygonBlockchainServiceOptions;
  };
  /** Solana configuration */
  solana?: {
    /** Devnet configuration */
    devnet?: {
      rpcUrl?: string;
      commitment?: string;
    };
    /** Mainnet configuration */
    mainnet?: {
      rpcUrl?: string;
      commitment?: string;
    };
  };
  /** Polkadot configuration */
  polkadot?: {
    /** Testnet configuration */
    testnet?: {
      wsEndpoint?: string;
      chainName?: string;
    };
    /** Mainnet configuration */
    mainnet?: {
      wsEndpoint?: string;
      chainName?: string;
    };
  };
  /** Moonbeam configuration */
  moonbeam?: {
    /** Testnet configuration */
    testnet?: MoonbeamBlockchainServiceOptions;
    /** Mainnet configuration */
    mainnet?: MoonbeamBlockchainServiceOptions;
  };
  /** Base configuration */
  base?: {
    /** Testnet configuration */
    testnet?: BaseNetworkBlockchainServiceOptions;
    /** Mainnet configuration */
    mainnet?: BaseNetworkBlockchainServiceOptions;
  };
}
/**
 * Factory for creating blockchain services
 */
export declare class BlockchainServiceFactory {
  private config;
  private services;
  /**
   * Create a new BlockchainServiceFactory
   * @param config - Configuration for blockchain services
   */
  constructor(config: BlockchainServiceConfig);
  /**
   * Get a blockchain service for the specified network
   * @param network - Blockchain network
   * @returns Blockchain service instance
   * @throws Error if the network is not supported or configured
   */
  getService(network: BlockchainNetwork): BlockchainService;
  /**
   * Get all configured blockchain services
   * @returns Array of blockchain services
   */
  getAllServices(): BlockchainService[];
  /**
   * Get all supported networks that are configured
   * @returns Array of supported blockchain networks
   */
  getSupportedNetworks(): BlockchainNetwork[];
}
//# sourceMappingURL=BlockchainServiceFactory.d.ts.map
