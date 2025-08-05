// Mock React Native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock components
  RN.TouchableOpacity = 'TouchableOpacity';
  RN.TouchableWithoutFeedback = 'TouchableWithoutFeedback';
  RN.View = 'View';
  RN.Text = 'Text';
  RN.TextInput = 'TextInput';
  RN.Image = 'Image';
  RN.ScrollView = 'ScrollView';
  RN.FlatList = 'FlatList';
  RN.SectionList = 'SectionList';
  RN.ActivityIndicator = 'ActivityIndicator';
  RN.Switch = 'Switch';
  RN.Modal = 'Modal';
  RN.Pressable = 'Pressable';
  
  // Mock methods
  RN.StyleSheet.create = (styles: any) => styles;
  RN.Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 812 });
  RN.Platform.OS = 'ios';
  RN.Platform.select = jest.fn((obj) => obj.ios || obj.default);
  
  return RN;
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');