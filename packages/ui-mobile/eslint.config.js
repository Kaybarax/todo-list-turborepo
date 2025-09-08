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
      // Keep ignoring generated type/output subpaths but allow component source under lib/components
      'lib/**/*.d.ts',
      'lib/**/index.js.map',
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
  // Override: disallow `style?: any` in component source to enforce typed style props
  {
    files: ['lib/components/**/*.{ts,tsx}'],
    rules: {
      // General ban on explicit any for style prop declarations
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: false }],
      // Narrow, readable error if someone tries to reintroduce `style?: any;`
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSPropertySignature[key.name='style'] TSTypeAnnotation TSTypeReference Identifier[name='any']",
          message: 'Use StyleProp<...> (e.g., StyleProp<ViewStyle | TextStyle>) instead of `any` for style prop.',
        },
      ],
    },
  },
  // Temporary exception: Text component has duplicate react-native type resolution causing StyleProp mismatch.
  // Allow explicit any until dependency tree flattened. (Tracked by remediation tasks TXT-2)
  {
    files: ['lib/components/Text/Text.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-syntax': 'off',
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
