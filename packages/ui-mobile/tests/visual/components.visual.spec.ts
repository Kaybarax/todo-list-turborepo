import { test, expect } from '@playwright/test';
import { VISUAL_TEST_SCENARIOS, VISUAL_DIFF_THRESHOLDS } from '../../.storybook/visual-tests';

const COMPONENT_STORIES = [
  'button--primary',
  'button--secondary',
  'button--ghost',
  'button--loading',
  'button--disabled',
  'card--default',
  'card--elevated',
  'card--interactive',
  'header--default',
  'header--with-actions',
  'header--with-border',
  'modal--default',
  'modal--fullscreen',
  'modal--alert',
  'tabbar--default',
  'tabbar--with-badges',
  'text--heading',
  'text--body',
];

test.describe('Visual Regression Tests', () => {
  COMPONENT_STORIES.forEach(story => {
    test(`${story} - visual comparison`, async ({ page, browserName }) => {
      // Navigate to story
      await page.goto(`/iframe.html?id=${story}`);
      await page.waitForSelector('#storybook-root');

      // Wait for component to render
      await page.waitForTimeout(1000);

      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `,
      });

      // Take screenshot and compare
      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story}-${browserName}.png`, {
        threshold: VISUAL_DIFF_THRESHOLDS.pixel.acceptable,
        animations: 'disabled',
      });
    });
  });

  test('Theme switching visual comparison', async ({ page }) => {
    const story = 'button--primary';

    // Test light theme
    await page.goto(`/iframe.html?id=${story}&globals=theme:light`);
    await page.waitForSelector('#storybook-root');
    await page.waitForTimeout(500);

    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story}-light-theme.png`, {
      threshold: VISUAL_DIFF_THRESHOLDS.pixel.acceptable,
    });

    // Test dark theme
    await page.goto(`/iframe.html?id=${story}&globals=theme:dark`);
    await page.waitForSelector('#storybook-root');
    await page.waitForTimeout(500);

    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story}-dark-theme.png`, {
      threshold: VISUAL_DIFF_THRESHOLDS.pixel.acceptable,
    });
  });

  test('Responsive breakpoints visual comparison', async ({ page }) => {
    const story = 'card--default';
    const breakpoints = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 375, height: 812, name: 'mobile-large' },
      { width: 768, height: 1024, name: 'tablet' },
    ];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height,
      });

      await page.goto(`/iframe.html?id=${story}`);
      await page.waitForSelector('#storybook-root');
      await page.waitForTimeout(500);

      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story}-${breakpoint.name}.png`, {
        threshold: VISUAL_DIFF_THRESHOLDS.pixel.acceptable,
      });
    }
  });

  test('Interactive states visual comparison', async ({ page }) => {
    await page.goto('/iframe.html?id=button--primary');
    await page.waitForSelector('#storybook-root');

    const button = page.locator('button');

    // Default state
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-default-state.png');

    // Hover state
    await button.hover();
    await page.waitForTimeout(200);
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-hover-state.png');

    // Focus state
    await button.focus();
    await page.waitForTimeout(200);
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-focus-state.png');

    // Active state
    await button.dispatchEvent('mousedown');
    await page.waitForTimeout(200);
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-active-state.png');
  });

  test('Component variants visual comparison', async ({ page }) => {
    const variants = [
      { story: 'button--primary', name: 'primary' },
      { story: 'button--secondary', name: 'secondary' },
      { story: 'button--ghost', name: 'ghost' },
    ];

    for (const variant of variants) {
      await page.goto(`/iframe.html?id=${variant.story}`);
      await page.waitForSelector('#storybook-root');
      await page.waitForTimeout(500);

      await expect(page.locator('#storybook-root')).toHaveScreenshot(`button-variant-${variant.name}.png`, {
        threshold: VISUAL_DIFF_THRESHOLDS.pixel.acceptable,
      });
    }
  });

  test('Loading states visual comparison', async ({ page }) => {
    await page.goto('/iframe.html?id=button--loading');
    await page.waitForSelector('#storybook-root');

    // Wait for loading animation to stabilize
    await page.waitForTimeout(1000);

    // Disable animations for consistent screenshot
    await page.addStyleTag({
      content: `
        * { animation-play-state: paused !important; }
      `,
    });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-loading-state.png', {
      threshold: VISUAL_DIFF_THRESHOLDS.pixel.acceptable,
    });
  });

  test('Error states visual comparison', async ({ page }) => {
    // Test modal with error content
    await page.goto('/iframe.html?id=modal--alert');
    await page.waitForSelector('#storybook-root');
    await page.waitForTimeout(500);

    await expect(page.locator('#storybook-root')).toHaveScreenshot('modal-alert-state.png', {
      threshold: VISUAL_DIFF_THRESHOLDS.pixel.acceptable,
    });
  });
});
