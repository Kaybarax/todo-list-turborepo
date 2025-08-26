import { type Meta, type StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Modal } from './Modal';
import { Button } from '../Button';
import { Text } from '../Text';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible modal component with backdrop, animations, focus management, and accessibility features.',
      },
    },
  },
  argTypes: {
    visible: {
      control: { type: 'boolean' },
      description: 'Whether the modal is visible',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'fullscreen'],
      description: 'Size of the modal',
    },
    type: {
      control: { type: 'select' },
      options: ['default', 'alert', 'confirmation'],
      description: 'Type of modal for different use cases',
    },
    animation: {
      control: { type: 'select' },
      options: ['slide', 'fade', 'scale'],
      description: 'Animation style for modal appearance',
    },
    dismissible: {
      control: { type: 'boolean' },
      description: 'Whether modal can be dismissed by backdrop tap',
    },
    onClose: { action: 'modal closed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = ({ children, ...args }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button onPress={() => setVisible(true)}>Open Modal</Button>
      <Modal {...args} visible={visible} onClose={() => setVisible(false)}>
        {children}
      </Modal>
    </div>
  );
};

export const Default: Story = {
  render: args => (
    <ModalWrapper {...args}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Default Modal</Text>
      <Text style={{ marginBottom: 24 }}>This is a default modal with standard content and actions.</Text>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Confirm
        </Button>
      </div>
    </ModalWrapper>
  ),
  args: {
    size: 'md',
    type: 'default',
    animation: 'slide',
  },
};

export const Alert: Story = {
  render: args => (
    <ModalWrapper {...args}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Alert Modal</Text>
      <Text style={{ marginBottom: 24 }}>This is an important alert that requires your attention.</Text>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Button variant="primary" size="sm">
          OK
        </Button>
      </div>
    </ModalWrapper>
  ),
  args: {
    size: 'sm',
    type: 'alert',
    animation: 'scale',
    dismissible: false,
  },
};

export const Confirmation: Story = {
  render: args => (
    <ModalWrapper {...args}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Confirm Action</Text>
      <Text style={{ marginBottom: 24 }}>Are you sure you want to delete this item? This action cannot be undone.</Text>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </div>
    </ModalWrapper>
  ),
  args: {
    size: 'sm',
    type: 'confirmation',
    animation: 'fade',
  },
};

export const LargeModal: Story = {
  render: args => (
    <ModalWrapper {...args}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16 }}>Large Modal</Text>
      <Text style={{ marginBottom: 16 }}>This is a large modal with more content space.</Text>
      <div style={{ marginBottom: 24 }}>
        <Text style={{ fontWeight: '600', marginBottom: 8 }}>Form Content:</Text>
        <div style={{ gap: 12 }}>
          <input placeholder="Name" style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
          <input placeholder="Email" style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
          <textarea placeholder="Message" rows={4} style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Submit
        </Button>
      </div>
    </ModalWrapper>
  ),
  args: {
    size: 'lg',
    animation: 'slide',
  },
};

export const FullscreenModal: Story = {
  render: args => (
    <ModalWrapper {...args}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 24 }}>Fullscreen Modal</Text>
      <Text style={{ marginBottom: 24 }}>
        This modal takes up the entire screen, useful for complex forms or detailed content.
      </Text>
      <div style={{ flex: 1, marginBottom: 24 }}>
        <Text style={{ fontWeight: '600', marginBottom: 16 }}>Content Area:</Text>
        <div style={{ height: 200, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16 }}>
          <Text>Large content area for complex interfaces</Text>
        </div>
      </div>
      <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button variant="outline">Close</Button>
        <Button variant="primary">Save Changes</Button>
      </div>
    </ModalWrapper>
  ),
  args: {
    size: 'fullscreen',
    animation: 'slide',
  },
};
