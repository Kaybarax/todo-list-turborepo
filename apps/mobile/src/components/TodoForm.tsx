import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';

type Props = {
  onSubmit: (data: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
  }) => void;
  onCancel: () => void;
  initialData?: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
  };
};

export const TodoForm: React.FC<Props> = ({ onSubmit, onCancel, initialData }) => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');

  return (
    <Card>
      <CardContent>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="What to do?" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="More details"
          />
        </View>
        <View style={styles.row}>
          <Button variant="outline" onPress={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onPress={() => onSubmit({ title, description })} disabled={!title.trim()}>
            Save
          </Button>
        </View>
      </CardContent>
    </Card>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    field: { marginBottom: tokens.spacing.md },
    label: { fontSize: tokens.typography.fontSize.sm, marginBottom: tokens.spacing.xs },
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 16 },
    textarea: { height: 100, textAlignVertical: 'top' as const },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: tokens.spacing.md },
  });

export default TodoForm;
