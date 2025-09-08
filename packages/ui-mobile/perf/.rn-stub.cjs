const React = require('react');
module.exports = new Proxy({}, {
  get: (t, p) => {
    if (p === 'StyleSheet') return { create: o => o };
    if (p === 'Platform') return { OS: 'ios', select: x => x.ios || x.default };
    if (p === 'View' || p === 'Text' || p === 'Pressable') return (props) => React.createElement('div', props, props.children);
    return (props) => React.createElement('div', props, props.children);
  }
});