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
  const [priority, setPriority] = useState<NonNullable<Props['initialData']>['priority']>(
    initialData?.priority ?? 'medium',
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? '');
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(', '));

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
        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.row}>
            {(['low', 'medium', 'high'] as const).map(p => (
              <Button key={p} variant={priority === p ? 'primary' : 'outline'} size="sm" onPress={() => setPriority(p)}>
                {p[0].toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Due Date</Text>
          <TextInput
            style={styles.input}
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD"
            inputMode="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={tagsInput}
            onChangeText={setTagsInput}
            placeholder="e.g. work, urgent, ui"
          />
        </View>

        <View style={styles.rowBetween}>
          <Button variant="outline" onPress={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={() => {
              const tags = tagsInput
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);
              onSubmit({ title, description, priority, dueDate: dueDate || undefined, tags });
            }}
            disabled={!title.trim()}
          >
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
    row: { flexDirection: 'row', gap: tokens.spacing.sm },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: tokens.spacing.md },
  });

export default TodoForm;
