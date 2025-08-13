module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'promise', 'node'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:node/recommended',
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

    // Security rules (removed due to circular reference issue)
    // 'security/detect-object-injection': 'warn',
    // 'security/detect-non-literal-regexp': 'warn',

    // General rules
    'no-console': 'off', // Allow console in server applications
    'prefer-const': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'object-shorthand': 'error',

    // NestJS specific rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Node.js specific rules
    'node/no-missing-import': 'off', // TypeScript handles this
    'node/no-unsupported-features/es-syntax': 'off', // We use TypeScript
    'node/no-unpublished-import': 'off', // Allow dev dependencies

    // Decorator support
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-types': 'off',
  },
  env: {
    node: true,
    browser: true,
    es2022: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
