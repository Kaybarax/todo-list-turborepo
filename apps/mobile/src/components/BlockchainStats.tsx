import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent, Badge } from '@todo/ui-mobile';
import type { Todo } from '../store/todoStore';

interface BlockchainStatsProps {
  todos: Todo[];
}

export function BlockchainStats({ todos }: BlockchainStatsProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const onChain = todos.filter(todo => todo.blockchainNetwork).length;
    const offChain = total - onChain;
    
    const networkBreakdown = todos.reduce((acc, todo) => {
      if (todo.blockchainNetwork) {
        acc[todo.blockchainNetwork] = (acc[todo.blockchainNetwork] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const pendingTransactions = todos.filter(
      todo => todo.transactionHash && !todo.blockchainAddress
    ).length;

    return {
      total,
      onChain,
      offChain,
      networkBreakdown,
      pendingTransactions,
      syncPercentage: total > 0 ? Math.round((onChain / total) * 100) : 0,
    };
  }, [todos]);

  const getNetworkColor = (network: string) => {
    const colors = {
      solana: '#9333ea',
      polkadot: '#ec4899',
      polygon: '#6366f1',
    };
    return colors[network as keyof typeof colors] || '#6b7280';
  };

  if (stats.total === 0) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <CardContent>
        <Text style={styles.title}>Blockchain Integration</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#2563eb' }]}>{stats.onChain}</Text>
          <Text style={styles.statLabel}>On-Chain</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#6b7280' }]}>{stats.offChain}</Text>
          <Text style={styles.statLabel}>Off-Chain</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats.syncPercentage}%</Text>
          <Text style={styles.statLabel}>Synced</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{stats.pendingTransactions}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {Object.keys(stats.networkBreakdown).length > 0 && (
        <View style={styles.networksSection}>
          <Text style={styles.sectionTitle}>Network Distribution</Text>
          <View style={styles.networkBadges}>
            {Object.entries(stats.networkBreakdown).map(([network, count]) => (
              <Badge
                key={network}
                variant="primary"
                size="small"
                text={`${network}: ${count}`}
                style={[
                  styles.networkBadge,
                  { backgroundColor: getNetworkColor(network) },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {stats.syncPercentage < 100 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Tip</Text>
          <Text style={styles.infoText}>
            You have {stats.offChain} todo{stats.offChain !== 1 ? 's' : ''} that can be synced to blockchain networks for decentralized storage.
          </Text>
        </View>
      )}
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  networksSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  networkBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  networkBadge: {
    // Custom styling can be added here if needed
  },
  infoSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});