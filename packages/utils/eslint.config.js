import baseConfig from '@todo/config-eslint/base';

export default [
  ...baseConfig,
  {
    ignores: ['dist/', 'coverage/', 'node_modules/'],
  },
];
