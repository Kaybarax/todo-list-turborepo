import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Web-compatible Switch component for Storybook
interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: {
    false: string;
    true: string;
  };
  testID?: string;
  accessibilityLabel?: string;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  trackColor = {
    false: '#F2F2F7',
    true: '#007AFF',
  },
  thumbColor = {
    false: '#FFFFFF',
    true: '#FFFFFF',
  },
  testID,
  accessibilityLabel,
}) => {
  // Theme colors matching the React Native theme
  const colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    medium: '#8E8E93',
    light: '#F2F2F7',
    white: '#FFFFFF',
    text: '#000000',
    border: '#CECED2',
  };

  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
  };

  const fontSizes = {
    md: 16,
  };

  const handleChange = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: disabled ? 0.6 : 1,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: fontSizes.md,
    color: disabled ? colors.medium : colors.text,
    marginRight: spacing.md,
    flex: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  const switchTrackStyle: React.CSSProperties = {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: value ? trackColor.true : trackColor.false,
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    border: value ? 'none' : `1px solid ${colors.border}`,
    boxSizing: 'border-box',
  };

  const switchThumbStyle: React.CSSProperties = {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: value ? thumbColor.true : thumbColor.false,
    position: 'absolute',
    top: '50%',
    left: value ? 'calc(100% - 29px)' : '2px',
    transform: 'translateY(-50%)',
    transition: 'left 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const hiddenInputStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <div style={containerStyle} onClick={handleChange} data-testid={testID}>
      {label && <span style={labelStyle}>{label}</span>}
      <div style={switchTrackStyle}>
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
          disabled={disabled}
          style={hiddenInputStyle}
          data-testid={`${testID}-input`}
          aria-label={accessibilityLabel || label}
          aria-checked={value}
          role="switch"
        />
        <div style={switchThumbStyle} />
      </div>
    </div>
  );
};

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable switch component with on/off states, disabled variants, and mobile touch interaction support (web preview)',
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
    trackColor: {
      control: { type: 'object' },
      description: 'Colors for the switch track in false and true states',
    },
    thumbColor: {
      control: { type: 'object' },
      description: 'Colors for the switch thumb in false and true states',
    },
    accessibilityLabel: {
      control: { type: 'text' },
      description: 'Accessibility label for screen readers',
    },
    onValueChange: { action: 'value changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic states
export const Default: Story = {
  args: {
    value: false,
    label: 'Switch',
    onValueChange: value => console.log('Switch changed:', value),
  },
};

export const On: Story = {
  args: {
    value: true,
    label: 'Switch On',
    onValueChange: value => console.log('Switch changed:', value),
  },
};

export const Off: Story = {
  args: {
    value: false,
    label: 'Switch Off',
    onValueChange: value => console.log('Switch changed:', value),
  },
};

// Disabled states
export const Disabled: Story = {
  args: {
    value: false,
    disabled: true,
    label: 'Disabled Switch',
    onValueChange: value => console.log('This should not be called'),
  },
};

export const DisabledOn: Story = {
  args: {
    value: true,
    disabled: true,
    label: 'Disabled Switch (On)',
    onValueChange: value => console.log('This should not be called'),
  },
};

export const DisabledOff: Story = {
  args: {
    value: false,
    disabled: true,
    label: 'Disabled Switch (Off)',
    onValueChange: value => console.log('This should not be called'),
  },
};

// Without label
export const WithoutLabel: Story = {
  args: {
    value: false,
    accessibilityLabel: 'Toggle setting',
    onValueChange: value => console.log('Switch changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch without visible label but with accessibility label for screen readers',
      },
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    value: true,
    label: 'Custom Colors',
    trackColor: {
      false: '#F2F2F7',
      true: '#34C759',
    },
    thumbColor: {
      false: '#FFFFFF',
      true: '#FFFFFF',
    },
    onValueChange: value => console.log('Switch changed:', value),
  },
};

export const DangerColor: Story = {
  args: {
    value: true,
    label: 'Danger Color',
    trackColor: {
      false: '#F2F2F7',
      true: '#FF3B30',
    },
    thumbColor: {
      false: '#FFFFFF',
      true: '#FFFFFF',
    },
    onValueChange: value => console.log('Switch changed:', value),
  },
};

export const WarningColor: Story = {
  args: {
    value: true,
    label: 'Warning Color',
    trackColor: {
      false: '#F2F2F7',
      true: '#FF9500',
    },
    thumbColor: {
      false: '#FFFFFF',
      true: '#FFFFFF',
    },
    onValueChange: value => console.log('Switch changed:', value),
  },
};

export const SecondaryColor: Story = {
  args: {
    value: true,
    label: 'Secondary Color',
    trackColor: {
      false: '#F2F2F7',
      true: '#5856D6',
    },
    thumbColor: {
      false: '#FFFFFF',
      true: '#FFFFFF',
    },
    onValueChange: value => console.log('Switch changed:', value),
  },
};

// State combinations
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch value={false} label="Off" onValueChange={() => {}} />
      <Switch value={true} label="On" onValueChange={() => {}} />
      <Switch value={false} disabled={true} label="Disabled Off" onValueChange={() => {}} />
      <Switch value={true} disabled={true} label="Disabled On" onValueChange={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All switch states displayed together for comparison',
      },
    },
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch
        value={true}
        label="Primary (Default)"
        trackColor={{ false: '#F2F2F7', true: '#007AFF' }}
        onValueChange={() => {}}
      />
      <Switch
        value={true}
        label="Success"
        trackColor={{ false: '#F2F2F7', true: '#34C759' }}
        onValueChange={() => {}}
      />
      <Switch
        value={true}
        label="Warning"
        trackColor={{ false: '#F2F2F7', true: '#FF9500' }}
        onValueChange={() => {}}
      />
      <Switch value={true} label="Danger" trackColor={{ false: '#F2F2F7', true: '#FF3B30' }} onValueChange={() => {}} />
      <Switch
        value={true}
        label="Secondary"
        trackColor={{ false: '#F2F2F7', true: '#5856D6' }}
        onValueChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Switch with different color variants',
      },
    },
  },
};

// Real-world usage examples
export const SettingsPanel: Story = {
  render: () => {
    const [settings, setSettings] = React.useState({
      notifications: true,
      darkMode: false,
      autoSync: true,
      locationServices: false,
      analytics: false,
    });

    const updateSetting = (key: keyof typeof settings) => (value: boolean) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>App Settings</h3>

        <Switch
          value={settings.notifications}
          label="Push Notifications"
          onValueChange={updateSetting('notifications')}
        />

        <Switch value={settings.darkMode} label="Dark Mode" onValueChange={updateSetting('darkMode')} />

        <Switch
          value={settings.autoSync}
          label="Auto Sync"
          trackColor={{ false: '#F2F2F7', true: '#34C759' }}
          onValueChange={updateSetting('autoSync')}
        />

        <Switch
          value={settings.locationServices}
          label="Location Services"
          trackColor={{ false: '#F2F2F7', true: '#FF9500' }}
          onValueChange={updateSetting('locationServices')}
        />

        <Switch
          value={settings.analytics}
          label="Analytics & Crash Reports"
          trackColor={{ false: '#F2F2F7', true: '#FF3B30' }}
          onValueChange={updateSetting('analytics')}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Interactive settings panel example showing multiple switches with different colors',
      },
    },
  },
};

export const PrivacySettings: Story = {
  render: () => {
    const [privacy, setPrivacy] = React.useState({
      profileVisible: true,
      shareLocation: false,
      allowMessages: true,
      showOnlineStatus: false,
      dataCollection: false,
    });

    const updatePrivacy = (key: keyof typeof privacy) => (value: boolean) => {
      setPrivacy(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '350px' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>Privacy Settings</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Control how your information is shared and used</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Switch
            value={privacy.profileVisible}
            label="Make profile visible to others"
            onValueChange={updatePrivacy('profileVisible')}
          />

          <Switch
            value={privacy.shareLocation}
            label="Share location with friends"
            trackColor={{ false: '#F2F2F7', true: '#FF9500' }}
            onValueChange={updatePrivacy('shareLocation')}
          />

          <Switch
            value={privacy.allowMessages}
            label="Allow messages from anyone"
            trackColor={{ false: '#F2F2F7', true: '#34C759' }}
            onValueChange={updatePrivacy('allowMessages')}
          />

          <Switch
            value={privacy.showOnlineStatus}
            label="Show when I'm online"
            onValueChange={updatePrivacy('showOnlineStatus')}
          />

          <Switch
            value={privacy.dataCollection}
            label="Allow data collection for analytics"
            trackColor={{ false: '#F2F2F7', true: '#FF3B30' }}
            onValueChange={updatePrivacy('dataCollection')}
          />
        </div>

        <div
          style={{
            padding: '12px',
            backgroundColor: '#F2F2F7',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#666',
          }}
        >
          <strong>Note:</strong> Changes to privacy settings take effect immediately and may affect your app experience.
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Privacy settings example with explanatory text and different switch colors for different privacy levels',
      },
    },
  },
};

export const AccessibilityExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>Accessibility Features</h4>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
          These switches demonstrate proper accessibility implementation with ARIA attributes:
        </p>
      </div>

      <Switch
        value={false}
        label="Enable notifications"
        accessibilityLabel="Enable push notifications for this application"
        onValueChange={() => {}}
      />

      <Switch
        value={true}
        label="High contrast mode"
        accessibilityLabel="Enable high contrast mode for better visibility"
        trackColor={{ false: '#F2F2F7', true: '#000000' }}
        onValueChange={() => {}}
      />

      <Switch
        value={false}
        label="Reduce motion"
        accessibilityLabel="Reduce motion and animations throughout the app"
        onValueChange={() => {}}
      />

      <Switch
        value={true}
        disabled={true}
        label="Voice control (requires iOS 13+)"
        accessibilityLabel="Voice control feature, disabled because iOS version requirement not met"
        onValueChange={() => {}}
      />

      <Switch
        value={false}
        label="Screen reader optimizations"
        accessibilityLabel="Enable optimizations for screen reader users"
        trackColor={{ false: '#F2F2F7', true: '#5856D6' }}
        onValueChange={() => {}}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Accessibility examples showing proper ARIA attributes, labels, and considerations for screen readers and assistive technologies',
      },
    },
  },
};

// Mobile touch interaction examples
export const TouchInteractionExample: Story = {
  render: () => {
    const [touchFeedback, setTouchFeedback] = React.useState('');
    const [lastChanged, setLastChanged] = React.useState<string | null>(null);

    const handleTouch = (switchName: string) => (value: boolean) => {
      setTouchFeedback(`${switchName} switched ${value ? 'ON' : 'OFF'}`);
      setLastChanged(switchName);
      setTimeout(() => {
        setTouchFeedback('');
        setLastChanged(null);
      }, 2000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>Mobile Touch Interactions</h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
            Tap any switch to see touch feedback. Switches provide visual and haptic feedback on mobile devices.
          </p>
        </div>

        {touchFeedback && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#007AFF',
              color: 'white',
              borderRadius: '6px',
              fontSize: '14px',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            {touchFeedback}
          </div>
        )}

        <Switch
          value={false}
          label="Airplane Mode"
          onValueChange={handleTouch('Airplane Mode')}
          trackColor={{
            false: '#F2F2F7',
            true: lastChanged === 'Airplane Mode' ? '#34C759' : '#007AFF',
          }}
        />

        <Switch
          value={true}
          label="Wi-Fi"
          onValueChange={handleTouch('Wi-Fi')}
          trackColor={{
            false: '#F2F2F7',
            true: lastChanged === 'Wi-Fi' ? '#34C759' : '#007AFF',
          }}
        />

        <Switch
          value={false}
          label="Bluetooth"
          onValueChange={handleTouch('Bluetooth')}
          trackColor={{
            false: '#F2F2F7',
            true: lastChanged === 'Bluetooth' ? '#34C759' : '#007AFF',
          }}
        />

        <Switch
          value={true}
          label="Cellular Data"
          onValueChange={handleTouch('Cellular Data')}
          trackColor={{
            false: '#F2F2F7',
            true: lastChanged === 'Cellular Data' ? '#34C759' : '#007AFF',
          }}
        />

        <div
          style={{
            padding: '12px',
            backgroundColor: '#F2F2F7',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#666',
            marginTop: '8px',
          }}
        >
          <strong>Mobile Considerations:</strong>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
            <li>Minimum touch target size of 44x44 points</li>
            <li>Visual feedback on touch (color changes, animations)</li>
            <li>Haptic feedback on supported devices</li>
            <li>Smooth animations for state transitions</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Mobile touch interaction example showing feedback, animations, and mobile-specific considerations',
      },
    },
  },
};

// Interactive example
export const InteractiveExample: Story = {
  render: () => {
    const [state, setState] = React.useState({
      value: false,
      disabled: false,
      customColors: false,
    });

    const toggleState = (key: keyof typeof state) => {
      setState(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const trackColor = state.customColors
      ? { false: '#F2F2F7', true: '#34C759' }
      : { false: '#F2F2F7', true: '#007AFF' };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Interactive Switch Demo</h4>
          <Switch
            value={state.value}
            disabled={state.disabled}
            label="Demo Switch"
            trackColor={trackColor}
            onValueChange={value => setState(prev => ({ ...prev, value }))}
          />
        </div>

        <div>
          <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Controls:</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Switch value={state.value} label="Switch Value" onValueChange={() => toggleState('value')} />
            <Switch value={state.disabled} label="Disabled State" onValueChange={() => toggleState('disabled')} />
            <Switch
              value={state.customColors}
              label="Custom Colors (Green)"
              trackColor={{ false: '#F2F2F7', true: '#34C759' }}
              onValueChange={() => toggleState('customColors')}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Interactive example allowing you to test different switch states and configurations',
      },
    },
  },
};
