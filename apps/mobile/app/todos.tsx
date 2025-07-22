import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { TodoForm } from '../src/components/TodoForm';
import { TodoList } from '../src/components/TodoList';
import { BlockchainStats } from '../src/components/BlockchainStats';
import { useTodoStore, type Todo } from '../src/store/todoStore';
import { useWallet } from '../src/providers/WalletProvider';

export default function TodosScreen() {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    syncToBlockchain,
    fetchTodos,
  } = useTodoStore();

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

  const handleBlockchainSync = async (id: string, network: 'solana' | 'polkadot' | 'polygon') => {
    if (!isConnected) {
      Alert.alert(
        'Wallet Required',
        'Please connect your wallet first to sync todos to blockchain.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Connect Wallet', onPress: () => {
            // Navigation will be handled by the Link component
          }},
        ]
      );
      return;
    }

    try {
      await syncToBlockchain(id, network);
      // Success alert is handled by the blockchain service
    } catch (error) {
      Alert.alert('Error', 'Failed to sync to blockchain: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
          <View style={styles.walletWarningContainer}>
            <Text style={styles.walletWarningTitle}>Wallet Not Connected</Text>
            <Text style={styles.walletWarningText}>
              Connect your wallet to sync todos to blockchain networks.
            </Text>
            <Link href="/wallet" asChild>
              <TouchableOpacity style={styles.walletWarningButton}>
                <Text style={styles.walletWarningButtonText}>Connect Wallet</Text>
              </TouchableOpacity>
            </Link>
          </View>
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

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowForm(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <Modal
          visible={showForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingTodo ? 'Edit Todo' : 'New Todo'}
              </Text>
              <View style={styles.modalHeaderSpacer} />
            </View>
            
            <TodoForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={editingTodo ? {
                title: editingTodo.title,
                description: editingTodo.description,
                priority: editingTodo.priority,
                dueDate: editingTodo.dueDate ? editingTodo.dueDate.toISOString().split('T')[0] : undefined,
                tags: editingTodo.tags,
              } : undefined}
            />
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  walletWarningContainer: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  walletWarningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  walletWarningText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  walletWarningButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  walletWarningButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancelText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalHeaderSpacer: {
    width: 60,
  },
});