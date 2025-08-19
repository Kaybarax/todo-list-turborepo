const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const promisePlugin = require('eslint-plugin-promise');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const globals = require('globals');

// Try to load Next.js ESLint config with better error handling
let nextConfig = {};
let nextRules = {};
let nextSettings = {};

try {
  const { FlatCompat } = require('@eslint/eslintrc');
  const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
  });

  // Convert Next.js config to flat config
  const nextConfigs = compat.extends('next/core-web-vitals');
  if (nextConfigs && nextConfigs.length > 0) {
    nextConfig = nextConfigs[0] || {};
    nextRules = nextConfig.rules || {};
    nextSettings = nextConfig.settings || {};
  }
} catch (error) {
  console.warn('Could not load Next.js ESLint config, using fallback configuration:', error.message);
  // Fallback Next.js rules
  nextRules = {
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-unwanted-polyfillio': 'error',
    '@next/next/no-page-custom-font': 'error',
  };
}

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: process.cwd(),
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
      ...nextRules,

      // Base TypeScript rules with improved configuration
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
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
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-as-const': 'error',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      'no-case-declarations': 'warn',
      'no-duplicate-imports': 'off', // Handled by TypeScript

      // Promise rules
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'error',
      'promise/param-names': 'error',

      // React specific rules
      'react/prop-types': 'off', // TypeScript handles prop types
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off', // TypeScript handles default props
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',

      // Override React rules for Next.js
      'jsx-a11y/anchor-is-valid': 'off', // Next.js handles this differently
    },
    settings: {
      react: {
        version: 'detect',
      },
      next: {
        rootDir: ['apps/web/', 'packages/ui-web/'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      ...nextSettings,
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: {
      // Disable TypeScript-specific rules for JavaScript files
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];
