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
  onDelete /* onBlockchainSync not used here */,
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
            <View style={styles.row}>
              <Button variant="outline" size="sm" onPress={() => onToggle(todo.id)}>
                {todo.completed ? 'Mark Open' : 'Mark Done'}
              </Button>
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
    row: { flexDirection: 'row', gap: tokens.spacing.sm, marginTop: tokens.spacing.sm },
  });

export default TodoList;
