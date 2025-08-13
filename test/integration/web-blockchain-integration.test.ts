import { test, expect, Page, BrowserContext } from '@playwright/test';

/**
 * Web application blockchain integration tests
 * Tests Moonbeam and Base network integration in the web app
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.WEB_APP_URL || 'http://localhost:3000',
  testUser: {
    email: 'blockchain-test@example.com',
    password: 'password123',
    name: 'Blockchain Test User',
  },
  networks: {
    moonbeam: {
      name: 'Moonbeam',
      chainId: '0x504', // 1284 in hex
      rpcUrl: 'https://rpc.api.moonbeam.network',
    },
    moonbeamTestnet: {
      name: 'Moonbase Alpha',
      chainId: '0x507', // 1287 in hex
      rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
    },
    base: {
      name: 'Base',
      chainId: '0x2105', // 8453 in hex
      rpcUrl: 'https://mainnet.base.org',
    },
    baseTestnet: {
      name: 'Base Sepolia',
      chainId: '0x14A34', // 84532 in hex
      rpcUrl: 'https://sepolia.base.org',
    },
  },
};

// Helper functions
async function setupMockWallet(page: Page, network: keyof typeof TEST_CONFIG.networks) {
  const networkConfig = TEST_CONFIG.networks[network];

  await page.addInitScript(config => {
    // Mock MetaMask/wallet provider
    (window as any).ethereum = {
      isMetaMask: true,
      request: async ({ method, params }: { method: string; params?: any[] }) => {
        switch (method) {
          case 'eth_requestAccounts':
            return ['0x1234567890123456789012345678901234567890'];
          case 'eth_chainId':
            return config.chainId;
          case 'eth_getBalance':
            return '0x1BC16D674EC80000'; // 2 ETH in wei
          case 'eth_sendTransaction':
            return '0x' + Math.random().toString(16).substr(2, 64);
          case 'wallet_switchEthereumChain':
            return null;
          case 'wallet_addEthereumChain':
            return null;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      },
      on: (event: string, handler: Function) => {
        // Mock event listeners
      },
      removeListener: (event: string, handler: Function) => {
        // Mock event listener removal
      },
    };
  }, networkConfig);
}

async function loginUser(page: Page) {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', TEST_CONFIG.testUser.email);
  await page.fill('[data-testid="password-input"]', TEST_CONFIG.testUser.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/todos');
}

async function registerUser(page: Page) {
  await page.goto('/register');
  await page.fill('[data-testid="name-input"]', TEST_CONFIG.testUser.name);
  await page.fill('[data-testid="email-input"]', TEST_CONFIG.testUser.email);
  await page.fill('[data-testid="password-input"]', TEST_CONFIG.testUser.password);
  await page.click('[data-testid="register-button"]');
  await page.waitForURL('/todos');
}

test.describe('Web Blockchain Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto(TEST_CONFIG.baseUrl);
  });

  test.describe('Moonbeam Network Integration', () => {
    test('should connect to Moonbeam mainnet and create blockchain todo', async ({ page }) => {
      await setupMockWallet(page, 'moonbeam');
      await registerUser(page);

      // Navigate to wallet page
      await page.click('[data-testid="wallet-nav-link"]');
      await expect(page.locator('[data-testid="wallet-page"]')).toBeVisible();

      // Connect wallet
      await page.click('[data-testid="connect-wallet-button"]');
      await expect(page.locator('[data-testid="wallet-connected-indicator"]')).toBeVisible();
      await expect(page.locator('[data-testid="wallet-address"]')).toContainText('0x1234...7890');

      // Select Moonbeam network
      await page.selectOption('[data-testid="network-selector"]', 'moonbeam');
      await expect(page.locator('[data-testid="selected-network"]')).toContainText('Moonbeam');

      // Create blockchain todo
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'Deploy on Moonbeam Parachain');
      await page.fill(
        '[data-testid="blockchain-todo-description"]',
        'Test Moonbeam EVM compatibility with Polkadot ecosystem',
      );
      await page.selectOption('[data-testid="blockchain-todo-priority"]', 'high');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Verify transaction status
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction pending');

      // Wait for transaction confirmation (mocked)
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction confirmed');

      // Verify todo appears in blockchain todos list
      await expect(page.locator('[data-testid="blockchain-todos-list"]')).toBeVisible();
      const blockchainTodo = page.locator('[data-testid="blockchain-todo-item"]').first();
      await expect(blockchainTodo.locator('[data-testid="todo-title"]')).toContainText('Deploy on Moonbeam Parachain');
      await expect(blockchainTodo.locator('[data-testid="network-badge"]')).toContainText('Moonbeam');
      await expect(blockchainTodo.locator('[data-testid="transaction-hash"]')).toBeVisible();
    });

    test('should connect to Moonbase Alpha testnet and perform CRUD operations', async ({ page }) => {
      await setupMockWallet(page, 'moonbeamTestnet');
      await registerUser(page);

      // Navigate to wallet page and connect
      await page.click('[data-testid="wallet-nav-link"]');
      await page.click('[data-testid="connect-wallet-button"]');

      // Select Moonbase Alpha testnet
      await page.selectOption('[data-testid="network-selector"]', 'moonbeam_testnet');
      await expect(page.locator('[data-testid="selected-network"]')).toContainText('Moonbase Alpha');

      // Create todo
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'Test Moonbase Alpha Features');
      await page.fill('[data-testid="blockchain-todo-description"]', 'Validate testnet functionality');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Wait for confirmation
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction confirmed');

      // Edit todo
      const todoItem = page.locator('[data-testid="blockchain-todo-item"]').first();
      await todoItem.locator('[data-testid="edit-todo-button"]').click();
      await page.fill('[data-testid="blockchain-todo-title"]', 'Updated: Moonbase Alpha Testing Complete');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Wait for update confirmation
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction confirmed');

      // Verify update
      await expect(todoItem.locator('[data-testid="todo-title"]')).toContainText(
        'Updated: Moonbase Alpha Testing Complete',
      );

      // Toggle completion
      await todoItem.locator('[data-testid="toggle-completion-button"]').click();
      await page.waitForTimeout(2000);
      await expect(todoItem.locator('[data-testid="completion-status"]')).toContainText('Completed');

      // Delete todo
      await todoItem.locator('[data-testid="delete-todo-button"]').click();
      await page.click('[data-testid="confirm-delete-button"]');
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction confirmed');

      // Verify deletion
      await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(0);
    });

    test('should handle Moonbeam-specific errors gracefully', async ({ page }) => {
      await setupMockWallet(page, 'moonbeam');
      await registerUser(page);

      // Mock a network error
      await page.addInitScript(() => {
        const originalRequest = (window as any).ethereum.request;
        (window as any).ethereum.request = async ({ method }: { method: string }) => {
          if (method === 'eth_sendTransaction') {
            throw new Error('Moonbeam parachain connection failed');
          }
          return originalRequest({ method });
        };
      });

      await page.click('[data-testid="wallet-nav-link"]');
      await page.click('[data-testid="connect-wallet-button"]');
      await page.selectOption('[data-testid="network-selector"]', 'moonbeam');

      // Try to create todo
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'Error Test Todo');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Verify error handling
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Moonbeam parachain connection failed');
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    });
  });

  test.describe('Base Network Integration', () => {
    test('should connect to Base mainnet and create blockchain todo', async ({ page }) => {
      await setupMockWallet(page, 'base');
      await registerUser(page);

      // Navigate to wallet page
      await page.click('[data-testid="wallet-nav-link"]');
      await expect(page.locator('[data-testid="wallet-page"]')).toBeVisible();

      // Connect wallet
      await page.click('[data-testid="connect-wallet-button"]');
      await expect(page.locator('[data-testid="wallet-connected-indicator"]')).toBeVisible();

      // Select Base network
      await page.selectOption('[data-testid="network-selector"]', 'base');
      await expect(page.locator('[data-testid="selected-network"]')).toContainText('Base');

      // Create blockchain todo
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'Deploy on Base L2');
      await page.fill(
        '[data-testid="blockchain-todo-description"]',
        "Test Coinbase's optimistic rollup for fast, cheap transactions",
      );
      await page.selectOption('[data-testid="blockchain-todo-priority"]', 'high');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Verify transaction status
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction pending');

      // Wait for transaction confirmation
      await page.waitForTimeout(1500); // Base should be faster than other networks
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction confirmed');

      // Verify L2 optimization indicators
      await expect(page.locator('[data-testid="gas-cost-indicator"]')).toContainText('Low cost');
      await expect(page.locator('[data-testid="transaction-speed-indicator"]')).toContainText('Fast');

      // Verify todo appears in blockchain todos list
      const blockchainTodo = page.locator('[data-testid="blockchain-todo-item"]').first();
      await expect(blockchainTodo.locator('[data-testid="todo-title"]')).toContainText('Deploy on Base L2');
      await expect(blockchainTodo.locator('[data-testid="network-badge"]')).toContainText('Base');
      await expect(blockchainTodo.locator('[data-testid="l2-indicator"]')).toBeVisible();
    });

    test('should connect to Base Sepolia testnet and demonstrate L2 efficiency', async ({ page }) => {
      await setupMockWallet(page, 'baseTestnet');
      await registerUser(page);

      await page.click('[data-testid="wallet-nav-link"]');
      await page.click('[data-testid="connect-wallet-button"]');

      // Select Base Sepolia testnet
      await page.selectOption('[data-testid="network-selector"]', 'base_testnet');
      await expect(page.locator('[data-testid="selected-network"]')).toContainText('Base Sepolia');

      // Create multiple todos quickly to test L2 efficiency
      const todoTitles = ['L2 Efficiency Test 1', 'L2 Efficiency Test 2', 'L2 Efficiency Test 3'];

      const startTime = Date.now();

      for (const title of todoTitles) {
        await page.click('[data-testid="create-blockchain-todo-button"]');
        await page.fill('[data-testid="blockchain-todo-title"]', title);
        await page.fill('[data-testid="blockchain-todo-description"]', 'Testing Base L2 transaction speed and cost');
        await page.click('[data-testid="submit-blockchain-todo-button"]');

        // Wait for confirmation
        await page.waitForTimeout(1000); // Base L2 should be fast
        await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction confirmed');
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Verify all todos were created efficiently
      await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(3);
      expect(totalTime).toBeLessThan(10000); // Should complete within 10 seconds

      // Verify L2-specific features
      const todoItems = page.locator('[data-testid="blockchain-todo-item"]');
      for (let i = 0; i < 3; i++) {
        const todoItem = todoItems.nth(i);
        await expect(todoItem.locator('[data-testid="network-badge"]')).toContainText('Base Sepolia');
        await expect(todoItem.locator('[data-testid="l2-indicator"]')).toBeVisible();
        await expect(todoItem.locator('[data-testid="low-gas-indicator"]')).toBeVisible();
      }
    });

    test('should handle Base L2-specific errors gracefully', async ({ page }) => {
      await setupMockWallet(page, 'base');
      await registerUser(page);

      // Mock a Base sequencer error
      await page.addInitScript(() => {
        const originalRequest = (window as any).ethereum.request;
        (window as any).ethereum.request = async ({ method }: { method: string }) => {
          if (method === 'eth_sendTransaction') {
            throw new Error('Base sequencer temporarily unavailable');
          }
          return originalRequest({ method });
        };
      });

      await page.click('[data-testid="wallet-nav-link"]');
      await page.click('[data-testid="connect-wallet-button"]');
      await page.selectOption('[data-testid="network-selector"]', 'base');

      // Try to create todo
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'L2 Error Test Todo');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Verify L2-specific error handling
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        'Base sequencer temporarily unavailable',
      );
      await expect(page.locator('[data-testid="l2-error-indicator"]')).toBeVisible();
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    });
  });

  test.describe('Network Switching Functionality', () => {
    test('should switch between all five networks seamlessly', async ({ page }) => {
      await registerUser(page);
      await page.click('[data-testid="wallet-nav-link"]');

      const networks = [
        { value: 'polygon', name: 'Polygon', setup: () => setupMockWallet(page, 'moonbeam') },
        { value: 'moonbeam', name: 'Moonbeam', setup: () => setupMockWallet(page, 'moonbeam') },
        { value: 'base', name: 'Base', setup: () => setupMockWallet(page, 'base') },
        { value: 'solana', name: 'Solana', setup: () => {} }, // Mock Solana separately if needed
        { value: 'polkadot', name: 'Polkadot', setup: () => {} }, // Mock Polkadot separately if needed
      ];

      // Connect wallet first
      await setupMockWallet(page, 'moonbeam');
      await page.click('[data-testid="connect-wallet-button"]');

      // Test switching between networks
      for (const network of networks) {
        await network.setup();
        await page.selectOption('[data-testid="network-selector"]', network.value);
        await expect(page.locator('[data-testid="selected-network"]')).toContainText(network.name);

        // Verify network-specific UI elements
        if (network.value === 'moonbeam') {
          await expect(page.locator('[data-testid="parachain-indicator"]')).toBeVisible();
        } else if (network.value === 'base') {
          await expect(page.locator('[data-testid="l2-indicator"]')).toBeVisible();
        }

        // Verify network switch was successful
        await expect(page.locator('[data-testid="network-status"]')).toContainText('Connected');
      }
    });

    test('should handle network switching with proper chain ID validation', async ({ page }) => {
      await registerUser(page);
      await page.click('[data-testid="wallet-nav-link"]');

      // Mock wallet with wrong chain ID
      await page.addInitScript(() => {
        (window as any).ethereum = {
          isMetaMask: true,
          request: async ({ method }: { method: string }) => {
            switch (method) {
              case 'eth_requestAccounts':
                return ['0x1234567890123456789012345678901234567890'];
              case 'eth_chainId':
                return '0x1'; // Ethereum mainnet instead of expected network
              default:
                throw new Error(`Unsupported method: ${method}`);
            }
          },
          on: () => {},
          removeListener: () => {},
        };
      });

      await page.click('[data-testid="connect-wallet-button"]');
      await page.selectOption('[data-testid="network-selector"]', 'moonbeam');

      // Verify network switch prompt
      await expect(page.locator('[data-testid="network-switch-prompt"]')).toBeVisible();
      await expect(page.locator('[data-testid="switch-network-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="network-mismatch-warning"]')).toContainText(
        'Please switch to Moonbeam network',
      );
    });

    test('should maintain separate todo lists for each network', async ({ page }) => {
      await registerUser(page);
      await page.click('[data-testid="wallet-nav-link"]');

      // Connect and create todo on Moonbeam
      await setupMockWallet(page, 'moonbeam');
      await page.click('[data-testid="connect-wallet-button"]');
      await page.selectOption('[data-testid="network-selector"]', 'moonbeam');

      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'Moonbeam Todo');
      await page.click('[data-testid="submit-blockchain-todo-button"]');
      await page.waitForTimeout(2000);

      // Verify Moonbeam todo exists
      await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(1);
      await expect(
        page.locator('[data-testid="blockchain-todo-item"]').first().locator('[data-testid="todo-title"]'),
      ).toContainText('Moonbeam Todo');

      // Switch to Base network
      await setupMockWallet(page, 'base');
      await page.selectOption('[data-testid="network-selector"]', 'base');

      // Verify Base network has no todos initially
      await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(0);

      // Create todo on Base
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'Base Todo');
      await page.click('[data-testid="submit-blockchain-todo-button"]');
      await page.waitForTimeout(2000);

      // Verify Base todo exists
      await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(1);
      await expect(
        page.locator('[data-testid="blockchain-todo-item"]').first().locator('[data-testid="todo-title"]'),
      ).toContainText('Base Todo');

      // Switch back to Moonbeam
      await setupMockWallet(page, 'moonbeam');
      await page.selectOption('[data-testid="network-selector"]', 'moonbeam');

      // Verify Moonbeam todo still exists
      await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(1);
      await expect(
        page.locator('[data-testid="blockchain-todo-item"]').first().locator('[data-testid="todo-title"]'),
      ).toContainText('Moonbeam Todo');
    });
  });

  test.describe('Cross-Network Data Consistency', () => {
    test('should maintain data integrity across network switches', async ({ page }) => {
      await registerUser(page);
      await page.click('[data-testid="wallet-nav-link"]');

      const networks = [
        { key: 'moonbeam', name: 'Moonbeam', setup: () => setupMockWallet(page, 'moonbeam') },
        { key: 'base', name: 'Base', setup: () => setupMockWallet(page, 'base') },
      ];

      const createdTodos: { network: string; title: string }[] = [];

      // Create todos on different networks
      for (const network of networks) {
        await network.setup();
        await page.click('[data-testid="connect-wallet-button"]');
        await page.selectOption('[data-testid="network-selector"]', network.key);

        const todoTitle = `${network.name} Consistency Test`;
        await page.click('[data-testid="create-blockchain-todo-button"]');
        await page.fill('[data-testid="blockchain-todo-title"]', todoTitle);
        await page.fill('[data-testid="blockchain-todo-description"]', `Testing data consistency on ${network.name}`);
        await page.click('[data-testid="submit-blockchain-todo-button"]');
        await page.waitForTimeout(2000);

        createdTodos.push({ network: network.key, title: todoTitle });

        // Verify todo was created
        await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(1);
        await expect(
          page.locator('[data-testid="blockchain-todo-item"]').first().locator('[data-testid="todo-title"]'),
        ).toContainText(todoTitle);
      }

      // Verify data persistence by switching back to each network
      for (const todo of createdTodos) {
        const network = networks.find(n => n.key === todo.network)!;
        await network.setup();
        await page.selectOption('[data-testid="network-selector"]', todo.network);

        // Verify todo still exists
        await expect(page.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(1);
        await expect(
          page.locator('[data-testid="blockchain-todo-item"]').first().locator('[data-testid="todo-title"]'),
        ).toContainText(todo.title);
      }
    });

    test('should handle concurrent operations across networks', async ({ page, context }) => {
      await registerUser(page);

      // Open multiple tabs for concurrent testing
      const moonbeamPage = await context.newPage();
      const basePage = await context.newPage();

      // Setup Moonbeam tab
      await setupMockWallet(moonbeamPage, 'moonbeam');
      await moonbeamPage.goto(`${TEST_CONFIG.baseUrl}/wallet`);
      await loginUser(moonbeamPage);
      await moonbeamPage.click('[data-testid="wallet-nav-link"]');
      await moonbeamPage.click('[data-testid="connect-wallet-button"]');
      await moonbeamPage.selectOption('[data-testid="network-selector"]', 'moonbeam');

      // Setup Base tab
      await setupMockWallet(basePage, 'base');
      await basePage.goto(`${TEST_CONFIG.baseUrl}/wallet`);
      await loginUser(basePage);
      await basePage.click('[data-testid="wallet-nav-link"]');
      await basePage.click('[data-testid="connect-wallet-button"]');
      await basePage.selectOption('[data-testid="network-selector"]', 'base');

      // Create todos concurrently
      const moonbeamPromise = (async () => {
        await moonbeamPage.click('[data-testid="create-blockchain-todo-button"]');
        await moonbeamPage.fill('[data-testid="blockchain-todo-title"]', 'Concurrent Moonbeam Todo');
        await moonbeamPage.click('[data-testid="submit-blockchain-todo-button"]');
        await moonbeamPage.waitForTimeout(2000);
      })();

      const basePromise = (async () => {
        await basePage.click('[data-testid="create-blockchain-todo-button"]');
        await basePage.fill('[data-testid="blockchain-todo-title"]', 'Concurrent Base Todo');
        await basePage.click('[data-testid="submit-blockchain-todo-button"]');
        await basePage.waitForTimeout(2000);
      })();

      // Wait for both operations to complete
      await Promise.all([moonbeamPromise, basePromise]);

      // Verify both todos were created successfully
      await expect(moonbeamPage.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(1);
      await expect(
        moonbeamPage.locator('[data-testid="blockchain-todo-item"]').first().locator('[data-testid="todo-title"]'),
      ).toContainText('Concurrent Moonbeam Todo');

      await expect(basePage.locator('[data-testid="blockchain-todo-item"]')).toHaveCount(1);
      await expect(
        basePage.locator('[data-testid="blockchain-todo-item"]').first().locator('[data-testid="todo-title"]'),
      ).toContainText('Concurrent Base Todo');

      // Cleanup
      await moonbeamPage.close();
      await basePage.close();
    });
  });

  test.describe('Performance and User Experience', () => {
    test('should provide responsive UI during blockchain operations', async ({ page }) => {
      await setupMockWallet(page, 'base'); // Use Base for fast L2 transactions
      await registerUser(page);
      await page.click('[data-testid="wallet-nav-link"]');
      await page.click('[data-testid="connect-wallet-button"]');
      await page.selectOption('[data-testid="network-selector"]', 'base');

      // Create todo and verify UI responsiveness
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="blockchain-todo-title"]', 'UI Responsiveness Test');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Verify loading states
      await expect(page.locator('[data-testid="transaction-loading-spinner"]')).toBeVisible();
      await expect(page.locator('[data-testid="submit-blockchain-todo-button"]')).toBeDisabled();

      // Verify UI remains interactive during transaction
      await expect(page.locator('[data-testid="network-selector"]')).toBeEnabled();
      await expect(page.locator('[data-testid="wallet-balance"]')).toBeVisible();

      // Wait for completion
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="transaction-loading-spinner"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="submit-blockchain-todo-button"]')).toBeEnabled();
    });

    test('should display appropriate network indicators and branding', async ({ page }) => {
      await registerUser(page);
      await page.click('[data-testid="wallet-nav-link"]');

      const networkTests = [
        {
          network: 'moonbeam',
          setup: () => setupMockWallet(page, 'moonbeam'),
          expectedIndicators: ['parachain-indicator', 'polkadot-ecosystem-badge'],
          expectedColors: ['moonbeam-brand-color'],
        },
        {
          network: 'base',
          setup: () => setupMockWallet(page, 'base'),
          expectedIndicators: ['l2-indicator', 'coinbase-ecosystem-badge'],
          expectedColors: ['base-brand-color'],
        },
      ];

      for (const test of networkTests) {
        await test.setup();
        await page.click('[data-testid="connect-wallet-button"]');
        await page.selectOption('[data-testid="network-selector"]', test.network);

        // Verify network-specific indicators
        for (const indicator of test.expectedIndicators) {
          await expect(page.locator(`[data-testid="${indicator}"]`)).toBeVisible();
        }

        // Verify branding colors (check CSS classes or styles)
        for (const colorClass of test.expectedColors) {
          await expect(page.locator(`[data-testid="network-branding"]`)).toHaveClass(new RegExp(colorClass));
        }
      }
    });
  });
});
