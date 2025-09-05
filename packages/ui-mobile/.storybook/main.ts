import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
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
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native/Libraries/Text/Text': 'react-native-web/dist/exports/Text',
      'react-native/Libraries/Components/View/View': 'react-native-web/dist/exports/View',
      '@': require('path').resolve(__dirname, '../lib'),
    };

    // Configure optimizeDeps to exclude problematic packages
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [...(config.optimizeDeps.exclude || []), '@ui-kitten/components', 'react-native'];

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
