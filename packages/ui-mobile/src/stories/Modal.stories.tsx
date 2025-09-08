import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { withUIKitten } from './decorators/UIKittenProvider';
// Direct meta object to satisfy CSF indexer.
import './shared/story-styles.css';

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
  return (
    <div className="sbOverlay" onClick={dismissible ? onClose : undefined}>
      <div role="dialog" aria-modal="true" className={`sbDialog sbDialog--${size}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// Heading class helpers (generic naming)
const headingClass = (variant: 'default' | 'large' | 'fullscreen') => `sbHeading sbHeading--${variant}`;

const meta: Meta<typeof WebModal> = {
  title: 'Components/Modal',
  component: WebModal,
  decorators: [withUIKitten],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A flexible modal component (web preview) demonstrating sizing, dismissal, and accessibility patterns.',
      },
    },
  },
  argTypes: {
    visible: { control: { type: 'boolean' }, description: 'Whether the modal is visible' },
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
      <div className={headingClass('default')}>Default Modal</div>
      <div className="sbSection">This is a default modal with standard content and actions.</div>
      <div className="sbActions">
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
      <div className={headingClass('default')}>Alert Modal</div>
      <div className="sbSection">This is an important alert that requires your attention.</div>
      <div className="sbActions sbActions--tight">
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
      <div className={headingClass('default')}>Confirm Action</div>
      <div className="sbSection">Are you sure you want to delete this item? This action cannot be undone.</div>
      <div className="sbActions">
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
      <div className={headingClass('large')}>Large Modal</div>
      <div className="sbIntro">This is a large modal with more content space.</div>
      <div className="sbSection">
        <div className="sbLabel">Form Content:</div>
        <div className="sbForm">
          <input placeholder="Name" className="sbInput" />
          <input placeholder="Email" className="sbInput" />
          <textarea placeholder="Message" rows={4} className="sbInput" />
        </div>
      </div>
      <div className="sbActions">
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
      <div className={headingClass('fullscreen')}>Fullscreen Modal</div>
      <div className="sbSection">
        This modal takes up the entire screen, useful for complex forms or detailed content.
      </div>
      <div className="sbSection sbSection--flexFill">
        <div className="sbLabel sbLabel--spaced">Content Area:</div>
        <div className="sbContentArea">
          <div>Large content area for complex interfaces</div>
        </div>
      </div>
      <div className="sbFooterSplit">
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
