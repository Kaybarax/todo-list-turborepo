import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../lib/**/*.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
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
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async config => {
    // Add React Native Web alias for better compatibility
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native/Libraries/Text/Text': 'react-native-web/dist/exports/Text',
      'react-native/Libraries/Components/View/View': 'react-native-web/dist/exports/View',
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

    // Configure Vite to handle JSX in .js files from node_modules
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.esbuildOptions = {
      ...config.optimizeDeps.esbuildOptions,
      loader: {
        '.js': 'jsx',
      },
    };

    return config;
  },
};
export default config;
