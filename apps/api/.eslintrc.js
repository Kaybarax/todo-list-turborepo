module.exports = {
  ...require('@todo/config-eslint/nestjs'),
  parserOptions: {
    ...require('@todo/config-eslint/nestjs').parserOptions,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
