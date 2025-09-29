import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const shouldStartServer = process.env.SKIP_WEBSERVER !== '1';

export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: { timeout: 60_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:8083',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  outputDir: 'test-results/',
  webServer: shouldStartServer
    ? {
        command: 'pnpm run web',
        url: 'http://localhost:8083',
        cwd: path.resolve(__dirname),
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          BROWSER: 'none',
          EXPO_NO_TELEMETRY: '1',
          EXPO_NO_INTERACTIVE: '1',
          CI: '1',
        },
      }
    : undefined,
});
