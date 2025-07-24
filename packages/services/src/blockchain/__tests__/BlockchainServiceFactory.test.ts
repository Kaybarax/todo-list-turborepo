import { BlockchainServiceFactory } from '../BlockchainServiceFactory';
import { BlockchainNetwork } from '../types';
import { PolygonBlockchainService } from '../implementations/PolygonBlockchainService';
import { SolanaBlockchainService } from '../implementations/SolanaBlockchainService';
import { PolkadotBlockchainService } from '../implementations/PolkadotBlockchainService';

describe('BlockchainServiceFactory', () => {
  const mockConfig = {
    polygon: {
      mumbai: {
        todoListFactoryAddress: '0x1234567890123456789012345678901234567890',
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        chainId: 80001,
        explorerBaseUrl: 'https://mumbai.polygonscan.com',
      },
      mainnet: {
        todoListFactoryAddress: '0x0987654321098765432109876543210987654321',
        rpcUrl: 'https://polygon-rpc.com',
        chainId: 137,
        explorerBaseUrl: 'https://polygonscan.com',
      },
    },
    solana: {
      mainnet: {
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        commitment: 'confirmed',
      },
      devnet: {
        rpcUrl: 'https://api.devnet.solana.com',
        commitment: 'confirmed',
      },
    },
    polkadot: {
      mainnet: {
        wsEndpoint: 'wss://rpc.polkadot.io',
        chainName: 'polkadot',
      },
      testnet: {
        wsEndpoint: 'wss://westend-rpc.polkadot.io',
        chainName: 'westend',
      },
    },
  };

  it('should create a factory with the provided configuration', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    expect(factory).toBeDefined();
  });

  it('should return a Polygon service for Mumbai network', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const service = factory.getService(BlockchainNetwork.POLYGON_MUMBAI);
    
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PolygonBlockchainService);
    expect(service.getNetwork()).toBe(BlockchainNetwork.POLYGON_MUMBAI);
  });

  it('should return a Polygon service for Polygon mainnet', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const service = factory.getService(BlockchainNetwork.POLYGON);
    
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PolygonBlockchainService);
    expect(service.getNetwork()).toBe(BlockchainNetwork.POLYGON);
  });

  it('should return a Solana service for Solana mainnet', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const service = factory.getService(BlockchainNetwork.SOLANA);
    
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SolanaBlockchainService);
    expect(service.getNetwork()).toBe(BlockchainNetwork.SOLANA);
  });

  it('should return a Solana service for Solana devnet', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const service = factory.getService(BlockchainNetwork.SOLANA_DEVNET);
    
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SolanaBlockchainService);
    expect(service.getNetwork()).toBe(BlockchainNetwork.SOLANA_DEVNET);
  });

  it('should return a Polkadot service for Polkadot mainnet', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const service = factory.getService(BlockchainNetwork.POLKADOT);
    
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PolkadotBlockchainService);
    expect(service.getNetwork()).toBe(BlockchainNetwork.POLKADOT);
  });

  it('should return a Polkadot service for Polkadot testnet', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const service = factory.getService(BlockchainNetwork.POLKADOT_TESTNET);
    
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PolkadotBlockchainService);
    expect(service.getNetwork()).toBe(BlockchainNetwork.POLKADOT_TESTNET);
  });

  it('should return the same instance for repeated calls', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    
    const service1 = factory.getService(BlockchainNetwork.POLYGON_MUMBAI);
    const service2 = factory.getService(BlockchainNetwork.POLYGON_MUMBAI);
    
    expect(service1).toBe(service2);
  });

  it('should return all supported networks', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const networks = factory.getSupportedNetworks();
    
    expect(networks).toContain(BlockchainNetwork.POLYGON);
    expect(networks).toContain(BlockchainNetwork.POLYGON_MUMBAI);
    expect(networks).toContain(BlockchainNetwork.SOLANA);
    expect(networks).toContain(BlockchainNetwork.SOLANA_DEVNET);
    expect(networks).toContain(BlockchainNetwork.POLKADOT);
    expect(networks).toContain(BlockchainNetwork.POLKADOT_TESTNET);
    expect(networks).toHaveLength(6);
  });

  it('should return all services', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const services = factory.getAllServices();
    
    expect(services).toHaveLength(6);
    
    const networkTypes = services.map(service => service.getNetwork());
    expect(networkTypes).toContain(BlockchainNetwork.POLYGON);
    expect(networkTypes).toContain(BlockchainNetwork.POLYGON_MUMBAI);
    expect(networkTypes).toContain(BlockchainNetwork.SOLANA);
    expect(networkTypes).toContain(BlockchainNetwork.SOLANA_DEVNET);
    expect(networkTypes).toContain(BlockchainNetwork.POLKADOT);
    expect(networkTypes).toContain(BlockchainNetwork.POLKADOT_TESTNET);
  });
});