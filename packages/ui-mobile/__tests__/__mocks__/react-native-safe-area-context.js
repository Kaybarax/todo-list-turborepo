const React = require('react');
module.exports = {
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  SafeAreaView: 'SafeAreaView',
};
