module.exports = {
  extends: ['@todo/config-eslint/nestjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};