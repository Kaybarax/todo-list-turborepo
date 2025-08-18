const baseConfig = require('./base.js');
const securityPlugin = require('eslint-plugin-security');
const globals = require('globals');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      security: securityPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        ...globals.es2022,
        // Hardhat globals
        artifacts: 'readonly',
        contract: 'readonly',
        web3: 'readonly',
        ethers: 'readonly',
        network: 'readonly',
        deployments: 'readonly',
        getNamedAccounts: 'readonly',
      },
    },
    rules: {
      // Disable TypeScript rules for Solidity files
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Security rules for smart contracts
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',

      // General rules for contract development
      'no-console': 'warn', // Allow console for debugging but warn
      'prefer-const': 'error',
      'no-var': 'error',

      // Import rules
      'import/no-unresolved': 'off', // Hardhat handles imports differently
      'import/order': 'off', // Different import patterns in Solidity projects
    },
  },
  {
    files: ['**/*.sol'],
    languageOptions: {
      parser: null, // Don't use TypeScript parser for Solidity files
    },
    rules: {
      // Disable all TypeScript and JavaScript rules for .sol files
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
];
