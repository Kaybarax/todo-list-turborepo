module.exports = {
  extends: ['../config-eslint/react.js'],
  parserOptions: {
    project: './tsconfig.dev.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.dev.json',
      },
    },
  },
};