import { jest } from '@jest/globals';

/**
 * Integration test setup
 * Configures the test environment for blockchain integration tests
 */

// Extend Jest timeout for blockchain operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: originalConsole.error, // Keep error logging for debugging
};

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.POLYGON_RPC_URL = 'https://polygon-rpc.com';
process.env.POLYGON_MUMBAI_RPC_URL = 'https://rpc-mumbai.maticvigil.com';
process.env.MOONBEAM_RPC_URL = 'https://rpc.api.moonbeam.network';
process.env.MOONBEAM_TESTNET_RPC_URL = 'https://rpc.api.moonbase.moonbeam.network';
process.env.BASE_RPC_URL = 'https://mainnet.base.org';
process.env.BASE_TESTNET_RPC_URL = 'https://sepolia.base.org';
process.env.SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
process.env.SOLANA_DEVNET_RPC_URL = 'https://api.devnet.solana.com';
process.env.POLKADOT_RPC_URL = 'wss://rpc.polkadot.io';
process.env.POLKADOT_TESTNET_RPC_URL = 'wss://westend-rpc.polkadot.io';

// Mock contract addresses
process.env.POLYGON_TODO_FACTORY_ADDRESS = '0xPolygonFactory123';
process.env.POLYGON_MUMBAI_TODO_FACTORY_ADDRESS = '0xMumbaiFactory123';
process.env.MOONBEAM_TODO_FACTORY_ADDRESS = '0xMoonbeamFactory123';
process.env.MOONBEAM_TESTNET_TODO_FACTORY_ADDRESS = '0xMoonbaseFactory123';
process.env.BASE_TODO_FACTORY_ADDRESS = '0xBaseFactory123';
process.env.BASE_TESTNET_TODO_FACTORY_ADDRESS = '0xBaseSepoliaFactory123';

// Mock global objects that might be used in blockchain services
global.window = global.window || {};
global.document = global.document || {};

// Mock fetch for HTTP requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
) as jest.Mock;

// Mock WebSocket for blockchain connections
global.WebSocket = jest.fn(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1, // OPEN
})) as any;

// Mock crypto for wallet operations
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
    },
  },
});

// Mock localStorage for wallet persistence
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(global, 'sessionStorage', {
  value: localStorageMock,
});

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
  },
});

// Mock URL constructor
global.URL = global.URL || class URL {
  constructor(public href: string, base?: string) {
    if (base) {
      this.href = new URL(href, base).href;
    }
  }
  toString() {
    return this.href;
  }
};

// Mock TextEncoder/TextDecoder for crypto operations
global.TextEncoder = global.TextEncoder || class TextEncoder {
  encode(input: string) {
    return new Uint8Array(Buffer.from(input, 'utf8'));
  }
};

global.TextDecoder = global.TextDecoder || class TextDecoder {
  decode(input: Uint8Array) {
    return Buffer.from(input).toString('utf8');
  }
};

// Setup test utilities
export const testUtils = {
  /**
   * Wait for a specified amount of time
   */
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Generate a mock transaction hash
   */
  generateMockTxHash: () => '0x' + Math.random().toString(16).substr(2, 64),
  
  /**
   * Generate a mock wallet address
   */
  generateMockAddress: () => '0x' + Math.random().toString(16).substr(2, 40),
  
  /**
   * Create a mock blockchain error
   */
  createMockError: (message: string, type?: string) => {
    const error = new Error(message);
    (error as any).type = type || 'MOCK_ERROR';
    return error;
  },
  
  /**
   * Mock a successful transaction receipt
   */
  createMockReceipt: (network: string, txHash?: string) => ({
    transactionHash: txHash || testUtils.generateMockTxHash(),
    blockNumber: Math.floor(Math.random() * 1000000),
    blockHash: '0x' + Math.random().toString(16).substr(2, 64),
    status: 'confirmed' as const,
    from: testUtils.generateMockAddress(),
    to: testUtils.generateMockAddress(),
    gasUsed: Math.floor(Math.random() * 100000).toString(),
    effectiveGasPrice: Math.floor(Math.random() * 1000000000).toString(),
    network: network as any,
    timestamp: new Date(),
    fee: Math.floor(Math.random() * 1000000000000000).toString(),
  }),
};

// Global test cleanup
afterEach(() => {
  jest.clearAllMocks();
  
  // Clear localStorage
  localStorageMock.clear();
  
  // Reset environment variables that might have been modified
  delete process.env.TEST_NETWORK_OVERRIDE;
  delete process.env.TEST_WALLET_ADDRESS;
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

export default testUtils;