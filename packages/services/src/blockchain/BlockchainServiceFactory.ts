import { BlockchainNetwork } from './types';
import { BlockchainService } from './interfaces/BlockchainService';
import { PolygonBlockchainService, PolygonBlockchainServiceOptions } from './implementations/PolygonBlockchainService';
import { BlockchainError } from './utils/BlockchainError';

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
    devnet?: any; // SolanaBlockchainServiceOptions
    /** Mainnet configuration */
    mainnet?: any; // SolanaBlockchainServiceOptions
  };
  /** Polkadot configuration */
  polkadot?: {
    /** Testnet configuration */
    testnet?: any; // PolkadotBlockchainServiceOptions
    /** Mainnet configuration */
    mainnet?: any; // PolkadotBlockchainServiceOptions
  };
}

/**
 * Factory for creating blockchain services
 */
export class BlockchainServiceFactory {
  private config: BlockchainServiceConfig;
  private services: Map<BlockchainNetwork, BlockchainService> = new Map();

  /**
   * Create a new BlockchainServiceFactory
   * @param config - Configuration for blockchain services
   */
  constructor(config: BlockchainServiceConfig) {
    this.config = config;
  }

  /**
   * Get a blockchain service for the specified network
   * @param network - Blockchain network
   * @returns Blockchain service instance
   * @throws Error if the network is not supported or configured
   */
  getService(network: BlockchainNetwork): BlockchainService {
    // Check if service is already created
    const existingService = this.services.get(network);
    if (existingService) {
      return existingService;
    }

    // Create a new service based on the network
    let service: BlockchainService;

    switch (network) {
      case BlockchainNetwork.POLYGON:
        if (!this.config.polygon?.mainnet) {
          throw new Error('Polygon mainnet configuration is missing');
        }
        service = new PolygonBlockchainService(this.config.polygon.mainnet);
        break;

      case BlockchainNetwork.POLYGON_MUMBAI:
        if (!this.config.polygon?.mumbai) {
          throw new Error('Polygon Mumbai configuration is missing');
        }
        service = new PolygonBlockchainService(this.config.polygon.mumbai);
        break;

      case BlockchainNetwork.SOLANA:
      case BlockchainNetwork.SOLANA_DEVNET:
      case BlockchainNetwork.POLKADOT:
      case BlockchainNetwork.POLKADOT_TESTNET:
        // These would be implemented similarly to Polygon
        throw new Error(`Network ${network} is not yet implemented`);

      default:
        throw new Error(`Unsupported blockchain network: ${network}`);
    }

    // Cache the service
    this.services.set(network, service);
    return service;
  }

  /**
   * Get all configured blockchain services
   * @returns Array of blockchain services
   */
  getAllServices(): BlockchainService[] {
    const services: BlockchainService[] = [];

    // Polygon
    if (this.config.polygon?.mainnet) {
      services.push(this.getService(BlockchainNetwork.POLYGON));
    }
    if (this.config.polygon?.mumbai) {
      services.push(this.getService(BlockchainNetwork.POLYGON_MUMBAI));
    }

    // Solana (would be implemented)
    // Polkadot (would be implemented)

    return services;
  }

  /**
   * Get all supported networks that are configured
   * @returns Array of supported blockchain networks
   */
  getSupportedNetworks(): BlockchainNetwork[] {
    const networks: BlockchainNetwork[] = [];

    // Polygon
    if (this.config.polygon?.mainnet) {
      networks.push(BlockchainNetwork.POLYGON);
    }
    if (this.config.polygon?.mumbai) {
      networks.push(BlockchainNetwork.POLYGON_MUMBAI);
    }

    // Solana (would be implemented)
    // Polkadot (would be implemented)

    return networks;
  }
}