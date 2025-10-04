import { test, expect, Page } from '@playwright/test';

const TEST_CONFIG = {
  baseUrl: process.env.WEB_APP_URL || 'http://localhost:3000',
};

test.describe('Web Parity E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CONFIG.baseUrl);
  });

  test('should create, edit, and filter a todo', async ({ page }) => {
    // Create a new todo
    await page.click('button:has-text("New Todo")');
    await page.fill('input[label="Title"]', 'Test Todo');
    await page.fill('textarea[label="Description"]', 'This is a test todo.');
    await page.selectOption('select[aria-label="Priority"]', 'high');
    await page.click('button:has-text("Save")');

    // Verify the new todo is in the list
    await expect(page.locator('text=Test Todo')).toBeVisible();

    // Edit the todo
    await page.click('button[aria-label="Edit todo"]');
    await page.fill('input[label="Title"]', 'Updated Test Todo');
    await page.click('button:has-text("Save")');

    // Verify the todo was updated
    await expect(page.locator('text=Updated Test Todo')).toBeVisible();

    // Filter by priority
    await page.click('button:has-text("High")');
    await expect(page.locator('text=Updated Test Todo')).toBeVisible();

    // Filter by status
    await page.click('button:has-text("Completed")');
    await expect(page.locator('text=Updated Test Todo')).not.toBeVisible();
  });

  test('should perform bulk actions and sync to blockchain', async ({ page }) => {
    // Create a couple of todos
    await page.click('button:has-text("New Todo")');
    await page.fill('input[label="Title"]', 'Todo 1');
    await page.click('button:has-text("Save")');
    await page.click('button:has-text("New Todo")');
    await page.fill('input[label="Title"]', 'Todo 2');
    await page.click('button:has-text("Save")');

    // Mark all as done
    await page.click('button:has-text("Mark all done")');
    await expect(page.locator('text=Todo 1').locator('..').locator('input[type="checkbox"]')).toBeChecked();
    await expect(page.locator('text=Todo 2').locator('..').locator('input[type="checkbox"]')).toBeChecked();

    // Clear completed
    await page.click('button:has-text("Clear completed")');
    await expect(page.locator('text=Todo 1')).not.toBeVisible();
    await expect(page.locator('text=Todo 2')).not.toBeVisible();

    // Create a new todo to sync
    await page.click('button:has-text("New Todo")');
    await page.fill('input[label="Title"]', 'Sync Me');
    await page.click('button:has-text("Save")');

    // Sync to blockchain
    await page.click('button[aria-label="Sync to blockchain"]');
    await expect(page.locator('text=Syncing to blockchain...')).toBeVisible();
  });
});
