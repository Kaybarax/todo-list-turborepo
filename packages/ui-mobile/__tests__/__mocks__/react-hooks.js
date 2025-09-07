const React = require('react');
const { render, act } = require('@testing-library/react-native');

function renderHook(callback) {
  const result = { current: undefined };
  let updateResolver = null;
  const waitForNextUpdate = () =>
    new Promise(resolve => {
      updateResolver = resolve;
    });

  function HookWrapper() {
    const value = callback();
    result.current = value;
    // Resolve any pending wait promise after commit
    React.useEffect(() => {
      if (updateResolver) {
        const r = updateResolver;
        updateResolver = null;
        r();
      }
    });
    return null;
  }

  const utils = render(React.createElement(HookWrapper));
  return { result, waitForNextUpdate, ...utils };
}

module.exports = { renderHook, act };
