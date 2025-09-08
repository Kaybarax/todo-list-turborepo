import { getNetworkColor, getSupportedWalletNetworks } from '@todo/services';
import { Text } from '@ui-kitten/components';
import { View, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { Badge } from '../Badge';

export type NetworkType = 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base';

export interface NetworkSelectorProps {
  selectedNetwork: NetworkType;
  // eslint-disable-next-line no-unused-vars
  onNetworkSelect: (network: NetworkType) => void;
  disabled?: boolean;
  variant?: 'grid' | 'list';
  showTestnets?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const NETWORK_INFO = {
  solana: {
    name: 'Solana',
    description: 'High-performance blockchain',
    icon: '◎',
  },
  polkadot: {
    name: 'Polkadot',
    description: 'Interoperable blockchain',
    icon: '●',
  },
  polygon: {
    name: 'Polygon',
    description: 'Ethereum scaling solution',
    icon: '⬟',
  },
  moonbeam: {
    name: 'Moonbeam',
    description: 'Ethereum on Polkadot',
    icon: '🌙',
  },
  base: {
    name: 'Base',
    description: 'Coinbase L2 solution',
    icon: '🔵',
  },
};

export const NetworkSelector = ({
  selectedNetwork,
  onNetworkSelect,
  disabled = false,
  variant = 'grid',
  style,
  testID,
}: NetworkSelectorProps) => {
  const { theme, evaTheme } = useEnhancedTheme();
  // Ensure we always have an array even if the service returns null/undefined (defensive for tests/env)
  const supportedNetworks = getSupportedWalletNetworks() ?? [];

  // Get Eva Design colors
  const getBackgroundColor = () => evaTheme['background-basic-color-1'] ?? '#ffffff';
  const getBorderColor = () => evaTheme['border-basic-color-3'] ?? '#e5e7eb';
  const getTextPrimaryColor = () => evaTheme['text-basic-color'] ?? '#1f2937';
  const getTextSecondaryColor = () => evaTheme['text-hint-color'] ?? '#6b7280';
  const getDisabledOpacity = () => {
    const raw = evaTheme['opacity-disabled'];
    const parsed = parseFloat(raw ?? '0.5');
    return Number.isFinite(parsed) ? parsed : 0.5;
  };

  if (variant === 'list') {
    return (
      <View style={[styles.listContainer, style]} testID={testID}>
        {supportedNetworks.map(network => {
          const isSelected = selectedNetwork === network;
          const networkInfo = NETWORK_INFO[network];
          const networkColor = getNetworkColor(network);

          return (
            <TouchableOpacity
              key={network}
              onPress={() => onNetworkSelect(network)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
              accessibilityLabel={`${networkInfo.name}. ${networkInfo.description}`}
              style={[
                {
                  backgroundColor: getBackgroundColor(),
                  borderColor: getBorderColor(),
                  // Safely derive border radius from theme token, fallback to 8
                  borderRadius: (() => {
                    const raw = evaTheme['border-radius'];
                    const parsed = parseInt(raw ?? '');
                    return Number.isFinite(parsed) ? parsed : 8;
                  })(),
                  borderWidth: 1,
                  marginBottom: theme.spacing.sm,
                  padding: theme.spacing.md,
                },
                isSelected && { backgroundColor: networkColor + '20', borderColor: networkColor },
                disabled && { opacity: getDisabledOpacity() },
              ]}
            >
              <View style={styles.listItemContent}>
                <Text style={[styles.networkIcon, { fontSize: 24, marginBottom: 0 }]}>{networkInfo.icon}</Text>
                <View style={[styles.networkInfo, { flex: 1, marginLeft: theme.spacing.md }]}>
                  <Text category="s1" style={[{ color: getTextPrimaryColor() }, isSelected && { color: networkColor }]}>
                    {networkInfo.name}
                  </Text>
                  <Text category="c1" style={{ color: getTextSecondaryColor() }}>
                    {networkInfo.description}
                  </Text>
                </View>
                {isSelected && (
                  <Badge
                    variant="primary"
                    size="small"
                    text="✓"
                    style={[{ height: 20, minWidth: 20 }, { backgroundColor: networkColor }]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View
        style={[
          styles.gridContainer,
          {
            gap: theme.spacing.md,
            marginBottom: theme.spacing.md,
          },
        ]}
      >
        {supportedNetworks.map(network => {
          const isSelected = selectedNetwork === network;
          const networkInfo = NETWORK_INFO[network];
          const networkColor = getNetworkColor(network);

          return (
            <TouchableOpacity
              key={network}
              onPress={() => onNetworkSelect(network)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
              accessibilityLabel={`${networkInfo.name}. ${networkInfo.description}`}
              style={[
                {
                  alignItems: 'center',
                  backgroundColor: getBackgroundColor(),
                  borderColor: getBorderColor(),
                  borderRadius: (() => {
                    const raw = evaTheme['border-radius'];
                    const parsed = parseInt(raw ?? '');
                    return Number.isFinite(parsed) ? parsed : 12;
                  })(),
                  borderWidth: 2,
                  flex: 1,
                  maxWidth: '48%',
                  minWidth: '45%',
                  padding: theme.spacing.lg,
                  position: 'relative',
                },
                isSelected && { backgroundColor: networkColor + '20', borderColor: networkColor },
                disabled && { opacity: getDisabledOpacity() },
              ]}
            >
              <View style={styles.networkContent}>
                <Text style={[styles.networkIcon, { fontSize: 24, marginBottom: theme.spacing.sm }]}>
                  {networkInfo.icon}
                </Text>
                <Text
                  category="s1"
                  style={[
                    {
                      color: getTextPrimaryColor(),
                      textAlign: 'center',
                      marginBottom: theme.spacing.xs,
                    },
                    isSelected && { color: networkColor },
                  ]}
                >
                  {networkInfo.name}
                </Text>
                <Text
                  category="c1"
                  style={{
                    color: getTextSecondaryColor(),
                    textAlign: 'center',
                    lineHeight: 14,
                  }}
                >
                  {networkInfo.description}
                </Text>
              </View>

              {isSelected && (
                <View
                  style={[
                    styles.selectedIndicator,
                    {
                      position: 'absolute',
                      right: -4,
                      top: -4,
                    },
                  ]}
                >
                  <Badge
                    variant="primary"
                    size="small"
                    text="✓"
                    style={[{ height: 20, minWidth: 20 }, { backgroundColor: networkColor }]}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text
        category="c1"
        style={{
          color: getTextSecondaryColor(),
          marginTop: theme.spacing.sm,
          textAlign: 'center',
        }}
      >
        Select a blockchain network to connect your wallet
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles handled dynamically with Eva Design tokens
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  networkContent: {
    alignItems: 'center',
  },
  networkIcon: {
    // Icon styles handled dynamically
  },
  selectedIndicator: {
    // Position handled dynamically
  },
  // List variant styles
  listContainer: {
    // List container styles handled dynamically
  },
  listItemContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  networkInfo: {
    // Info styles handled dynamically
  },
});

export default NetworkSelector;
