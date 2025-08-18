const baseConfig = require('@todo/config-eslint/base');

module.exports = [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];