// Mock React Native components
/* eslint-disable no-undef */
import '@testing-library/jest-dom';

jest.mock('react-native', () => ({
  // Mock components
  TouchableOpacity: 'TouchableOpacity',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  Image: 'Image',
  ScrollView: 'ScrollView',
  FlatList: 'FlatList',
  SectionList: 'SectionList',
  ActivityIndicator: 'ActivityIndicator',
  Switch: 'Switch',
  Modal: 'Modal',
  Pressable: 'Pressable',
  SafeAreaView: 'SafeAreaView',
  StatusBar: 'StatusBar',

  // Mock StyleSheet
  StyleSheet: {
    create: jest.fn(styles => styles),
    absoluteFillObject: {},
    hairlineWidth: 1,
    flatten: jest.fn(style => {
      if (Array.isArray(style)) {
        return Object.assign({}, ...style.filter(Boolean));
      }
      return style || {};
    }),
  },

  // Mock Dimensions
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },

  PixelRatio: {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
    roundToNearestPixel: jest.fn(n => n),
  },

  // Mock Platform
  Platform: {
    OS: 'ios',
    Version: '14.0',
    select: jest.fn((obj: any) => obj.ios ?? obj.default),
  },

  // Mock Animated
  Animated: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Value: jest.fn(() => ({ setValue: jest.fn(), addListener: jest.fn() })),
    timing: jest.fn(() => ({ start: jest.fn() })),
    spring: jest.fn(() => ({ start: jest.fn() })),
    sequence: jest.fn(() => ({ start: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn() })),
  },

  // Mock other common APIs
  Alert: {
    alert: jest.fn(),
  },

  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
  },
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

// Mock reanimated for Jest
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: 'SafeAreaView',
}));
