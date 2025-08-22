import { defineConfig, devices } from '@playwright/test';
import { VISUAL_TEST_SCENARIOS } from './visual-tests';

export default defineConfig({
  testDir: '../tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'visual-report' }],
    ['json', { outputFile: 'visual-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: VISUAL_TEST_SCENARIOS.map(scenario => ({
    name: scenario.name,
    use: {
      ...devices['Desktop Chrome'],
      viewport: scenario.viewport,
      userAgent: scenario.userAgent,
    },
    testMatch: /.*\.visual\.spec\.ts/,
  })),
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
