import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';
import { type Todo } from '../store/todoStore';

export const BlockchainStats: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const completed = todos.filter(t => t.completed).length;

  return (
    <Card style={styles.card}>
      <CardContent>
        <Text style={[styles.title, { color: tokens.colors.text.primary }]}>Your Todos</Text>
        <View style={styles.row}>
          <Text style={styles.stat}>Total: {todos.length}</Text>
          <Text style={styles.stat}>Completed: {completed}</Text>
          <Text style={styles.stat}>Open: {todos.length - completed}</Text>
        </View>
      </CardContent>
    </Card>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    card: { marginBottom: tokens.spacing.lg },
    title: { fontSize: tokens.typography.fontSize.lg, fontWeight: '600', marginBottom: tokens.spacing.sm },
    row: { flexDirection: 'row', gap: tokens.spacing.lg },
    stat: { fontSize: tokens.typography.fontSize.sm, color: tokens.colors.text.secondary },
  });

export default BlockchainStats;
