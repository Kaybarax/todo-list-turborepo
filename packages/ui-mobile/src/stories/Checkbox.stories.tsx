import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Web-compatible Checkbox component for Storybook
interface CheckboxProps {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: boolean;
  errorMessage?: string;
  activeColor?: string;
  inactiveColor?: string;
  checkColor?: string;
  testID?: string;
  accessibilityLabel?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onValueChange,
  label,
  disabled = false,
  indeterminate = false,
  error = false,
  errorMessage,
  activeColor = '#007AFF',
  inactiveColor = '#CECED2',
  checkColor = '#FFFFFF',
  testID,
  accessibilityLabel,
}) => {
  // Theme colors matching the React Native theme
  const colors = {
    primary: '#007AFF',
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
    sm: 14,
  };

  const borderRadius = {
    xs: 4,
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onValueChange(event.target.checked);
    }
  };

  const getCheckboxColor = () => {
    if (error) return colors.danger;
    if (checked || indeterminate) return activeColor;
    return inactiveColor;
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.light;
    if (checked || indeterminate) return getCheckboxColor();
    return colors.white;
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    opacity: disabled ? 0.6 : 1,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const checkboxStyle: React.CSSProperties = {
    width: 20,
    height: 20,
    borderRadius: borderRadius.xs,
    border: `2px solid ${getCheckboxColor()}`,
    backgroundColor: getBackgroundColor(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
  };

  const hiddenInputStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: 20,
    height: 20,
    margin: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    marginLeft: spacing.sm,
    fontSize: fontSizes.md,
    color: disabled ? colors.medium : colors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.danger,
    marginTop: spacing.xs,
  };

  const renderCheckIcon = () => {
    if (indeterminate) {
      return (
        <div
          style={{
            width: 10,
            height: 2,
            backgroundColor: checkColor,
            borderRadius: 1,
          }}
        />
      );
    }
    
    if (checked) {
      return (
        <svg
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          style={{ display: 'block' }}
        >
          <path
            d="M1 4.5L4.5 8L11 1"
            stroke={checkColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    
    return null;
  };

  return (
    <div style={containerStyle}>
      <label style={checkboxContainerStyle}>
        <div style={checkboxStyle}>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            style={hiddenInputStyle}
            data-testid={testID}
            aria-label={accessibilityLabel || label}
            aria-checked={indeterminate ? 'mixed' : checked}
            aria-invalid={error}
            aria-describedby={error && errorMessage ? `${testID}-error` : undefined}
          />
          {renderCheckIcon()}
        </div>
        {label && <span style={labelStyle}>{label}</span>}
      </label>
      {error && errorMessage && (
        <div style={errorStyle} id={`${testID}-error`}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable checkbox component with support for checked, unchecked, indeterminate, disabled, and error states for mobile interfaces (web preview)'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    label: {
      control: { type: 'text' },
      description: 'Text label to display next to the checkbox',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is in indeterminate state (partially checked)',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is in error state',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message to display when in error state',
    },
    activeColor: {
      control: { type: 'color' },
      description: 'Color when checkbox is checked or indeterminate',
    },
    inactiveColor: {
      control: { type: 'color' },
      description: 'Border color when checkbox is unchecked',
    },
    checkColor: {
      control: { type: 'color' },
      description: 'Color of the check mark or indeterminate indicator',
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
    checked: false,
    label: 'Checkbox',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Checked Checkbox',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
    label: 'Unchecked Checkbox',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
    label: 'Indeterminate Checkbox',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox in indeterminate state, typically used for "select all" functionality when some but not all items are selected'
      }
    }
  },
};

// Disabled states
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Disabled Checkbox',
    onValueChange: (checked) => console.log('This should not be called'),
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled Checked Checkbox',
    onValueChange: (checked) => console.log('This should not be called'),
  },
};

export const DisabledIndeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
    disabled: true,
    label: 'Disabled Indeterminate Checkbox',
    onValueChange: (checked) => console.log('This should not be called'),
  },
};

// Error states
export const Error: Story = {
  args: {
    checked: false,
    error: true,
    errorMessage: 'This field is required',
    label: 'Required Checkbox',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const ErrorChecked: Story = {
  args: {
    checked: true,
    error: true,
    errorMessage: 'Invalid selection',
    label: 'Invalid Checkbox',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

// Without label
export const WithoutLabel: Story = {
  args: {
    checked: false,
    accessibilityLabel: 'Select item',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox without visible label but with accessibility label for screen readers'
      }
    }
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    checked: true,
    label: 'Custom Colors',
    activeColor: '#34C759',
    checkColor: '#FFFFFF',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const DangerColor: Story = {
  args: {
    checked: true,
    label: 'Danger Color',
    activeColor: '#FF3B30',
    checkColor: '#FFFFFF',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const SecondaryColor: Story = {
  args: {
    checked: true,
    label: 'Secondary Color',
    activeColor: '#5856D6',
    checkColor: '#FFFFFF',
    onValueChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

// State combinations
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox checked={false} label="Unchecked" onValueChange={() => {}} />
      <Checkbox checked={true} label="Checked" onValueChange={() => {}} />
      <Checkbox checked={false} indeterminate={true} label="Indeterminate" onValueChange={() => {}} />
      <Checkbox checked={false} disabled={true} label="Disabled Unchecked" onValueChange={() => {}} />
      <Checkbox checked={true} disabled={true} label="Disabled Checked" onValueChange={() => {}} />
      <Checkbox checked={false} indeterminate={true} disabled={true} label="Disabled Indeterminate" onValueChange={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All checkbox states displayed together for comparison'
      }
    }
  },
};

export const ErrorStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox 
        checked={false} 
        error={true} 
        errorMessage="This field is required" 
        label="Required Field" 
        onValueChange={() => {}} 
      />
      <Checkbox 
        checked={true} 
        error={true} 
        errorMessage="Invalid selection" 
        label="Invalid Selection" 
        onValueChange={() => {}} 
      />
      <Checkbox 
        checked={false} 
        indeterminate={true} 
        error={true} 
        errorMessage="Partial selection not allowed" 
        label="Partial Selection" 
        onValueChange={() => {}} 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox error states with error messages'
      }
    }
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox checked={true} label="Primary (Default)" activeColor="#007AFF" onValueChange={() => {}} />
      <Checkbox checked={true} label="Success" activeColor="#34C759" onValueChange={() => {}} />
      <Checkbox checked={true} label="Warning" activeColor="#FF9500" onValueChange={() => {}} />
      <Checkbox checked={true} label="Danger" activeColor="#FF3B30" onValueChange={() => {}} />
      <Checkbox checked={true} label="Secondary" activeColor="#5856D6" onValueChange={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with different color variants'
      }
    }
  },
};

// Real-world usage examples
export const TodoList: Story = {
  render: () => {
    const [todos, setTodos] = React.useState([
      { id: 1, text: 'Complete project documentation', completed: true },
      { id: 2, text: 'Review pull requests', completed: false },
      { id: 3, text: 'Update dependencies', completed: false },
      { id: 4, text: 'Write unit tests', completed: true },
    ]);

    const toggleTodo = (id: number) => {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    };

    const completedCount = todos.filter(todo => todo.completed).length;
    const allCompleted = completedCount === todos.length;
    const someCompleted = completedCount > 0 && completedCount < todos.length;

    const toggleAll = () => {
      const newState = !allCompleted;
      setTodos(prev => prev.map(todo => ({ ...todo, completed: newState })));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '300px' }}>
        <Checkbox
          checked={allCompleted}
          indeterminate={someCompleted}
          label={`Select All (${completedCount}/${todos.length})`}
          onValueChange={toggleAll}
        />
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #CECED2' }} />
        {todos.map(todo => (
          <Checkbox
            key={todo.id}
            checked={todo.completed}
            label={todo.text}
            onValueChange={() => toggleTodo(todo.id)}
          />
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Interactive todo list example showing select all functionality with indeterminate state'
      }
    }
  },
};

export const FormValidation: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      terms: false,
      newsletter: false,
      privacy: false,
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleChange = (field: string) => (value: boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user interacts
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

    const handleSubmit = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.terms) {
        newErrors.terms = 'You must accept the terms and conditions';
      }
      if (!formData.privacy) {
        newErrors.privacy = 'You must accept the privacy policy';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '350px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Account Settings</h3>
        
        <Checkbox
          checked={formData.terms}
          error={!!errors.terms}
          errorMessage={errors.terms}
          label="I accept the terms and conditions"
          onValueChange={handleChange('terms')}
        />
        
        <Checkbox
          checked={formData.privacy}
          error={!!errors.privacy}
          errorMessage={errors.privacy}
          label="I accept the privacy policy"
          onValueChange={handleChange('privacy')}
        />
        
        <Checkbox
          checked={formData.newsletter}
          label="Subscribe to newsletter (optional)"
          onValueChange={handleChange('newsletter')}
        />

        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Submit
        </button>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Form validation example showing required and optional checkboxes with error handling'
      }
    }
  },
};

export const AccessibilityExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Accessibility Features
        </h4>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
          These checkboxes demonstrate proper accessibility implementation:
        </p>
      </div>
      
      <Checkbox
        checked={false}
        label="Enable notifications"
        accessibilityLabel="Enable push notifications for this application"
        onValueChange={() => {}}
      />
      
      <Checkbox
        checked={true}
        label="High contrast mode"
        accessibilityLabel="Enable high contrast mode for better visibility"
        onValueChange={() => {}}
      />
      
      <Checkbox
        checked={false}
        indeterminate={true}
        label="Sync settings"
        accessibilityLabel="Partially sync settings across devices"
        onValueChange={() => {}}
      />
      
      <Checkbox
        checked={false}
        disabled={true}
        label="Premium feature (requires upgrade)"
        accessibilityLabel="Premium feature checkbox, disabled because upgrade is required"
        onValueChange={() => {}}
      />
      
      <Checkbox
        checked={false}
        error={true}
        errorMessage="This setting is required for the application to function properly"
        label="Required setting"
        accessibilityLabel="Required application setting"
        onValueChange={() => {}}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Accessibility examples showing proper ARIA attributes, labels, and error handling for screen readers'
      }
    }
  },
};

// Interactive example
export const InteractiveExample: Story = {
  render: () => {
    const [state, setState] = React.useState({
      checked: false,
      disabled: false,
      indeterminate: false,
      error: false,
    });

    const toggleState = (key: keyof typeof state) => {
      setState(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
            Interactive Checkbox Demo
          </h4>
          <Checkbox
            checked={state.checked}
            disabled={state.disabled}
            indeterminate={state.indeterminate}
            error={state.error}
            errorMessage={state.error ? 'This is an error message' : undefined}
            label="Demo Checkbox"
            onValueChange={(checked) => setState(prev => ({ ...prev, checked }))}
          />
        </div>

        <div>
          <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Controls:
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Checkbox
              checked={state.checked}
              label="Checked"
              onValueChange={() => toggleState('checked')}
            />
            <Checkbox
              checked={state.disabled}
              label="Disabled"
              onValueChange={() => toggleState('disabled')}
            />
            <Checkbox
              checked={state.indeterminate}
              label="Indeterminate"
              onValueChange={() => toggleState('indeterminate')}
            />
            <Checkbox
              checked={state.error}
              label="Error State"
              onValueChange={() => toggleState('error')}
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
        story: 'Interactive example allowing you to test different checkbox states and combinations'
      }
    }
  },
};