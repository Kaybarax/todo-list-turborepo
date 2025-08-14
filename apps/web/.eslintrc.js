module.exports = {
  ...require('@todo/config-eslint/nextjs'),
  parserOptions: {
    ...require('@todo/config-eslint/nextjs').parserOptions,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
