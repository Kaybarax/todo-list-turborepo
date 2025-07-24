import { BlockchainServiceFactory } from '../BlockchainServiceFactory';
import { BlockchainNetwork } from '../types';
import { PolygonBlockchainService } from '../implementations/PolygonBlockchainService';

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

  it('should throw an error for unsupported networks', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    
    expect(() => {
      factory.getService(BlockchainNetwork.SOLANA);
    }).toThrow('Network solana is not yet implemented');
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
    expect(networks).toHaveLength(2);
  });

  it('should return all services', () => {
    const factory = new BlockchainServiceFactory(mockConfig);
    const services = factory.getAllServices();
    
    expect(services).toHaveLength(2);
    expect(services[0].getNetwork()).toBe(BlockchainNetwork.POLYGON);
    expect(services[1].getNetwork()).toBe(BlockchainNetwork.POLYGON_MUMBAI);
  });
});