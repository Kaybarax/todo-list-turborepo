import React, { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  Textarea,
} from '@todo/ui-web';
import { useTodoStore } from '../../store/todoStore';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags: string[];
  }) => void;
  initialData?: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
  };
};

export const TodoFormModal: React.FC<Props> = ({ open, onClose: onOpenChange, onSubmit, initialData }) => {
  const { todos } = useTodoStore();
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? '');
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(', '));
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  const validateTitle = (value: string) => {
    if (!value.trim()) return 'Title is required';
    return undefined;
  };

  const isValidDateString = (s: string) => {
    if (!s) return true; // Allow empty date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return false;
    return d.toISOString().slice(0, 10) === s;
  };

  const validateDueDate = (value: string) => {
    if (value && !isValidDateString(value)) return 'Use format YYYY-MM-DD';
    return undefined;
  };

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

  const handleSave = () => {
    const titleErr = validateTitle(title);
    const dateErr = validateDueDate(dueDate);
    setErrors({ title: titleErr, dueDate: dateErr });
    if (titleErr || dateErr) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSubmit({ title, description, priority, dueDate: dueDate || undefined, tags });
  };

  const handleClose = () => {
    onOpenChange();
    // Reset form state on close
    setTimeout(() => {
      setTitle(initialData?.title ?? '');
      setDescription(initialData?.description ?? '');
      setPriority(initialData?.priority ?? 'medium');
      setDueDate(initialData?.dueDate ?? '');
      setTagsInput((initialData?.tags ?? []).join(', '));
      setErrors({});
    }, 150); // delay to allow animation
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} size="lg">
      <DialogHeader>
        <DialogTitle>{initialData?.title ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <FormField label="Title" required>
          <Input
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
              if (errors.title) setErrors(e => ({ ...e, title: undefined }));
            }}
            placeholder="Enter todo title"
            state={errors.title ? 'error' : 'default'}
            helperText={errors.title}
            autoFocus
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            rows={3}
          />
        </FormField>
        <FormField label="Priority">
          <Select
            id="priority"
            value={priority}
            aria-label="Priority"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPriority(e.target.value as 'low' | 'medium' | 'high')
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormField>
        <FormField label="Due Date">
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors(e => ({ ...e, dueDate: undefined }));
            }}
            placeholder="YYYY-MM-DD"
            state={errors.dueDate ? 'error' : 'default'}
            helperText={errors.dueDate}
          />
        </FormField>
        <FormField label="Tags">
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value)}
            placeholder="Enter tags separated by commas"
          />
        </FormField>
        {suggestedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedTags.map(tag => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = tagsInput
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean);
                  if (!current.includes(tag)) {
                    setTagsInput([...current, tag].join(', '));
                  }
                }}
              >
                #{tag}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!!validateTitle(title) || !!validateDueDate(dueDate)}>
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default TodoFormModal;
