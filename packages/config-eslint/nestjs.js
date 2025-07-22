module.exports = {
  extends: ['./base.js'],
  plugins: ['node'],
  extends: [
    './base.js',
    'plugin:node/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    // NestJS specific rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],

    // Node.js specific rules
    'node/no-missing-import': 'off', // TypeScript handles this
    'node/no-unsupported-features/es-syntax': 'off', // We use TypeScript
    'node/no-unpublished-import': 'off', // Allow dev dependencies

    // Decorator support
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-types': 'off',

    // API development rules
    'no-console': 'off', // Allow console in server applications
    'security/detect-object-injection': 'warn'
  },
  env: {
    node: true,
    jest: true,
    es2022: true
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  }
};