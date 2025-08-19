import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {},
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async config => {
    // Ensure TypeScript files are handled properly
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Update existing TypeScript rule or add new one
    const tsRuleIndex = config.module.rules.findIndex(
      (rule: any) => rule.test && rule.test.toString().includes('tsx?'),
    );

    const tsRule = {
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
            ],
            plugins: [],
          },
        },
      ],
      exclude: /node_modules/,
    };

    if (tsRuleIndex >= 0) {
      config.module.rules[tsRuleIndex] = tsRule;
    } else {
      config.module.rules.push(tsRule);
    }

    return config;
  },
};

export default config;
