import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';

type Props = {
  onMarkAllDone: () => void;
  onClearCompleted: () => void;
  hasTodos: boolean;
  hasCompleted: boolean;
};

export const TodoBulkActions: React.FC<Props> = ({ onMarkAllDone, onClearCompleted, hasTodos, hasCompleted }) => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  return (
    <Card style={styles.card}>
      <CardContent>
        <View style={styles.row}>
          <Button variant="outline" size="sm" onPress={onMarkAllDone} disabled={!hasTodos}>
            Mark all done
          </Button>
          <Button variant="destructive" size="sm" onPress={onClearCompleted} disabled={!hasCompleted}>
            Clear completed
          </Button>
        </View>
      </CardContent>
    </Card>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    card: { marginBottom: tokens.spacing.md },
    row: { flexDirection: 'row', gap: tokens.spacing.sm, justifyContent: 'space-between' },
  });

export default TodoBulkActions;
