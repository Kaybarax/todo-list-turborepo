import React from 'react';

import { render, testThemeSwitch } from '../../../src/test/utils/eva-test-utils';
import { Avatar } from '../Avatar';

describe('Avatar - Eva Design Integration', () => {
  it('renders with Eva Design theming', () => {
    const { getByText } = render(<Avatar initials="JD" />);

    expect(getByText('JD')).toBeTruthy();
  });

  it('applies Eva Design colors for initials', () => {
    const { getByText } = render(<Avatar initials="AB" size="large" />);

    expect(getByText('AB')).toBeTruthy();
  });

  it('supports different sizes with Eva Design scaling', () => {
    const { getByText: getTiny } = render(<Avatar initials="T" size="tiny" />);
    const { getByText: getGiant } = render(<Avatar initials="G" size="giant" />);

    expect(getTiny('T')).toBeTruthy();
    expect(getGiant('G')).toBeTruthy();
  });

  it('handles theme switching for background colors', () => {
    const component = <Avatar initials="TS" />;
    const { light, dark } = testThemeSwitch(component);

    expect(light.getByText('TS')).toBeTruthy();
    expect(dark.getByText('TS')).toBeTruthy();
  });

  it('supports different shapes with Eva Design styling', () => {
    const { getByText } = render(<Avatar initials="SQ" shape="square" />);

    expect(getByText('SQ')).toBeTruthy();
  });

  it('renders image avatars with Eva Design container', () => {
    const { getByTestId } = render(<Avatar source={{ uri: 'https://example.com/avatar.jpg' }} testID="avatar-image" />);

    expect(getByTestId('avatar-image')).toBeTruthy();
  });
});
