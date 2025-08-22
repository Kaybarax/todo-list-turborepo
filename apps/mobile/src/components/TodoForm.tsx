/* eslint-disable no-unused-vars */
import { Input, Button } from '@todo/ui-mobile';
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
    setTags(tags.filter(tag => tag !== tagToRemove));
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
              {tags.map(tag => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  priorityButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagRemove: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 12,
  },
  submitButton: {
    flex: 1,
  },
});
