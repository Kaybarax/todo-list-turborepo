import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';
import { useTodoStore } from '../store/todoStore';

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
  const { todos } = useTodoStore();
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [priority, setPriority] = useState<NonNullable<Props['initialData']>['priority']>(
    initialData?.priority ?? 'medium',
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? '');
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(', '));
  const webDateInputRef = useRef<any>(null);
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  const validateTitle = (value: string) => {
    if (!value.trim()) return 'Title is required';
    return undefined;
  };

  const isValidDateString = (s: string) => {
    // Expect YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return false;
    // Ensure normalization keeps same date part
    return d.toISOString().slice(0, 10) === s;
  };

  const validateDueDate = (value: string) => {
    if (!value) return undefined;
    if (!isValidDateString(value)) return 'Use format YYYY-MM-DD';
    return undefined;
  };

  // Suggested tags from existing todos (top 5 by frequency)
  const suggestedTags = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const t of todos) {
      for (const tag of t.tags ?? []) {
        const key = String(tag).trim();
        if (!key) continue;
        freq[key] = (freq[key] ?? 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [todos]);

  return (
    <Card>
      <CardContent>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, errors.title ? { borderColor: tokens.colors.border.error } : null]}
            value={title}
            onChangeText={v => {
              setTitle(v);
              setErrors(prev => ({ ...prev, title: validateTitle(v) }));
            }}
            onBlur={() => setErrors(prev => ({ ...prev, title: validateTitle(title) }))}
            placeholder="What to do?"
            accessibilityLabel="Todo title"
          />
          {errors.title ? <Text style={[styles.errorText, { color: tokens.colors.error }]}>{errors.title}</Text> : null}
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
            accessibilityLabel="Todo description"
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
          {Platform.OS === 'web' ? (
            <View style={styles.rowBetween}>
              {/* Using native input type=date on web via createElement to avoid TS DOM typings */}
              {React.createElement('input' as any, {
                ref: webDateInputRef,
                type: 'date',
                value: dueDate,
                onChange: (e: any) => setDueDate(e.target.value),
                style: {
                  borderWidth: 1,
                  borderColor: tokens.colors.border.default,
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                  flex: 1,
                  marginRight: 8,
                },
                'aria-label': 'Due date',
              })}
              <Button
                variant="outline"
                size="sm"
                onPress={() => {
                  setDueDate('');
                  if (webDateInputRef.current) {
                    try {
                      webDateInputRef.current.value = '';
                    } catch {}
                  }
                }}
                accessibilityLabel="Clear due date"
              >
                Clear
              </Button>
            </View>
          ) : (
            <View>
              <TextInput
                style={[styles.input, errors.dueDate ? { borderColor: tokens.colors.border.error } : null]}
                value={dueDate}
                onChangeText={v => {
                  setDueDate(v);
                  setErrors(prev => ({ ...prev, dueDate: validateDueDate(v) }));
                }}
                onBlur={() => setErrors(prev => ({ ...prev, dueDate: validateDueDate(dueDate) }))}
                placeholder="YYYY-MM-DD"
                inputMode="numeric"
                accessibilityLabel="Due date"
              />
              {errors.dueDate ? (
                <Text style={[styles.errorText, { color: tokens.colors.error }]}>{errors.dueDate}</Text>
              ) : null}
              <View style={[styles.row, { marginTop: 8 }]}>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setDueDate(new Date().toISOString().slice(0, 10))}
                  accessibilityLabel="Set due date to today"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setDueDate(d.toISOString().slice(0, 10));
                  }}
                  accessibilityLabel="Set due date to tomorrow"
                >
                  Tomorrow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 7);
                    setDueDate(d.toISOString().slice(0, 10));
                  }}
                  accessibilityLabel="Set due date to next week"
                >
                  Next Week
                </Button>
                <Button variant="ghost" size="sm" onPress={() => setDueDate('')} accessibilityLabel="Clear due date">
                  Clear
                </Button>
              </View>
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={tagsInput}
            onChangeText={setTagsInput}
            placeholder="e.g. work, urgent, ui"
            accessibilityLabel="Tags"
          />
          {suggestedTags.length > 0 ? (
            <View style={[styles.row, { marginTop: 8, flexWrap: 'wrap' as const }]}>
              {suggestedTags.map(tag => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    const current = tagsInput
                      .split(',')
                      .map(t => t.trim())
                      .filter(Boolean);
                    if (!current.includes(tag)) {
                      setTagsInput([...(current.length ? current : []), tag].join(', '));
                    }
                  }}
                >
                  #{tag}
                </Button>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.rowBetween}>
          <Button variant="outline" onPress={onCancel} accessibilityLabel="Cancel">
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={() => {
              const titleErr = validateTitle(title);
              const dateErr = validateDueDate(dueDate);
              setErrors({ title: titleErr, dueDate: dateErr });
              if (titleErr || dateErr) return;
              const tags = tagsInput
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);
              onSubmit({ title, description, priority, dueDate: dueDate || undefined, tags });
            }}
            disabled={!!validateTitle(title) || !!validateDueDate(dueDate)}
            accessibilityLabel="Save todo"
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
    input: { borderWidth: 1, borderColor: tokens.colors.border.default, borderRadius: 8, padding: 12, fontSize: 16 },
    textarea: { height: 100, textAlignVertical: 'top' as const },
    row: { flexDirection: 'row', gap: tokens.spacing.sm },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: tokens.spacing.md },
    errorText: { marginTop: 6, fontSize: tokens.typography.fontSize.sm },
  });

export default TodoForm;
