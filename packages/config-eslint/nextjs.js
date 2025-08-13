module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'promise', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
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
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',

    // Import rules
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'prefer-const': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'object-shorthand': 'error',

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
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    // Next.js specific rules
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn', // Prefer next/image
    '@next/next/no-page-custom-font': 'warn',
    '@next/next/no-unwanted-polyfillio': 'error',

    // Override React rules for Next.js
    'jsx-a11y/anchor-is-valid': 'off', // Next.js handles this differently
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js 13+

    // Additional rules for Next.js
    'import/no-anonymous-default-export': 'warn',

    // App Router specific rules
    'import/no-default-export': 'off', // Next.js requires default exports for pages
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    react: {
      version: 'detect',
    },
    next: {
      rootDir: ['apps/web/'],
    },
  },
};
