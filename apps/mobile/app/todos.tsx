import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { TodoApiClient } from '@todo/services';

type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = new TodoApiClient({ baseUrl: 'http://localhost:3001/api/v1' });
    api
      .getTodos()
      .then(res => {
        if (res.success && res.data) {
          setTodos(res.data as unknown as Todo[]);
        } else {
          setError(res.error ?? 'Failed to load todos');
        }
      })
      .catch(e => setError(e?.message ?? 'Failed to load todos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading todos…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Todos</Text>
        <Text style={{ color: 'crimson' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos</Text>
      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        contentContainerStyle={{ gap: 8, padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoTitle}>
              {item.completed ? '✅ ' : '⬜️ '} {item.title}
            </Text>
            {!!item.description && <Text style={styles.todoDesc}>{item.description}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' },
  title: { fontSize: 22, fontWeight: '700', margin: 16 },
  todoItem: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
  },
  todoTitle: { fontSize: 16, fontWeight: '600' },
  todoDesc: { fontSize: 13, color: '#374151', marginTop: 4 },
});
