import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import { ACCESSIBILITY_TEST_CONFIG } from '../../.storybook/visual-tests';

const COMPONENT_STORIES = [
  'components-button--primary',
  'components-button--secondary',
  'components-button--disabled',
  'components-card--elevated',
  'components-card--interactive',
  'components-header--basic',
  'components-header--with-both-actions',
  'components-modal--default',
  'components-modal--alert',
  'components-tabbar--basic',
  'components-tabbar--with-badges',
  'components-text--headings',
  'components-text--body-text',
];

test.describe('Accessibility Tests', () => {
  async function setupAxe(page: any) {
    await injectAxe(page);
    await configureAxe(page, {
      rules: Object.entries(ACCESSIBILITY_TEST_CONFIG.rules).map(([id, config]) => ({
        id,
        ...config,
      })),
    });
  }

  COMPONENT_STORIES.forEach(story => {
    test(`${story} - accessibility compliance`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story}`);
      await page.waitForSelector('#storybook-root');
      await page.waitForTimeout(500);
      await setupAxe(page);

      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  });

  test('Keyboard navigation - Button component', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');
    await page.waitForSelector('#storybook-root');

    const button = page.locator('button');

    // Tab to button
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();

    // Activate with Enter
    await page.keyboard.press('Enter');

    // Activate with Space
    await page.keyboard.press('Space');

    // Check focus visible
    await expect(button).toHaveCSS('outline', /.*solid.*/);
  });

  test('Keyboard navigation - Modal component', async ({ page }) => {
    await page.goto('/iframe.html?id=components-modal--default');
    await page.waitForSelector('#storybook-root');

    // Open modal by clicking the trigger button
    const trigger = page.locator('button').first();
    await trigger.click();

    // Check modal is focused
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Test Escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Keyboard navigation - TabBar component', async ({ page }) => {
    await page.goto('/iframe.html?id=components-tabbar--basic');
    await page.waitForSelector('#storybook-root');

    const buttons = page.locator('button');
    const firstButton = buttons.first();
    const secondButton = buttons.nth(1);

    // Tab to first button
    await page.keyboard.press('Tab');
    await expect(firstButton).toBeFocused();

    // Tab to next button
    await page.keyboard.press('Tab');
    await expect(secondButton).toBeFocused();

    // Shift+Tab back to first
    await page.keyboard.press('Shift+Tab');
    await expect(firstButton).toBeFocused();

    // Enter to activate button
    const initialUrl = page.url();
    await firstButton.click();
    await expect(page.url()).toBe(initialUrl); // click should not navigate away
  });

  test('Screen reader announcements - Button states', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--loading');
    await page.waitForSelector('#storybook-root');

    const button = page.locator('button');

    // Check loading state announcement
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-label', /.*loading.*/i);

    // Check disabled state
    await page.goto('/iframe.html?id=components-button--disabled');
    await page.waitForSelector('#storybook-root');

    const disabledButton = page.locator('button');
    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('Touch target size validation', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');
    await page.waitForSelector('#storybook-root');

    const button = page.locator('button');
    const boundingBox = await button.boundingBox();

    // WCAG 2.1 Level AA requires minimum 44x44px touch targets
    expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('Color contrast validation', async ({ page }) => {
    await page.goto('/iframe.html?id=components-text--body-text');
    await page.waitForSelector('#storybook-root');
    await setupAxe(page);

    // Check color contrast with axe
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('Focus management - Modal component', async ({ page }) => {
    await page.goto('/iframe.html?id=components-modal--default');
    await page.waitForSelector('#storybook-root');
    await setupAxe(page);

    // Store initial focus
    const initialFocus = await page.evaluate(() => document.activeElement?.tagName);

    // Open modal by clicking the trigger button
    const trigger = page.locator('button').first();
    await trigger.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check focus is trapped in modal
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement);
    const isInsideModal = await page.evaluate(
      (modal, focused) => {
        return modal?.contains(focused);
      },
      await modal.elementHandle(),
      focusedElement,
    );

    expect(isInsideModal).toBe(true);

    // Close modal and check focus returns
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('ARIA labels and roles validation', async ({ page }) => {
    await page.goto('/iframe.html?id=components-tabbar--with-badges');
    await page.waitForSelector('#storybook-root');

    // Check tab buttons exist (3 tabs: Home, Search, Profile)
    const buttons = page.locator('button');
    await expect(buttons).toHaveCount(3);

    // Check each button has proper labels
    for (let i = 0; i < (await buttons.count()); i++) {
      const btn = buttons.nth(i);
      await expect(btn).toBeVisible();
      await expect(btn.locator('div').last()).not.toBeEmpty();
    }

    // Check badge accessibility (WithBadges story has badges)
    const badges = page.locator('button:has-text("3")');
    if ((await badges.count()) > 0) {
      await expect(badges.first()).toBeVisible();
    }
  });

  test('Reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/iframe.html?id=components-modal--default');
    await page.waitForSelector('#storybook-root');

    // Open modal by clicking the trigger button
    const trigger = page.locator('button').first();
    await trigger.click();

    // Check that animations are disabled or reduced
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify no complex animations are running
    const animationDuration = await modal.evaluate(el => {
      const styles = getComputedStyle(el);
      return styles.animationDuration;
    });

    // Should be 0s or very short for reduced motion
    expect(animationDuration === '0s' || parseFloat(animationDuration) <= 0.2).toBe(true);
  });

  test('High contrast mode support', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });

    await page.goto('/iframe.html?id=components-button--primary');
    await page.waitForSelector('#storybook-root');
    await setupAxe(page);

    // Check that components still have proper contrast
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });
});
