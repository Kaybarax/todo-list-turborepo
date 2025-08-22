import { test, expect } from '@playwright/test';
import { PerformanceTester, PERFORMANCE_BUDGETS } from '../../.storybook/performance-tests';

const COMPONENT_STORIES = [
  { story: 'button--primary', component: 'button' },
  { story: 'card--default', component: 'card' },
  { story: 'header--default', component: 'header' },
  { story: 'modal--default', component: 'modal' },
  { story: 'tabbar--default', component: 'tabbar' },
];

test.describe('Performance Tests', () => {
  let performanceTester: PerformanceTester;

  test.beforeEach(async ({ page }) => {
    performanceTester = new PerformanceTester(page);
  });

  COMPONENT_STORIES.forEach(({ story, component }) => {
    test(`${story} - rendering performance`, async ({ page }) => {
      const metrics = await performanceTester.measureComponentPerformance(story);

      // Check render time budget
      const budget = PERFORMANCE_BUDGETS.renderTime[component as keyof typeof PERFORMANCE_BUDGETS.renderTime];
      expect(metrics.renderTime).toBeLessThanOrEqual(budget);

      // Check memory usage budget
      const memoryBudget = PERFORMANCE_BUDGETS.memoryUsage[component as keyof typeof PERFORMANCE_BUDGETS.memoryUsage];
      expect(metrics.memoryUsage).toBeLessThanOrEqual(memoryBudget);

      // Check paint timing
      expect(metrics.paintTiming.firstContentfulPaint).toBeLessThanOrEqual(1000); // 1s max
      expect(metrics.paintTiming.largestContentfulPaint).toBeLessThanOrEqual(2500); // 2.5s max

      // Log metrics for analysis
      console.log(`Performance metrics for ${story}:`, {
        renderTime: `${metrics.renderTime.toFixed(2)}ms`,
        memoryUsage: `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
        firstContentfulPaint: `${metrics.paintTiming.firstContentfulPaint.toFixed(2)}ms`,
        largestContentfulPaint: `${metrics.paintTiming.largestContentfulPaint.toFixed(2)}ms`,
      });
    });
  });

  test('Button variants performance comparison', async ({ page }) => {
    const variants = ['secondary', 'ghost', 'loading', 'disabled'];
    const results = await performanceTester.benchmarkComponentVariants('button--primary', variants);

    // Check that variants don't significantly degrade performance
    Object.entries(results.comparison).forEach(([variant, comparison]) => {
      expect(comparison.renderTimeDiff).toBeLessThanOrEqual(50); // Max 50% increase
      expect(comparison.memoryUsageDiff).toBeLessThanOrEqual(25); // Max 25% increase
    });

    console.log('Button variants performance comparison:', results.comparison);
  });

  test('Modal interaction performance', async ({ page }) => {
    const interactions = [
      {
        name: 'modal-open',
        action: async () => {
          const trigger = page.locator('[data-testid="modal-trigger"]').first();
          if (await trigger.isVisible()) {
            await trigger.click();
          }
        },
      },
      {
        name: 'modal-close',
        action: async () => {
          await page.keyboard.press('Escape');
        },
      },
    ];

    const results = await performanceTester.measureInteractionPerformance('modal--default', interactions);

    // Check interaction budgets
    Object.entries(results).forEach(([interaction, metrics]) => {
      const budget = PERFORMANCE_BUDGETS.interactions[interaction as keyof typeof PERFORMANCE_BUDGETS.interactions];
      if (budget) {
        expect(metrics.duration).toBeLessThanOrEqual(budget);
      }

      // Check frame rate during interaction
      expect(metrics.fps).toBeGreaterThanOrEqual(PERFORMANCE_BUDGETS.frameRate.minimum);
      expect(metrics.jankScore).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.frameRate.jankThreshold);
    });

    console.log('Modal interaction performance:', results);
  });

  test('TabBar switching performance', async ({ page }) => {
    const interactions = [
      {
        name: 'tab-switch',
        action: async () => {
          const secondTab = page.locator('[role="tab"]').nth(1);
          await secondTab.click();
        },
      },
    ];

    const results = await performanceTester.measureInteractionPerformance('tabbar--default', interactions);

    // Check tab switching performance
    expect(results['tab-switch'].duration).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.interactions.tabSwitch);
    expect(results['tab-switch'].fps).toBeGreaterThanOrEqual(PERFORMANCE_BUDGETS.frameRate.target);

    console.log('TabBar switching performance:', results);
  });

  test('Component bundle size analysis', async ({ page }) => {
    const stories = ['button--primary', 'card--default', 'modal--default'];

    for (const story of stories) {
      const metrics = await performanceTester.measureComponentPerformance(story);
      const component = story.split('--')[0];

      const budget = PERFORMANCE_BUDGETS.bundleSize[component as keyof typeof PERFORMANCE_BUDGETS.bundleSize];
      if (budget) {
        expect(metrics.bundleSize).toBeLessThanOrEqual(budget);
      }

      console.log(`Bundle size for ${story}: ${(metrics.bundleSize / 1024).toFixed(2)}KB`);
    }
  });

  test('Memory leak detection', async ({ page }) => {
    const story = 'modal--default';
    let initialMemory = 0;
    let finalMemory = 0;

    // Measure initial memory
    await page.goto(`/iframe.html?id=${story}`);
    await page.waitForSelector('#storybook-root');

    const initialMetrics = await performanceTester.measureComponentPerformance(story);
    initialMemory = initialMetrics.memoryUsage;

    // Perform multiple modal open/close cycles
    for (let i = 0; i < 10; i++) {
      const trigger = page.locator('[data-testid="modal-trigger"]').first();
      if (await trigger.isVisible()) {
        await trigger.click();
        await page.waitForTimeout(100);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(100);
      }
    }

    // Measure final memory
    const finalMetrics = await performanceTester.measureComponentPerformance(story);
    finalMemory = finalMetrics.memoryUsage;

    // Check for significant memory increase (potential leak)
    const memoryIncrease = ((finalMemory - initialMemory) / initialMemory) * 100;
    expect(memoryIncrease).toBeLessThanOrEqual(20); // Max 20% increase

    console.log(
      `Memory usage: Initial ${(initialMemory / 1024 / 1024).toFixed(2)}MB, Final ${(finalMemory / 1024 / 1024).toFixed(2)}MB, Increase: ${memoryIncrease.toFixed(2)}%`,
    );
  });

  test('Animation performance', async ({ page }) => {
    await page.goto('/iframe.html?id=button--loading');
    await page.waitForSelector('#storybook-root');

    // Measure frame rate during loading animation
    const frameMetrics = await page.evaluate(() => {
      return new Promise(resolve => {
        let frames = 0;
        let jankFrames = 0;
        let lastTime = performance.now();
        const startTime = lastTime;

        const measureFrame = () => {
          const currentTime = performance.now();
          const frameDuration = currentTime - lastTime;

          frames++;
          if (frameDuration > 16.67) {
            // Longer than 60fps
            jankFrames++;
          }

          lastTime = currentTime;

          if (currentTime - startTime < 2000) {
            // Measure for 2 seconds
            requestAnimationFrame(measureFrame);
          } else {
            const avgFrameTime = (currentTime - startTime) / frames;
            const fps = 1000 / avgFrameTime;
            const jankScore = (jankFrames / frames) * 100;
            resolve({ fps, jankScore, frames });
          }
        };

        requestAnimationFrame(measureFrame);
      });
    });

    // Check animation performance
    expect((frameMetrics as any).fps).toBeGreaterThanOrEqual(PERFORMANCE_BUDGETS.frameRate.minimum);
    expect((frameMetrics as any).jankScore).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.frameRate.jankThreshold);

    console.log('Animation performance:', frameMetrics);
  });

  test('Cross-platform performance comparison', async ({ page, browserName }) => {
    const story = 'card--default';
    const metrics = await performanceTester.measureComponentPerformance(story);

    // Platform-specific performance expectations
    const platformBudgets = {
      chromium: { renderTime: 10, memoryUsage: 2 * 1024 * 1024 },
      firefox: { renderTime: 15, memoryUsage: 3 * 1024 * 1024 },
      webkit: { renderTime: 12, memoryUsage: 2.5 * 1024 * 1024 },
    };

    const budget = platformBudgets[browserName as keyof typeof platformBudgets];
    if (budget) {
      expect(metrics.renderTime).toBeLessThanOrEqual(budget.renderTime);
      expect(metrics.memoryUsage).toBeLessThanOrEqual(budget.memoryUsage);
    }

    console.log(`Performance on ${browserName}:`, {
      renderTime: `${metrics.renderTime.toFixed(2)}ms`,
      memoryUsage: `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
    });
  });
});
