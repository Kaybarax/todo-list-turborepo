import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from '@ui-kitten/components';

import { render, testAccessibility } from '../src/test/utils/eva-test-utils';
import { Modal } from '../lib/components/Modal/Modal';

describe('Modal - Eva Design Integration', () => {
  it('renders with Eva Design theming when visible', () => {
    const { getByText } = render(
      <Modal visible={true} onClose={() => {}} title="Test Modal">
        <Text>Modal content</Text>
      </Modal>,
    );

    expect(getByText('Test Modal')).toBeTruthy();
    expect(getByText('Modal content')).toBeTruthy();
  });

  it('applies Eva Design Card styling to modal content', () => {
    const { getByTestId } = render(
      <Modal visible={true} onClose={() => {}} testID="eva-modal">
        <Text>Styled content</Text>
      </Modal>,
    );

    expect(getByTestId('eva-modal')).toBeTruthy();
  });

  it('handles close functionality with Eva Design animations', () => {
    const mockClose = jest.fn();
    const { getByLabelText } = render(
      <Modal visible={true} onClose={mockClose} showCloseButton={true}>
        <Text>Closeable modal</Text>
      </Modal>,
    );

    const closeButton = getByLabelText('Close modal');
    fireEvent.press(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('supports Eva Design backdrop styling', () => {
    const { getByTestId } = render(
      <Modal visible={true} onClose={() => {}} backdropStyle={{ opacity: 0.5 }} testID="backdrop-modal">
        <Text>Backdrop modal</Text>
      </Modal>,
    );

    expect(getByTestId('backdrop-modal')).toBeTruthy();
  });

  it('maintains accessibility with Eva Design components', async () => {
    const { getByRole } = await testAccessibility(
      <Modal visible={true} onClose={() => {}} title="Accessible Modal">
        <Text>Accessible content</Text>
      </Modal>,
    );

    expect(getByRole('dialog')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <Modal visible={false} onClose={() => {}} title="Hidden Modal">
        <Text>Hidden content</Text>
      </Modal>,
    );

    expect(queryByText('Hidden Modal')).toBeNull();
  });
});
