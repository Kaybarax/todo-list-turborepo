// Lightweight CommonJS mock for react-native-reanimated to avoid ESM parsing issues in Jest
// Expanded to cover createAnimatedComponent and Animated.View usage in components
const React = require('react');
const { View } = require('react-native');

const NOOP = () => {};

const createAnimatedValue = value => ({ value });

const createAnimatedComponent = Component => Component;

const AnimatedView = props => React.createElement(View, props, props.children);

const reanimatedExport = {
  Easing: {
    linear: NOOP,
    ease: NOOP,
    inOut: NOOP,
  },
  useSharedValue: v => createAnimatedValue(v),
  withTiming: toValue => toValue,
  withDelay: (_delay, cb) => cb,
  withSpring: toValue => toValue,
  useAnimatedStyle: fn => fn(),
  interpolate: (value, _input, _output) => value,
  Extrapolate: { CLAMP: 'clamp' },
  cancelAnimation: NOOP,
  runOnJS: fn => fn,
  runOnUI: fn => fn,
  createAnimatedComponent,
  View: AnimatedView,
};

module.exports = {
  __esModule: true,
  default: reanimatedExport,
  ...reanimatedExport,
};
