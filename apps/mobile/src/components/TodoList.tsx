import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';
import { type Todo } from '../store/todoStore';

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onBlockchainSync?: (id: string, network: any) => void;
  onRefresh: () => void;
  refreshing: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onBlockchainSync,
  onRefresh,
  refreshing,
}) => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);

  return (
    <View>
      {todos.map(todo => (
        <Card key={todo.id} style={styles.card}>
          <CardContent>
            <Text style={[styles.title, todo.completed && styles.completed]}>{todo.title}</Text>
            {todo.description ? <Text style={styles.desc}>{todo.description}</Text> : null}
            <View style={styles.metaRow}>
              {todo.priority ? (
                <View style={[styles.badge, styles[`p_${todo.priority}` as const]]}>
                  <Text style={styles.badgeText}>{todo.priority}</Text>
                </View>
              ) : null}
              {todo.dueDate ? (
                <Text style={styles.metaText}>Due {new Date(todo.dueDate).toLocaleDateString()}</Text>
              ) : null}
            </View>
            {todo.tags && todo.tags.length > 0 ? (
              <View style={styles.tagsRow}>
                {todo.tags.map(tag => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <View style={styles.row}>
              <Button variant="outline" size="sm" onPress={() => onToggle(todo.id)}>
                {todo.completed ? 'Mark Open' : 'Mark Done'}
              </Button>
              {onBlockchainSync ? (
                <Button variant="outline" size="sm" onPress={() => onBlockchainSync(todo.id, undefined)}>
                  Sync
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" onPress={() => onEdit(todo)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onPress={() => onDelete(todo.id)}>
                Delete
              </Button>
            </View>
          </CardContent>
        </Card>
      ))}
      <Button variant="link" onPress={onRefresh} disabled={refreshing}>
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </Button>
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    card: { marginBottom: tokens.spacing.md },
    title: { fontSize: tokens.typography.fontSize.md, fontWeight: '600' },
    completed: { textDecorationLine: 'line-through' },
    desc: { color: '#6b7280', marginTop: 4 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
    metaText: { color: '#4b5563', fontSize: 12 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
    badgeText: { color: 'white', fontSize: 12, textTransform: 'capitalize' as const },
    p_low: { backgroundColor: '#10b981' },
    p_medium: { backgroundColor: '#f59e0b' },
    p_high: { backgroundColor: '#ef4444' },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
    tagChip: { backgroundColor: '#f3f4f6', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 4 },
    tagText: { color: '#374151', fontSize: 12 },
    row: { flexDirection: 'row', gap: tokens.spacing.sm, marginTop: tokens.spacing.sm },
  });

export default TodoList;
