import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { TodoItem } from './TodoItem';
import { BlockchainNetwork } from '@todo/services';
import type { Todo } from '../store/todoStore';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onBlockchainSync?: (id: string, network: BlockchainNetwork) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'created' | 'priority' | 'dueDate' | 'title';

export function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onBlockchainSync,
  onRefresh,
  refreshing = false,
}: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('created');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = todos.filter((todo) => !todo.completed);
        break;
      case 'completed':
        filtered = todos.filter((todo) => todo.completed);
        break;
      default:
        filtered = todos;
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sort) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [todos, filter, sort, searchTerm]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const overdue = todos.filter(
      (todo) => todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
    ).length;

    return { total, completed, active, overdue };
  }, [todos]);

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
      onBlockchainSync={onBlockchainSync}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {searchTerm || filter !== 'all' ? 'No matching todos' : 'No todos yet'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchTerm || filter !== 'all'
          ? 'Try adjusting your search or filter'
          : 'Create your first todo to get started'}
      </Text>
    </View>
  );

  const FilterButton = ({ 
    type, 
    label, 
    count 
  }: { 
    type: FilterType; 
    label: string; 
    count: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === type && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(type)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === type && styles.filterButtonTextActive,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const SortButton = ({ 
    type, 
    label 
  }: { 
    type: SortType; 
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sort === type && styles.sortButtonActive,
      ]}
      onPress={() => setSort(type)}
    >
      <Text
        style={[
          styles.sortButtonText,
          sort === type && styles.sortButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#2563eb' }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#ef4444' }]}>{stats.overdue}</Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search todos..."
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Show:</Text>
            <View style={styles.filterButtons}>
              <FilterButton type="all" label="All" count={stats.total} />
              <FilterButton type="active" label="Active" count={stats.active} />
              <FilterButton type="completed" label="Done" count={stats.completed} />
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort by:</Text>
            <View style={styles.sortButtons}>
              <SortButton type="created" label="Created" />
              <SortButton type="priority" label="Priority" />
              <SortButton type="dueDate" label="Due Date" />
              <SortButton type="title" label="Title" />
            </View>
          </View>
        </View>
      )}

      {/* Todo List */}
      <FlatList
        data={filteredAndSortedTodos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  filterToggle: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  filterToggleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonActive: {
    backgroundColor: '#10b981',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  sortButtonTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});