/* eslint-disable no-unused-vars */
import { BlockchainNetwork, getNetworkDisplayInfo } from '@todo/services';
import { Card, CardContent, Badge, Button } from '@todo/ui-mobile';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { type Todo } from '../store/todoStore';

interface TodoItemProps {
  todo: Todo;
  onToggle: (_id: string) => void;
  onEdit: (_todo: Todo) => void;
  onDelete: (_id: string) => void;
  onBlockchainSync?: (_id: string, _network: BlockchainNetwork) => void;
}

export const TodoItem = ({ todo, onToggle, onEdit, onDelete, onBlockchainSync }: TodoItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  const getNetworkColor = (network: BlockchainNetwork): string => {
    return getNetworkDisplayInfo(network).color;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  const handleDelete = () => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(todo.id) },
    ]);
  };

  const handleBlockchainSync = () => {
    if (!onBlockchainSync) return;

    Alert.alert('Sync to Blockchain', 'Choose a network to sync this todo:', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Solana', onPress: () => onBlockchainSync(todo.id, BlockchainNetwork.SOLANA) },
      { text: 'Polkadot', onPress: () => onBlockchainSync(todo.id, BlockchainNetwork.POLKADOT) },
      { text: 'Polygon', onPress: () => onBlockchainSync(todo.id, BlockchainNetwork.POLYGON) },
      { text: 'Moonbeam', onPress: () => onBlockchainSync(todo.id, BlockchainNetwork.MOONBEAM) },
      { text: 'Base', onPress: () => onBlockchainSync(todo.id, BlockchainNetwork.BASE) },
    ]);
  };

  return (
    <TouchableOpacity onPress={() => setShowActions(!showActions)} activeOpacity={0.7}>
      <Card
        style={[styles.container, todo.completed && styles.completedContainer, isOverdue && styles.overdueContainer]}
      >
        <CardContent>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => onToggle(todo.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={[styles.checkboxInner, todo.completed && styles.checkboxChecked]}>
                {todo.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>

            <View style={styles.content}>
              <Text style={[styles.title, todo.completed && styles.completedTitle]} numberOfLines={2}>
                {todo.title}
              </Text>

              {todo.description && (
                <Text style={[styles.description, todo.completed && styles.completedDescription]} numberOfLines={2}>
                  {todo.description}
                </Text>
              )}

              <View style={styles.metadata}>
                <Badge
                  variant="primary"
                  size="small"
                  text={todo.priority}
                  style={[styles.priorityBadge, { backgroundColor: priorityColors[todo.priority] }]}
                />

                {todo.dueDate && (
                  <View style={[styles.dueDateBadge, isOverdue && styles.overdueBadge]}>
                    <Text style={[styles.dueDateText, isOverdue && styles.overdueText]}>
                      {formatDate(todo.dueDate)}
                    </Text>
                  </View>
                )}

                {todo.blockchainNetwork && (
                  <Badge
                    variant="primary"
                    size="small"
                    text={getNetworkDisplayInfo(todo.blockchainNetwork).displayName}
                    style={[styles.networkBadge, { backgroundColor: getNetworkColor(todo.blockchainNetwork) }]}
                  />
                )}
              </View>

              {todo.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {todo.tags.slice(0, 3).map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                  {todo.tags.length > 3 && <Text style={styles.moreTagsText}>+{todo.tags.length - 3}</Text>}
                </View>
              )}

              {todo.transactionHash && (
                <View style={styles.transactionContainer}>
                  <Text style={styles.transactionLabel}>Tx:</Text>
                  <Text style={styles.transactionHash}>
                    {todo.transactionHash.slice(0, 8)}...{todo.transactionHash.slice(-8)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {showActions && (
            <View style={styles.actionsContainer}>
              <Button
                variant="outline"
                size="small"
                title="Edit"
                style={styles.actionButton}
                onPress={() => onEdit(todo)}
              />

              <Button
                variant="outline"
                size="small"
                title="Delete"
                style={styles.actionButton}
                onPress={handleDelete}
              />

              {onBlockchainSync && !todo.blockchainNetwork && (
                <Button
                  variant="primary"
                  size="small"
                  title="Sync"
                  style={styles.actionButton}
                  onPress={handleBlockchainSync}
                />
              )}
            </View>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  completedContainer: {
    opacity: 0.7,
  },
  overdueContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  completedDescription: {
    color: '#9ca3af',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  dueDateBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  overdueBadge: {
    backgroundColor: '#fef2f2',
  },
  dueDateText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  overdueText: {
    color: '#dc2626',
  },
  networkBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '500',
  },
  moreTagsText: {
    color: '#6b7280',
    fontSize: 12,
    fontStyle: 'italic',
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  transactionLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginRight: 4,
  },
  transactionHash: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    marginLeft: 8,
  },
  deleteButton: {
    // Custom styling can be added here if needed
  },
  syncButton: {
    // Custom styling can be added here if needed
  },
});
