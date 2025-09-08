import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';
import { ListItem } from '../lib/components/ListItem/ListItem';

describe('ListItem', () => {
  it('renders non-pressable variant (no onPress) with title accessibility label', () => {
    const { getByTestId, getByText } = renderWithProvider(<ListItem title="Item Title" testID="list-item" />);
    const container = getByTestId('list-item');
    expect(getByText('Item Title')).toBeTruthy();
    // accessibilityLabel should fall back to title
    expect(container.props.accessibilityLabel).toBe('Item Title');
  });

  it('renders pressable variant and handles press', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProvider(<ListItem title="Press Me" onPress={onPress} testID="pressable-item" />);
    const pressable = getByTestId('pressable-item');
    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(pressable.props.accessibilityRole).toBe('button');
  });

  it('does not render pressable when disabled (falls back to View)', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProvider(
      <ListItem title="Disabled" onPress={onPress} disabled testID="disabled-item" />,
    );
    const container = getByTestId('disabled-item');
    // No accessibilityRole button because it rendered non-pressable path
    expect(container.props.accessibilityRole).toBeUndefined();
    fireEvent.press(container);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies size based layout (minHeight) for sm, md, lg', () => {
    const sizes: Array<[any, number]> = [
      ['sm', 40],
      ['md', 56],
      ['lg', 72],
    ];
    sizes.forEach(([size, expectedMinHeight]) => {
      const { getByTestId, unmount } = renderWithProvider(
        <ListItem title={`Size ${size}`} size={size} testID={`item-${size}`} />,
      );
      const node = getByTestId(`item-${size}`);
      // style is an array; flatten and find minHeight
      const flat = Array.isArray(node.props.style) ? Object.assign({}, ...node.props.style) : node.props.style;
      expect(flat.minHeight).toBe(expectedMinHeight);
      unmount();
    });
  });

  it('renders leading and trailing accessories', () => {
    const Leading = () => (
      <>
        {/* @ts-ignore */}
        <React.Fragment>
          <></>
        </React.Fragment>
      </>
    );
    const { getByTestId } = renderWithProvider(
      <ListItem title="With Accessories" leading={<></>} trailing={<></>} testID="accessory-item" />,
    );
    const container = getByTestId('accessory-item');
    expect(container).toBeTruthy();
  });

  it('falls back accessibility label to title / provided prop', () => {
    const { getByTestId } = renderWithProvider(
      <ListItem title="Readable" accessibilityLabel="Custom Label" testID="a11y-item" />,
    );
    const node = getByTestId('a11y-item');
    expect(node.props.accessibilityLabel).toBe('Custom Label');
  });
});
