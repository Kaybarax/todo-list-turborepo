import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../tests/performance',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'performance-report' }],
    ['json', { outputFile: 'performance-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'performance-mobile',
      use: {
        ...devices['iPhone 12'],
      },
      testMatch: /.*\.perf\.spec\.ts/,
    },
    {
      name: 'performance-tablet',
      use: {
        ...devices['iPad Pro'],
      },
      testMatch: /.*\.perf\.spec\.ts/,
    },
    {
      name: 'performance-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: /.*\.perf\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
