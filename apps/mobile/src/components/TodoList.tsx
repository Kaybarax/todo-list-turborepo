import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';
import { type Todo } from '../store/todoStore';
import { Skeleton } from './Skeleton';

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onBlockchainSync?: (id: string, network: any) => void;
  onRefresh: () => void;
  refreshing: boolean;
  isLoading?: boolean;
};

type RowProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onBlockchainSync?: (id: string, network: any) => void;
};

const TodoRow = React.memo(
  ({ todo, onToggle, onEdit, onDelete, onBlockchainSync }: RowProps) => {
    const tokens = useDesignTokens();
    const styles = createStyles(tokens);
    const content = (
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
            <Button
              variant="outline"
              size="sm"
              onPress={() => onToggle(todo.id)}
              accessibilityLabel={todo.completed ? 'Mark todo as open' : 'Mark todo as done'}
              style={{ minHeight: 40, paddingHorizontal: 10 }}
            >
              {todo.completed ? 'Mark Open' : 'Mark Done'}
            </Button>
            {onBlockchainSync ? (
              <Button
                variant="outline"
                size="sm"
                onPress={() => onBlockchainSync(todo.id, undefined)}
                accessibilityLabel="Sync todo to blockchain"
                style={{ minHeight: 40, paddingHorizontal: 10 }}
              >
                Sync
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              onPress={() => onEdit(todo)}
              accessibilityLabel="Edit todo"
              style={{ minHeight: 40, paddingHorizontal: 10 }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onPress={() => onDelete(todo.id)}
              accessibilityLabel="Delete todo"
              style={{ minHeight: 40, paddingHorizontal: 10 }}
            >
              Delete
            </Button>
          </View>
        </CardContent>
      </Card>
    );
    // On web, Swipeable is a no-op wrapper. On native, enable left/right actions.
    if (Platform.OS === 'web') return content;
    return (
      <Swipeable
        renderLeftActions={() => (
          <View style={{ justifyContent: 'center', paddingHorizontal: 16 }}>
            <Text style={{ color: tokens.colors.success }}>Mark {todo.completed ? 'Open' : 'Done'}</Text>
          </View>
        )}
        renderRightActions={() => (
          <View style={{ justifyContent: 'center', paddingHorizontal: 16, alignItems: 'flex-end' }}>
            <Text style={{ color: tokens.colors.error }}>Delete</Text>
          </View>
        )}
        onSwipeableLeftOpen={() => onToggle(todo.id)}
        onSwipeableRightOpen={() => onDelete(todo.id)}
      >
        {content}
      </Swipeable>
    );
  },
  (prev, next) => {
    const a = prev.todo;
    const b = next.todo;
    return (
      a.id === b.id &&
      a.title === b.title &&
      a.description === b.description &&
      a.completed === b.completed &&
      a.priority === b.priority &&
      String(a.dueDate) === String(b.dueDate) &&
      JSON.stringify(a.tags) === JSON.stringify(b.tags) &&
      prev.onBlockchainSync === next.onBlockchainSync
    );
  },
);

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onBlockchainSync,
  onRefresh,
  refreshing,
  isLoading = false,
}) => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);

  const renderSkeletonCard = (key: number) => (
    <Card key={`sk-${key}`} style={styles.card}>
      <CardContent>
        <Skeleton width={'60%'} height={16} style={{ marginBottom: 8 }} />
        <Skeleton width={'90%'} height={12} style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          <Skeleton width={70} height={14} borderRadius={9999} />
          <Skeleton width={110} height={14} borderRadius={9999} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Skeleton width={90} height={32} borderRadius={8} />
          <Skeleton width={90} height={32} borderRadius={8} />
          <Skeleton width={70} height={32} borderRadius={8} />
        </View>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <View>{Array.from({ length: 3 }).map((_, i) => renderSkeletonCard(i))}</View>;
  }

  if (!todos || todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No todos to show</Text>
        <Text style={styles.emptySubtitle}>Create your first todo or adjust filters.</Text>
        <Button variant="outline" size="sm" onPress={onRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </View>
    );
  }

  return (
    <View>
      {todos.map(todo => (
        <TodoRow
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onBlockchainSync={onBlockchainSync}
        />
      ))}
      <Button variant="link" onPress={onRefresh} disabled={refreshing}>
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </Button>
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) => {
  const chipBg =
    (tokens.colors.neutral && (tokens.colors.neutral[200] || (tokens.colors.neutral as any)['200'])) || '#f3f4f6';
  const tagTextColor = tokens.colors.text.secondary;
  return StyleSheet.create({
    card: { marginBottom: tokens.spacing.md },
    title: { fontSize: tokens.typography.fontSize.md, fontWeight: '600', color: tokens.colors.text.primary },
    completed: { textDecorationLine: 'line-through' },
    desc: { color: tokens.colors.text.secondary, marginTop: 4, fontSize: tokens.typography.fontSize.sm },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
    metaText: { color: tokens.colors.text.secondary, fontSize: tokens.typography.fontSize.xs },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
    badgeText: { color: 'white', fontSize: tokens.typography.fontSize.xs, textTransform: 'capitalize' as const },
    p_low: { backgroundColor: tokens.colors.success },
    p_medium: { backgroundColor: tokens.colors.warning },
    p_high: { backgroundColor: tokens.colors.error },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
    tagChip: { backgroundColor: chipBg, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 4 },
    tagText: { color: tagTextColor, fontSize: tokens.typography.fontSize.xs },
    row: { flexDirection: 'row', gap: tokens.spacing.sm, marginTop: tokens.spacing.sm },
    emptyContainer: { alignItems: 'center', paddingVertical: 40, gap: 8 },
    emptyTitle: { fontSize: tokens.typography.fontSize.md, fontWeight: '600', color: tokens.colors.text.primary },
    emptySubtitle: { color: tokens.colors.text.secondary, marginBottom: 8 },
  });
};

export default TodoList;
