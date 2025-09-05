/* eslint-disable no-unused-vars */
import { Button, Input } from '@todo/ui-mobile';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

import { useDesignTokens } from '../hooks/useDesignTokens';
// import { Picker } from '@react-native-picker/picker';

interface TodoFormProps {
  onSubmit: (_todo: {
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    tags: string[];
  }) => void;
  onCancel?: () => void;
  initialData?: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags: string[];
  };
}

export const TodoForm = ({ onSubmit, onCancel, initialData }: TodoFormProps) => {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority ?? 'medium');
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your todo');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
    });

    // Reset form if not editing
    if (!initialData) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setTags([]);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <Input value={title} onChangeText={setTitle} placeholder="Enter todo title" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description (optional)"
            multiline
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {(['low', 'medium', 'high'] as const).map(level => (
                <Button
                  key={level}
                  variant={priority === level ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setPriority(level)}
                  style={styles.priorityButton}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </View>
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Due Date</Text>
            <Input value={dueDate} onChangeText={setDueDate} placeholder="YYYY-MM-DD" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <Input
              style={styles.tagInput}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag"
              onSubmitEditing={addTag}
            />
            <Button variant="outline" size="sm" onPress={addTag} style={styles.addTagButton}>
              Add
            </Button>
          </View>

          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag: string) => (
                <TouchableOpacity key={tag} style={styles.tag} onPress={() => removeTag(tag)}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button variant="outline" size="lg" onPress={onCancel} style={styles.cancelButton}>
              Cancel
            </Button>
          )}
          <Button variant="primary" size="lg" onPress={handleSubmit} style={styles.submitButton}>
            {initialData ? 'Update Todo' : 'Create Todo'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    form: {
      gap: 16,
    },
    inputGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      marginBottom: 8,
      color: '#374151',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    priorityContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    priorityButton: {
      marginRight: 8,
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    tagInput: {
      flex: 1,
    },
    addTagButton: {
      marginLeft: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    tag: {
      backgroundColor: '#f3f4f6',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    tagText: {
      fontSize: 12,
      color: '#374151',
    },
    tagRemove: {
      marginLeft: 6,
      fontSize: 12,
      color: '#6b7280',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      marginRight: 8,
    },
    submitButton: {
      flex: 1,
      marginLeft: 8,
    },
  });

// (Deprecated) Old static styles removed in favor of createStyles(tokens)
