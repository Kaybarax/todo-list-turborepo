/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Modal, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, CardContent, useEnhancedTheme } from '@todo/ui-mobile';
import { mapWalletNetworkToBlockchainNetwork } from '@todo/services';
import { BlockchainStats } from '../../src/components/BlockchainStats';
import { TodoForm } from '../../src/components/TodoForm';
import { TodoList } from '../../src/components/TodoList';
import { TodoFilters, type PriorityFilter, type StatusFilter } from '../../src/components/TodoFilters';
import { TodoBulkActions } from '../../src/components/TodoBulkActions';
import { Snackbar } from '../../src/components/Snackbar';
import { ErrorBanner } from '../../src/components/ErrorBanner';
import { useTodoStore, type Todo } from '../../src/store/todoStore';
import { useWallet } from '../../src/providers/WalletProvider';
import { useDesignTokens } from '../../src/hooks/useDesignTokens';

export default function Todos() {
  const tokens = useDesignTokens();
  const { evaTheme } = useEnhancedTheme();
  const {
    q,
    status: statusParam,
    priority: priorityParam,
  } = useLocalSearchParams<{
    q?: string;
    status?: string;
    priority?: string;
  }>();
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
    fetchTodos,
    syncToBlockchain,
    markAllDone,
    clearCompleted,
    undo,
  } = useTodoStore();
  const [snack, setSnack] = useState<{
    visible: boolean;
    msg: string;
    variant: 'success' | 'error' | 'info';
    actionLabel?: string;
    onAction?: () => void;
  }>({
    visible: false,
    msg: '',
    variant: 'info',
  });
  const { isConnected, account } = useWallet();
  // removed unused prevSnapshotRef from legacy logic

  // Local filter state
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<PriorityFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  // Sync initial filters from route params (e.g., /todos?status=completed&priority=high&q=pay)
  useEffect(() => {
    if (typeof q === 'string') setSearch(q);
    if (typeof statusParam === 'string') {
      const s = statusParam.toLowerCase();
      if (s === 'open' || s === 'completed' || s === 'all') setStatus(s as StatusFilter);
    }
    if (typeof priorityParam === 'string') {
      const p = priorityParam.toLowerCase();
      if (p === 'low' || p === 'medium' || p === 'high' || p === 'all') setPriority(p as PriorityFilter);
    }
  }, [q, statusParam, priorityParam]);

  const filteredTodos = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return todos.filter(t => {
      // Status filter
      if (status === 'open' && t.completed) return false;
      if (status === 'completed' && !t.completed) return false;

      // Priority filter
      if (priority !== 'all' && t.priority !== priority) return false;

      // Search across title, description, and tags (#tag matches)
      if (searchLower.length > 0) {
        const inTitle = t.title.toLowerCase().includes(searchLower);
        const inDesc = (t.description ?? '').toLowerCase().includes(searchLower);
        const inTags = (t.tags ?? []).some(
          tag => `#${tag}`.toLowerCase().includes(searchLower) || tag.toLowerCase().includes(searchLower),
        );
        if (!inTitle && !inDesc && !inTags) return false;
      }
      return true;
    });
  }, [todos, search, priority, status]);

  // Bulk action handlers with undo
  const handleMarkAllDone = () => {
    markAllDone();
    setSnack({
      visible: true,
      msg: 'Marked all as done',
      variant: 'info',
      actionLabel: 'Undo',
      onAction: () => undo(),
    });
  };

  const handleClearCompleted = () => {
    clearCompleted();
    setSnack({
      visible: true,
      msg: 'Cleared completed',
      variant: 'info',
      actionLabel: 'Undo',
      onAction: () => undo(),
    });
  };

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
    <SafeAreaView style={[styles.container, { backgroundColor: evaTheme['background-basic-color-1'] }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTodos} />}
      >
        {error && <ErrorBanner message={error} />}
        <Text testID="todos-title" style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>
          Todos
        </Text>

        {!isConnected && todos.length > 0 && (
          <Card style={styles.walletWarningContainer}>
            <CardContent>
              <Text
                style={[
                  styles.walletWarningTitle,
                  { color: tokens.colors.text.primary, fontSize: tokens.typography.fontSize.md, fontWeight: '600' },
                ]}
              >
                Wallet Not Connected
              </Text>
              <Text
                style={[
                  styles.walletWarningText,
                  {
                    color: tokens.colors.text.secondary,
                    fontSize: tokens.typography.fontSize.sm,
                    lineHeight: tokens.typography.lineHeight.normal,
                  },
                ]}
              >
                Connect your wallet to sync todos to blockchain networks.
              </Text>
            </CardContent>
          </Card>
        )}

        <TodoFilters
          search={search}
          onSearchChange={setSearch}
          priority={priority}
          onPriorityChange={setPriority}
          status={status}
          onStatusChange={setStatus}
        />

        <BlockchainStats todos={filteredTodos} />

        <TodoBulkActions
          onMarkAllDone={handleMarkAllDone}
          onClearCompleted={handleClearCompleted}
          hasTodos={filteredTodos.length > 0}
          hasCompleted={filteredTodos.some(t => t.completed)}
        />

        <View style={styles.todoListContainer}>
          {filteredTodos.length === 0 && !isLoading ? (
            <Card>
              <CardContent>
                <Text
                  style={{
                    fontSize: tokens.typography.fontSize.md,
                    fontWeight: '600',
                    marginBottom: 6,
                    color: tokens.colors.text.primary,
                  }}
                >
                  {todos.length === 0 ? 'You have no todos yet' : 'No results match your filters'}
                </Text>
                <Text style={{ color: tokens.colors.text.secondary, marginBottom: 12 }}>
                  {todos.length === 0
                    ? 'Tap the + button to create your first todo.'
                    : 'Try clearing or adjusting your filters.'}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleRefresh}
                  disabled={isLoading}
                  accessibilityLabel="Refresh todos"
                >
                  {isLoading ? 'Refreshing…' : 'Refresh'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBlockchainSync={
                isConnected && account?.network
                  ? (id, _network) => {
                      // fire-and-forget for now, could show progress toast/snackbar later
                      void (async () => {
                        try {
                          await syncToBlockchain(id, mapWalletNetworkToBlockchainNetwork(account.network));
                          setSnack({ visible: true, msg: 'Synced to blockchain', variant: 'success' });
                        } catch {
                          setSnack({ visible: true, msg: 'Failed to sync', variant: 'error' });
                        }
                      })();
                    }
                  : undefined
              }
              onRefresh={handleRefresh}
              refreshing={isLoading}
              isLoading={isLoading}
            />
          )}
        </View>

        <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: tokens.colors.background }]}>
            <View style={[styles.modalHeader, { borderColor: tokens.colors.border.default }]}>
              <Button variant="outline" size="sm" onPress={handleCancel} accessibilityLabel="Cancel and close form">
                Cancel
              </Button>
              <Text
                style={[
                  styles.modalTitle,
                  { fontSize: tokens.typography.fontSize.lg, color: tokens.colors.text.primary },
                ]}
              >
                {editingTodo ? 'Edit Todo' : 'New Todo'}
              </Text>
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
      <Button
        variant="primary"
        size="lg"
        style={styles.fab}
        onPress={() => setShowForm(true)}
        accessibilityLabel="Create new todo"
      >
        +
      </Button>
      <Snackbar
        visible={snack.visible}
        message={snack.msg}
        variant={snack.variant}
        actionLabel={snack.actionLabel}
        onAction={snack.onAction}
        onHide={() => setSnack(s => ({ ...s, visible: false }))}
      />
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
