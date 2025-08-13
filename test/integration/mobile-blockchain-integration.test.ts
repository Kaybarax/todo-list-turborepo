import { device, expect, element, by, waitFor } from 'detox';

/**
 * Mobile application blockchain integration tests
 * Tests Moonbeam and Base network integration in the mobile app
 */

// Test configuration
const TEST_CONFIG = {
  testUser: {
    email: 'mobile-blockchain-test@example.com',
    password: 'password123',
    name: 'Mobile Blockchain Test User',
  },
  networks: {
    moonbeam: {
      name: 'Moonbeam',
      chainId: 1284,
      displayName: 'Moonbeam',
    },
    moonbeamTestnet: {
      name: 'Moonbase Alpha',
      chainId: 1287,
      displayName: 'Moonbase Alpha',
    },
    base: {
      name: 'Base',
      chainId: 8453,
      displayName: 'Base',
    },
    baseTestnet: {
      name: 'Base Sepolia',
      chainId: 84532,
      displayName: 'Base Sepolia',
    },
  },
};

// Helper functions
const setupMockWallet = async (network: keyof typeof TEST_CONFIG.networks) => {
  const networkConfig = TEST_CONFIG.networks[network];

  // Mock WalletConnect or other mobile wallet provider
  await device.sendToHome();
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES', camera: 'YES' },
  });

  // Set up mock wallet responses
  await device.setURLBlacklist([]);
  await device.setLocation(37.7749, -122.4194); // San Francisco coordinates for testing
};

const loginUser = async () => {
  await element(by.id('email-input')).typeText(TEST_CONFIG.testUser.email);
  await element(by.id('password-input')).typeText(TEST_CONFIG.testUser.password);
  await element(by.id('login-button')).tap();
  await waitFor(element(by.id('todo-list-screen')))
    .toBeVisible()
    .withTimeout(5000);
};

const registerUser = async () => {
  await element(by.id('register-tab')).tap();
  await element(by.id('name-input')).typeText(TEST_CONFIG.testUser.name);
  await element(by.id('email-input')).typeText(TEST_CONFIG.testUser.email);
  await element(by.id('password-input')).typeText(TEST_CONFIG.testUser.password);
  await element(by.id('register-button')).tap();
  await waitFor(element(by.id('todo-list-screen')))
    .toBeVisible()
    .withTimeout(5000);
};

describe('Mobile Blockchain Integration Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Moonbeam Network Integration', () => {
    beforeEach(async () => {
      await setupMockWallet('moonbeam');
      await registerUser();
    });

    it('should connect to Moonbeam mainnet wallet and create blockchain todo', async () => {
      // Navigate to wallet screen
      await element(by.id('wallet-tab')).tap();
      await expect(element(by.id('wallet-screen'))).toBeVisible();

      // Connect wallet
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('walletconnect-option')).tap();

      // Mock successful wallet connection
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('wallet-address-display'))).toBeVisible();

      // Select Moonbeam network
      await element(by.id('network-selector')).tap();
      await element(by.text('Moonbeam')).tap();
      await expect(element(by.id('selected-network-display'))).toHaveText('Moonbeam');

      // Create blockchain todo
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Deploy on Moonbeam Parachain');
      await element(by.id('blockchain-todo-description-input')).typeText(
        'Test Moonbeam EVM compatibility with Polkadot ecosystem',
      );

      // Select priority
      await element(by.id('blockchain-todo-priority-picker')).tap();
      await element(by.text('High')).tap();

      // Submit todo
      await element(by.id('submit-blockchain-todo-button')).tap();

      // Verify transaction status
      await expect(element(by.id('transaction-status-modal'))).toBeVisible();
      await expect(element(by.id('transaction-status-text'))).toHaveText('Transaction pending...');

      // Wait for transaction confirmation (mocked)
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('transaction-hash-display'))).toBeVisible();

      // Close transaction modal
      await element(by.id('close-transaction-modal')).tap();

      // Verify todo appears in blockchain todos list
      await expect(element(by.id('blockchain-todos-list'))).toBeVisible();
      const blockchainTodo = element(by.id('blockchain-todo-item-0'));
      await expect(blockchainTodo).toBeVisible();
      await expect(element(by.id('blockchain-todo-title')).withAncestor(blockchainTodo)).toHaveText(
        'Deploy on Moonbeam Parachain',
      );
      await expect(element(by.id('network-badge')).withAncestor(blockchainTodo)).toHaveText('Moonbeam');
      await expect(element(by.id('parachain-indicator')).withAncestor(blockchainTodo)).toBeVisible();
    });

    it('should perform CRUD operations on Moonbase Alpha testnet', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('walletconnect-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Select Moonbase Alpha testnet
      await element(by.id('network-selector')).tap();
      await element(by.text('Moonbase Alpha')).tap();
      await expect(element(by.id('selected-network-display'))).toHaveText('Moonbase Alpha');
      await expect(element(by.id('testnet-indicator'))).toBeVisible();

      // Create todo
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Test Moonbase Alpha Features');
      await element(by.id('blockchain-todo-description-input')).typeText(
        'Validate testnet functionality before mainnet deployment',
      );
      await element(by.id('submit-blockchain-todo-button')).tap();

      // Wait for confirmation
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('close-transaction-modal')).tap();

      // Verify todo was created
      const todoItem = element(by.id('blockchain-todo-item-0'));
      await expect(todoItem).toBeVisible();

      // Edit todo
      await todoItem.tap();
      await element(by.id('edit-blockchain-todo-button')).tap();
      await element(by.id('blockchain-todo-title-input')).clearText();
      await element(by.id('blockchain-todo-title-input')).typeText('Updated: Moonbase Alpha Testing Complete');
      await element(by.id('submit-blockchain-todo-button')).tap();

      // Wait for update confirmation
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('close-transaction-modal')).tap();

      // Verify update
      await expect(element(by.id('blockchain-todo-title')).withAncestor(todoItem)).toHaveText(
        'Updated: Moonbase Alpha Testing Complete',
      );

      // Toggle completion
      await element(by.id('toggle-blockchain-todo-completion')).withAncestor(todoItem).tap();
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('close-transaction-modal')).tap();

      // Verify completion status
      await expect(element(by.id('blockchain-todo-completed-indicator')).withAncestor(todoItem)).toBeVisible();

      // Delete todo
      await todoItem.longPress();
      await element(by.id('delete-blockchain-todo-action')).tap();
      await element(by.id('confirm-delete-blockchain-todo')).tap();

      // Wait for deletion confirmation
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('close-transaction-modal')).tap();

      // Verify deletion
      await expect(element(by.id('blockchain-todo-item-0'))).not.toBeVisible();
      await expect(element(by.id('empty-blockchain-todos-message'))).toBeVisible();
    });

    it('should handle Moonbeam-specific errors gracefully', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();

      // Mock connection error
      await element(by.id('walletconnect-option')).tap();

      // Simulate Moonbeam parachain connection failure
      await waitFor(element(by.id('wallet-connection-error')))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('error-message-text'))).toHaveText('Failed to connect to Moonbeam parachain');
      await expect(element(by.id('moonbeam-error-indicator'))).toBeVisible();

      // Verify retry functionality
      await element(by.id('retry-wallet-connection')).tap();
      await expect(element(by.id('wallet-connection-retry-indicator'))).toBeVisible();
    });

    it('should display Moonbeam-specific UI elements and branding', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('walletconnect-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('network-selector')).tap();
      await element(by.text('Moonbeam')).tap();

      // Verify Moonbeam-specific UI elements
      await expect(element(by.id('moonbeam-brand-logo'))).toBeVisible();
      await expect(element(by.id('parachain-ecosystem-badge'))).toBeVisible();
      await expect(element(by.id('polkadot-integration-indicator'))).toBeVisible();
      await expect(element(by.id('glmr-token-display'))).toBeVisible();

      // Verify network information
      await expect(element(by.id('network-info-chain-id'))).toHaveText('1284');
      await expect(element(by.id('network-info-type'))).toHaveText('Parachain');
      await expect(element(by.id('network-info-consensus'))).toHaveText('Substrate');
    });
  });

  describe('Base Network Integration', () => {
    beforeEach(async () => {
      await setupMockWallet('base');
      await registerUser();
    });

    it('should connect to Base mainnet wallet and create blockchain todo', async () => {
      await element(by.id('wallet-tab')).tap();
      await expect(element(by.id('wallet-screen'))).toBeVisible();

      // Connect wallet
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap(); // Base uses MetaMask-compatible wallets

      // Mock successful wallet connection
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Select Base network
      await element(by.id('network-selector')).tap();
      await element(by.text('Base')).tap();
      await expect(element(by.id('selected-network-display'))).toHaveText('Base');

      // Create blockchain todo
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Deploy on Base L2');
      await element(by.id('blockchain-todo-description-input')).typeText(
        "Test Coinbase's optimistic rollup for fast, cheap transactions",
      );

      await element(by.id('blockchain-todo-priority-picker')).tap();
      await element(by.text('High')).tap();

      await element(by.id('submit-blockchain-todo-button')).tap();

      // Verify transaction status (should be faster on L2)
      await expect(element(by.id('transaction-status-modal'))).toBeVisible();
      await expect(element(by.id('transaction-status-text'))).toHaveText('Transaction pending...');

      // Wait for faster L2 confirmation
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(3000);

      // Verify L2 optimization indicators
      await expect(element(by.id('l2-fast-confirmation-indicator'))).toBeVisible();
      await expect(element(by.id('low-gas-cost-indicator'))).toBeVisible();

      await element(by.id('close-transaction-modal')).tap();

      // Verify todo appears with Base-specific indicators
      const blockchainTodo = element(by.id('blockchain-todo-item-0'));
      await expect(blockchainTodo).toBeVisible();
      await expect(element(by.id('blockchain-todo-title')).withAncestor(blockchainTodo)).toHaveText(
        'Deploy on Base L2',
      );
      await expect(element(by.id('network-badge')).withAncestor(blockchainTodo)).toHaveText('Base');
      await expect(element(by.id('l2-indicator')).withAncestor(blockchainTodo)).toBeVisible();
      await expect(element(by.id('optimistic-rollup-badge')).withAncestor(blockchainTodo)).toBeVisible();
    });

    it('should demonstrate Base L2 efficiency with multiple rapid transactions', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Select Base Sepolia testnet for testing
      await element(by.id('network-selector')).tap();
      await element(by.text('Base Sepolia')).tap();
      await expect(element(by.id('selected-network-display'))).toHaveText('Base Sepolia');

      const todoTitles = ['L2 Efficiency Test 1', 'L2 Efficiency Test 2', 'L2 Efficiency Test 3'];

      const startTime = Date.now();

      // Create multiple todos rapidly
      for (let i = 0; i < todoTitles.length; i++) {
        await element(by.id('create-blockchain-todo-fab')).tap();
        await element(by.id('blockchain-todo-title-input')).typeText(todoTitles[i]);
        await element(by.id('blockchain-todo-description-input')).typeText('Testing Base L2 transaction speed');
        await element(by.id('submit-blockchain-todo-button')).tap();

        // Wait for fast L2 confirmation
        await waitFor(element(by.id('transaction-confirmed-status')))
          .toBeVisible()
          .withTimeout(2000);
        await element(by.id('close-transaction-modal')).tap();
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Verify all todos were created efficiently
      await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();
      await expect(element(by.id('blockchain-todo-item-1'))).toBeVisible();
      await expect(element(by.id('blockchain-todo-item-2'))).toBeVisible();

      // Verify reasonable performance (should be fast on L2)
      expect(totalTime).toBeLessThan(15000); // Should complete within 15 seconds

      // Verify L2-specific features for all todos
      for (let i = 0; i < todoTitles.length; i++) {
        const todoItem = element(by.id(`blockchain-todo-item-${i}`));
        await expect(element(by.id('network-badge')).withAncestor(todoItem)).toHaveText('Base Sepolia');
        await expect(element(by.id('l2-indicator')).withAncestor(todoItem)).toBeVisible();
        await expect(element(by.id('low-gas-indicator')).withAncestor(todoItem)).toBeVisible();
      }
    });

    it('should handle Base L2-specific errors gracefully', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();

      // Mock Base sequencer error
      await waitFor(element(by.id('wallet-connection-error')))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('error-message-text'))).toHaveText('Base sequencer temporarily unavailable');
      await expect(element(by.id('l2-error-indicator'))).toBeVisible();
      await expect(element(by.id('sequencer-status-indicator'))).toHaveText('Offline');

      // Verify L2-specific error handling UI
      await expect(element(by.id('l2-error-explanation'))).toBeVisible();
      await expect(element(by.id('retry-wallet-connection'))).toBeVisible();
      await expect(element(by.id('check-sequencer-status-button'))).toBeVisible();
    });

    it('should display Base-specific UI elements and branding', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('network-selector')).tap();
      await element(by.text('Base')).tap();

      // Verify Base-specific UI elements
      await expect(element(by.id('base-brand-logo'))).toBeVisible();
      await expect(element(by.id('coinbase-ecosystem-badge'))).toBeVisible();
      await expect(element(by.id('l2-optimization-indicator'))).toBeVisible();
      await expect(element(by.id('eth-token-display'))).toBeVisible();

      // Verify network information
      await expect(element(by.id('network-info-chain-id'))).toHaveText('8453');
      await expect(element(by.id('network-info-type'))).toHaveText('L2 Optimistic Rollup');
      await expect(element(by.id('network-info-settlement'))).toHaveText('Ethereum');

      // Verify L2-specific features
      await expect(element(by.id('gas-optimization-badge'))).toBeVisible();
      await expect(element(by.id('fast-finality-indicator'))).toBeVisible();
    });
  });

  describe('Mobile Network Switching Functionality', () => {
    beforeEach(async () => {
      await registerUser();
    });

    it('should switch between all supported networks seamlessly', async () => {
      await element(by.id('wallet-tab')).tap();

      const networks = [
        { name: 'Polygon', indicator: 'polygon-indicator' },
        { name: 'Moonbeam', indicator: 'parachain-indicator' },
        { name: 'Base', indicator: 'l2-indicator' },
        { name: 'Solana', indicator: 'solana-indicator' },
        { name: 'Polkadot', indicator: 'substrate-indicator' },
      ];

      // Connect wallet first
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Test switching between networks
      for (const network of networks) {
        await element(by.id('network-selector')).tap();
        await element(by.text(network.name)).tap();

        await expect(element(by.id('selected-network-display'))).toHaveText(network.name);
        await expect(element(by.id(network.indicator))).toBeVisible();

        // Verify network switch was successful
        await expect(element(by.id('network-connection-status'))).toHaveText('Connected');

        // Brief pause between switches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });

    it('should handle network switching with proper validation', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Try to switch to Moonbeam (should prompt for network addition)
      await element(by.id('network-selector')).tap();
      await element(by.text('Moonbeam')).tap();

      // Verify network switch prompt
      await expect(element(by.id('network-switch-modal'))).toBeVisible();
      await expect(element(by.id('network-switch-title'))).toHaveText('Switch to Moonbeam');
      await expect(element(by.id('network-switch-description'))).toHaveText(
        'This will add Moonbeam network to your wallet',
      );

      // Confirm network switch
      await element(by.id('confirm-network-switch')).tap();

      // Verify successful switch
      await waitFor(element(by.id('network-switch-success')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('selected-network-display'))).toHaveText('Moonbeam');
    });

    it('should maintain separate todo lists for each network', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Create todo on Moonbeam
      await element(by.id('network-selector')).tap();
      await element(by.text('Moonbeam')).tap();
      await element(by.id('confirm-network-switch')).tap();
      await waitFor(element(by.id('network-switch-success')))
        .toBeVisible()
        .withTimeout(5000);

      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Moonbeam Todo');
      await element(by.id('submit-blockchain-todo-button')).tap();
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('close-transaction-modal')).tap();

      // Verify Moonbeam todo exists
      await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();

      // Switch to Base network
      await element(by.id('network-selector')).tap();
      await element(by.text('Base')).tap();
      await element(by.id('confirm-network-switch')).tap();
      await waitFor(element(by.id('network-switch-success')))
        .toBeVisible()
        .withTimeout(5000);

      // Verify Base network has no todos initially
      await expect(element(by.id('empty-blockchain-todos-message'))).toBeVisible();

      // Create todo on Base
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Base Todo');
      await element(by.id('submit-blockchain-todo-button')).tap();
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.id('close-transaction-modal')).tap();

      // Verify Base todo exists
      await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();
      await expect(element(by.id('blockchain-todo-title')).withAncestor(by.id('blockchain-todo-item-0'))).toHaveText(
        'Base Todo',
      );

      // Switch back to Moonbeam
      await element(by.id('network-selector')).tap();
      await element(by.text('Moonbeam')).tap();

      // Verify Moonbeam todo still exists
      await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();
      await expect(element(by.id('blockchain-todo-title')).withAncestor(by.id('blockchain-todo-item-0'))).toHaveText(
        'Moonbeam Todo',
      );
    });
  });

  describe('Mobile Cross-Network Data Consistency', () => {
    beforeEach(async () => {
      await registerUser();
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should maintain data integrity across network switches', async () => {
      const networks = [
        { name: 'Moonbeam', todoTitle: 'Moonbeam Consistency Test' },
        { name: 'Base', todoTitle: 'Base Consistency Test' },
      ];

      const createdTodos: { network: string; title: string }[] = [];

      // Create todos on different networks
      for (const network of networks) {
        await element(by.id('network-selector')).tap();
        await element(by.text(network.name)).tap();
        if (network.name !== 'Polygon') {
          // Assume Polygon is default
          await element(by.id('confirm-network-switch')).tap();
          await waitFor(element(by.id('network-switch-success')))
            .toBeVisible()
            .withTimeout(5000);
        }

        await element(by.id('create-blockchain-todo-fab')).tap();
        await element(by.id('blockchain-todo-title-input')).typeText(network.todoTitle);
        await element(by.id('blockchain-todo-description-input')).typeText(
          `Testing data consistency on ${network.name}`,
        );
        await element(by.id('submit-blockchain-todo-button')).tap();

        const timeout = network.name === 'Base' ? 3000 : 5000; // Base L2 should be faster
        await waitFor(element(by.id('transaction-confirmed-status')))
          .toBeVisible()
          .withTimeout(timeout);
        await element(by.id('close-transaction-modal')).tap();

        createdTodos.push({ network: network.name, title: network.todoTitle });

        // Verify todo was created
        await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();
        await expect(element(by.id('blockchain-todo-title')).withAncestor(by.id('blockchain-todo-item-0'))).toHaveText(
          network.todoTitle,
        );
      }

      // Verify data persistence by switching back to each network
      for (const todo of createdTodos) {
        await element(by.id('network-selector')).tap();
        await element(by.text(todo.network)).tap();

        // Verify todo still exists
        await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();
        await expect(element(by.id('blockchain-todo-title')).withAncestor(by.id('blockchain-todo-item-0'))).toHaveText(
          todo.title,
        );
      }
    });

    it('should handle offline scenarios with proper sync', async () => {
      // Connect to Moonbeam
      await element(by.id('network-selector')).tap();
      await element(by.text('Moonbeam')).tap();
      await element(by.id('confirm-network-switch')).tap();
      await waitFor(element(by.id('network-switch-success')))
        .toBeVisible()
        .withTimeout(5000);

      // Create todo while online
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Online Moonbeam Todo');
      await element(by.id('submit-blockchain-todo-button')).tap();
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('close-transaction-modal')).tap();

      // Simulate going offline
      await device.setURLBlacklist(['*']);

      // Verify offline indicator
      await expect(element(by.id('offline-indicator'))).toBeVisible();
      await expect(element(by.id('blockchain-offline-warning'))).toBeVisible();

      // Try to create todo while offline
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Offline Moonbeam Todo');
      await element(by.id('submit-blockchain-todo-button')).tap();

      // Verify offline handling
      await expect(element(by.id('offline-transaction-queue-indicator'))).toBeVisible();
      await expect(element(by.id('pending-sync-message'))).toHaveText('Transaction queued for when online');

      // Go back online
      await device.setURLBlacklist([]);

      // Verify sync occurs
      await waitFor(element(by.id('sync-success-indicator')))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('offline-indicator'))).not.toBeVisible();

      // Verify both todos exist
      await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();
      await expect(element(by.id('blockchain-todo-item-1'))).toBeVisible();
    });
  });

  describe('Mobile Performance and User Experience', () => {
    beforeEach(async () => {
      await registerUser();
    });

    it('should provide responsive UI during blockchain operations', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Select Base for fast L2 transactions
      await element(by.id('network-selector')).tap();
      await element(by.text('Base')).tap();
      await element(by.id('confirm-network-switch')).tap();
      await waitFor(element(by.id('network-switch-success')))
        .toBeVisible()
        .withTimeout(5000);

      // Create todo and verify UI responsiveness
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('UI Responsiveness Test');
      await element(by.id('submit-blockchain-todo-button')).tap();

      // Verify loading states
      await expect(element(by.id('transaction-loading-spinner'))).toBeVisible();
      await expect(element(by.id('submit-blockchain-todo-button'))).toHaveText('Processing...');

      // Verify UI remains interactive during transaction
      await expect(element(by.id('network-selector'))).toBeVisible();
      await expect(element(by.id('wallet-balance-display'))).toBeVisible();

      // Wait for completion
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(3000);
      await expect(element(by.id('transaction-loading-spinner'))).not.toBeVisible();
      await expect(element(by.id('submit-blockchain-todo-button'))).toHaveText('Submit');
    });

    it('should handle device rotation during blockchain operations', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      // Start creating a todo
      await element(by.id('create-blockchain-todo-fab')).tap();
      await element(by.id('blockchain-todo-title-input')).typeText('Rotation Test Todo');

      // Rotate device to landscape
      await device.setOrientation('landscape');

      // Verify form is still accessible and functional
      await expect(element(by.id('blockchain-todo-form'))).toBeVisible();
      await expect(element(by.id('blockchain-todo-title-input'))).toHaveText('Rotation Test Todo');

      // Complete the todo creation
      await element(by.id('blockchain-todo-description-input')).typeText('Testing device rotation handling');
      await element(by.id('submit-blockchain-todo-button')).tap();

      // Rotate back to portrait during transaction
      await device.setOrientation('portrait');

      // Verify transaction completes successfully
      await waitFor(element(by.id('transaction-confirmed-status')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('close-transaction-modal')).tap();

      // Verify todo was created
      await expect(element(by.id('blockchain-todo-item-0'))).toBeVisible();
    });

    it('should display appropriate network indicators and optimize for mobile', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      await waitFor(element(by.id('wallet-connected-status')))
        .toBeVisible()
        .withTimeout(10000);

      const networkTests = [
        {
          network: 'Moonbeam',
          expectedElements: ['moonbeam-mobile-logo', 'parachain-mobile-badge', 'polkadot-ecosystem-mobile-indicator'],
        },
        {
          network: 'Base',
          expectedElements: ['base-mobile-logo', 'l2-mobile-badge', 'coinbase-ecosystem-mobile-indicator'],
        },
      ];

      for (const test of networkTests) {
        await element(by.id('network-selector')).tap();
        await element(by.text(test.network)).tap();
        if (test.network !== 'Polygon') {
          await element(by.id('confirm-network-switch')).tap();
          await waitFor(element(by.id('network-switch-success')))
            .toBeVisible()
            .withTimeout(5000);
        }

        // Verify mobile-optimized network indicators
        for (const elementId of test.expectedElements) {
          await expect(element(by.id(elementId))).toBeVisible();
        }

        // Verify mobile-specific layout optimizations
        await expect(element(by.id('mobile-network-info-card'))).toBeVisible();
        await expect(element(by.id('mobile-optimized-balance-display'))).toBeVisible();
      }
    });
  });
});
