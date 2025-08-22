import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

const config: TestRunnerConfig = {
  setup() {
    // Global setup for visual regression testing
    console.log('Setting up visual regression testing...');
  },
  async preVisit(page, context) {
    // Inject axe-core for accessibility testing
    await injectAxe(page);

    // Configure axe for mobile-specific rules
    await configureAxe(page, {
      rules: [
        // Enable mobile-specific accessibility rules
        { id: 'color-contrast', enabled: true },
        { id: 'touch-target', enabled: true },
        { id: 'focus-visible', enabled: true },
        { id: 'keyboard-navigation', enabled: true },
      ],
    });

    // Set viewport for mobile testing
    await page.setViewportSize({ width: 375, height: 812 });

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');

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
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // Skip accessibility tests for certain stories
    const skipA11yTest = storyContext.parameters?.a11y?.disable;

    if (!skipA11yTest) {
      // Run accessibility tests
      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
        axeOptions: {
          rules: {
            // Customize rules for mobile components
            'color-contrast': { enabled: true },
            'touch-target': { enabled: true },
            'focus-visible': { enabled: true },
          },
        },
      });
    }

    // Take screenshot for visual regression testing
    const screenshotName = `${context.id}--${storyContext.name}`;
    await page.screenshot({
      path: `screenshots/${screenshotName}.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 812 },
    });

    // Test different viewport sizes for responsive components
    if (storyContext.parameters?.responsive?.test) {
      const viewports = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 812, name: 'mobile-large' },
        { width: 768, height: 1024, name: 'tablet' },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(500); // Allow for responsive changes

        await page.screenshot({
          path: `screenshots/${screenshotName}--${viewport.name}.png`,
          fullPage: false,
          clip: { x: 0, y: 0, width: viewport.width, height: viewport.height },
        });
      }
    }

    // Test theme variations
    if (storyContext.parameters?.themes?.test) {
      const themes = ['light', 'dark'];

      for (const theme of themes) {
        // Switch theme via global toolbar
        await page.evaluate(themeName => {
          const iframe = document.querySelector('#storybook-preview-iframe') as HTMLIFrameElement;
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: 'SET_GLOBALS',
                globals: { theme: themeName },
              },
              '*',
            );
          }
        }, theme);

        await page.waitForTimeout(500); // Allow theme to apply

        await page.screenshot({
          path: `screenshots/${screenshotName}--${theme}-theme.png`,
          fullPage: false,
          clip: { x: 0, y: 0, width: 375, height: 812 },
        });
      }
    }
  },
  tags: {
    include: ['test'],
    exclude: ['skip-test'],
    skip: ['broken'],
  },
};

export default config;
