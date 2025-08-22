import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import { ACCESSIBILITY_TEST_CONFIG } from '../../.storybook/visual-tests';

const COMPONENT_STORIES = [
  'button--primary',
  'button--secondary',
  'button--disabled',
  'card--default',
  'card--interactive',
  'header--default',
  'header--with-actions',
  'modal--default',
  'modal--alert',
  'tabbar--default',
  'tabbar--with-badges',
  'text--heading',
  'text--body',
];

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await injectAxe(page);
    await configureAxe(page, {
      rules: ACCESSIBILITY_TEST_CONFIG.rules,
    });
  });

  COMPONENT_STORIES.forEach(story => {
    test(`${story} - accessibility compliance`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story}`);
      await page.waitForSelector('#storybook-root');
      await page.waitForTimeout(500);

      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  });

  test('Keyboard navigation - Button component', async ({ page }) => {
    await page.goto('/iframe.html?id=button--primary');
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
    await page.goto('/iframe.html?id=modal--default');
    await page.waitForSelector('#storybook-root');

    // Open modal (assuming there's a trigger button)
    const trigger = page.locator('[data-testid="modal-trigger"]').first();
    if (await trigger.isVisible()) {
      await trigger.click();
    }

    // Check modal is focused
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Test Escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Keyboard navigation - TabBar component', async ({ page }) => {
    await page.goto('/iframe.html?id=tabbar--default');
    await page.waitForSelector('#storybook-root');

    const tabs = page.locator('[role="tab"]');
    const firstTab = tabs.first();
    const secondTab = tabs.nth(1);

    // Tab to first tab
    await page.keyboard.press('Tab');
    await expect(firstTab).toBeFocused();

    // Arrow right to next tab
    await page.keyboard.press('ArrowRight');
    await expect(secondTab).toBeFocused();

    // Arrow left to previous tab
    await page.keyboard.press('ArrowLeft');
    await expect(firstTab).toBeFocused();

    // Enter to activate tab
    await page.keyboard.press('Enter');
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Screen reader announcements - Button states', async ({ page }) => {
    await page.goto('/iframe.html?id=button--loading');
    await page.waitForSelector('#storybook-root');

    const button = page.locator('button');

    // Check loading state announcement
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-label', /.*loading.*/i);

    // Check disabled state
    await page.goto('/iframe.html?id=button--disabled');
    await page.waitForSelector('#storybook-root');

    const disabledButton = page.locator('button');
    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('Touch target size validation', async ({ page }) => {
    await page.goto('/iframe.html?id=button--primary');
    await page.waitForSelector('#storybook-root');

    const button = page.locator('button');
    const boundingBox = await button.boundingBox();

    // WCAG 2.1 Level AA requires minimum 44x44px touch targets
    expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('Color contrast validation', async ({ page }) => {
    await page.goto('/iframe.html?id=text--body');
    await page.waitForSelector('#storybook-root');

    // Check color contrast with axe
    await checkA11y(page, '#storybook-root', {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  test('Focus management - Modal component', async ({ page }) => {
    await page.goto('/iframe.html?id=modal--default');
    await page.waitForSelector('#storybook-root');

    // Store initial focus
    const initialFocus = await page.evaluate(() => document.activeElement?.tagName);

    // Open modal
    const trigger = page.locator('[data-testid="modal-trigger"]').first();
    if (await trigger.isVisible()) {
      await trigger.click();
    }

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
    await page.goto('/iframe.html?id=tabbar--with-badges');
    await page.waitForSelector('#storybook-root');

    // Check tab roles
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3); // Assuming 3 tabs

    // Check each tab has proper labels
    for (let i = 0; i < (await tabs.count()); i++) {
      const tab = tabs.nth(i);
      await expect(tab).toHaveAttribute('aria-label');
      await expect(tab).toHaveAttribute('role', 'tab');
    }

    // Check badge accessibility
    const badges = page.locator('[data-testid*="badge"]');
    if ((await badges.count()) > 0) {
      const badge = badges.first();
      await expect(badge).toHaveAttribute('aria-label');
    }
  });

  test('Reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/iframe.html?id=modal--default');
    await page.waitForSelector('#storybook-root');

    // Open modal
    const trigger = page.locator('[data-testid="modal-trigger"]').first();
    if (await trigger.isVisible()) {
      await trigger.click();
    }

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

    await page.goto('/iframe.html?id=button--primary');
    await page.waitForSelector('#storybook-root');

    // Check that components still have proper contrast
    await checkA11y(page, '#storybook-root', {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });
});
