module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated 4 moved plugin to react-native-worklets; must be listed last
      'react-native-worklets/plugin',
    ],
  };
};
