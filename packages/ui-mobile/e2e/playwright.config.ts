import { defineConfig, devices } from '@playwright/test';

// Phase 6 (P6-1) base Playwright config for Storybook-driven component smoke tests.
const BASE_URL = process.env.STORYBOOK_BASE_URL || 'http://localhost:6006';

export default defineConfig({
  testDir: __dirname,
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
