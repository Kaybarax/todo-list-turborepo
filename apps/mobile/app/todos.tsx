/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises */
import { type BlockchainNetwork } from '@todo/services';
import { Card, CardContent, Button, Input } from '@todo/ui-mobile';
import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TodoForm } from '../src/components/TodoForm';
import { BlockchainStats } from '../src/components/BlockchainStats';
import { TodoItem } from '../src/components/TodoItem';
import { useDesignTokens } from '../src/hooks/useDesignTokens';
import { TodoList } from '../src/components/TodoList';
import { useWallet } from '../src/providers/WalletProvider';
import { useTodoStore, type Todo } from '../src/store/todoStore';

const TodosScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const { todos, isLoading, error, addTodo, updateTodo, deleteTodo, toggleTodo, syncToBlockchain, fetchTodos } =
    useTodoStore();

  const { isConnected } = useWallet();
  const tokens = useDesignTokens();

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

  const handleBlockchainSync = async (id: string, network: BlockchainNetwork) => {
    if (!isConnected) {
      Alert.alert('Wallet Required', 'Please connect your wallet first to sync todos to blockchain.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect Wallet',
          onPress: () => {
            // Navigation will be handled by the Link component
          },
        },
      ]);
      return;
    }

    try {
      await syncToBlockchain(id, network);
      // Success alert is handled by the blockchain service
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to sync to blockchain: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
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
              <Link href="/wallet" asChild>
                <Button variant="primary" size="sm" onPress={() => {}} style={styles.walletWarningButton}>
                  Connect Wallet
                </Button>
              </Link>
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
            onBlockchainSync={isConnected ? handleBlockchainSync : undefined}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  walletWarningContainer: {
    marginBottom: 16,
  },
  walletWarningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  walletWarningText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  walletWarningButton: {
    marginTop: 8,
  },
  todoListContainer: {
    flex: 1,
    minHeight: 400,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalHeaderSpacer: {
    width: 60,
  },
});

export default TodosScreen;
