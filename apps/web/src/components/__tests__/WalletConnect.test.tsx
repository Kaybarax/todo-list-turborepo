import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WalletConnect } from '../WalletConnect';
import { vi } from 'vitest';

// Mock the WalletProvider
const mockWalletContext = {
  isConnected: false,
  address: null,
  network: null,
  balance: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  switchNetwork: vi.fn(),
  isConnecting: false,
  error: null,
};

vi.mock('../WalletProvider', () => ({
  useWallet: () => mockWalletContext,
}));

// Mock the UI components
vi.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, disabled, isLoading, variant }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading}
      data-variant={variant}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}));

describe('WalletConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock context to default state
    Object.assign(mockWalletContext, {
      isConnected: false,
      address: null,
      network: null,
      balance: null,
      isConnecting: false,
      error: null,
    });
  });

  it('renders connect button when wallet is not connected', () => {
    render(<WalletConnect />);
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet to save todos on blockchain')).toBeInTheDocument();
  });

  it('handles wallet connection', async () => {
    render(<WalletConnect />);
    
    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);
    
    expect(mockWalletContext.connect).toHaveBeenCalled();
  });

  it('shows connecting state', () => {
    mockWalletContext.isConnecting = true;
    
    render(<WalletConnect />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders wallet info when connected', () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    mockWalletContext.network = 'polygon';
    mockWalletContext.balance = '1.5';
    
    render(<WalletConnect />);
    
    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument();
    expect(screen.getByText('polygon')).toBeInTheDocument();
    expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('handles wallet disconnection', async () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    
    render(<WalletConnect />);
    
    const disconnectButton = screen.getByText('Disconnect');
    fireEvent.click(disconnectButton);
    
    expect(mockWalletContext.disconnect).toHaveBeenCalled();
  });

  it('shows network selection when connected', () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    mockWalletContext.network = 'polygon';
    
    render(<WalletConnect />);
    
    expect(screen.getByDisplayValue('polygon')).toBeInTheDocument();
  });

  it('handles network switching', async () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    mockWalletContext.network = 'polygon';
    
    render(<WalletConnect />);
    
    const networkSelect = screen.getByDisplayValue('polygon');
    fireEvent.change(networkSelect, { target: { value: 'solana' } });
    
    expect(mockWalletContext.switchNetwork).toHaveBeenCalledWith('solana');
  });

  it('displays error messages', () => {
    mockWalletContext.error = 'Failed to connect wallet';
    
    render(<WalletConnect />);
    
    expect(screen.getByText('Failed to connect wallet')).toBeInTheDocument();
  });

  it('shows different network badges with correct variants', () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    
    const { rerender } = render(<WalletConnect />);
    
    // Test Polygon network
    mockWalletContext.network = 'polygon';
    rerender(<WalletConnect />);
    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'default');
    
    // Test Solana network
    mockWalletContext.network = 'solana';
    rerender(<WalletConnect />);
    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'secondary');
    
    // Test Polkadot network
    mockWalletContext.network = 'polkadot';
    rerender(<WalletConnect />);
    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'outline');
  });

  it('formats address correctly', () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdefghijklmnop';
    
    render(<WalletConnect />);
    
    expect(screen.getByText('0x1234...mnop')).toBeInTheDocument();
  });

  it('handles missing balance gracefully', () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    mockWalletContext.network = 'polygon';
    mockWalletContext.balance = null;
    
    render(<WalletConnect />);
    
    expect(screen.queryByText(/ETH/)).not.toBeInTheDocument();
  });

  it('shows copy address functionality', async () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    
    render(<WalletConnect />);
    
    const addressElement = screen.getByText('0x1234...cdef');
    fireEvent.click(addressElement);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('0x1234567890abcdef');
    });
  });

  it('handles connection errors gracefully', async () => {
    mockWalletContext.connect.mockRejectedValue(new Error('Connection failed'));
    
    render(<WalletConnect />);
    
    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(mockWalletContext.connect).toHaveBeenCalled();
    });
  });

  it('shows transaction status when provided', () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    
    render(<WalletConnect transactionStatus="pending" />);
    
    expect(screen.getByText('Transaction pending...')).toBeInTheDocument();
  });

  it('handles different transaction statuses', () => {
    mockWalletContext.isConnected = true;
    mockWalletContext.address = '0x1234567890abcdef';
    
    const { rerender } = render(<WalletConnect transactionStatus="pending" />);
    expect(screen.getByText('Transaction pending...')).toBeInTheDocument();
    
    rerender(<WalletConnect transactionStatus="success" />);
    expect(screen.getByText('Transaction successful!')).toBeInTheDocument();
    
    rerender(<WalletConnect transactionStatus="error" />);
    expect(screen.getByText('Transaction failed!')).toBeInTheDocument();
  });
});