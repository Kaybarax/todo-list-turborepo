import { type Meta, type StoryObj } from '@storybook/react';
import { withUIKitten } from './decorators/UIKittenProvider';
import { useState } from 'react';
import React from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';
type ModalType = 'default' | 'alert' | 'confirmation';

interface WebModalProps {
  visible: boolean;
  size?: ModalSize;
  type?: ModalType;
  animation?: 'slide' | 'fade' | 'scale';
  dismissible?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const WebModal: React.FC<WebModalProps> = ({ visible, size = 'md', dismissible = true, onClose, children }) => {
  if (!visible) return null;
  const widths: Record<ModalSize, number | string> = { sm: 360, md: 480, lg: 680, fullscreen: '90vw' };
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={dismissible ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: widths[size],
          maxWidth: '90vw',
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const meta: Meta<typeof WebModal> = {
  title: 'Components/Modal',
  component: WebModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible modal component with backdrop, animations, focus management, and accessibility features.',
      },
    },
  },
  decorators: [withUIKitten],
  tags: ['autodocs'],
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
      <button onClick={() => setVisible(true)}>Open Modal</button>
      <WebModal {...args} visible={visible} onClose={() => setVisible(false)}>
        {children}
      </WebModal>
    </div>
  );
};

export const Default: Story = {
  render: args => (
    <ModalWrapper {...args}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Default Modal</div>
      <div style={{ marginBottom: 24 }}>This is a default modal with standard content and actions.</div>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        <button>Cancel</button>
        <button>Confirm</button>
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
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Alert Modal</div>
      <div style={{ marginBottom: 24 }}>This is an important alert that requires your attention.</div>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <button>OK</button>
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
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Confirm Action</div>
      <div style={{ marginBottom: 24 }}>Are you sure you want to delete this item? This action cannot be undone.</div>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        <button>Cancel</button>
        <button>Delete</button>
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
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Large Modal</div>
      <div style={{ marginBottom: 16 }}>This is a large modal with more content space.</div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600 as any, marginBottom: 8 }}>Form Content:</div>
        <div style={{ gap: 12 }}>
          <input placeholder="Name" style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
          <input placeholder="Email" style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
          <textarea placeholder="Message" rows={4} style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        <button>Cancel</button>
        <button>Submit</button>
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
      <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Fullscreen Modal</div>
      <div style={{ marginBottom: 24 }}>
        This modal takes up the entire screen, useful for complex forms or detailed content.
      </div>
      <div style={{ flex: 1, marginBottom: 24 }}>
        <div style={{ fontWeight: 600 as any, marginBottom: 16 }}>Content Area:</div>
        <div style={{ height: 200, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16 }}>
          <div>Large content area for complex interfaces</div>
        </div>
      </div>
      <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <button>Close</button>
        <button>Save Changes</button>
      </div>
    </ModalWrapper>
  ),
  args: {
    size: 'fullscreen',
    animation: 'slide',
  },
};
