module.exports = {
  // Project token from Chromatic
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN,

  // Build configuration
  buildScriptName: 'build-storybook',
  storybookBuildDir: 'storybook-static',

  // Visual testing configuration
  modes: {
    // Test key themes for visual regression
    light: {
      theme: 'light',
      viewport: 'desktop',
    },
    dark: {
      theme: 'dark',
      viewport: 'desktop',
    },
    corporate: {
      theme: 'corporate',
      viewport: 'desktop',
    },
    synthwave: {
      theme: 'synthwave',
      viewport: 'desktop',
    },
    // Mobile responsive testing
    'light-mobile': {
      theme: 'light',
      viewport: 'mobile',
    },
    'dark-mobile': {
      theme: 'dark',
      viewport: 'mobile',
    },
  },

  // Responsive viewports
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
    wide: { width: 1920, height: 1080 },
  },

  // Performance and timing
  delay: 300, // Wait for theme transitions
  pauseAnimationAtEnd: true,

  // File patterns
  onlyChanged: true, // Only test changed stories in CI
  externals: ['public/**'],

  // Threshold for visual changes
  threshold: 0.2, // 20% threshold for changes

  // Skip certain stories from visual testing
  skip: [
    'example-*', // Skip example stories
    '**/Internal/**', // Skip internal component stories
  ],

  // Exit codes
  exitZeroOnChanges: false, // Fail CI on visual changes
  exitOnceUploaded: true,

  // Debugging
  debug: process.env.NODE_ENV === 'development',
  diagnostics: false,

  // Branch and CI configuration
  branchName: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME,

  // Ignore certain file changes that don't affect visuals
  ignoreLastBuildOnBranch: 'main',

  // Upload metadata
  zip: true,
  junitReport: true,

  // Custom configuration for component testing
  manuallyApproved: [
    // Stories that require manual approval
    'tokens--color-palette',
    'theme-showcase--all-themes',
  ],
};
