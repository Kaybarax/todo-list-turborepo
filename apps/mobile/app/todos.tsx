/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { BlockchainStats } from '../src/components/BlockchainStats';
import { TodoForm } from '../src/components/TodoForm';
import { TodoList } from '../src/components/TodoList';
import { useTodoStore, type Todo } from '../src/store/todoStore';
import { useWallet } from '../src/providers/WalletProvider';

export default function Todos() {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { todos, isLoading, error, addTodo, updateTodo, deleteTodo, toggleTodo, fetchTodos } = useTodoStore();
  const { isConnected } = useWallet();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = (todoData: Parameters<typeof addTodo>[0]) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    } else {
      addTodo(todoData);
    }
    setShowForm(false);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleRefresh = () => {
    fetchTodos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isConnected && todos.length > 0 && (
          <Card style={styles.walletWarningContainer}>
            <CardContent>
              <Text style={styles.walletWarningTitle}>Wallet Not Connected</Text>
              <Text style={styles.walletWarningText}>Connect your wallet to sync todos to blockchain networks.</Text>
            </CardContent>
          </Card>
        )}

        <BlockchainStats todos={todos} />

        <View style={styles.todoListContainer}>
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
            refreshing={isLoading}
          />
        </View>

        <Button variant="primary" size="lg" style={styles.fab} onPress={() => setShowForm(true)}>
          +
        </Button>

        <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Button variant="outline" size="sm" onPress={handleCancel}>
                Cancel
              </Button>
              <Text style={styles.modalTitle}>{editingTodo ? 'Edit Todo' : 'New Todo'}</Text>
              <View style={styles.modalHeaderSpacer} />
            </View>

            <TodoForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={
                editingTodo
                  ? {
                      title: editingTodo.title,
                      description: editingTodo.description,
                      priority: editingTodo.priority,
                      dueDate: editingTodo.dueDate ? editingTodo.dueDate.toISOString().split('T')[0] : undefined,
                      tags: editingTodo.tags,
                    }
                  : undefined
              }
            />
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  errorContainer: { borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { fontSize: 14, textAlign: 'center' },
  walletWarningContainer: { marginBottom: 16 },
  walletWarningTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  walletWarningText: { fontSize: 14, textAlign: 'center', marginBottom: 12, lineHeight: 20 },
  todoListContainer: { flex: 1, minHeight: 400 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalHeaderSpacer: { width: 60 },
});
