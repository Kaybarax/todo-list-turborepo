import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { Button } from '../../lib/components/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../lib/components/Dialog/Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  parameters: { layout: 'fullscreen' },
  render: args => {
    const [open, setOpen] = React.useState(true);
    const titleId = 'dialog-title';
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog {...args} open={open} onOpenChange={setOpen} titleId={titleId}>
          <DialogHeader>
            <DialogTitle id={titleId}>Dialog Title</DialogTitle>
            <DialogDescription>Short description for context.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p>Dialog content goes here.</p>
          </DialogContent>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
  args: { size: 'md' },
};

export const Sizes: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [size, setSize] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('sm');
    const titleId = 'dialog-title-2';
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Button
              key={s}
              onClick={() => {
                setSize(s);
                setOpen(true);
              }}
            >
              Open {s.toUpperCase()}
            </Button>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen} titleId={titleId} size={size}>
          <DialogHeader>
            <DialogTitle id={titleId}>Size: {size.toUpperCase()}</DialogTitle>
            <DialogDescription>Demonstrating size variants.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p>Content for {size} dialog.</p>
          </DialogContent>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
};
