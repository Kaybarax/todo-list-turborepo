import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { Switch, type SwitchProps } from '../../lib/components/Switch/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Native Switch (Toggle) component backed by UI Kitten. Provides value, disabled, status, and label props. Replaces prior web-only implementation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'boolean' },
      description: 'Whether the switch is on (true) or off (false)',
    },
    label: {
      control: { type: 'text' },
      description: 'Text label to display next to the switch',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the switch is disabled',
    },
    status: {
      control: { type: 'select' },
      options: ['basic', 'primary', 'success', 'info', 'warning', 'danger'],
      description: 'Color/status variant mapped to Eva Design tokens',
    },
    accessibilityLabel: {
      control: { type: 'text' },
      description: 'Accessibility label for screen readers',
    },
    onValueChange: { action: 'value changed' },
  },
};

export default meta;
type Story = StoryObj<SwitchProps>;

// Basic states
const ControlledSwitchComponent: React.FC<Partial<SwitchProps>> = ({ label = 'Controlled Switch', ...rest }) => {
  const [value, setValue] = React.useState(false);
  return (
    <React.Fragment>
      <Switch {...rest} label={label} value={value} onValueChange={setValue} />
    </React.Fragment>
  );
};

export const Controlled: Story = {
  render: args => <ControlledSwitchComponent {...args} />,
  args: { label: 'Controlled Switch' },
  parameters: {
    docs: { description: { story: 'A controlled switch component with state managed by the parent.' } },
  },
};
// Disabled variants
export const Disabled: Story = { args: { value: false, disabled: true, label: 'Disabled Switch' } };

export const DisabledOn: Story = { args: { value: true, disabled: true, label: 'Disabled Switch (On)' } };

export const DisabledOff: Story = { args: { value: false, disabled: true, label: 'Disabled Switch (Off)' } };

// Without label
export const WithoutLabel: Story = {
  args: { value: false, accessibilityLabel: 'Toggle setting' },
  parameters: { docs: { description: { story: 'Switch without visible label but with accessibility label.' } } },
};

// Custom colors
export const StatusSuccess: Story = { args: { value: true, label: 'Success Status', status: 'success' } };

export const StatusDanger: Story = { args: { value: true, label: 'Danger Status', status: 'danger' } };

export const StatusWarning: Story = { args: { value: true, label: 'Warning Status', status: 'warning' } };

export const StatusInfo: Story = { args: { value: true, label: 'Info Status', status: 'info' } };

// State combinations
export const AllStates: Story = {
  render: () => (
    <React.Fragment>
      <Switch value={false} label="Off" onValueChange={() => {}} />
      <Switch value={true} label="On" onValueChange={() => {}} />
      <Switch value={false} disabled={true} label="Disabled Off" onValueChange={() => {}} />
      <Switch value={true} disabled={true} label="Disabled On" onValueChange={() => {}} />
    </React.Fragment>
  ),
  parameters: { docs: { description: { story: 'All switch states displayed together.' } } },
};

export const StatusVariants: Story = {
  render: () => (
    <React.Fragment>
      <Switch value={true} label="Primary" status="primary" onValueChange={() => {}} />
      <Switch value={true} label="Success" status="success" onValueChange={() => {}} />
      <Switch value={true} label="Warning" status="warning" onValueChange={() => {}} />
      <Switch value={true} label="Danger" status="danger" onValueChange={() => {}} />
      <Switch value={true} label="Info" status="info" onValueChange={() => {}} />
      <Switch value={true} label="Basic" status="basic" onValueChange={() => {}} />
    </React.Fragment>
  ),
  parameters: { docs: { description: { story: 'Status/color variants provided by Eva Design tokens.' } } },
};

// Real-world usage examples
// Simplified settings panel using status props
const SettingsPanelComponent: React.FC = () => {
  const [settings, setSettings] = React.useState({ notifications: true, darkMode: false, autoSync: true });
  const update = (k: keyof typeof settings) => (v: boolean) => setSettings(s => ({ ...s, [k]: v }));
  return (
    <React.Fragment>
      <Switch value={settings.notifications} label="Notifications" onValueChange={update('notifications')} />
      <Switch value={settings.darkMode} label="Dark Mode" status="info" onValueChange={update('darkMode')} />
      <Switch value={settings.autoSync} label="Auto Sync" status="success" onValueChange={update('autoSync')} />
    </React.Fragment>
  );
};
export const SettingsPanel: Story = { render: () => <SettingsPanelComponent />, parameters: { layout: 'padded' } };

// Removed verbose privacy & interaction examples for brevity; can be reintroduced with native components if needed.

export const AccessibilityExample: Story = {
  render: () => (
    <React.Fragment>
      <Switch
        value={false}
        label="Enable notifications"
        accessibilityLabel="Enable push notifications"
        onValueChange={() => {}}
      />
      <Switch value={true} label="High contrast mode" status="basic" onValueChange={() => {}} />
      <Switch value={false} label="Reduce motion" onValueChange={() => {}} />
      <Switch value={true} disabled label="Voice control (disabled)" onValueChange={() => {}} />
      <Switch value={false} label="Screen reader optimizations" status="info" onValueChange={() => {}} />
    </React.Fragment>
  ),
  parameters: { layout: 'padded' },
};

// Mobile touch interaction examples
// Removed touch interaction example (web-specific). Could be rebuilt with react-native-gesture-handler if required.

// Interactive example
// Removed interactive example; controlled story covers core usage.
// @ts-nocheck
