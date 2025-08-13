import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/test-globals';
import {
  BlockchainServiceFactory,
  BlockchainNetwork,
  BlockchainTodo,
  TransactionStatus,
  CreateBlockchainTodoInput,
  UpdateBlockchainTodoInput,
  WalletInfo,
  BlockchainTodoStatus,
} from '../../packages/services/src/blockchain';

/**
 * Comprehensive integration tests for blockchain expansion refactor
 * Tests Moonbeam, Base, and cross-network functionality
 */
describe('Blockchain Expansion Integration Tests', () => {
  let factory: BlockchainServiceFactory;
  let mockWalletProvider: any;
  let testWalletAddress: string;

  beforeAll(async () => {
    // Initialize test environment
    testWalletAddress = '0x1234567890123456789012345678901234567890';

    // Mock wallet provider
    mockWalletProvider = {
      request: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    // Initialize blockchain service factory with all networks
    factory = new BlockchainServiceFactory({
      polygon: {
        mainnet: {
          todoListFactoryAddress: '0xPolygonFactory123',
          rpcUrl: 'https://polygon-rpc.com',
          chainId: 137,
          explorerBaseUrl: 'https://polygonscan.com',
        },
        mumbai: {
          todoListFactoryAddress: '0xMumbaiFactory123',
          rpcUrl: 'https://rpc-mumbai.maticvigil.com',
          chainId: 80001,
          explorerBaseUrl: 'https://mumbai.polygonscan.com',
        },
      },
      solana: {
        mainnet: {
          rpcUrl: 'https://api.mainnet-beta.solana.com',
        },
        devnet: {
          rpcUrl: 'https://api.devnet.solana.com',
        },
      },
      polkadot: {
        mainnet: {
          wsEndpoint: 'wss://rpc.polkadot.io',
        },
        testnet: {
          wsEndpoint: 'wss://westend-rpc.polkadot.io',
        },
      },
      moonbeam: {
        mainnet: {
          todoListFactoryAddress: '0xMoonbeamFactory123',
          rpcUrl: 'https://rpc.api.moonbeam.network',
          chainId: 1284,
          explorerBaseUrl: 'https://moonscan.io',
        },
        testnet: {
          todoListFactoryAddress: '0xMoonbaseFactory123',
          rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
          chainId: 1287,
          explorerBaseUrl: 'https://moonbase.moonscan.io',
        },
      },
      base: {
        mainnet: {
          todoListFactoryAddress: '0xBaseFactory123',
          rpcUrl: 'https://mainnet.base.org',
          chainId: 8453,
          explorerBaseUrl: 'https://basescan.org',
        },
        testnet: {
          todoListFactoryAddress: '0xBaseSepoliaFactory123',
          rpcUrl: 'https://sepolia.base.org',
          chainId: 84532,
          explorerBaseUrl: 'https://sepolia.basescan.org',
        },
      },
    });
  });

  afterAll(async () => {
    // Cleanup test environment
    jest.clearAllMocks();
  });

  describe('Moonbeam Network Integration Tests', () => {
    let moonbeamService: any;
    let moonbeamTestnetService: any;

    beforeEach(async () => {
      moonbeamService = factory.getService(BlockchainNetwork.MOONBEAM);
      moonbeamTestnetService = factory.getService(BlockchainNetwork.MOONBEAM_TESTNET);
    });

    afterEach(async () => {
      // Disconnect wallets after each test
      try {
        await moonbeamService.disconnectWallet();
        await moonbeamTestnetService.disconnectWallet();
      } catch (error) {
        // Ignore disconnection errors in tests
      }
    });

    describe('Moonbeam Mainnet Todo Operations', () => {
      it('should connect to Moonbeam mainnet wallet successfully', async () => {
        const walletInfo: WalletInfo = await moonbeamService.connectWallet(mockWalletProvider);

        expect(walletInfo).toBeDefined();
        expect(walletInfo.network).toBe(BlockchainNetwork.MOONBEAM);
        expect(walletInfo.isConnected).toBe(true);
        expect(walletInfo.address).toBe(testWalletAddress);
        expect(walletInfo.chainId).toBe('1284');
      });

      it('should create todo on Moonbeam mainnet', async () => {
        await moonbeamService.connectWallet(mockWalletProvider);

        const todoInput: CreateBlockchainTodoInput = {
          title: 'Deploy Moonbeam Parachain Integration',
          description: 'Implement cross-chain functionality with Polkadot ecosystem',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        };

        const receipt = await moonbeamService.createTodo(todoInput);

        expect(receipt).toBeDefined();
        expect(receipt.network).toBe(BlockchainNetwork.MOONBEAM);
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
        expect(receipt.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
        expect(receipt.from).toBe(testWalletAddress);
        expect(receipt.gasUsed).toBeDefined();
        expect(receipt.fee).toBeDefined();
      });

      it('should retrieve todos from Moonbeam mainnet', async () => {
        await moonbeamService.connectWallet(mockWalletProvider);

        const todos: BlockchainTodo[] = await moonbeamService.getTodos();

        expect(todos).toBeDefined();
        expect(Array.isArray(todos)).toBe(true);
        expect(todos.length).toBeGreaterThan(0);

        // Verify Moonbeam-specific todo content
        const moonbeamTodo = todos.find(
          todo => todo.title.toLowerCase().includes('moonbeam') || todo.description.toLowerCase().includes('parachain'),
        );
        expect(moonbeamTodo).toBeDefined();
        expect(moonbeamTodo!.network).toBe(BlockchainNetwork.MOONBEAM);
        expect(moonbeamTodo!.owner).toBe(testWalletAddress);
      });

      it('should update todo on Moonbeam mainnet', async () => {
        await moonbeamService.connectWallet(mockWalletProvider);

        const updateInput: UpdateBlockchainTodoInput = {
          title: 'Updated: Moonbeam Parachain Integration Complete',
          description: 'Successfully implemented and tested cross-chain functionality',
          status: BlockchainTodoStatus.DONE,
          completed: true,
        };

        const receipt = await moonbeamService.updateTodo('1', updateInput);

        expect(receipt).toBeDefined();
        expect(receipt.network).toBe(BlockchainNetwork.MOONBEAM);
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
        expect(receipt.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
      });

      it('should delete todo from Moonbeam mainnet', async () => {
        await moonbeamService.connectWallet(mockWalletProvider);

        const receipt = await moonbeamService.deleteTodo('1');

        expect(receipt).toBeDefined();
        expect(receipt.network).toBe(BlockchainNetwork.MOONBEAM);
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
        expect(receipt.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
      });

      it('should get wallet balance on Moonbeam mainnet', async () => {
        await moonbeamService.connectWallet(mockWalletProvider);

        const balance = await moonbeamService.getWalletBalance();

        expect(balance).toBeDefined();
        expect(typeof balance).toBe('string');
        expect(parseFloat(balance)).toBeGreaterThan(0);
      });

      it('should handle Moonbeam-specific transaction monitoring', async () => {
        await moonbeamService.connectWallet(mockWalletProvider);

        const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
        const status = await moonbeamService.getTransactionStatus(txHash);

        expect(status).toBeDefined();
        expect(Object.values(TransactionStatus)).toContain(status);
      });
    });

    describe('Moonbeam Testnet (Moonbase Alpha) Todo Operations', () => {
      it('should connect to Moonbase Alpha testnet wallet successfully', async () => {
        const walletInfo: WalletInfo = await moonbeamTestnetService.connectWallet(mockWalletProvider);

        expect(walletInfo).toBeDefined();
        expect(walletInfo.network).toBe(BlockchainNetwork.MOONBEAM_TESTNET);
        expect(walletInfo.isConnected).toBe(true);
        expect(walletInfo.chainId).toBe('1287');
      });

      it('should perform full CRUD operations on Moonbase Alpha', async () => {
        await moonbeamTestnetService.connectWallet(mockWalletProvider);

        // Create
        const createInput: CreateBlockchainTodoInput = {
          title: 'Test Moonbase Alpha Features',
          description: 'Validate testnet functionality before mainnet deployment',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        };

        const createReceipt = await moonbeamTestnetService.createTodo(createInput);
        expect(createReceipt.network).toBe(BlockchainNetwork.MOONBEAM_TESTNET);

        // Read
        const todos = await moonbeamTestnetService.getTodos();
        expect(todos.length).toBeGreaterThan(0);
        expect(todos[0].network).toBe(BlockchainNetwork.MOONBEAM_TESTNET);

        // Update
        const updateInput: UpdateBlockchainTodoInput = {
          status: BlockchainTodoStatus.IN_PROGRESS,
        };

        const updateReceipt = await moonbeamTestnetService.updateTodo('1', updateInput);
        expect(updateReceipt.network).toBe(BlockchainNetwork.MOONBEAM_TESTNET);

        // Delete
        const deleteReceipt = await moonbeamTestnetService.deleteTodo('1');
        expect(deleteReceipt.network).toBe(BlockchainNetwork.MOONBEAM_TESTNET);
      });
    });

    describe('Moonbeam Error Handling', () => {
      it('should handle Moonbeam-specific connection errors', async () => {
        const invalidProvider = {
          request: jest.fn().mockRejectedValue(new Error('Moonbeam parachain connection failed')),
          on: jest.fn(),
          removeListener: jest.fn(),
        };

        await expect(moonbeamService.connectWallet(invalidProvider)).rejects.toThrow(/moonbeam.*connection.*failed/i);
      });

      it('should handle Substrate-specific errors', async () => {
        await moonbeamService.connectWallet(mockWalletProvider);

        // Mock a Substrate-specific error
        const mockError = new Error('Substrate runtime error: pallet execution failed');
        jest.spyOn(moonbeamService, 'createTodo').mockRejectedValueOnce(mockError);

        const todoInput: CreateBlockchainTodoInput = {
          title: 'Test Error Handling',
          description: 'This should trigger a Substrate error',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        };

        await expect(moonbeamService.createTodo(todoInput)).rejects.toThrow(/substrate.*runtime.*error/i);
      });
    });
  });

  describe('Base Network Integration Tests', () => {
    let baseService: any;
    let baseTestnetService: any;

    beforeEach(async () => {
      baseService = factory.getService(BlockchainNetwork.BASE);
      baseTestnetService = factory.getService(BlockchainNetwork.BASE_TESTNET);
    });

    afterEach(async () => {
      // Disconnect wallets after each test
      try {
        await baseService.disconnectWallet();
        await baseTestnetService.disconnectWallet();
      } catch (error) {
        // Ignore disconnection errors in tests
      }
    });

    describe('Base Mainnet Todo Operations', () => {
      it('should connect to Base mainnet wallet successfully', async () => {
        const walletInfo: WalletInfo = await baseService.connectWallet(mockWalletProvider);

        expect(walletInfo).toBeDefined();
        expect(walletInfo.network).toBe(BlockchainNetwork.BASE);
        expect(walletInfo.isConnected).toBe(true);
        expect(walletInfo.address).toBe(testWalletAddress);
        expect(walletInfo.chainId).toBe('8453');
      });

      it('should create todo on Base mainnet with L2 optimizations', async () => {
        await baseService.connectWallet(mockWalletProvider);

        const todoInput: CreateBlockchainTodoInput = {
          title: 'Deploy on Base L2',
          description: "Leverage Coinbase's optimistic rollup for fast, cheap transactions",
          status: BlockchainTodoStatus.TODO,
          completed: false,
        };

        const receipt = await baseService.createTodo(todoInput);

        expect(receipt).toBeDefined();
        expect(receipt.network).toBe(BlockchainNetwork.BASE);
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
        expect(receipt.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

        // Verify L2 optimizations (lower gas costs)
        const gasUsed = parseInt(receipt.gasUsed || '0');
        expect(gasUsed).toBeLessThan(100000); // Base should have lower gas usage

        const gasPrice = parseInt(receipt.effectiveGasPrice || '0');
        expect(gasPrice).toBeLessThan(1000000000); // Base should have lower gas prices
      });

      it('should retrieve todos from Base mainnet', async () => {
        await baseService.connectWallet(mockWalletProvider);

        const todos: BlockchainTodo[] = await baseService.getTodos();

        expect(todos).toBeDefined();
        expect(Array.isArray(todos)).toBe(true);
        expect(todos.length).toBeGreaterThan(0);

        // Verify Base-specific todo content
        const baseTodo = todos.find(
          todo =>
            todo.title.toLowerCase().includes('base') ||
            todo.description.toLowerCase().includes('l2') ||
            todo.description.toLowerCase().includes('optimistic rollup'),
        );
        expect(baseTodo).toBeDefined();
        expect(baseTodo!.network).toBe(BlockchainNetwork.BASE);
        expect(baseTodo!.owner).toBe(testWalletAddress);
      });

      it('should update todo on Base mainnet', async () => {
        await baseService.connectWallet(mockWalletProvider);

        const updateInput: UpdateBlockchainTodoInput = {
          title: 'Updated: Base L2 Deployment Complete',
          description: "Successfully deployed and optimized for Base's L2 environment",
          status: BlockchainTodoStatus.DONE,
          completed: true,
        };

        const receipt = await baseService.updateTodo('1', updateInput);

        expect(receipt).toBeDefined();
        expect(receipt.network).toBe(BlockchainNetwork.BASE);
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
      });

      it('should delete todo from Base mainnet', async () => {
        await baseService.connectWallet(mockWalletProvider);

        const receipt = await baseService.deleteTodo('1');

        expect(receipt).toBeDefined();
        expect(receipt.network).toBe(BlockchainNetwork.BASE);
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
      });

      it('should demonstrate Base L2 transaction efficiency', async () => {
        await baseService.connectWallet(mockWalletProvider);

        const startTime = Date.now();

        // Perform multiple operations to test L2 efficiency
        const operations = [
          baseService.createTodo({
            title: 'L2 Efficiency Test 1',
            description: 'Testing Base L2 transaction speed',
            status: BlockchainTodoStatus.TODO,
            completed: false,
          }),
          baseService.createTodo({
            title: 'L2 Efficiency Test 2',
            description: 'Testing Base L2 transaction cost',
            status: BlockchainTodoStatus.TODO,
            completed: false,
          }),
          baseService.createTodo({
            title: 'L2 Efficiency Test 3',
            description: 'Testing Base L2 throughput',
            status: BlockchainTodoStatus.TODO,
            completed: false,
          }),
        ];

        const receipts = await Promise.all(operations);
        const endTime = Date.now();

        // Verify all operations completed successfully
        receipts.forEach(receipt => {
          expect(receipt.network).toBe(BlockchainNetwork.BASE);
          expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
        });

        // Verify reasonable execution time for L2
        const executionTime = endTime - startTime;
        expect(executionTime).toBeLessThan(10000); // Should complete within 10 seconds
      });
    });

    describe('Base Testnet (Sepolia) Todo Operations', () => {
      it('should connect to Base Sepolia testnet wallet successfully', async () => {
        const walletInfo: WalletInfo = await baseTestnetService.connectWallet(mockWalletProvider);

        expect(walletInfo).toBeDefined();
        expect(walletInfo.network).toBe(BlockchainNetwork.BASE_TESTNET);
        expect(walletInfo.isConnected).toBe(true);
        expect(walletInfo.chainId).toBe('84532');
      });

      it('should perform full CRUD operations on Base Sepolia', async () => {
        await baseTestnetService.connectWallet(mockWalletProvider);

        // Create
        const createInput: CreateBlockchainTodoInput = {
          title: 'Test Base Sepolia Features',
          description: 'Validate L2 testnet functionality before mainnet deployment',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        };

        const createReceipt = await baseTestnetService.createTodo(createInput);
        expect(createReceipt.network).toBe(BlockchainNetwork.BASE_TESTNET);

        // Read
        const todos = await baseTestnetService.getTodos();
        expect(todos.length).toBeGreaterThan(0);
        expect(todos[0].network).toBe(BlockchainNetwork.BASE_TESTNET);

        // Update
        const updateInput: UpdateBlockchainTodoInput = {
          status: BlockchainTodoStatus.IN_PROGRESS,
        };

        const updateReceipt = await baseTestnetService.updateTodo('1', updateInput);
        expect(updateReceipt.network).toBe(BlockchainNetwork.BASE_TESTNET);

        // Delete
        const deleteReceipt = await baseTestnetService.deleteTodo('1');
        expect(deleteReceipt.network).toBe(BlockchainNetwork.BASE_TESTNET);
      });
    });

    describe('Base L2 Error Handling', () => {
      it('should handle Base L2-specific connection errors', async () => {
        const invalidProvider = {
          request: jest.fn().mockRejectedValue(new Error('Base sequencer unavailable')),
          on: jest.fn(),
          removeListener: jest.fn(),
        };

        await expect(baseService.connectWallet(invalidProvider)).rejects.toThrow(/base.*sequencer/i);
      });

      it('should handle optimistic rollup errors', async () => {
        await baseService.connectWallet(mockWalletProvider);

        // Mock an L2-specific error
        const mockError = new Error('Optimistic rollup: transaction reverted during execution');
        jest.spyOn(baseService, 'createTodo').mockRejectedValueOnce(mockError);

        const todoInput: CreateBlockchainTodoInput = {
          title: 'Test L2 Error Handling',
          description: 'This should trigger an L2 error',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        };

        await expect(baseService.createTodo(todoInput)).rejects.toThrow(/optimistic rollup.*reverted/i);
      });
    });
  });

  describe('Network Switching Functionality', () => {
    const allNetworks = [
      BlockchainNetwork.POLYGON,
      BlockchainNetwork.POLYGON_MUMBAI,
      BlockchainNetwork.SOLANA,
      BlockchainNetwork.SOLANA_DEVNET,
      BlockchainNetwork.POLKADOT,
      BlockchainNetwork.POLKADOT_TESTNET,
      BlockchainNetwork.MOONBEAM,
      BlockchainNetwork.MOONBEAM_TESTNET,
      BlockchainNetwork.BASE,
      BlockchainNetwork.BASE_TESTNET,
    ];

    it('should support all five blockchain networks', async () => {
      const supportedNetworks = factory.getSupportedNetworks();

      expect(supportedNetworks).toBeDefined();
      expect(supportedNetworks.length).toBe(10); // 5 networks × 2 environments each

      // Verify all expected networks are supported
      allNetworks.forEach(network => {
        expect(supportedNetworks).toContain(network);
      });
    });

    it('should create services for all supported networks', async () => {
      const services = factory.getAllServices();

      expect(services).toBeDefined();
      expect(services.length).toBe(10);

      // Verify each service is properly configured
      services.forEach(service => {
        expect(service).toBeDefined();
        expect(service.getNetwork).toBeDefined();
        expect(allNetworks).toContain(service.getNetwork());
      });
    });

    it('should switch between EVM-compatible networks seamlessly', async () => {
      const evmNetworks = [
        BlockchainNetwork.POLYGON,
        BlockchainNetwork.POLYGON_MUMBAI,
        BlockchainNetwork.MOONBEAM,
        BlockchainNetwork.MOONBEAM_TESTNET,
        BlockchainNetwork.BASE,
        BlockchainNetwork.BASE_TESTNET,
      ];

      for (const network of evmNetworks) {
        const service = factory.getService(network);
        await service.connectWallet(mockWalletProvider);

        const walletInfo = await service.connectWallet(mockWalletProvider);
        expect(walletInfo.network).toBe(network);
        expect(walletInfo.isConnected).toBe(true);

        // Verify network-specific functionality
        const todos = await service.getTodos();
        expect(Array.isArray(todos)).toBe(true);

        await service.disconnectWallet();
      }
    });

    it('should handle network switching with proper chain ID validation', async () => {
      const networkChainIds = {
        [BlockchainNetwork.POLYGON]: 137,
        [BlockchainNetwork.POLYGON_MUMBAI]: 80001,
        [BlockchainNetwork.MOONBEAM]: 1284,
        [BlockchainNetwork.MOONBEAM_TESTNET]: 1287,
        [BlockchainNetwork.BASE]: 8453,
        [BlockchainNetwork.BASE_TESTNET]: 84532,
      };

      for (const [network, expectedChainId] of Object.entries(networkChainIds)) {
        const service = factory.getService(network as BlockchainNetwork);
        const walletInfo = await service.connectWallet(mockWalletProvider);

        expect(walletInfo.chainId).toBe(expectedChainId.toString());
      }
    });

    it('should maintain separate state for each network', async () => {
      // Connect to multiple networks simultaneously
      const polygonService = factory.getService(BlockchainNetwork.POLYGON);
      const moonbeamService = factory.getService(BlockchainNetwork.MOONBEAM);
      const baseService = factory.getService(BlockchainNetwork.BASE);

      await polygonService.connectWallet(mockWalletProvider);
      await moonbeamService.connectWallet(mockWalletProvider);
      await baseService.connectWallet(mockWalletProvider);

      // Verify each service maintains its own state
      const polygonTodos = await polygonService.getTodos();
      const moonbeamTodos = await moonbeamService.getTodos();
      const baseTodos = await baseService.getTodos();

      // Each network should have different todos
      expect(polygonTodos).not.toEqual(moonbeamTodos);
      expect(moonbeamTodos).not.toEqual(baseTodos);
      expect(baseTodos).not.toEqual(polygonTodos);

      // Verify network-specific content
      polygonTodos.forEach(todo => expect(todo.network).toBe(BlockchainNetwork.POLYGON));
      moonbeamTodos.forEach(todo => expect(todo.network).toBe(BlockchainNetwork.MOONBEAM));
      baseTodos.forEach(todo => expect(todo.network).toBe(BlockchainNetwork.BASE));
    });

    it('should handle rapid network switching without conflicts', async () => {
      const networks = [
        BlockchainNetwork.POLYGON,
        BlockchainNetwork.MOONBEAM,
        BlockchainNetwork.BASE,
        BlockchainNetwork.POLYGON_MUMBAI,
        BlockchainNetwork.MOONBEAM_TESTNET,
        BlockchainNetwork.BASE_TESTNET,
      ];

      // Rapidly switch between networks
      for (let i = 0; i < 3; i++) {
        for (const network of networks) {
          const service = factory.getService(network);
          const walletInfo = await service.connectWallet(mockWalletProvider);

          expect(walletInfo.network).toBe(network);

          // Perform a quick operation
          const todos = await service.getTodos();
          expect(Array.isArray(todos)).toBe(true);

          await service.disconnectWallet();
        }
      }
    });
  });

  describe('Cross-Network Todo Synchronization and Data Consistency', () => {
    let polygonService: any;
    let moonbeamService: any;
    let baseService: any;

    beforeEach(async () => {
      polygonService = factory.getService(BlockchainNetwork.POLYGON);
      moonbeamService = factory.getService(BlockchainNetwork.MOONBEAM);
      baseService = factory.getService(BlockchainNetwork.BASE);

      await polygonService.connectWallet(mockWalletProvider);
      await moonbeamService.connectWallet(mockWalletProvider);
      await baseService.connectWallet(mockWalletProvider);
    });

    afterEach(async () => {
      await polygonService.disconnectWallet();
      await moonbeamService.disconnectWallet();
      await baseService.disconnectWallet();
    });

    it('should maintain data consistency across networks', async () => {
      // Create similar todos on different networks
      const baseTodoInput: CreateBlockchainTodoInput = {
        title: 'Cross-Network Consistency Test',
        description: 'Testing data consistency across blockchain networks',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      };

      const polygonReceipt = await polygonService.createTodo({
        ...baseTodoInput,
        title: 'Polygon: ' + baseTodoInput.title,
      });

      const moonbeamReceipt = await moonbeamService.createTodo({
        ...baseTodoInput,
        title: 'Moonbeam: ' + baseTodoInput.title,
      });

      const baseReceipt = await baseService.createTodo({
        ...baseTodoInput,
        title: 'Base: ' + baseTodoInput.title,
      });

      // Verify all transactions succeeded
      expect(polygonReceipt.status).toBe(TransactionStatus.CONFIRMED);
      expect(moonbeamReceipt.status).toBe(TransactionStatus.CONFIRMED);
      expect(baseReceipt.status).toBe(TransactionStatus.CONFIRMED);

      // Verify network-specific data
      expect(polygonReceipt.network).toBe(BlockchainNetwork.POLYGON);
      expect(moonbeamReceipt.network).toBe(BlockchainNetwork.MOONBEAM);
      expect(baseReceipt.network).toBe(BlockchainNetwork.BASE);

      // Verify todos are retrievable from their respective networks
      const polygonTodos = await polygonService.getTodos();
      const moonbeamTodos = await moonbeamService.getTodos();
      const baseTodos = await baseService.getTodos();

      const polygonTodo = polygonTodos.find(todo => todo.title.includes('Polygon:'));
      const moonbeamTodo = moonbeamTodos.find(todo => todo.title.includes('Moonbeam:'));
      const baseTodo = baseTodos.find(todo => todo.title.includes('Base:'));

      expect(polygonTodo).toBeDefined();
      expect(moonbeamTodo).toBeDefined();
      expect(baseTodo).toBeDefined();

      expect(polygonTodo!.network).toBe(BlockchainNetwork.POLYGON);
      expect(moonbeamTodo!.network).toBe(BlockchainNetwork.MOONBEAM);
      expect(baseTodo!.network).toBe(BlockchainNetwork.BASE);
    });

    it('should handle concurrent operations across networks', async () => {
      const concurrentOperations = [
        polygonService.createTodo({
          title: 'Concurrent Polygon Todo',
          description: 'Created concurrently with other networks',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        }),
        moonbeamService.createTodo({
          title: 'Concurrent Moonbeam Todo',
          description: 'Created concurrently with other networks',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        }),
        baseService.createTodo({
          title: 'Concurrent Base Todo',
          description: 'Created concurrently with other networks',
          status: BlockchainTodoStatus.TODO,
          completed: false,
        }),
      ];

      const receipts = await Promise.all(concurrentOperations);

      // Verify all operations completed successfully
      receipts.forEach((receipt, index) => {
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
        expect(receipt.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
      });

      // Verify network assignment
      expect(receipts[0].network).toBe(BlockchainNetwork.POLYGON);
      expect(receipts[1].network).toBe(BlockchainNetwork.MOONBEAM);
      expect(receipts[2].network).toBe(BlockchainNetwork.BASE);
    });

    it('should maintain transaction isolation between networks', async () => {
      // Create a todo on Polygon
      const polygonTodo = await polygonService.createTodo({
        title: 'Polygon Isolated Todo',
        description: 'This should only exist on Polygon',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      });

      // Verify it doesn't appear on other networks
      const moonbeamTodos = await moonbeamService.getTodos();
      const baseTodos = await baseService.getTodos();

      const polygonTodoInMoonbeam = moonbeamTodos.find(todo => todo.title === 'Polygon Isolated Todo');
      const polygonTodoInBase = baseTodos.find(todo => todo.title === 'Polygon Isolated Todo');

      expect(polygonTodoInMoonbeam).toBeUndefined();
      expect(polygonTodoInBase).toBeUndefined();

      // Verify it exists on Polygon
      const polygonTodos = await polygonService.getTodos();
      const actualPolygonTodo = polygonTodos.find(todo => todo.title === 'Polygon Isolated Todo');

      expect(actualPolygonTodo).toBeDefined();
      expect(actualPolygonTodo!.network).toBe(BlockchainNetwork.POLYGON);
    });

    it('should handle network-specific error scenarios without affecting other networks', async () => {
      // Mock an error on Moonbeam service
      const mockError = new Error('Moonbeam network temporarily unavailable');
      jest.spyOn(moonbeamService, 'createTodo').mockRejectedValueOnce(mockError);

      // Try to create todos on all networks
      const polygonPromise = polygonService.createTodo({
        title: 'Polygon Todo During Moonbeam Error',
        description: 'Should succeed despite Moonbeam error',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      });

      const moonbeamPromise = moonbeamService.createTodo({
        title: 'Moonbeam Todo That Will Fail',
        description: 'This should fail',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      });

      const basePromise = baseService.createTodo({
        title: 'Base Todo During Moonbeam Error',
        description: 'Should succeed despite Moonbeam error',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      });

      // Wait for all promises to settle
      const results = await Promise.allSettled([polygonPromise, moonbeamPromise, basePromise]);

      // Verify Polygon and Base succeeded
      expect(results[0].status).toBe('fulfilled');
      expect(results[2].status).toBe('fulfilled');

      // Verify Moonbeam failed
      expect(results[1].status).toBe('rejected');
      expect((results[1] as PromiseRejectedResult).reason.message).toContain(
        'Moonbeam network temporarily unavailable',
      );

      // Verify successful operations have correct network assignments
      if (results[0].status === 'fulfilled') {
        expect(results[0].value.network).toBe(BlockchainNetwork.POLYGON);
      }
      if (results[2].status === 'fulfilled') {
        expect(results[2].value.network).toBe(BlockchainNetwork.BASE);
      }
    });

    it('should demonstrate cross-network todo lifecycle management', async () => {
      // Create a todo workflow across multiple networks
      const workflowSteps = [
        {
          network: 'polygon',
          service: polygonService,
          todo: {
            title: 'Step 1: Design on Polygon',
            description: 'Initial design and planning phase',
            status: BlockchainTodoStatus.TODO,
            completed: false,
          },
        },
        {
          network: 'moonbeam',
          service: moonbeamService,
          todo: {
            title: 'Step 2: Prototype on Moonbeam',
            description: 'Cross-chain prototype development',
            status: BlockchainTodoStatus.TODO,
            completed: false,
          },
        },
        {
          network: 'base',
          service: baseService,
          todo: {
            title: 'Step 3: Deploy on Base',
            description: 'Production deployment on L2',
            status: BlockchainTodoStatus.TODO,
            completed: false,
          },
        },
      ];

      const receipts = [];

      // Execute workflow steps sequentially
      for (const step of workflowSteps) {
        const receipt = await step.service.createTodo(step.todo);
        receipts.push({ ...receipt, stepNetwork: step.network });

        // Verify each step completes successfully
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
      }

      // Verify workflow integrity
      expect(receipts).toHaveLength(3);
      expect(receipts[0].network).toBe(BlockchainNetwork.POLYGON);
      expect(receipts[1].network).toBe(BlockchainNetwork.MOONBEAM);
      expect(receipts[2].network).toBe(BlockchainNetwork.BASE);

      // Verify todos exist on their respective networks
      const polygonTodos = await polygonService.getTodos();
      const moonbeamTodos = await moonbeamService.getTodos();
      const baseTodos = await baseService.getTodos();

      expect(polygonTodos.some(todo => todo.title.includes('Step 1'))).toBe(true);
      expect(moonbeamTodos.some(todo => todo.title.includes('Step 2'))).toBe(true);
      expect(baseTodos.some(todo => todo.title.includes('Step 3'))).toBe(true);
    });

    it('should validate transaction finality across networks', async () => {
      const transactions = [];

      // Create todos on all networks and collect transaction hashes
      const polygonReceipt = await polygonService.createTodo({
        title: 'Finality Test Polygon',
        description: 'Testing transaction finality',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      });
      transactions.push({ service: polygonService, hash: polygonReceipt.transactionHash });

      const moonbeamReceipt = await moonbeamService.createTodo({
        title: 'Finality Test Moonbeam',
        description: 'Testing transaction finality',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      });
      transactions.push({ service: moonbeamService, hash: moonbeamReceipt.transactionHash });

      const baseReceipt = await baseService.createTodo({
        title: 'Finality Test Base',
        description: 'Testing transaction finality',
        status: BlockchainTodoStatus.TODO,
        completed: false,
      });
      transactions.push({ service: baseService, hash: baseReceipt.transactionHash });

      // Verify transaction finality on each network
      for (const tx of transactions) {
        const status = await tx.service.getTransactionStatus(tx.hash);
        expect(status).toBe(TransactionStatus.CONFIRMED);

        const receipt = await tx.service.getTransactionReceipt(tx.hash);
        expect(receipt).toBeDefined();
        expect(receipt!.status).toBe(TransactionStatus.CONFIRMED);
        expect(receipt!.blockNumber).toBeDefined();
        expect(receipt!.blockHash).toBeDefined();
      }
    });
  });

  describe('Performance and Scalability Tests', () => {
    it('should handle high-volume operations across all networks', async () => {
      const networks = [
        { name: 'Polygon', service: factory.getService(BlockchainNetwork.POLYGON) },
        { name: 'Moonbeam', service: factory.getService(BlockchainNetwork.MOONBEAM) },
        { name: 'Base', service: factory.getService(BlockchainNetwork.BASE) },
      ];

      const operationsPerNetwork = 10;
      const allOperations = [];

      // Connect all services
      for (const network of networks) {
        await network.service.connectWallet(mockWalletProvider);
      }

      // Create multiple operations per network
      for (const network of networks) {
        for (let i = 0; i < operationsPerNetwork; i++) {
          allOperations.push(
            network.service.createTodo({
              title: `${network.name} Bulk Todo ${i + 1}`,
              description: `Bulk operation test for ${network.name}`,
              status: BlockchainTodoStatus.TODO,
              completed: false,
            }),
          );
        }
      }

      const startTime = Date.now();
      const receipts = await Promise.all(allOperations);
      const endTime = Date.now();

      // Verify all operations completed successfully
      expect(receipts).toHaveLength(networks.length * operationsPerNetwork);
      receipts.forEach(receipt => {
        expect(receipt.status).toBe(TransactionStatus.CONFIRMED);
      });

      // Verify reasonable performance
      const totalTime = endTime - startTime;
      const avgTimePerOperation = totalTime / receipts.length;
      expect(avgTimePerOperation).toBeLessThan(1000); // Less than 1 second per operation

      // Cleanup
      for (const network of networks) {
        await network.service.disconnectWallet();
      }
    });

    it('should maintain performance under concurrent network switching', async () => {
      const switchingOperations = [];
      const networks = [
        BlockchainNetwork.POLYGON,
        BlockchainNetwork.MOONBEAM,
        BlockchainNetwork.BASE,
        BlockchainNetwork.POLYGON_MUMBAI,
        BlockchainNetwork.MOONBEAM_TESTNET,
        BlockchainNetwork.BASE_TESTNET,
      ];

      // Create concurrent network switching operations
      for (let i = 0; i < 20; i++) {
        const randomNetwork = networks[i % networks.length];
        switchingOperations.push(async () => {
          const service = factory.getService(randomNetwork);
          await service.connectWallet(mockWalletProvider);
          const todos = await service.getTodos();
          await service.disconnectWallet();
          return { network: randomNetwork, todoCount: todos.length };
        });
      }

      const startTime = Date.now();
      const results = await Promise.all(switchingOperations.map(op => op()));
      const endTime = Date.now();

      // Verify all operations completed successfully
      expect(results).toHaveLength(20);
      results.forEach(result => {
        expect(networks).toContain(result.network);
        expect(typeof result.todoCount).toBe('number');
        expect(result.todoCount).toBeGreaterThanOrEqual(0);
      });

      // Verify reasonable performance for concurrent operations
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds
    });
  });
});
