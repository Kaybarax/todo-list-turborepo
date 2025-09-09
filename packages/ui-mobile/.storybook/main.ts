import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Load all stories
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    // Use built-in react-docgen for compatibility. The previous 'react-docgen-typescript' requires extra deps and breaks in this setup.
    reactDocgen: 'react-docgen',
  },
  viteFinal: async config => {
    // Add React Native Web alias for better compatibility
    config.resolve = config.resolve || {};
    // Prefer simple alias mapping to ensure all 'react-native' imports resolve to web
    const path = require('path');
    const codegenStub = path.resolve(__dirname, './rn-web-stubs/codegenNativeComponent.ts');
    config.resolve.alias = {
      // Deep aliases first
      'react-native/Libraries/Utilities/codegenNativeComponent': codegenStub,
      'react-native/Libraries/BatchedBridge/NativeModules': path.resolve(__dirname, './rn-web-stubs/NativeModules.ts'),
      'react-native/Libraries/TurboModule/TurboModuleRegistry': path.resolve(
        __dirname,
        './rn-web-stubs/TurboModuleRegistry.ts',
      ),
      ...(config.resolve.alias || {}),
      // Point base 'react-native' to our shim so missing native exports (TurboModuleRegistry, etc.) are provided.
      'react-native': path.resolve(__dirname, './rn-web-stubs/react-native-shim.ts'),
      'react-native/Libraries/Text/Text': 'react-native-web/dist/exports/Text',
      'react-native/Libraries/Components/View/View': 'react-native-web/dist/exports/View',
      // Mock reanimated to avoid requiring deep native internals in Storybook web (ESM stub)
      'react-native-reanimated': path.resolve(__dirname, './rn-web-stubs/reanimated-web.ts'),
      '@': path.resolve(__dirname, '../lib'),
    };

    // Configure optimizeDeps: REMOVE previous exclusions so ui-kitten & react-native-svg get pre-bundled.
    config.optimizeDeps = config.optimizeDeps || {};
    const existingExclude = (config.optimizeDeps.exclude || []).filter(
      (pkg: string) => !['@ui-kitten/components', '@ui-kitten/eva-icons', 'react-native'].includes(pkg),
    );
    config.optimizeDeps.exclude = existingExclude; // keep any unrelated excludes
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      '@ui-kitten/components',
      '@ui-kitten/eva-icons',
      'react-native-svg',
    ];

    // Add define for React Native environment
    config.define = {
      ...config.define,
      __DEV__: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    };

    // Configure Vite to handle JSX in .js files from node_modules (dev prebundle)
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.esbuildOptions = {
      ...config.optimizeDeps.esbuildOptions,
      loader: {
        '.js': 'jsx',
      },
    };

    // Workaround: disable Storybook's inject-export-order-plugin which fails to parse some TSX in this setup
    // This avoids build-time parse errors; Story export order falls back to default alphabetical order
    if (Array.isArray((config as any).plugins)) {
      (config as any).plugins = (config as any).plugins.filter(
        (p: any) => p && p.name !== 'storybook:inject-export-order-plugin',
      );
    }

    return config;
  },
};
export default config;
