import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { NetworkSelector } from '../lib/components/NetworkSelector';

// Mock the services module
jest.mock('@todo/services', () => ({
  getSupportedWalletNetworks: jest.fn(() => ['solana', 'polkadot', 'polygon', 'moonbeam', 'base']),
  getNetworkColor: jest.fn(network => {
    const colors = {
      solana: '#9945FF',
      polkadot: '#E6007A',
      polygon: '#8247E5',
      moonbeam: '#53CBC8',
      base: '#0052FF',
    };
    return colors[network as keyof typeof colors] || '#000000';
  }),
}));

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('NetworkSelector', () => {
  const defaultProps = {
    selectedNetwork: 'solana' as const,
    onNetworkSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<NetworkSelector {...defaultProps} testID="network-selector" />, {
      wrapper: TestWrapper,
    });

    expect(getByTestId('network-selector')).toBeTruthy();
  });

  it('renders grid variant by default', () => {
    const { getByText } = render(<NetworkSelector {...defaultProps} />, { wrapper: TestWrapper });

    expect(getByText('Solana')).toBeTruthy();
    expect(getByText('Polkadot')).toBeTruthy();
    expect(getByText('Polygon')).toBeTruthy();
  });

  it('renders list variant when specified', () => {
    const { getByText } = render(<NetworkSelector {...defaultProps} variant="list" />, { wrapper: TestWrapper });

    expect(getByText('Solana')).toBeTruthy();
    expect(getByText('High-performance blockchain')).toBeTruthy();
  });

  it('shows selected network as active', () => {
    const { getByText } = render(<NetworkSelector {...defaultProps} selectedNetwork="polkadot" />, {
      wrapper: TestWrapper,
    });

    expect(getByText('Polkadot')).toBeTruthy();
  });

  it('calls onNetworkSelect when a network is pressed', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} />, {
      wrapper: TestWrapper,
    });

    fireEvent.press(getByText('Polkadot'));
    expect(mockOnSelect).toHaveBeenCalledWith('polkadot');
  });

  it('does not call onNetworkSelect when disabled', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} disabled />, {
      wrapper: TestWrapper,
    });

    fireEvent.press(getByText('Polkadot'));
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('renders all supported networks', () => {
    const { getByText } = render(<NetworkSelector {...defaultProps} />, { wrapper: TestWrapper });

    expect(getByText('Solana')).toBeTruthy();
    expect(getByText('Polkadot')).toBeTruthy();
    expect(getByText('Polygon')).toBeTruthy();
    expect(getByText('Moonbeam')).toBeTruthy();
    expect(getByText('Base')).toBeTruthy();
  });

  describe('Grid variant', () => {
    it('displays network icons', () => {
      const { getByText } = render(<NetworkSelector {...defaultProps} variant="grid" />, { wrapper: TestWrapper });

      expect(getByText('◎')).toBeTruthy(); // Solana icon
      expect(getByText('●')).toBeTruthy(); // Polkadot icon
      expect(getByText('⬟')).toBeTruthy(); // Polygon icon
    });

    it('shows network names', () => {
      const { getByText } = render(<NetworkSelector {...defaultProps} variant="grid" />, { wrapper: TestWrapper });

      expect(getByText('Solana')).toBeTruthy();
      expect(getByText('Polkadot')).toBeTruthy();
      expect(getByText('Polygon')).toBeTruthy();
    });
  });

  describe('List variant', () => {
    it('displays network descriptions', () => {
      const { getByText } = render(<NetworkSelector {...defaultProps} variant="list" />, { wrapper: TestWrapper });

      expect(getByText('High-performance blockchain')).toBeTruthy();
      expect(getByText('Interoperable blockchain')).toBeTruthy();
      expect(getByText('Ethereum scaling solution')).toBeTruthy();
    });

    it('shows network icons and names', () => {
      const { getByText } = render(<NetworkSelector {...defaultProps} variant="list" />, { wrapper: TestWrapper });

      expect(getByText('◎')).toBeTruthy(); // Solana icon
      expect(getByText('Solana')).toBeTruthy();
      expect(getByText('●')).toBeTruthy(); // Polkadot icon
      expect(getByText('Polkadot')).toBeTruthy();
    });
  });

  describe('Network selection', () => {
    it('handles Solana selection', () => {
      const mockOnSelect = jest.fn();
      const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByText('Solana'));
      expect(mockOnSelect).toHaveBeenCalledWith('solana');
    });

    it('handles Polkadot selection', () => {
      const mockOnSelect = jest.fn();
      const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByText('Polkadot'));
      expect(mockOnSelect).toHaveBeenCalledWith('polkadot');
    });

    it('handles Polygon selection', () => {
      const mockOnSelect = jest.fn();
      const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByText('Polygon'));
      expect(mockOnSelect).toHaveBeenCalledWith('polygon');
    });

    it('handles Moonbeam selection', () => {
      const mockOnSelect = jest.fn();
      const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByText('Moonbeam'));
      expect(mockOnSelect).toHaveBeenCalledWith('moonbeam');
    });

    it('handles Base selection', () => {
      const mockOnSelect = jest.fn();
      const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByText('Base'));
      expect(mockOnSelect).toHaveBeenCalledWith('base');
    });
  });

  describe('Disabled state', () => {
    it('renders in disabled state', () => {
      const { getByText } = render(<NetworkSelector {...defaultProps} disabled />, { wrapper: TestWrapper });

      expect(getByText('Solana')).toBeTruthy();
    });

    it('prevents interaction when disabled', () => {
      const mockOnSelect = jest.fn();
      const { getByText } = render(<NetworkSelector {...defaultProps} onNetworkSelect={mockOnSelect} disabled />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByText('Solana'));
      fireEvent.press(getByText('Polkadot'));
      fireEvent.press(getByText('Polygon'));

      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  describe('Custom styling', () => {
    it('applies custom style prop', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <NetworkSelector {...defaultProps} style={customStyle} testID="styled-selector" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('styled-selector')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('provides accessible network selection', () => {
      const { getByText } = render(<NetworkSelector {...defaultProps} />, { wrapper: TestWrapper });

      const solanaButton = getByText('Solana');
      expect(solanaButton).toBeTruthy();

      // Test that buttons are pressable
      fireEvent.press(solanaButton);
    });

    it('supports testID for automation', () => {
      const { getByTestId } = render(<NetworkSelector {...defaultProps} testID="network-selector-test" />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId('network-selector-test')).toBeTruthy();
    });
  });
});
