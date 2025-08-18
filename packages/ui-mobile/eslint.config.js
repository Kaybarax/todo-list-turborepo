const reactNativeConfig = require('../config-eslint/react-native.js');

module.exports = [
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
];
