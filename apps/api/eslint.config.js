const nestjsConfig = require('@todo/config-eslint/nestjs');

module.exports = [
  ...nestjsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
