module.exports = {
  extends: ['@todo/config-eslint/nextjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
