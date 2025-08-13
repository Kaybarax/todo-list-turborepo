// Mock react-native-vector-icons
const mockIcon = () => 'Icon';
jest.mock('react-native-vector-icons/MaterialIcons', () => mockIcon);
jest.mock('react-native-vector-icons/FontAwesome', () => mockIcon);
jest.mock('react-native-vector-icons/Ionicons', () => mockIcon);

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Path: 'Path',
  G: 'G',
}));

// Mock UI Kitten
jest.mock('@ui-kitten/components', () => require('./__mocks__/ui-kitten.ts'));

// Mock react-native components
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  TextInput: 'TextInput',
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: (styles: any) => styles,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 667 }),
  },
}));
