import 'react-native-gesture-handler/jestSetup';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Path: 'Path',
  G: 'G',
}));

// Mock UI Kitten
jest.mock('@ui-kitten/components', () => ({
  ApplicationProvider: ({ children }: any) => children,
  Button: 'Button',
  Card: 'Card',
  Input: 'Input',
  Text: 'Text',
  Layout: 'Layout',
}));