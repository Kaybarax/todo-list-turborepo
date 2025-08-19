const baseConfig = require('../config-eslint/base.js');
const globals = require('globals');

module.exports = [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    files: ['src/blockchain/implementations/*BlockchainService.ts'],
    rules: {
      'no-unreachable': 'off', // Temporary fix for false positives in catch blocks
    },
  },
];
