import { device, expect, element, by, waitFor } from 'detox';

// Test data
const testUser = {
  email: 'mobile-e2e@example.com',
  password: 'password123',
  name: 'Mobile E2E User',
};

const testTodos = [
  {
    title: 'Mobile Todo 1',
    description: 'First mobile todo for testing',
    priority: 'high',
    dueDate: '2024-12-31',
    tags: 'mobile, testing',
  },
  {
    title: 'Mobile Todo 2',
    description: 'Second mobile todo for testing',
    priority: 'medium',
    dueDate: '2024-11-30',
    tags: 'mobile, work',
  },
  {
    title: 'Mobile Todo 3',
    description: 'Third mobile todo for testing',
    priority: 'low',
    dueDate: '2024-10-15',
    tags: 'mobile, personal',
  },
];

// Helper functions
const loginUser = async (email, password) => {
  await element(by.id('email-input')).typeText(email);
  await element(by.id('password-input')).typeText(password);
  await element(by.id('login-button')).tap();
  await waitFor(element(by.id('todo-list-screen'))).toBeVisible().withTimeout(5000);
};

const registerUser = async (user) => {
  await element(by.id('register-tab')).tap();
  await element(by.id('name-input')).typeText(user.name);
  await element(by.id('email-input')).typeText(user.email);
  await element(by.id('password-input')).typeText(user.password);
  await element(by.id('register-button')).tap();
  await waitFor(element(by.id('todo-list-screen'))).toBeVisible().withTimeout(5000);
};

const createTodo = async (todo) => {
  await element(by.id('add-todo-fab')).tap();
  await element(by.id('todo-title-input')).typeText(todo.title);
  await element(by.id('todo-description-input')).typeText(todo.description);
  
  // Select priority
  await element(by.id('priority-picker')).tap();
  await element(by.text(todo.priority)).tap();
  
  // Set due date
  await element(by.id('due-date-picker')).tap();
  // Note: Date picker interaction would be platform-specific
  await element(by.id('date-picker-confirm')).tap();
  
  // Add tags
  await element(by.id('tags-input')).typeText(todo.tags);
  
  await element(by.id('save-todo-button')).tap();
  await waitFor(element(by.id(`todo-item-${todo.title}`))).toBeVisible().withTimeout(3000);
};

describe('Mobile Todo Management E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Authentication Flow', () => {
    it('should register new user successfully', async () => {
      await registerUser(testUser);
      
      // Verify user is on todo list screen
      await expect(element(by.id('todo-list-screen'))).toBeVisible();
      await expect(element(by.id('welcome-message'))).toHaveText(`Welcome, ${testUser.name}!`);
    });

    it('should login existing user', async () => {
      // First register the user
      await registerUser(testUser);
      
      // Logout
      await element(by.id('user-menu-button')).tap();
      await element(by.id('logout-button')).tap();
      
      // Login again
      await element(by.id('login-tab')).tap();
      await loginUser(testUser.email, testUser.password);
      
      // Verify successful login
      await expect(element(by.id('todo-list-screen'))).toBeVisible();
      await expect(element(by.id('welcome-message'))).toHaveText(`Welcome, ${testUser.name}!`);
    });

    it('should show error for invalid credentials', async () => {
      await element(by.id('email-input')).typeText('invalid@example.com');
      await element(by.id('password-input')).typeText('wrongpassword');
      await element(by.id('login-button')).tap();
      
      await expect(element(by.id('error-message'))).toHaveText('Invalid credentials');
      await expect(element(by.id('login-screen'))).toBeVisible();
    });

    it('should handle biometric authentication', async () => {
      await registerUser(testUser);
      
      // Enable biometric authentication
      await element(by.id('user-menu-button')).tap();
      await element(by.id('settings-button')).tap();
      await element(by.id('biometric-toggle')).tap();
      
      // Logout and try biometric login
      await element(by.id('back-button')).tap();
      await element(by.id('logout-button')).tap();
      
      await element(by.id('biometric-login-button')).tap();
      
      // Simulate biometric success (would require device-specific setup)
      await expect(element(by.id('todo-list-screen'))).toBeVisible();
    });
  });

  describe('Todo CRUD Operations', () => {
    beforeEach(async () => {
      await registerUser(testUser);
    });

    it('should create a new todo', async () => {
      const todo = testTodos[0];
      await createTodo(todo);
      
      // Verify todo appears in the list
      const todoItem = element(by.id(`todo-item-${todo.title}`));
      await expect(todoItem).toBeVisible();
      await expect(element(by.id('todo-title')).withAncestor(todoItem)).toHaveText(todo.title);
      await expect(element(by.id('todo-description')).withAncestor(todoItem)).toHaveText(todo.description);
      await expect(element(by.id('todo-priority-badge')).withAncestor(todoItem)).toHaveText(todo.priority);
    });

    it('should edit an existing todo', async () => {
      const todo = testTodos[0];
      await createTodo(todo);
      
      // Tap on todo to open details
      await element(by.id(`todo-item-${todo.title}`)).tap();
      await element(by.id('edit-todo-button')).tap();
      
      // Update todo details
      const updatedTitle = 'Updated Mobile Todo 1';
      await element(by.id('todo-title-input')).clearText();
      await element(by.id('todo-title-input')).typeText(updatedTitle);
      
      await element(by.id('save-todo-button')).tap();
      
      // Verify updated todo
      await expect(element(by.id(`todo-item-${updatedTitle}`))).toBeVisible();
      await expect(element(by.id('todo-title')).withAncestor(by.id(`todo-item-${updatedTitle}`))).toHaveText(updatedTitle);
    });

    it('should toggle todo completion with swipe gesture', async () => {
      const todo = testTodos[0];
      await createTodo(todo);
      
      const todoItem = element(by.id(`todo-item-${todo.title}`));
      
      // Swipe right to complete
      await todoItem.swipe('right');
      
      // Verify todo is marked as completed
      await expect(element(by.id('completed-indicator')).withAncestor(todoItem)).toBeVisible();
      await expect(element(by.id('todo-title')).withAncestor(todoItem)).toHaveText(todo.title);
      
      // Swipe right again to uncomplete
      await todoItem.swipe('right');
      
      // Verify todo is marked as active
      await expect(element(by.id('completed-indicator')).withAncestor(todoItem)).not.toBeVisible();
    });

    it('should delete todo with swipe gesture', async () => {
      const todo = testTodos[0];
      await createTodo(todo);
      
      const todoItem = element(by.id(`todo-item-${todo.title}`));
      
      // Swipe left to reveal delete action
      await todoItem.swipe('left');
      await element(by.id('delete-action-button')).tap();
      
      // Confirm deletion
      await element(by.id('confirm-delete-button')).tap();
      
      // Verify todo is removed
      await expect(todoItem).not.toBeVisible();
    });

    it('should handle long press for context menu', async () => {
      const todo = testTodos[0];
      await createTodo(todo);
      
      const todoItem = element(by.id(`todo-item-${todo.title}`));
      
      // Long press to open context menu
      await todoItem.longPress();
      
      // Verify context menu appears
      await expect(element(by.id('context-menu'))).toBeVisible();
      await expect(element(by.id('edit-action'))).toBeVisible();
      await expect(element(by.id('delete-action'))).toBeVisible();
      await expect(element(by.id('share-action'))).toBeVisible();
      
      // Test edit action
      await element(by.id('edit-action')).tap();
      await expect(element(by.id('todo-form-screen'))).toBeVisible();
    });

    it('should validate todo creation form', async () => {
      await element(by.id('add-todo-fab')).tap();
      
      // Try to save without title
      await element(by.id('save-todo-button')).tap();
      
      // Verify validation error
      await expect(element(by.id('title-error'))).toHaveText('Title is required');
      
      // Fill title and save
      await element(by.id('todo-title-input')).typeText('Valid Todo');
      await element(by.id('save-todo-button')).tap();
      
      // Verify todo is created
      await expect(element(by.id('todo-item-Valid Todo'))).toBeVisible();
    });
  });

  describe('Todo List Management', () => {
    beforeEach(async () => {
      await registerUser(testUser);
      
      // Create multiple todos for testing
      for (const todo of testTodos) {
        await createTodo(todo);
      }
    });

    it('should filter todos by completion status', async () => {
      // Complete first todo
      await element(by.id(`todo-item-${testTodos[0].title}`)).swipe('right');
      
      // Open filter menu
      await element(by.id('filter-button')).tap();
      
      // Filter by completed
      await element(by.id('filter-completed')).tap();
      
      // Verify only completed todos are shown
      await expect(element(by.id(`todo-item-${testTodos[0].title}`))).toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[1].title}`))).not.toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[2].title}`))).not.toBeVisible();
      
      // Filter by active
      await element(by.id('filter-button')).tap();
      await element(by.id('filter-active')).tap();
      
      // Verify only active todos are shown
      await expect(element(by.id(`todo-item-${testTodos[0].title}`))).not.toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[1].title}`))).toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[2].title}`))).toBeVisible();
    });

    it('should search todos', async () => {
      // Open search
      await element(by.id('search-button')).tap();
      
      // Search for specific todo
      await element(by.id('search-input')).typeText('Mobile Todo 1');
      
      // Verify search results
      await expect(element(by.id(`todo-item-${testTodos[0].title}`))).toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[1].title}`))).not.toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[2].title}`))).not.toBeVisible();
      
      // Clear search
      await element(by.id('clear-search-button')).tap();
      
      // Verify all todos are shown again
      await expect(element(by.id(`todo-item-${testTodos[0].title}`))).toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[1].title}`))).toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[2].title}`))).toBeVisible();
    });

    it('should sort todos by priority', async () => {
      // Open sort menu
      await element(by.id('sort-button')).tap();
      await element(by.id('sort-by-priority')).tap();
      
      // Verify todos are sorted by priority (high, medium, low)
      const todoList = element(by.id('todo-list'));
      await expect(element(by.id(`todo-item-${testTodos[0].title}`)).withAncestor(todoList).atIndex(0)).toBeVisible(); // high
      await expect(element(by.id(`todo-item-${testTodos[1].title}`)).withAncestor(todoList).atIndex(1)).toBeVisible(); // medium
      await expect(element(by.id(`todo-item-${testTodos[2].title}`)).withAncestor(todoList).atIndex(2)).toBeVisible(); // low
    });

    it('should handle pull-to-refresh', async () => {
      // Pull down to refresh
      await element(by.id('todo-list')).swipe('down', 'slow');
      
      // Verify refresh indicator appears
      await expect(element(by.id('refresh-indicator'))).toBeVisible();
      
      // Wait for refresh to complete
      await waitFor(element(by.id('refresh-indicator'))).not.toBeVisible().withTimeout(3000);
      
      // Verify todos are still visible
      await expect(element(by.id(`todo-item-${testTodos[0].title}`))).toBeVisible();
    });

    it('should handle infinite scroll', async () => {
      // Create many todos to test infinite scroll
      for (let i = 4; i <= 20; i++) {
        await createTodo({
          title: `Scroll Todo ${i}`,
          description: `Description ${i}`,
          priority: 'medium',
          dueDate: '2024-12-31',
          tags: 'scroll',
        });
      }
      
      // Scroll to bottom
      await element(by.id('todo-list')).scrollTo('bottom');
      
      // Verify more todos are loaded
      await expect(element(by.id('todo-item-Scroll Todo 20'))).toBeVisible();
    });
  });

  describe('Wallet Integration', () => {
    beforeEach(async () => {
      await registerUser(testUser);
    });

    it('should navigate to wallet screen', async () => {
      await element(by.id('wallet-tab')).tap();
      
      await expect(element(by.id('wallet-screen'))).toBeVisible();
      await expect(element(by.id('connect-wallet-button'))).toBeVisible();
      await expect(element(by.id('wallet-status'))).toHaveText('Not connected');
    });

    it('should show wallet connection options', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      
      // Verify wallet options modal
      await expect(element(by.id('wallet-options-modal'))).toBeVisible();
      await expect(element(by.id('metamask-option'))).toBeVisible();
      await expect(element(by.id('walletconnect-option'))).toBeVisible();
      await expect(element(by.id('phantom-option'))).toBeVisible();
    });

    it('should handle wallet connection flow', async () => {
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      
      // Select MetaMask (mocked)
      await element(by.id('metamask-option')).tap();
      
      // Mock successful connection
      await expect(element(by.id('wallet-status'))).toHaveText('Connected');
      await expect(element(by.id('wallet-address'))).toBeVisible();
      await expect(element(by.id('network-selector'))).toBeVisible();
    });

    it('should create blockchain todo', async () => {
      // Mock wallet connection
      await element(by.id('wallet-tab')).tap();
      await element(by.id('connect-wallet-button')).tap();
      await element(by.id('metamask-option')).tap();
      
      // Create blockchain todo
      await element(by.id('create-blockchain-todo-button')).tap();
      await element(by.id('todo-title-input')).typeText('Blockchain Todo');
      await element(by.id('todo-description-input')).typeText('Stored on blockchain');
      await element(by.id('blockchain-network-picker')).tap();
      await element(by.text('Polygon')).tap();
      await element(by.id('save-blockchain-todo-button')).tap();
      
      // Verify transaction status
      await expect(element(by.id('transaction-status'))).toHaveText('Transaction pending...');
      
      // Wait for confirmation (mocked)
      await waitFor(element(by.id('transaction-confirmed'))).toBeVisible().withTimeout(5000);
      
      // Verify todo appears with blockchain indicator
      await element(by.id('todos-tab')).tap();
      const todoItem = element(by.id('todo-item-Blockchain Todo'));
      await expect(todoItem).toBeVisible();
      await expect(element(by.id('blockchain-indicator')).withAncestor(todoItem)).toBeVisible();
    });
  });

  describe('Offline Functionality', () => {
    beforeEach(async () => {
      await registerUser(testUser);
    });

    it('should work offline', async () => {
      // Create todo while online
      await createTodo(testTodos[0]);
      
      // Simulate going offline
      await device.setURLBlacklist(['*']);
      
      // Verify offline indicator
      await expect(element(by.id('offline-indicator'))).toBeVisible();
      
      // Create todo while offline
      await createTodo({
        title: 'Offline Todo',
        description: 'Created while offline',
        priority: 'medium',
        dueDate: '2024-12-31',
        tags: 'offline',
      });
      
      // Verify todo is created locally
      await expect(element(by.id('todo-item-Offline Todo'))).toBeVisible();
      await expect(element(by.id('sync-pending-indicator'))).toBeVisible();
      
      // Go back online
      await device.setURLBlacklist([]);
      
      // Verify sync occurs
      await waitFor(element(by.id('sync-success-indicator'))).toBeVisible().withTimeout(5000);
      await expect(element(by.id('offline-indicator'))).not.toBeVisible();
    });

    it('should handle sync conflicts', async () => {
      // Create todo
      await createTodo(testTodos[0]);
      
      // Go offline
      await device.setURLBlacklist(['*']);
      
      // Edit todo offline
      await element(by.id(`todo-item-${testTodos[0].title}`)).tap();
      await element(by.id('edit-todo-button')).tap();
      await element(by.id('todo-title-input')).clearText();
      await element(by.id('todo-title-input')).typeText('Offline Edit');
      await element(by.id('save-todo-button')).tap();
      
      // Go back online
      await device.setURLBlacklist([]);
      
      // Verify conflict resolution dialog
      await expect(element(by.id('sync-conflict-dialog'))).toBeVisible();
      await element(by.id('keep-local-changes')).tap();
      
      // Verify local changes are kept
      await expect(element(by.id('todo-item-Offline Edit'))).toBeVisible();
    });
  });

  describe('Push Notifications', () => {
    beforeEach(async () => {
      await registerUser(testUser);
    });

    it('should request notification permissions', async () => {
      // Go to settings
      await element(by.id('user-menu-button')).tap();
      await element(by.id('settings-button')).tap();
      
      // Enable notifications
      await element(by.id('notifications-toggle')).tap();
      
      // Verify permission request (would be platform-specific)
      await expect(element(by.id('notification-permission-granted'))).toBeVisible();
    });

    it('should show notification for due todos', async () => {
      // Create todo with due date today
      const dueTodo = {
        title: 'Due Today',
        description: 'This todo is due today',
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0],
        tags: 'urgent',
      };
      
      await createTodo(dueTodo);
      
      // Simulate notification trigger (would require background processing)
      await device.sendToHome();
      await device.launchApp();
      
      // Verify notification badge
      await expect(element(by.id('notification-badge'))).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      await registerUser(testUser);
      await createTodo(testTodos[0]);
    });

    it('should support screen reader', async () => {
      // Enable accessibility
      await device.setAccessibilityEnabled(true);
      
      // Verify accessibility labels
      const todoItem = element(by.id(`todo-item-${testTodos[0].title}`));
      await expect(todoItem).toHaveAccessibilityLabel(`Todo: ${testTodos[0].title}, ${testTodos[0].description}`);
      
      // Test accessibility actions
      await todoItem.performAccessibilityAction('activate');
      await expect(element(by.id('todo-details-screen'))).toBeVisible();
    });

    it('should support voice control', async () => {
      // Enable voice control
      await device.setVoiceControlEnabled(true);
      
      // Test voice commands (would require platform-specific implementation)
      await device.sendVoiceCommand('Create new todo');
      await expect(element(by.id('todo-form-screen'))).toBeVisible();
      
      await device.sendVoiceCommand('Cancel');
      await expect(element(by.id('todo-list-screen'))).toBeVisible();
    });

    it('should support high contrast mode', async () => {
      // Enable high contrast
      await device.setHighContrastEnabled(true);
      
      // Verify high contrast styles are applied
      const todoItem = element(by.id(`todo-item-${testTodos[0].title}`));
      await expect(todoItem).toHaveAccessibilityTrait('high-contrast');
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await registerUser(testUser);
    });

    it('should handle large todo lists efficiently', async () => {
      // Create many todos
      for (let i = 1; i <= 100; i++) {
        await createTodo({
          title: `Performance Todo ${i}`,
          description: `Description ${i}`,
          priority: 'medium',
          dueDate: '2024-12-31',
          tags: 'performance',
        });
      }
      
      // Measure scroll performance
      const startTime = Date.now();
      await element(by.id('todo-list')).scrollTo('bottom');
      const scrollTime = Date.now() - startTime;
      
      // Verify reasonable performance (less than 2 seconds)
      expect(scrollTime).toBeLessThan(2000);
      
      // Verify last todo is visible
      await expect(element(by.id('todo-item-Performance Todo 100'))).toBeVisible();
    });

    it('should handle rapid user interactions', async () => {
      await createTodo(testTodos[0]);
      
      const todoItem = element(by.id(`todo-item-${testTodos[0].title}`));
      
      // Rapid tap interactions
      for (let i = 0; i < 10; i++) {
        await todoItem.tap();
        await element(by.id('back-button')).tap();
      }
      
      // Verify app remains responsive
      await expect(element(by.id('todo-list-screen'))).toBeVisible();
      await expect(todoItem).toBeVisible();
    });
  });

  describe('Device-Specific Features', () => {
    beforeEach(async () => {
      await registerUser(testUser);
    });

    it('should handle device rotation', async () => {
      await createTodo(testTodos[0]);
      
      // Rotate to landscape
      await device.setOrientation('landscape');
      
      // Verify layout adapts
      await expect(element(by.id('todo-list-landscape'))).toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[0].title}`))).toBeVisible();
      
      // Rotate back to portrait
      await device.setOrientation('portrait');
      
      // Verify layout returns to portrait mode
      await expect(element(by.id('todo-list-portrait'))).toBeVisible();
    });

    it('should handle background/foreground transitions', async () => {
      await createTodo(testTodos[0]);
      
      // Send app to background
      await device.sendToHome();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Bring app back to foreground
      await device.launchApp();
      
      // Verify app state is preserved
      await expect(element(by.id('todo-list-screen'))).toBeVisible();
      await expect(element(by.id(`todo-item-${testTodos[0].title}`))).toBeVisible();
    });

    it('should handle memory warnings', async () => {
      // Create many todos to use memory
      for (let i = 1; i <= 50; i++) {
        await createTodo({
          title: `Memory Todo ${i}`,
          description: `Description ${i}`,
          priority: 'medium',
          dueDate: '2024-12-31',
          tags: 'memory',
        });
      }
      
      // Simulate memory warning
      await device.sendMemoryWarning();
      
      // Verify app handles memory warning gracefully
      await expect(element(by.id('todo-list-screen'))).toBeVisible();
      
      // Verify some todos are still visible (may have been optimized)
      await expect(element(by.id('todo-item-Memory Todo 1'))).toBeVisible();
    });
  });
});