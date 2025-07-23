import React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  it('renders with initials', () => {
    const { getByText } = render(
      <Avatar initials="JD" testID="avatar" />
    );
    expect(getByText('JD')).toBeTruthy();
  });

  it('renders with image source', () => {
    const { getByTestId } = render(
      <Avatar 
        source={{ uri: 'https://example.com/avatar.jpg' }} 
        testID="avatar" 
      />
    );
    expect(getByTestId('avatar-image')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { getByTestId: getSmall } = render(
      <Avatar initials="SM" size="sm" testID="small-avatar" />
    );
    const { getByTestId: getLarge } = render(
      <Avatar initials="LG" size="lg" testID="large-avatar" />
    );
    
    const smallAvatar = getSmall('small-avatar');
    const largeAvatar = getLarge('large-avatar');
    
    // Check that the style arrays contain different width/height values
    expect(smallAvatar.props.style).not.toEqual(largeAvatar.props.style);
  });

  it('applies custom background and text colors', () => {
    const { getByTestId } = render(
      <Avatar 
        initials="JD" 
        backgroundColor="#FF0000" 
        textColor="#FFFFFF" 
        testID="custom-avatar" 
      />
    );
    
    const avatar = getByTestId('custom-avatar');
    const text = getByTestId('custom-avatar-text');
    
    expect(avatar.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#FF0000' })
    );
    expect(text.props.style).toContainEqual(
      expect.objectContaining({ color: '#FFFFFF' })
    );
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <Avatar 
        initials="JD" 
        style={{ borderWidth: 2 }} 
        textStyle={{ fontWeight: 'bold' }}
        testID="styled-avatar" 
      />
    );
    
    const avatar = getByTestId('styled-avatar');
    expect(avatar.props.style).toContainEqual(
      expect.objectContaining({ borderWidth: 2 })
    );
  });
});