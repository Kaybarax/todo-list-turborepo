import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Silence console.error from ErrorBoundary during test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

// TODO: Re-enable after stabilizing state transitions in class boundary + mocked Button press semantics
it.skip('ErrorBoundary: renders fallback and retries', async () => {
  const tokensModule = require('../src/hooks/useDesignTokens');
  jest.spyOn(tokensModule, 'useDesignTokens').mockReturnValue({
    colors: { background: '#fff', error: '#f00', text: { secondary: '#555' } },
    spacing: { sm: 8, md: 12, lg: 16 },
    typography: { fontSize: { sm: 14, lg: 20 } },
  });

  const { ErrorBoundary } = require('../src/components/ErrorBoundary');

  const Boom: React.FC = () => {
    throw new Error('Boom');
  };

  const { getByText, rerender, queryByText, getByRole } = render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>,
  );

  // Fallback appears with message
  getByText('Something went wrong');
  getByText('Boom');

  // Retry clears error and renders children again
  fireEvent.press(getByText('Try again'));
  rerender(
    <ErrorBoundary>
      <React.Fragment>OK</React.Fragment>
    </ErrorBoundary>,
  );
  await waitFor(() => {
    getByText('OK');
  });
  expect(queryByText('Something went wrong')).toBeNull();
});
