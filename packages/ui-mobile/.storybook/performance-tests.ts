/**
 * Performance Testing Configuration for Mobile Components
 * Measures rendering performance, bundle size, and memory usage
 */

import { Page } from '@playwright/test';

export interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  paintTiming: {
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  };
  interactionTiming: {
    firstInputDelay: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
  };
}

export class PerformanceTester {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async measureComponentPerformance(storyId: string): Promise<PerformanceMetrics> {
    // Start performance measurement
    await this.page.evaluate(() => {
      performance.mark('component-render-start');
    });

    // Navigate to story
    await this.page.goto(`/iframe.html?id=${storyId}`);
    await this.page.waitForSelector('#storybook-root');

    // End performance measurement
    await this.page.evaluate(() => {
      performance.mark('component-render-end');
      performance.measure('component-render', 'component-render-start', 'component-render-end');
    });

    // Collect performance metrics
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const measure = performance.getEntriesByName('component-render')[0];

      return {
        renderTime: measure?.duration || 0,
        paintTiming: {
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          largestContentfulPaint: 0, // Will be measured separately
        },
        navigationTiming: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        },
      };
    });

    // Measure memory usage
    const memoryInfo = await this.page.evaluate(() => {
      return (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          }
        : null;
    });

    // Measure bundle size (approximate)
    const bundleSize = await this.measureBundleSize();

    // Measure Core Web Vitals
    const webVitals = await this.measureWebVitals();

    return {
      renderTime: metrics.renderTime,
      bundleSize,
      memoryUsage: memoryInfo?.usedJSHeapSize || 0,
      paintTiming: {
        firstPaint: metrics.paintTiming.firstPaint,
        firstContentfulPaint: metrics.paintTiming.firstContentfulPaint,
        largestContentfulPaint: webVitals.lcp,
      },
      interactionTiming: {
        firstInputDelay: webVitals.fid,
        totalBlockingTime: webVitals.tbt,
        cumulativeLayoutShift: webVitals.cls,
      },
    };
  }

  private async measureBundleSize(): Promise<number> {
    const resourceSizes = await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources
        .filter(resource => resource.name.includes('.js') || resource.name.includes('.css'))
        .reduce((total, resource) => total + (resource.transferSize || 0), 0);
    });

    return resourceSizes;
  }

  private async measureWebVitals(): Promise<{
    lcp: number;
    fid: number;
    cls: number;
    tbt: number;
  }> {
    return await this.page.evaluate(() => {
      return new Promise(resolve => {
        const vitals = {
          lcp: 0,
          fid: 0,
          cls: 0,
          tbt: 0,
        };

        // Largest Contentful Paint
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          vitals.lcp = entries[entries.length - 1].startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          vitals.fid = entries[0].processingStart - entries[0].startTime;
        }).observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift
        new PerformanceObserver(list => {
          let cls = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          vitals.cls = cls;
        }).observe({ type: 'layout-shift', buffered: true });

        // Total Blocking Time (approximate)
        new PerformanceObserver(list => {
          let tbt = 0;
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              tbt += entry.duration - 50;
            }
          }
          vitals.tbt = tbt;
        }).observe({ type: 'longtask', buffered: true });

        // Resolve after a short delay to collect metrics
        setTimeout(() => resolve(vitals), 2000);
      });
    });
  }

  async benchmarkComponentVariants(
    baseStoryId: string,
    variants: string[],
  ): Promise<{
    baseline: PerformanceMetrics;
    variants: Record<string, PerformanceMetrics>;
    comparison: Record<
      string,
      {
        renderTimeDiff: number;
        bundleSizeDiff: number;
        memoryUsageDiff: number;
      }
    >;
  }> {
    // Measure baseline performance
    const baseline = await this.measureComponentPerformance(baseStoryId);

    // Measure variant performance
    const variantMetrics: Record<string, PerformanceMetrics> = {};
    for (const variant of variants) {
      variantMetrics[variant] = await this.measureComponentPerformance(`${baseStoryId}--${variant}`);
    }

    // Calculate performance differences
    const comparison: Record<string, any> = {};
    for (const [variant, metrics] of Object.entries(variantMetrics)) {
      comparison[variant] = {
        renderTimeDiff: ((metrics.renderTime - baseline.renderTime) / baseline.renderTime) * 100,
        bundleSizeDiff: ((metrics.bundleSize - baseline.bundleSize) / baseline.bundleSize) * 100,
        memoryUsageDiff: ((metrics.memoryUsage - baseline.memoryUsage) / baseline.memoryUsage) * 100,
      };
    }

    return {
      baseline,
      variants: variantMetrics,
      comparison,
    };
  }

  async measureInteractionPerformance(
    storyId: string,
    interactions: Array<{
      name: string;
      action: () => Promise<void>;
    }>,
  ): Promise<
    Record<
      string,
      {
        duration: number;
        fps: number;
        jankScore: number;
      }
    >
  > {
    await this.page.goto(`/iframe.html?id=${storyId}`);
    await this.page.waitForSelector('#storybook-root');

    const results: Record<string, any> = {};

    for (const interaction of interactions) {
      // Start measuring
      await this.page.evaluate(name => {
        performance.mark(`${name}-start`);
      }, interaction.name);

      // Perform interaction
      await interaction.action();

      // End measuring
      const metrics = await this.page.evaluate(name => {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const measure = performance.getEntriesByName(name)[0];
        return {
          duration: measure.duration,
        };
      }, interaction.name);

      // Calculate FPS and jank score
      const frameMetrics = await this.measureFrameRate();

      results[interaction.name] = {
        duration: metrics.duration,
        fps: frameMetrics.fps,
        jankScore: frameMetrics.jankScore,
      };
    }

    return results;
  }

  private async measureFrameRate(): Promise<{ fps: number; jankScore: number }> {
    return await this.page.evaluate(() => {
      return new Promise(resolve => {
        let frames = 0;
        let jankFrames = 0;
        let lastTime = performance.now();

        const measureFrame = () => {
          const currentTime = performance.now();
          const frameDuration = currentTime - lastTime;

          frames++;
          if (frameDuration > 16.67) {
            // Longer than 60fps
            jankFrames++;
          }

          lastTime = currentTime;

          if (frames < 60) {
            // Measure for ~1 second
            requestAnimationFrame(measureFrame);
          } else {
            const fps = 1000 / (currentTime / frames);
            const jankScore = (jankFrames / frames) * 100;
            resolve({ fps, jankScore });
          }
        };

        requestAnimationFrame(measureFrame);
      });
    });
  }
}

export const PERFORMANCE_BUDGETS = {
  // Component rendering budgets
  renderTime: {
    button: 5, // 5ms max
    card: 10, // 10ms max
    modal: 20, // 20ms max
    tabbar: 15, // 15ms max
    header: 8, // 8ms max
  },

  // Bundle size budgets (bytes)
  bundleSize: {
    button: 5 * 1024, // 5KB
    card: 8 * 1024, // 8KB
    modal: 15 * 1024, // 15KB
    tabbar: 12 * 1024, // 12KB
    header: 6 * 1024, // 6KB
  },

  // Memory usage budgets (bytes)
  memoryUsage: {
    button: 1 * 1024 * 1024, // 1MB
    card: 2 * 1024 * 1024, // 2MB
    modal: 5 * 1024 * 1024, // 5MB
    tabbar: 3 * 1024 * 1024, // 3MB
    header: 1.5 * 1024 * 1024, // 1.5MB
  },

  // Interaction performance budgets
  interactions: {
    buttonPress: 100, // 100ms max
    modalOpen: 300, // 300ms max
    tabSwitch: 200, // 200ms max
    cardPress: 150, // 150ms max
  },

  // Frame rate budgets
  frameRate: {
    minimum: 30, // 30fps minimum
    target: 60, // 60fps target
    jankThreshold: 10, // 10% jank max
  },
};
