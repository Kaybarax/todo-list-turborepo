import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../tests/accessibility',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'accessibility-report' }],
    ['json', { outputFile: 'accessibility-results.json' }],
    ['junit', { outputFile: 'accessibility-results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'accessibility-mobile',
      use: {
        ...devices['iPhone 12'],
      },
      testMatch: /.*\.a11y\.spec\.ts/,
    },
    {
      name: 'accessibility-tablet',
      use: {
        ...devices['iPad Pro'],
      },
      testMatch: /.*\.a11y\.spec\.ts/,
    },
    {
      name: 'accessibility-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: /.*\.a11y\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
