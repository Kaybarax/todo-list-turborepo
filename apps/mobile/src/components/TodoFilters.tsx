import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Button, ButtonGroup, Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';

export type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
export type StatusFilter = 'all' | 'open' | 'completed';

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
  priority: PriorityFilter;
  onPriorityChange: (p: PriorityFilter) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  onClear?: () => void;
};

export const TodoFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  onClear,
}) => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);

  return (
    <Card style={styles.card}>
      <CardContent>
        <Text style={styles.sectionLabel}>Search</Text>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search title, description, or #tag"
          placeholderTextColor={tokens.colors.text.secondary}
        />

        <Text style={[styles.sectionLabel, styles.sectionSpacing]}>Priority</Text>
        <ButtonGroup
          attached={true}
          type="single"
          value={priority}
          onValueChange={(value: string | string[]) => onPriorityChange(value as PriorityFilter)}
        >
          {(['all', 'low', 'medium', 'high'] as const).map(p => (
            <Button key={p} size="sm" variant={priority === p ? 'primary' : 'outline'} value={p}>
              {p[0].toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </ButtonGroup>

        <Text style={[styles.sectionLabel, styles.sectionSpacing]}>Status</Text>
        <ButtonGroup
          attached={true}
          type="single"
          value={status}
          onValueChange={(value: string | string[]) => onStatusChange(value as StatusFilter)}
        >
          {(['all', 'open', 'completed'] as const).map(s => (
            <Button key={s} size="sm" variant={status === s ? 'primary' : 'outline'} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </ButtonGroup>

        <View style={styles.clearRow}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              onSearchChange('');
              onPriorityChange('all');
              onStatusChange('all');
              onClear?.();
            }}
          >
            Clear filters
          </Button>
        </View>
      </CardContent>
    </Card>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    card: { marginBottom: tokens.spacing.md },
    input: {
      borderWidth: 1,
      borderColor: tokens.colors.border.default,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: tokens.colors.text.primary,
      backgroundColor: tokens.colors.surface,
    },
    sectionLabel: {
      fontSize: tokens.typography.fontSize.sm,
      marginBottom: tokens.spacing.xs,
      color: tokens.colors.text.primary,
      fontWeight: '600',
    },
    sectionSpacing: { marginTop: tokens.spacing.sm },
    clearRow: { marginTop: tokens.spacing.sm, flexDirection: 'row', justifyContent: 'flex-end' },
  });

export default TodoFilters;
