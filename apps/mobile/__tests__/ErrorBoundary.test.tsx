import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';

// Mock @todo/ui-mobile Button with a simple pressable so fireEvent.press works
jest.mock('@todo/ui-mobile', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ children, onPress, ...props }: any) => (
      <TouchableOpacity onPress={onPress} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
  };
});

// Silence console.error from ErrorBoundary during test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

it('ErrorBoundary: renders fallback and retries', async () => {
  const tokensModule = require('../src/hooks/useDesignTokens');
  jest.spyOn(tokensModule, 'useDesignTokens').mockReturnValue({
    colors: { background: '#fff', error: '#f00', text: { secondary: '#555' } },
    spacing: { sm: 8, md: 12, lg: 16 },
    typography: { fontSize: { sm: 14, lg: 20 } },
  });

  const { ErrorBoundary } = require('../src/components/ErrorBoundary');

  let shouldThrow = true;
  const MaybeBoom: React.FC = () => {
    if (shouldThrow) {
      throw new Error('Boom');
    }
    return <Text>OK</Text>;
  };

  const { getByText, queryByText } = render(
    <ErrorBoundary>
      <MaybeBoom />
    </ErrorBoundary>,
  );

  // Fallback appears with message
  getByText('Something went wrong');
  getByText('Boom');

  // Stop throwing before retry so re-render succeeds
  shouldThrow = false;

  // Retry clears error and renders children again
  const tryAgain = getByText('Try again');
  await act(() => {
    fireEvent.press(tryAgain);
  });

  // After retry, ErrorBoundary re-renders children which no longer throw
  getByText('OK');
  expect(queryByText('Something went wrong')).toBeNull();
});
