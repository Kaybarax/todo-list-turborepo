module.exports = {
  extends: ['@todo/config-eslint/react-native'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};