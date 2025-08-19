const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      'no-console': 'off', // Allow console in blockchain scripts
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // Disabled for blockchain development
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-console': 'off', // Allow console in blockchain scripts
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // Disabled for blockchain development
      '@typescript-eslint/no-unused-vars': 'off', // Disabled for blockchain development
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in generated types
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'target/debug/', 'target/deploy/'],
  },
];
