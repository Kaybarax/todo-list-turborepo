// Todo service
export * from './todo';

// Blockchain services - explicit exports to avoid conflicts
export {
  // Enums
  BlockchainNetwork,
  TransactionStatus,
  BlockchainTodoStatus,
  BlockchainErrorType,
  
  // Constants and configs
  NETWORK_CONFIGS,
  NETWORK_DISPLAY_INFO,
  
  // Functions
  getNetworkConfig,
  isEVMNetwork,
  isTestnetNetwork,
  getEVMNetworks,
  getMainnetNetworks,
  getTestnetNetworks,
  getNetworkDisplayInfo,
  getMainnetNetworkDisplayInfo,
  getTestnetNetworkDisplayInfo,
  getEVMNetworkDisplayInfo,
  getNetworkColor,
  getSupportedWalletNetworks,
  mapWalletNetworkToBlockchainNetwork,
  mapBlockchainNetworkToWalletNetwork,
  getWalletConnectionUrls,
  generateMockAddress,
  
  // Classes
  BaseBlockchainService,
  PolygonBlockchainService,
  SolanaBlockchainService,
  PolkadotBlockchainService,
  MoonbeamBlockchainService,
  BaseNetworkBlockchainService,
  TransactionMonitor,
  BlockchainServiceFactory,
} from './blockchain';

// Blockchain types
export type {
  WalletInfo,
  TransactionReceipt,
  BlockchainTodo,
  CreateBlockchainTodoInput,
  UpdateBlockchainTodoInput,
  BlockchainError,
  NetworkConfig,
  EVMServiceOptions,
  NetworkDisplayInfo,
  BlockchainService,
  BlockchainServiceConfig,
} from './blockchain';

// API clients
export * from './api';

// Add more services as they are created
