import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaProvider, useEnhancedTheme } from '../../lib/theme';
import { Button } from '../../lib/components/Button/Button';
import { Input } from '../../lib/components/Input/Input';
import { Card } from '../../lib/components/Card/Card';
import { Modal } from '../../lib/components/Modal/Modal';

// Integration test wrapper
const TestWrapper = ({ children, theme = eva.light }: { children: React.ReactNode; theme?: any }) => (
  <ApplicationProvider {...theme} theme={theme}>
    <EvaProvider>{children}</EvaProvider>
  </ApplicationProvider>
);

// Test component that uses multiple Eva Design components
const TestApp = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const { toggleTheme, isDark } = useEnhancedTheme();

  return (
    <>
      <Card>
        <Button title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`} onPress={toggleTheme} testID="theme-toggle" />
        <Input placeholder="Test input" value={inputValue} onChangeText={setInputValue} testID="test-input" />
        <Button title="Open Modal" onPress={() => setModalVisible(true)} testID="modal-trigger" />
      </Card>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Test Modal" testID="test-modal">
        <Button title="Close Modal" onPress={() => setModalVisible(false)} testID="close-modal" />
      </Modal>
    </>
  );
};

describe('Eva Design Integration Tests', () => {
  it('integrates multiple components with Eva Design theming', async () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <TestApp />
      </TestWrapper>,
    );

    // Test button rendering
    expect(getByTestId('theme-toggle')).toBeTruthy();
    expect(getByTestId('test-input')).toBeTruthy();
    expect(getByTestId('modal-trigger')).toBeTruthy();
  });

  it('handles theme switching across components', async () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <TestApp />
      </TestWrapper>,
    );

    const themeButton = getByTestId('theme-toggle');

    // Initial state should show "Switch to Dark Theme"
    expect(getByText('Switch to Dark Theme')).toBeTruthy();

    // Toggle theme
    fireEvent.press(themeButton);

    await waitFor(() => {
      expect(getByText('Switch to Light Theme')).toBeTruthy();
    });
  });

  it('handles modal interactions with Eva Design components', async () => {
    const { getByTestId, queryByTestId } = render(
      <TestWrapper>
        <TestApp />
      </TestWrapper>,
    );

    // Modal should not be visible initially
    expect(queryByTestId('test-modal')).toBeNull();

    // Open modal
    fireEvent.press(getByTestId('modal-trigger'));

    await waitFor(() => {
      expect(getByTestId('test-modal')).toBeTruthy();
    });

    // Close modal
    fireEvent.press(getByTestId('close-modal'));

    await waitFor(() => {
      expect(queryByTestId('test-modal')).toBeNull();
    });
  });

  it('handles input interactions with Eva Design styling', async () => {
    const { getByTestId } = render(
      <TestWrapper>
        <TestApp />
      </TestWrapper>,
    );

    const input = getByTestId('test-input');

    fireEvent.changeText(input, 'Test value');

    expect(input.props.value).toBe('Test value');
  });

  it('works with dark theme', async () => {
    const { getByTestId } = render(
      <TestWrapper theme={eva.dark}>
        <TestApp />
      </TestWrapper>,
    );

    expect(getByTestId('theme-toggle')).toBeTruthy();
    expect(getByTestId('test-input')).toBeTruthy();
  });

  it('maintains component functionality across theme changes', async () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <TestApp />
      </TestWrapper>,
    );

    // Test input functionality
    const input = getByTestId('test-input');
    fireEvent.changeText(input, 'Before theme change');

    // Change theme
    fireEvent.press(getByTestId('theme-toggle'));

    await waitFor(() => {
      expect(getByText('Switch to Light Theme')).toBeTruthy();
    });

    // Input should still work
    fireEvent.changeText(input, 'After theme change');
    expect(input.props.value).toBe('After theme change');
  });
});
