/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnect } from '../WalletConnect';

// Mock the wallet context
const mockWalletContext = {
  address: null,
  network: null,
  balance: null,
  isConnecting: false,
  error: null,
  connect: jest.fn(),
  disconnect: jest.fn(),
  switchNetwork: jest.fn(),
};

jest.mock('../../providers/WalletProvider', () => ({
  useWallet: () => mockWalletContext,
}));

// Mock the UI components
jest.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, disabled, isLoading }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('WalletConnect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock context
    mockWalletContext.address = null;
    mockWalletContext.network = null;
    mockWalletContext.balance = null;
    mockWalletContext.isConnecting = false;
    mockWalletContext.error = null;
  });

  it('should render connect button when not connected', () => {
    render(<WalletConnect />);

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet to save todos on blockchain')).toBeInTheDocument();
  });

  it('should show loading state when connecting', () => {
    mockWalletContext.isConnecting = true;

    render(<WalletConnect />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render wallet info when connected', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';
    (mockWalletContext as any).network = 'polygon';
    (mockWalletContext as any).balance = '1.5';

    render(<WalletConnect />);

    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument();
    expect(screen.getByText('polygon')).toBeInTheDocument();
    expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('should call connect when connect button is clicked', () => {
    render(<WalletConnect />);

    fireEvent.click(screen.getByText('Connect Wallet'));
    expect(mockWalletContext.connect).toHaveBeenCalled();
  });

  it('should render network selector when connected', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';
    (mockWalletContext as any).network = 'polygon';

    render(<WalletConnect />);

    expect(screen.getByDisplayValue('polygon')).toBeInTheDocument();
  });

  it('should call switchNetwork when network is changed', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';
    (mockWalletContext as any).network = 'polygon';

    render(<WalletConnect />);

    const networkSelect = screen.getByDisplayValue('polygon');
    fireEvent.change(networkSelect, { target: { value: 'solana' } });

    expect(mockWalletContext.switchNetwork).toHaveBeenCalledWith('solana');
  });

  it('should show error message when there is an error', () => {
    (mockWalletContext as any).error = 'Failed to connect wallet';

    render(<WalletConnect />);

    expect(screen.getByText('Failed to connect wallet')).toBeInTheDocument();
  });

  it('should render network badge with correct variant for polygon', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';
    (mockWalletContext as any).network = 'polygon';

    render(<WalletConnect />);

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'default');
  });

  it('should render network badge with correct variant for solana', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';
    (mockWalletContext as any).network = 'solana';

    render(<WalletConnect />);

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'secondary');
  });

  it('should render network badge with correct variant for polkadot', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';
    (mockWalletContext as any).network = 'polkadot';

    render(<WalletConnect />);

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'outline');
  });

  it('should truncate long addresses', () => {
    (mockWalletContext as any).address = '0x1234567890abcdefghijklmnop';

    render(<WalletConnect />);

    expect(screen.getByText('0x1234...mnop')).toBeInTheDocument();
  });

  it('should not show balance when not available', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';
    (mockWalletContext as any).network = 'polygon';
    // balance is null

    render(<WalletConnect />);

    expect(screen.queryByText(/ETH/)).not.toBeInTheDocument();
  });

  it('should call disconnect when disconnect button is clicked', () => {
    (mockWalletContext as any).address = '0x1234567890abcdef';

    render(<WalletConnect />);

    fireEvent.click(screen.getByText('Disconnect'));
    expect(mockWalletContext.disconnect).toHaveBeenCalled();
  });
});
