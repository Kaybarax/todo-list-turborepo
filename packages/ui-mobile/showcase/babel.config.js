module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@todo/ui-mobile': '../lib',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
