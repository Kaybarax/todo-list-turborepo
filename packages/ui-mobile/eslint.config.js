// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import globals from 'globals';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const reactNativeConfig = require('../config-eslint/react-native.js');

export default [
  // Ignore built and generated files
  {
    ignores: [
      'lib/**',
      'dist/**',
      'coverage/**',
      'storybook-static/**',
      '.turbo/**',
      'src/stories/**',
      'src/test/**',
      '**/*.d.ts',
      '**/*.map',
    ],
  },
  ...reactNativeConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.dev.json',
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.dev.json',
        },
      },
    },
  },
  // Jest globals for test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
