import { test, expect } from '@playwright/test';

// Basic E2E smoke for Expo Web build of the mobile app
// Assumes Expo web server runs on http://localhost:8083

test.describe('Mobile Web smoke', () => {
  test('home renders and navigates to Todos and Wallet', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Debug: log current URL and a snippet of the HTML
    // eslint-disable-next-line no-console
    console.log('Loaded URL:', page.url());
    await page.waitForTimeout(2000);
    const html = await page.content();
    // eslint-disable-next-line no-console
    console.log('HTML snippet:', html.slice(0, 500));
    // Ensure Expo Web root mounted
    // Wait for our app's home title testID to be present to ensure React tree is mounted
    await page.getByTestId('home-title').waitFor({ state: 'visible', timeout: 60000 });

    // Home should show welcome title via testID
    await expect(page.getByTestId('home-title')).toBeVisible();

    // Navigate to Todos via the button/link
    await page.getByTestId('nav-todos').click();
    await expect(page).toHaveURL(/\/todos$/);

    // Verify Todos screen elements (title testID exists even if visually hidden)
    await page.getByTestId('todos-title').waitFor({ state: 'attached', timeout: 60000 });

    // Go back home using browser back
    await page.goBack();

    // Navigate to Wallet
    await page.getByTestId('nav-wallet').click();
    await expect(page).toHaveURL(/\/wallet$/);

    // Wallet screen title
    await page.getByTestId('wallet-title').waitFor({ state: 'attached', timeout: 60000 });
  });
});
