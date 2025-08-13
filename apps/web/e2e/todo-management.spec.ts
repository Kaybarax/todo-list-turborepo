import { test, expect, Page } from '@playwright/test';

// Test data
const testUser = {
  email: 'e2e-test@example.com',
  password: 'password123',
  name: 'E2E Test User',
};

const testTodos = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the todo app',
    priority: 'high',
    dueDate: '2024-12-31',
    tags: 'work, documentation',
  },
  {
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and vegetables',
    priority: 'medium',
    dueDate: '2024-01-15',
    tags: 'personal, shopping',
  },
  {
    title: 'Exercise routine',
    description: '30 minutes of cardio and strength training',
    priority: 'low',
    dueDate: '2024-01-10',
    tags: 'health, fitness',
  },
];

// Helper functions
async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/todos');
}

async function registerUser(page: Page, user: typeof testUser) {
  await page.goto('/register');
  await page.fill('[data-testid="name-input"]', user.name);
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="register-button"]');
  await page.waitForURL('/todos');
}

async function createTodo(page: Page, todo: (typeof testTodos)[0]) {
  await page.click('[data-testid="create-todo-button"]');
  await page.fill('[data-testid="todo-title-input"]', todo.title);
  await page.fill('[data-testid="todo-description-input"]', todo.description);
  await page.selectOption('[data-testid="todo-priority-select"]', todo.priority);
  await page.fill('[data-testid="todo-due-date-input"]', todo.dueDate);
  await page.fill('[data-testid="todo-tags-input"]', todo.tags);
  await page.click('[data-testid="submit-todo-button"]');
  await page.waitForSelector(`[data-testid="todo-item"]:has-text("${todo.title}")`);
}

test.describe('Todo Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/');
  });

  test.describe('Authentication Flow', () => {
    test('should register new user and redirect to todos', async ({ page }) => {
      await registerUser(page, testUser);

      // Verify user is logged in and on todos page
      await expect(page).toHaveURL('/todos');
      await expect(page.locator('[data-testid="user-menu"]')).toContainText(testUser.name);
      await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
    });

    test('should login existing user', async ({ page }) => {
      // First register the user
      await registerUser(page, testUser);

      // Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/login');

      // Login again
      await loginUser(page, testUser.email, testUser.password);

      // Verify successful login
      await expect(page).toHaveURL('/todos');
      await expect(page.locator('[data-testid="user-menu"]')).toContainText(testUser.name);
    });

    test('should show error for invalid login credentials', async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'invalid@example.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');

      await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
      await expect(page).toHaveURL('/login');
    });

    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/todos');
      await expect(page).toHaveURL('/login');
    });

    test('should logout user successfully', async ({ page }) => {
      await registerUser(page, testUser);

      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');

      await expect(page).toHaveURL('/login');
      await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
    });
  });

  test.describe('Todo CRUD Operations', () => {
    test.beforeEach(async ({ page }) => {
      await registerUser(page, testUser);
    });

    test('should create a new todo', async ({ page }) => {
      const todo = testTodos[0];
      await createTodo(page, todo);

      // Verify todo appears in the list
      const todoItem = page.locator(`[data-testid="todo-item"]:has-text("${todo.title}")`);
      await expect(todoItem).toBeVisible();
      await expect(todoItem.locator('[data-testid="todo-title"]')).toContainText(todo.title);
      await expect(todoItem.locator('[data-testid="todo-description"]')).toContainText(todo.description);
      await expect(todoItem.locator('[data-testid="todo-priority"]')).toContainText(todo.priority);
      await expect(todoItem.locator('[data-testid="todo-due-date"]')).toContainText(todo.dueDate);

      // Verify tags are displayed
      const tags = todo.tags.split(', ');
      for (const tag of tags) {
        await expect(todoItem.locator(`[data-testid="todo-tag"]:has-text("${tag}")`)).toBeVisible();
      }
    });

    test('should edit an existing todo', async ({ page }) => {
      const todo = testTodos[0];
      await createTodo(page, todo);

      // Click edit button
      await page.click(`[data-testid="todo-item"]:has-text("${todo.title}") [data-testid="edit-todo-button"]`);

      // Update todo details
      const updatedTodo = {
        title: 'Updated: Complete project documentation',
        description: 'Updated: Write comprehensive documentation for the todo app',
        priority: 'medium',
        dueDate: '2024-11-30',
        tags: 'work, documentation, updated',
      };

      await page.fill('[data-testid="todo-title-input"]', updatedTodo.title);
      await page.fill('[data-testid="todo-description-input"]', updatedTodo.description);
      await page.selectOption('[data-testid="todo-priority-select"]', updatedTodo.priority);
      await page.fill('[data-testid="todo-due-date-input"]', updatedTodo.dueDate);
      await page.fill('[data-testid="todo-tags-input"]', updatedTodo.tags);
      await page.click('[data-testid="submit-todo-button"]');

      // Verify updated todo
      const todoItem = page.locator(`[data-testid="todo-item"]:has-text("${updatedTodo.title}")`);
      await expect(todoItem).toBeVisible();
      await expect(todoItem.locator('[data-testid="todo-title"]')).toContainText(updatedTodo.title);
      await expect(todoItem.locator('[data-testid="todo-description"]')).toContainText(updatedTodo.description);
      await expect(todoItem.locator('[data-testid="todo-priority"]')).toContainText(updatedTodo.priority);
    });

    test('should toggle todo completion status', async ({ page }) => {
      const todo = testTodos[0];
      await createTodo(page, todo);

      const todoItem = page.locator(`[data-testid="todo-item"]:has-text("${todo.title}")`);
      const checkbox = todoItem.locator('[data-testid="todo-checkbox"]');

      // Initially uncompleted
      await expect(checkbox).not.toBeChecked();
      await expect(todoItem).not.toHaveClass(/completed/);

      // Toggle to completed
      await checkbox.click();
      await expect(checkbox).toBeChecked();
      await expect(todoItem).toHaveClass(/completed/);

      // Toggle back to uncompleted
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
      await expect(todoItem).not.toHaveClass(/completed/);
    });

    test('should delete a todo', async ({ page }) => {
      const todo = testTodos[0];
      await createTodo(page, todo);

      // Click delete button
      await page.click(`[data-testid="todo-item"]:has-text("${todo.title}") [data-testid="delete-todo-button"]`);

      // Confirm deletion in modal
      await page.click('[data-testid="confirm-delete-button"]');

      // Verify todo is removed
      await expect(page.locator(`[data-testid="todo-item"]:has-text("${todo.title}")`)).not.toBeVisible();
    });

    test('should handle todo creation validation', async ({ page }) => {
      await page.click('[data-testid="create-todo-button"]');

      // Try to submit without title
      await page.click('[data-testid="submit-todo-button"]');

      // Verify validation error
      await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');

      // Fill title and submit
      await page.fill('[data-testid="todo-title-input"]', 'Valid Todo Title');
      await page.click('[data-testid="submit-todo-button"]');

      // Verify todo is created
      await expect(page.locator('[data-testid="todo-item"]:has-text("Valid Todo Title")')).toBeVisible();
    });
  });

  test.describe('Todo List Management', () => {
    test.beforeEach(async ({ page }) => {
      await registerUser(page, testUser);

      // Create multiple todos for testing
      for (const todo of testTodos) {
        await createTodo(page, todo);
      }
    });

    test('should filter todos by completion status', async ({ page }) => {
      // Complete one todo
      const firstTodo = page.locator('[data-testid="todo-item"]').first();
      await firstTodo.locator('[data-testid="todo-checkbox"]').click();

      // Filter by completed
      await page.selectOption('[data-testid="filter-select"]', 'completed');

      // Verify only completed todos are shown
      const visibleTodos = page.locator('[data-testid="todo-item"]');
      await expect(visibleTodos).toHaveCount(1);
      await expect(visibleTodos.first().locator('[data-testid="todo-checkbox"]')).toBeChecked();

      // Filter by active
      await page.selectOption('[data-testid="filter-select"]', 'active');

      // Verify only active todos are shown
      await expect(visibleTodos).toHaveCount(2);
      const checkboxes = visibleTodos.locator('[data-testid="todo-checkbox"]');
      await expect(checkboxes.first()).not.toBeChecked();
      await expect(checkboxes.last()).not.toBeChecked();

      // Show all todos
      await page.selectOption('[data-testid="filter-select"]', 'all');
      await expect(visibleTodos).toHaveCount(3);
    });

    test('should filter todos by priority', async ({ page }) => {
      // Filter by high priority
      await page.selectOption('[data-testid="priority-filter-select"]', 'high');

      const visibleTodos = page.locator('[data-testid="todo-item"]');
      await expect(visibleTodos).toHaveCount(1);
      await expect(visibleTodos.first().locator('[data-testid="todo-priority"]')).toContainText('high');

      // Filter by medium priority
      await page.selectOption('[data-testid="priority-filter-select"]', 'medium');
      await expect(visibleTodos).toHaveCount(1);
      await expect(visibleTodos.first().locator('[data-testid="todo-priority"]')).toContainText('medium');

      // Show all priorities
      await page.selectOption('[data-testid="priority-filter-select"]', 'all');
      await expect(visibleTodos).toHaveCount(3);
    });

    test('should search todos by title and description', async ({ page }) => {
      // Search by title
      await page.fill('[data-testid="search-input"]', 'documentation');

      const visibleTodos = page.locator('[data-testid="todo-item"]');
      await expect(visibleTodos).toHaveCount(1);
      await expect(visibleTodos.first().locator('[data-testid="todo-title"]')).toContainText('documentation');

      // Search by description
      await page.fill('[data-testid="search-input"]', 'groceries');
      await expect(visibleTodos).toHaveCount(1);
      await expect(visibleTodos.first().locator('[data-testid="todo-title"]')).toContainText('Buy groceries');

      // Clear search
      await page.fill('[data-testid="search-input"]', '');
      await expect(visibleTodos).toHaveCount(3);
    });

    test('should sort todos by different criteria', async ({ page }) => {
      // Sort by priority (high to low)
      await page.selectOption('[data-testid="sort-select"]', 'priority');

      const todoTitles = page.locator('[data-testid="todo-item"] [data-testid="todo-title"]');
      await expect(todoTitles.first()).toContainText('Complete project documentation'); // high priority
      await expect(todoTitles.last()).toContainText('Exercise routine'); // low priority

      // Sort by due date
      await page.selectOption('[data-testid="sort-select"]', 'dueDate');

      // Verify sorting by due date (earliest first)
      await expect(todoTitles.first()).toContainText('Exercise routine'); // 2024-01-10
      await expect(todoTitles.last()).toContainText('Complete project documentation'); // 2024-12-31

      // Sort by creation date
      await page.selectOption('[data-testid="sort-select"]', 'createdAt');

      // Should be in creation order
      await expect(todoTitles.first()).toContainText('Complete project documentation');
      await expect(todoTitles.nth(1)).toContainText('Buy groceries');
      await expect(todoTitles.last()).toContainText('Exercise routine');
    });

    test('should handle pagination', async ({ page }) => {
      // Create more todos to test pagination
      for (let i = 4; i <= 15; i++) {
        await createTodo(page, {
          title: `Todo ${i}`,
          description: `Description for todo ${i}`,
          priority: 'medium',
          dueDate: '2024-12-31',
          tags: 'test',
        });
      }

      // Verify pagination controls appear
      await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
      await expect(page.locator('[data-testid="page-info"]')).toContainText('Page 1 of');

      // Go to next page
      await page.click('[data-testid="next-page-button"]');
      await expect(page.locator('[data-testid="page-info"]')).toContainText('Page 2 of');

      // Go back to first page
      await page.click('[data-testid="prev-page-button"]');
      await expect(page.locator('[data-testid="page-info"]')).toContainText('Page 1 of');
    });
  });

  test.describe('Wallet Integration', () => {
    test.beforeEach(async ({ page }) => {
      await registerUser(page, testUser);
    });

    test('should display wallet connection interface', async ({ page }) => {
      await page.goto('/wallet');

      await expect(page.locator('[data-testid="wallet-connect-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="connect-wallet-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="wallet-status"]')).toContainText('Not connected');
    });

    test('should show network selection when wallet connected', async ({ page }) => {
      await page.goto('/wallet');

      // Mock wallet connection
      await page.evaluate(() => {
        (window as any).ethereum = {
          request: async ({ method }: { method: string }) => {
            if (method === 'eth_requestAccounts') {
              return ['0x1234567890abcdef1234567890abcdef12345678'];
            }
            if (method === 'eth_chainId') {
              return '0x89'; // Polygon
            }
            return null;
          },
          on: () => {},
          removeListener: () => {},
        };
      });

      await page.click('[data-testid="connect-wallet-button"]');

      // Verify wallet connected state
      await expect(page.locator('[data-testid="wallet-status"]')).toContainText('Connected');
      await expect(page.locator('[data-testid="wallet-address"]')).toContainText('0x1234...5678');
      await expect(page.locator('[data-testid="network-select"]')).toBeVisible();
    });

    test('should create todo on blockchain when wallet connected', async ({ page }) => {
      // Mock wallet connection
      await page.evaluate(() => {
        (window as any).ethereum = {
          request: async ({ method }: { method: string }) => {
            if (method === 'eth_requestAccounts') {
              return ['0x1234567890abcdef1234567890abcdef12345678'];
            }
            if (method === 'eth_chainId') {
              return '0x89'; // Polygon
            }
            if (method === 'eth_sendTransaction') {
              return '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
            }
            return null;
          },
          on: () => {},
          removeListener: () => {},
        };
      });

      await page.goto('/wallet');
      await page.click('[data-testid="connect-wallet-button"]');

      // Create blockchain todo
      await page.click('[data-testid="create-blockchain-todo-button"]');
      await page.fill('[data-testid="todo-title-input"]', 'Blockchain Todo');
      await page.fill('[data-testid="todo-description-input"]', 'Stored on blockchain');
      await page.selectOption('[data-testid="blockchain-network-select"]', 'polygon');
      await page.click('[data-testid="submit-blockchain-todo-button"]');

      // Verify transaction status
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction pending');

      // Wait for transaction confirmation (mocked)
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="transaction-status"]')).toContainText('Transaction confirmed');

      // Verify todo appears with blockchain indicator
      const todoItem = page.locator('[data-testid="todo-item"]:has-text("Blockchain Todo")');
      await expect(todoItem).toBeVisible();
      await expect(todoItem.locator('[data-testid="blockchain-indicator"]')).toBeVisible();
      await expect(todoItem.locator('[data-testid="transaction-hash"]')).toContainText('0xabcdef');
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      await registerUser(page, testUser);
      await createTodo(page, testTodos[0]);
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      // Verify mobile navigation
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-nav-menu"]')).toBeVisible();

      // Verify todo list is responsive
      const todoItem = page.locator('[data-testid="todo-item"]').first();
      await expect(todoItem).toBeVisible();

      // Verify mobile-specific actions
      await todoItem.click();
      await expect(page.locator('[data-testid="mobile-todo-actions"]')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad

      // Verify tablet layout
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();

      // Verify todo grid layout on tablet
      const todoGrid = page.locator('[data-testid="todo-grid"]');
      await expect(todoGrid).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop

      // Verify desktop layout
      await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="desktop-main-content"]')).toBeVisible();
      await expect(page.locator('[data-testid="desktop-actions-panel"]')).toBeVisible();
    });
  });

  test.describe('Performance and Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await registerUser(page, testUser);
    });

    test('should load todos quickly', async ({ page }) => {
      // Create multiple todos
      for (let i = 0; i < 20; i++) {
        await createTodo(page, {
          title: `Performance Test Todo ${i}`,
          description: `Description ${i}`,
          priority: 'medium',
          dueDate: '2024-12-31',
          tags: 'performance',
        });
      }

      // Measure load time
      const startTime = Date.now();
      await page.reload();
      await page.waitForSelector('[data-testid="todo-item"]');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should be keyboard accessible', async ({ page }) => {
      await createTodo(page, testTodos[0]);

      // Navigate using keyboard
      await page.keyboard.press('Tab'); // Focus on first interactive element
      await page.keyboard.press('Tab'); // Navigate to todo item
      await page.keyboard.press('Enter'); // Activate todo item

      // Verify keyboard navigation works
      await expect(page.locator('[data-testid="todo-item"]:focus')).toBeVisible();

      // Test keyboard shortcuts
      await page.keyboard.press('Control+n'); // New todo shortcut
      await expect(page.locator('[data-testid="todo-form"]')).toBeVisible();

      await page.keyboard.press('Escape'); // Close form
      await expect(page.locator('[data-testid="todo-form"]')).not.toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await createTodo(page, testTodos[0]);

      // Verify ARIA labels
      await expect(page.locator('[data-testid="todo-list"]')).toHaveAttribute('aria-label', 'Todo list');
      await expect(page.locator('[data-testid="create-todo-button"]')).toHaveAttribute('aria-label', 'Create new todo');
      await expect(page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label', 'Search todos');

      const todoItem = page.locator('[data-testid="todo-item"]').first();
      await expect(todoItem.locator('[data-testid="todo-checkbox"]')).toHaveAttribute(
        'aria-label',
        'Mark todo as complete',
      );
      await expect(todoItem.locator('[data-testid="edit-todo-button"]')).toHaveAttribute('aria-label', 'Edit todo');
      await expect(todoItem.locator('[data-testid="delete-todo-button"]')).toHaveAttribute('aria-label', 'Delete todo');
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await registerUser(page, testUser);
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/todos', route => route.abort());

      await page.reload();

      // Verify error message is displayed
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to load todos');
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();

      // Test retry functionality
      await page.unroute('**/api/todos');
      await page.click('[data-testid="retry-button"]');

      // Verify todos load after retry
      await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();
    });

    test('should handle server errors', async ({ page }) => {
      // Simulate server error
      await page.route('**/api/todos', route =>
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Internal server error' }) }),
      );

      await page.reload();

      // Verify error handling
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Server error');
      await expect(page.locator('[data-testid="error-details"]')).toContainText('Internal server error');
    });

    test('should handle validation errors', async ({ page }) => {
      // Try to create todo with invalid data
      await page.click('[data-testid="create-todo-button"]');
      await page.fill('[data-testid="todo-title-input"]', ''); // Empty title
      await page.fill('[data-testid="todo-due-date-input"]', '2020-01-01'); // Past date
      await page.click('[data-testid="submit-todo-button"]');

      // Verify validation errors
      await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');
      await expect(page.locator('[data-testid="due-date-error"]')).toContainText('Due date cannot be in the past');
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist todos across browser sessions', async ({ page, context }) => {
      await registerUser(page, testUser);
      await createTodo(page, testTodos[0]);

      // Close and reopen browser
      await page.close();
      const newPage = await context.newPage();

      // Login again
      await loginUser(newPage, testUser.email, testUser.password);

      // Verify todo persists
      await expect(newPage.locator(`[data-testid="todo-item"]:has-text("${testTodos[0].title}")`)).toBeVisible();
    });

    test('should handle offline scenarios', async ({ page }) => {
      await registerUser(page, testUser);
      await createTodo(page, testTodos[0]);

      // Go offline
      await page.context().setOffline(true);

      // Try to create todo while offline
      await page.click('[data-testid="create-todo-button"]');
      await page.fill('[data-testid="todo-title-input"]', 'Offline Todo');
      await page.click('[data-testid="submit-todo-button"]');

      // Verify offline indicator
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
      await expect(page.locator('[data-testid="offline-message"]')).toContainText('You are offline');

      // Verify todo is queued for sync
      await expect(page.locator('[data-testid="pending-sync-indicator"]')).toBeVisible();

      // Go back online
      await page.context().setOffline(false);

      // Verify sync occurs
      await expect(page.locator('[data-testid="sync-success-message"]')).toContainText('Synced successfully');
      await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();
    });
  });
});
