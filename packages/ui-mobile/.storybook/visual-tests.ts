/**
 * Visual Regression Testing Configuration
 * Defines test scenarios for cross-platform visual testing
 */

export interface VisualTestScenario {
  name: string;
  viewport: { width: number; height: number };
  theme: 'light' | 'dark';
  platform: 'ios' | 'android' | 'web';
  userAgent?: string;
}

export const MOBILE_VIEWPORTS = {
  'iphone-se': { width: 320, height: 568 },
  'iphone-12': { width: 390, height: 844 },
  'iphone-12-pro-max': { width: 428, height: 926 },
  'android-small': { width: 360, height: 640 },
  'android-large': { width: 412, height: 892 },
  'tablet-portrait': { width: 768, height: 1024 },
  'tablet-landscape': { width: 1024, height: 768 },
} as const;

export const VISUAL_TEST_SCENARIOS: VisualTestScenario[] = [
  // iOS Light Theme
  {
    name: 'ios-light-small',
    viewport: MOBILE_VIEWPORTS['iphone-se'],
    theme: 'light',
    platform: 'ios',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },
  {
    name: 'ios-light-large',
    viewport: MOBILE_VIEWPORTS['iphone-12-pro-max'],
    theme: 'light',
    platform: 'ios',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },

  // iOS Dark Theme
  {
    name: 'ios-dark-small',
    viewport: MOBILE_VIEWPORTS['iphone-se'],
    theme: 'dark',
    platform: 'ios',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },
  {
    name: 'ios-dark-large',
    viewport: MOBILE_VIEWPORTS['iphone-12-pro-max'],
    theme: 'dark',
    platform: 'ios',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },

  // Android Light Theme
  {
    name: 'android-light-small',
    viewport: MOBILE_VIEWPORTS['android-small'],
    theme: 'light',
    platform: 'android',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
  },
  {
    name: 'android-light-large',
    viewport: MOBILE_VIEWPORTS['android-large'],
    theme: 'light',
    platform: 'android',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
  },

  // Android Dark Theme
  {
    name: 'android-dark-small',
    viewport: MOBILE_VIEWPORTS['android-small'],
    theme: 'dark',
    platform: 'android',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
  },
  {
    name: 'android-dark-large',
    viewport: MOBILE_VIEWPORTS['android-large'],
    theme: 'dark',
    platform: 'android',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
  },

  // Tablet Scenarios
  {
    name: 'tablet-light-portrait',
    viewport: MOBILE_VIEWPORTS['tablet-portrait'],
    theme: 'light',
    platform: 'ios',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },
  {
    name: 'tablet-dark-landscape',
    viewport: MOBILE_VIEWPORTS['tablet-landscape'],
    theme: 'dark',
    platform: 'ios',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },
];

export const PERFORMANCE_THRESHOLDS = {
  // Component rendering performance benchmarks
  renderTime: {
    fast: 16, // 60fps target
    acceptable: 33, // 30fps target
    slow: 100, // Anything above is concerning
  },

  // Bundle size thresholds
  bundleSize: {
    small: 50 * 1024, // 50KB
    medium: 100 * 1024, // 100KB
    large: 200 * 1024, // 200KB
  },

  // Memory usage thresholds
  memoryUsage: {
    low: 10 * 1024 * 1024, // 10MB
    medium: 50 * 1024 * 1024, // 50MB
    high: 100 * 1024 * 1024, // 100MB
  },
};

export const ACCESSIBILITY_TEST_CONFIG = {
  rules: {
    // WCAG 2.1 Level AA compliance
    'color-contrast': { enabled: true },
    'color-contrast-enhanced': { enabled: false }, // AAA level
    'focus-visible': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'touch-target': { enabled: true },
    'aria-labels': { enabled: true },
    'aria-roles': { enabled: true },
    'heading-hierarchy': { enabled: true },
    'landmark-roles': { enabled: true },
    'list-structure': { enabled: true },
    'image-alt': { enabled: true },
    'form-labels': { enabled: true },
    'button-name': { enabled: true },
    'link-name': { enabled: true },
  },

  // Mobile-specific accessibility considerations
  mobileRules: {
    'touch-target-size': {
      enabled: true,
      options: {
        minWidth: 44,
        minHeight: 44,
      },
    },
    'zoom-content': { enabled: true },
    'orientation-support': { enabled: true },
    'motion-reduction': { enabled: true },
  },

  // Platform-specific rules
  platformRules: {
    ios: {
      'voiceover-support': { enabled: true },
      'dynamic-type': { enabled: true },
      'reduce-motion': { enabled: true },
    },
    android: {
      'talkback-support': { enabled: true },
      'font-scaling': { enabled: true },
      'high-contrast': { enabled: true },
    },
  },
};

export const VISUAL_DIFF_THRESHOLDS = {
  // Pixel difference thresholds for visual regression
  pixel: {
    identical: 0,
    minimal: 0.01, // 1% difference
    acceptable: 0.05, // 5% difference
    significant: 0.1, // 10% difference
  },

  // Anti-aliasing tolerance
  antialiasing: true,

  // Ignore regions (for dynamic content)
  ignoreRegions: [
    // Ignore timestamps, loading states, etc.
    { selector: '[data-testid="timestamp"]' },
    { selector: '[data-testid="loading-indicator"]' },
    { selector: '[data-testid="random-content"]' },
  ],

  // Comparison options
  comparison: {
    threshold: 0.2,
    includeAA: false,
    alpha: 0.1,
    aaColor: [255, 0, 255],
    diffColor: [255, 255, 0],
    diffColorAlt: null,
  },
};
