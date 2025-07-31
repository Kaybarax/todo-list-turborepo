import React from 'react';

const Icon = ({ name, size, color, ...props }) => {
  return React.createElement('span', {
    ...props,
    'data-testid': `icon-${name}`,
    style: { fontSize: size, color }
  }, name);
};

export default Icon;