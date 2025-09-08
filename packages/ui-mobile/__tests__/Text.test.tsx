import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../lib/components/Text/Text';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';

describe('Text', () => {
  it('renders with default props', () => {
    const { getByText } = renderWithProvider(<Text>Body text</Text>);
    expect(getByText('Body text')).toBeTruthy();
  });

  it('maps variants to categories', () => {
    const variants: Array<[string, string]> = [
      ['h1', 'Heading 1'],
      ['h2', 'Heading 2'],
      ['h3', 'Heading 3'],
      ['h4', 'Heading 4'],
      ['body1', 'Body 1'],
      ['body2', 'Body 2'],
      ['caption', 'Caption'],
      ['overline', 'Overline'],
    ];

    variants.forEach(([variant, label]) => {
      const { getByText, unmount } = renderWithProvider(<Text variant={variant as any}>{label}</Text>);
      expect(getByText(label)).toBeTruthy();
      unmount();
    });
  });

  it('applies weight and alignment', () => {
    const { getByText } = renderWithProvider(
      <Text weight="bold" align="center" testID="text-weight-align">
        Center Bold
      </Text>,
    );
    const node = getByText('Center Bold');
    expect(node).toBeTruthy();
  });

  it('supports custom color token string', () => {
    const { getByText } = renderWithProvider(
      <Text color="#ff0000" testID="custom-color-text">
        Red Text
      </Text>,
    );
    expect(getByText('Red Text')).toBeTruthy();
  });
});
