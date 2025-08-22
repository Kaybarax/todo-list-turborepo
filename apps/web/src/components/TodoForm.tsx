'use client';

import { useState } from 'react';
import { Button, Input, Badge, Textarea, Label, Select, SelectItem } from '@todo/ui-web';

interface TodoFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (todoData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="block text-base-content mb-1">
          Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter todo title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="block text-base-content mb-1">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Enter todo description"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="priority" className="block text-base-content mb-1">
            Priority
          </Label>
          <Select value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
            <SelectItem value="">Select priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </Select>
        </div>

        <div>
          <Label htmlFor="dueDate" className="block text-base-content mb-1">
            Due Date
          </Label>
          <Input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="tags" className="block text-base-content mb-1">
          Tags
        </Label>
        <div className="flex rounded-md shadow-sm">
          <Input
            type="text"
            id="tags"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a tag"
            className="flex-1 rounded-r-none"
          />
          <Button type="button" onClick={addTag} variant="outline" className="rounded-l-none border-l-0">
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="inline-flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-base-200 focus:outline-none"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="default">
          {initialData ? 'Update Todo' : 'Create Todo'}
        </Button>
      </div>
    </form>
  );
};
