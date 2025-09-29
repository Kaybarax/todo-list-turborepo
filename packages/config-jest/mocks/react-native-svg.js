/* Minimal mock for react-native-svg used in tests */
const React = require('react');
function createComponent(name) {
  return React.forwardRef((props, ref) => React.createElement(name, { ref, ...props }, props.children));
}
module.exports = new Proxy(
  {},
  {
    get: (_, key) => {
      if (key === 'default') return {};
      // Return a generic host component for all SVG primitives
      return createComponent(`RNSVG_${String(key)}`);
    },
  },
);
