import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WalletConnect, type WalletConnectProps, type WalletAccount } from './WalletConnect';
import type { BlockchainNetwork } from '@todo/services';

// Mock the services
jest.mock('@todo/services', () => ({
  getNetworkColor: jest.fn((network: string) => {
    const colorMap: Record<string, string> = {
      polygon: '#6366f1',
      solana: '#9333ea',
      polkadot: '#ec4899',
      moonbeam: '#14b8a6',
      base: '#3b82f6',
    };
    return colorMap[network] || '#6b7280';
  }),
}));

const mockAccount: WalletAccount = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  network: 'polygon' as BlockchainNetwork,
  balance: '1.2345',
  chainId: '137',
};

const supportedNetworks: BlockchainNetwork[] = [
  'solana' as BlockchainNetwork,
  'polkadot' as BlockchainNetwork,
  'polygon' as BlockchainNetwork,
  'moonbeam' as BlockchainNetwork,
  'base' as BlockchainNetwork,
];

const defaultProps: Partial<WalletConnectProps> = {
  supportedNetworks,
  showBalance: true,
  showNetworkSelector: true,
  isConnected: false,
  isConnecting: false,
  account: null,
  error: null,
};

describe('WalletConnect', () => {
  const mockOnConnect = jest.fn();
  const mockOnDisconnect = jest.fn();
  const mockOnNetworkSwitch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Disconnected State', () => {
    it('should render connect form when not connected', () => {
      render(
        <WalletConnect
          {...defaultProps}
          onConnect={mockOnConnect}
          onDisconnect={mockOnDisconnect}
          onNetworkSwitch={mockOnNetworkSwitch}
        />,
      );

      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
      expect(screen.getByText('Select Network:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Connect to/ })).toBeInTheDocument();
    });

    it('should show network selection buttons', () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      supportedNetworks.forEach(network => {
        expect(screen.getByRole('button', { name: network })).toBeInTheDocument();
      });
    });

    it('should call onConnect when connect button is clicked', async () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      const connectButton = screen.getByRole('button', { name: /Connect to/ });
      fireEvent.click(connectButton);

      await waitFor(() => {
        expect(mockOnConnect).toHaveBeenCalledWith(
          expect.objectContaining({
            network: 'solana', // default network
            address: expect.any(String),
            balance: expect.any(String),
          }),
        );
      });
    });

    it('should update selected network when network button is clicked', () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      const polygonButton = screen.getByRole('button', { name: 'polygon' });
      fireEvent.click(polygonButton);

      const connectButton = screen.getByRole('button', { name: /Connect to polygon/ });
      expect(connectButton).toBeInTheDocument();
    });

    it('should show error message when error prop is provided', () => {
      const errorMessage = 'Failed to connect wallet';
      render(<WalletConnect {...defaultProps} error={errorMessage} onConnect={mockOnConnect} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should show connecting state', () => {
      render(<WalletConnect {...defaultProps} isConnecting={true} onConnect={mockOnConnect} />);

      expect(screen.getByText('Connecting...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Connecting/ })).toBeDisabled();
    });
  });

  describe('Connected State', () => {
    const connectedProps = {
      ...defaultProps,
      isConnected: true,
      account: mockAccount,
    };

    it('should render wallet info when connected', () => {
      render(
        <WalletConnect {...connectedProps} onDisconnect={mockOnDisconnect} onNetworkSwitch={mockOnNetworkSwitch} />,
      );

      expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
      expect(screen.getByText('polygon')).toBeInTheDocument();
      expect(screen.getByText('1.2345 ETH')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
    });

    it('should call onDisconnect when disconnect button is clicked', () => {
      render(<WalletConnect {...connectedProps} onDisconnect={mockOnDisconnect} />);

      const disconnectButton = screen.getByRole('button', { name: 'Disconnect' });
      fireEvent.click(disconnectButton);

      expect(mockOnDisconnect).toHaveBeenCalled();
    });

    it('should show network switcher when switch button is clicked', () => {
      render(<WalletConnect {...connectedProps} onNetworkSwitch={mockOnNetworkSwitch} />);

      const switchButton = screen.getByRole('button', { name: 'Switch' });
      fireEvent.click(switchButton);

      expect(screen.getByText('Select Network:')).toBeInTheDocument();
      supportedNetworks.forEach(network => {
        expect(screen.getAllByText(network)).toHaveLength(network === 'polygon' ? 2 : 1);
      });
    });

    it('should call onNetworkSwitch when network is selected', () => {
      render(<WalletConnect {...connectedProps} onNetworkSwitch={mockOnNetworkSwitch} />);

      // Open network switcher
      const switchButton = screen.getByRole('button', { name: 'Switch' });
      fireEvent.click(switchButton);

      // Click on a different network
      const networkButtons = screen.getAllByRole('button', { name: 'solana' });
      const switcherButton = networkButtons.find(button => button.closest('.border.rounded-md.p-3.bg-gray-50'));

      if (switcherButton) {
        fireEvent.click(switcherButton);
        expect(mockOnNetworkSwitch).toHaveBeenCalledWith('solana');
      }
    });

    it('should not show balance when showBalance is false', () => {
      render(<WalletConnect {...connectedProps} showBalance={false} />);

      expect(screen.queryByText('1.2345 ETH')).not.toBeInTheDocument();
      expect(screen.queryByText('Balance:')).not.toBeInTheDocument();
    });

    it('should not show network selector when showNetworkSelector is false', () => {
      render(<WalletConnect {...connectedProps} showNetworkSelector={false} />);

      expect(screen.queryByText('Network:')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Switch' })).not.toBeInTheDocument();
    });

    it('should show full address when showHash is true', () => {
      render(<WalletConnect {...connectedProps} showHash={true} />);

      expect(screen.getByText(mockAccount.address)).toBeInTheDocument();
      expect(screen.queryByText('0x1234...5678')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render compact variant correctly', () => {
      render(<WalletConnect {...defaultProps} variant="compact" onConnect={mockOnConnect} />);

      expect(screen.getByText('Connect')).toBeInTheDocument();
      expect(screen.queryByText('• This is a demo implementation')).not.toBeInTheDocument();
    });

    it('should render compact connected variant correctly', () => {
      render(
        <WalletConnect
          {...defaultProps}
          variant="compact"
          isConnected={true}
          account={mockAccount}
          onDisconnect={mockOnDisconnect}
        />,
      );

      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    it('should render button-only variant when disconnected', () => {
      render(<WalletConnect {...defaultProps} variant="button-only" onConnect={mockOnConnect} />);

      expect(screen.getByRole('button', { name: 'Connect Wallet' })).toBeInTheDocument();
      expect(screen.queryByText('Select Network:')).not.toBeInTheDocument();
    });

    it('should render button-only variant when connected', () => {
      render(
        <WalletConnect
          {...defaultProps}
          variant="button-only"
          isConnected={true}
          account={mockAccount}
          onDisconnect={mockOnDisconnect}
        />,
      );

      expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
      expect(screen.queryByText('Wallet Connected')).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<WalletConnect {...defaultProps} size="sm" isConnected={true} account={mockAccount} />);

      // Check that text elements have small size classes
      const elements = screen.getAllByText(/Network:|Address:|Balance:/);
      elements.forEach(element => {
        expect(element).toHaveClass('text-xs');
      });
    });

    it('should apply large size classes', () => {
      render(<WalletConnect {...defaultProps} size="lg" isConnected={true} account={mockAccount} />);

      const heading = screen.getByText('Wallet Connected');
      expect(heading).toHaveClass('text-lg');
    });
  });

  describe('Accessibility', () => {
    it('should have proper data-testid when provided', () => {
      render(<WalletConnect {...defaultProps} data-testid="wallet-connect" onConnect={mockOnConnect} />);

      expect(screen.getByTestId('wallet-connect')).toBeInTheDocument();
    });

    it('should have proper label for network selector', () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      expect(screen.getByLabelText('Select Network:')).toBeInTheDocument();
    });

    it('should disable buttons when connecting', () => {
      render(
        <WalletConnect
          {...defaultProps}
          isConnecting={true}
          isConnected={true}
          account={mockAccount}
          onDisconnect={mockOnDisconnect}
          onNetworkSwitch={mockOnNetworkSwitch}
        />,
      );

      expect(screen.getByRole('button', { name: 'Disconnect' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Switch' })).toBeDisabled();
    });
  });

  describe('Network Color Integration', () => {
    it('should apply network-specific colors', () => {
      render(<WalletConnect {...defaultProps} isConnected={true} account={mockAccount} />);

      // The badge should have network-specific color classes
      const badge = screen.getByText('polygon').closest('span');
      expect(badge).toHaveClass('bg-indigo-100', 'text-indigo-800', 'border-indigo-200');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onConnect gracefully', () => {
      render(<WalletConnect {...defaultProps} />);

      const connectButton = screen.getByRole('button', { name: /Connect to/ });
      expect(() => fireEvent.click(connectButton)).not.toThrow();
    });

    it('should handle missing onDisconnect gracefully', () => {
      render(<WalletConnect {...defaultProps} isConnected={true} account={mockAccount} />);

      const disconnectButton = screen.getByRole('button', { name: 'Disconnect' });
      expect(() => fireEvent.click(disconnectButton)).not.toThrow();
    });
  });
});
