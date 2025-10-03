const AsyncStorage = require('@react-native-async-storage/async-storage').default;

(async () => {
  try {
    await AsyncStorage.removeItem('theme');
    await AsyncStorage.removeItem('eva-theme');
    await AsyncStorage.removeItem('enhanced-theme');
    console.log('All theme storage cleared!');
  } catch (e) {
    console.error('Failed to clear theme:', e);
  }
})();
