const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const promisePlugin = require('eslint-plugin-promise');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const globals = require('globals');

// Try to load Next.js ESLint config
let nextConfig = {};
try {
  const { FlatCompat } = require('@eslint/eslintrc');
  const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
  });
  
  // Convert Next.js config to flat config
  nextConfig = compat.extends('next/core-web-vitals')[0] || {};
} catch (error) {
  console.warn('Could not load Next.js ESLint config:', error.message);
}

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      promise: promisePlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      ...nextConfig.plugins,
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,
      
      // Next.js rules
      ...nextConfig.rules,
      
      // Base TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      'no-case-declarations': 'warn',
      'promise/always-return': 'warn',

      // React specific rules
      'react/prop-types': 'off', // TypeScript handles prop types
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off', // TypeScript handles default props

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules
      'jsx-a11y/label-has-associated-control': 'warn',
      
      // Override React rules for Next.js
      'jsx-a11y/anchor-is-valid': 'off', // Next.js handles this differently
    },
    settings: {
      react: {
        version: 'detect',
      },
      next: {
        rootDir: ['apps/web/'],
      },
      ...nextConfig.settings,
    },
  },
];
