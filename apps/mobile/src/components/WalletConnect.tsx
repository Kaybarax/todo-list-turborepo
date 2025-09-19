import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { useWallet } from '../providers/WalletProvider';
import { useDesignTokens } from '../hooks/useDesignTokens';

export const WalletConnect: React.FC = () => {
  const { isConnected, isConnecting, account, connect, disconnect, switchNetwork, supportedNetworks } = useWallet();
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);

  return (
    <Card style={styles.card}>
      <CardContent>
        <Text style={[styles.title, { color: tokens.colors.text.primary }]}>Wallet</Text>
        {isConnected && account ? (
          <View>
            <Text style={[styles.detail, { color: tokens.colors.text.secondary }]}>Network: {account.network}</Text>
            <Text style={[styles.detail, { color: tokens.colors.text.secondary }]}>Address: {account.address}</Text>
            {account.balance && (
              <Text style={[styles.detail, { color: tokens.colors.text.secondary }]}>Balance: {account.balance}</Text>
            )}
            <View style={styles.row}>
              <Button variant="outline" size="sm" style={styles.button} onPress={disconnect} disabled={isConnecting}>
                Disconnect
              </Button>
            </View>
            <Text style={[styles.subtitle, { color: tokens.colors.text.secondary }]}>Switch Network</Text>
            <View style={styles.row}>
              {supportedNetworks.map(n => (
                <Button key={n} variant="ghost" size="sm" style={styles.pill} onPress={() => switchNetwork(n)}>
                  {n}
                </Button>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Text style={[styles.subtitle, { color: tokens.colors.text.secondary }]}>Select a network</Text>
            <View style={styles.row}>
              {supportedNetworks.map(n => (
                <Button
                  key={n}
                  variant="primary"
                  size="sm"
                  style={styles.button}
                  onPress={() => connect(n)}
                  disabled={isConnecting}
                >
                  Connect {n}
                </Button>
              ))}
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    card: {
      marginBottom: tokens.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    pill: {
      marginRight: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
    },
    button: {
      marginRight: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
    },
    title: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: '700',
      marginBottom: tokens.spacing.sm,
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.sm,
      marginTop: tokens.spacing.sm,
    },
    detail: {
      fontSize: tokens.typography.fontSize.sm,
      marginBottom: tokens.spacing.xs,
    },
  });

export default WalletConnect;
