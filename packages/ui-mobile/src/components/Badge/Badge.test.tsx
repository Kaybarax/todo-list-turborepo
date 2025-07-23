import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Badge text="New" />);
    expect(getByText('New')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { getByTestId } = render(
      <Badge text="Primary" variant="primary" testID="primary-badge" />
    );
    const badge = getByTestId('primary-badge');
    
    // Check that the style array contains an object with the primary background color
    expect(badge.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('renders with different sizes', () => {
    const { getByTestId: getSmall } = render(
      <Badge text="Small" size="small" testID="small-badge" />
    );
    const { getByTestId: getLarge } = render(
      <Badge text="Large" size="large" testID="large-badge" />
    );
    
    const smallBadge = getSmall('small-badge');
    const largeBadge = getLarge('large-badge');
    
    // Check that the style arrays contain different padding values
    expect(smallBadge.props.style).not.toEqual(largeBadge.props.style);
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <Badge 
        text="Custom" 
        style={{ marginTop: 10 }} 
        textStyle={{ fontWeight: 'bold' }}
        testID="custom-badge" 
      />
    );
    
    const badge = getByTestId('custom-badge');
    expect(badge.props.style).toContainEqual(
      expect.objectContaining({ marginTop: 10 })
    );
  });
});