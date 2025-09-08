import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import Icon from '../lib/components/Icon';

describe('Icon', () => {
  it('renders named icon', () => {
    const { toJSON } = render(<Icon name="star" size="lg" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders custom child icon element', () => {
    const Custom = (props: any) => <View {...props} />;
    const { toJSON } = render(
      <Icon size="sm">
        <Custom testID="custom-icon" />
      </Icon>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('returns null without name or children', () => {
    const { toJSON } = render(<Icon />);
    expect(toJSON()).toBeNull();
  });
});
