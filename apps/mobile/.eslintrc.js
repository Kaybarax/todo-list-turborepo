module.exports = {
  ...require('@todo/config-eslint/react-native'),
  parserOptions: {
    ...require('@todo/config-eslint/react-native').parserOptions,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
