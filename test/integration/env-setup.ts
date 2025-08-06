/**
 * Environment setup for integration tests
 * Sets up environment variables and configuration before tests run
 */

// Load environment variables from .env.test if it exists
import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
config({ path: resolve(__dirname, '../../.env.test') });

// Override with test-specific values
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Database configuration for tests
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app-test';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379/1';

// API configuration
process.env.API_URL = process.env.API_URL || 'http://localhost:3001';
process.env.WEB_APP_URL = process.env.WEB_APP_URL || 'http://localhost:3000';

// JWT configuration for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Blockchain network configurations
process.env.POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
process.env.POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com';
process.env.MOONBEAM_RPC_URL = process.env.MOONBEAM_RPC_URL || 'https://rpc.api.moonbeam.network';
process.env.MOONBEAM_TESTNET_RPC_URL = process.env.MOONBEAM_TESTNET_RPC_URL || 'https://rpc.api.moonbase.moonbeam.network';
process.env.BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
process.env.BASE_TESTNET_RPC_URL = process.env.BASE_TESTNET_RPC_URL || 'https://sepolia.base.org';
process.env.SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
process.env.SOLANA_DEVNET_RPC_URL = process.env.SOLANA_DEVNET_RPC_URL || 'https://api.devnet.solana.com';
process.env.POLKADOT_RPC_URL = process.env.POLKADOT_RPC_URL || 'wss://rpc.polkadot.io';
process.env.POLKADOT_TESTNET_RPC_URL = process.env.POLKADOT_TESTNET_RPC_URL || 'wss://westend-rpc.polkadot.io';

// Contract addresses (use test/mock addresses)
process.env.POLYGON_TODO_FACTORY_ADDRESS = process.env.POLYGON_TODO_FACTORY_ADDRESS || '0x1234567890123456789012345678901234567890';
process.env.POLYGON_MUMBAI_TODO_FACTORY_ADDRESS = process.env.POLYGON_MUMBAI_TODO_FACTORY_ADDRESS || '0x2345678901234567890123456789012345678901';
process.env.MOONBEAM_TODO_FACTORY_ADDRESS = process.env.MOONBEAM_TODO_FACTORY_ADDRESS || '0x3456789012345678901234567890123456789012';
process.env.MOONBEAM_TESTNET_TODO_FACTORY_ADDRESS = process.env.MOONBEAM_TESTNET_TODO_FACTORY_ADDRESS || '0x4567890123456789012345678901234567890123';
process.env.BASE_TODO_FACTORY_ADDRESS = process.env.BASE_TODO_FACTORY_ADDRESS || '0x5678901234567890123456789012345678901234';
process.env.BASE_TESTNET_TODO_FACTORY_ADDRESS = process.env.BASE_TESTNET_TODO_FACTORY_ADDRESS || '0x6789012345678901234567890123456789012345';

// Solana program IDs
process.env.SOLANA_PROGRAM_ID = process.env.SOLANA_PROGRAM_ID || 'TodoProgram1111111111111111111111111111111';
process.env.SOLANA_DEVNET_PROGRAM_ID = process.env.SOLANA_DEVNET_PROGRAM_ID || 'TodoProgramDev111111111111111111111111111';

// Explorer API keys (use test keys or leave empty)
process.env.POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || 'test-polygonscan-key';
process.env.MOONSCAN_API_KEY = process.env.MOONSCAN_API_KEY || 'test-moonscan-key';
process.env.BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || 'test-basescan-key';

// Wallet configuration
process.env.WALLETCONNECT_PROJECT_ID = process.env.WALLETCONNECT_PROJECT_ID || 'test-walletconnect-project-id';

// Test-specific flags
process.env.ENABLE_BLOCKCHAIN_TESTS = process.env.ENABLE_BLOCKCHAIN_TESTS || 'true';
process.env.ENABLE_E2E_TESTS = process.env.ENABLE_E2E_TESTS || 'true';
process.env.ENABLE_PERFORMANCE_TESTS = process.env.ENABLE_PERFORMANCE_TESTS || 'false';

// Timeout configurations
process.env.TEST_TIMEOUT = process.env.TEST_TIMEOUT || '30000';
process.env.BLOCKCHAIN_OPERATION_TIMEOUT = process.env.BLOCKCHAIN_OPERATION_TIMEOUT || '10000';
process.env.NETWORK_SWITCH_TIMEOUT = process.env.NETWORK_SWITCH_TIMEOUT || '5000';

// Mock configurations
process.env.USE_MOCK_BLOCKCHAIN_SERVICES = process.env.USE_MOCK_BLOCKCHAIN_SERVICES || 'true';
process.env.USE_MOCK_WALLET_PROVIDERS = process.env.USE_MOCK_WALLET_PROVIDERS || 'true';
process.env.MOCK_TRANSACTION_DELAY = process.env.MOCK_TRANSACTION_DELAY || '1000';

// Playwright configuration for web tests
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || '0';
process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD || '1';

// Detox configuration for mobile tests
process.env.DETOX_CONFIGURATION = process.env.DETOX_CONFIGURATION || 'ios.sim.debug';
process.env.DETOX_LOGLEVEL = process.env.DETOX_LOGLEVEL || 'error';

// CI/CD specific configurations
if (process.env.CI) {
  process.env.USE_MOCK_BLOCKCHAIN_SERVICES = 'true';
  process.env.USE_MOCK_WALLET_PROVIDERS = 'true';
  process.env.ENABLE_PERFORMANCE_TESTS = 'false';
  process.env.LOG_LEVEL = 'error';
}

// Development vs production test configurations
if (process.env.NODE_ENV === 'development') {
  process.env.ENABLE_PERFORMANCE_TESTS = 'true';
  process.env.LOG_LEVEL = 'debug';
}

// Export configuration for use in tests
export const testConfig = {
  // Network configurations
  networks: {
    polygon: {
      rpcUrl: process.env.POLYGON_RPC_URL!,
      chainId: 137,
      factoryAddress: process.env.POLYGON_TODO_FACTORY_ADDRESS!,
    },
    polygonMumbai: {
      rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL!,
      chainId: 80001,
      factoryAddress: process.env.POLYGON_MUMBAI_TODO_FACTORY_ADDRESS!,
    },
    moonbeam: {
      rpcUrl: process.env.MOONBEAM_RPC_URL!,
      chainId: 1284,
      factoryAddress: process.env.MOONBEAM_TODO_FACTORY_ADDRESS!,
    },
    moonbeamTestnet: {
      rpcUrl: process.env.MOONBEAM_TESTNET_RPC_URL!,
      chainId: 1287,
      factoryAddress: process.env.MOONBEAM_TESTNET_TODO_FACTORY_ADDRESS!,
    },
    base: {
      rpcUrl: process.env.BASE_RPC_URL!,
      chainId: 8453,
      factoryAddress: process.env.BASE_TODO_FACTORY_ADDRESS!,
    },
    baseTestnet: {
      rpcUrl: process.env.BASE_TESTNET_RPC_URL!,
      chainId: 84532,
      factoryAddress: process.env.BASE_TESTNET_TODO_FACTORY_ADDRESS!,
    },
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL!,
      programId: process.env.SOLANA_PROGRAM_ID!,
    },
    solanaDevnet: {
      rpcUrl: process.env.SOLANA_DEVNET_RPC_URL!,
      programId: process.env.SOLANA_DEVNET_PROGRAM_ID!,
    },
    polkadot: {
      rpcUrl: process.env.POLKADOT_RPC_URL!,
    },
    polkadotTestnet: {
      rpcUrl: process.env.POLKADOT_TESTNET_RPC_URL!,
    },
  },
  
  // Test configuration
  timeouts: {
    default: parseInt(process.env.TEST_TIMEOUT!),
    blockchainOperation: parseInt(process.env.BLOCKCHAIN_OPERATION_TIMEOUT!),
    networkSwitch: parseInt(process.env.NETWORK_SWITCH_TIMEOUT!),
  },
  
  // Mock configuration
  mocks: {
    useBlockchainServices: process.env.USE_MOCK_BLOCKCHAIN_SERVICES === 'true',
    useWalletProviders: process.env.USE_MOCK_WALLET_PROVIDERS === 'true',
    transactionDelay: parseInt(process.env.MOCK_TRANSACTION_DELAY!),
  },
  
  // Feature flags
  features: {
    blockchainTests: process.env.ENABLE_BLOCKCHAIN_TESTS === 'true',
    e2eTests: process.env.ENABLE_E2E_TESTS === 'true',
    performanceTests: process.env.ENABLE_PERFORMANCE_TESTS === 'true',
  },
  
  // Application URLs
  urls: {
    api: process.env.API_URL!,
    web: process.env.WEB_APP_URL!,
  },
  
  // Database configuration
  database: {
    mongodb: process.env.MONGODB_URI!,
    redis: process.env.REDIS_URL!,
  },
  
  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  },
};