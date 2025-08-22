const { getStoryContext } = require('@storybook/test-runner');

module.exports = {
  setup() {
    // Global setup for visual regression testing
  },
  async preRender(page, context) {
    // Set up theme data attribute before rendering
    const storyContext = await getStoryContext(page, context);
    const theme = storyContext.parameters?.theme || 'light';

    await page.evaluate(theme => {
      document.documentElement.setAttribute('data-theme', theme);
    }, theme);

    // Wait for theme transition to complete
    await page.waitForTimeout(300);
  },
  async postRender(page, context) {
    // Additional visual testing setup
    const storyContext = await getStoryContext(page, context);

    // Skip visual regression for certain stories
    if (storyContext.parameters?.skipVisualTest) {
      return;
    }

    // Wait for animations to complete
    if (storyContext.parameters?.waitForAnimations) {
      await page.waitForTimeout(1000);
    }

    // Check for accessibility violations
    if (storyContext.parameters?.a11y !== false) {
      await page.evaluate(() => {
        // Basic accessibility checks
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        focusableElements.forEach(element => {
          const style = window.getComputedStyle(element);
          if (style.outline === 'none' && !style.boxShadow.includes('focus')) {
            console.warn('Element may lack focus indicator:', element);
          }
        });
      });
    }
  },
  tags: {
    include: ['test'],
    exclude: ['skip-test'],
    skip: ['skip-visual'],
  },
};
