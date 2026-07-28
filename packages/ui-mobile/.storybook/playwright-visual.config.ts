import { defineConfig, devices } from '@playwright/test';
import { VISUAL_TEST_SCENARIOS } from './visual-tests';

const requestedPlatform = process.env.PLATFORM;
const requestedTheme = process.env.THEME;
const selectedScenarios = VISUAL_TEST_SCENARIOS.filter(
  scenario =>
    (!requestedPlatform || scenario.platform === requestedPlatform) &&
    (!requestedTheme || scenario.theme === requestedTheme),
);

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
  projects: selectedScenarios.map(scenario => ({
    name: scenario.name,
    use: {
      ...devices['Desktop Chrome'],
      viewport: scenario.viewport,
      userAgent: scenario.userAgent,
    },
    testMatch: /.*\.visual\.spec\.ts/,
  })),
  webServer: process.env.CI
    ? {
        command: 'pnpm exec serve storybook-static -p 6006 -L',
        url: 'http://localhost:6006',
        reuseExistingServer: true,
        timeout: 120 * 1000,
      }
    : {
        command: 'npm run storybook',
        url: 'http://localhost:6006',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
