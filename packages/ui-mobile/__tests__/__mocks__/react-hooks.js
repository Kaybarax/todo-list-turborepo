const React = require('react');
const { render, act } = require('@testing-library/react-native');

function renderHook(callback) {
  const result = { current: undefined };
  function HookWrapper() {
    result.current = callback();
    return null;
  }
  const utils = render(React.createElement(HookWrapper));
  return { result, ...utils };
}

module.exports = { renderHook, act };
