module.exports = {
  extends: ['@todo/eslint-config/nestjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
