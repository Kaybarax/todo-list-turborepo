import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Web-compatible Input component for Storybook
interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'email' | 'name' | 'tel' | 'url' | 'username' | 'password';
  maxLength?: number;
  leftIcon?: string;
  rightIcon?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  accessibilityLabel?: string;
  testID?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  defaultValue,
  error = false,
  errorMessage,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete = 'off',
  maxLength,
  leftIcon,
  rightIcon,
  onChangeText,
  onFocus,
  onBlur,
  onSubmitEditing,
  returnKeyType = 'done',
  accessibilityLabel,
  testID,
}) => {
  // Theme colors matching the React Native theme
  const colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    dark: '#1C1C1E',
    medium: '#8E8E93',
    light: '#F2F2F7',
    white: '#FFFFFF',
    black: '#000000',
    background: '#F9F9F9',
    text: '#000000',
    border: '#CECED2',
  };

  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  };

  const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
  };

  const borderRadius = {
    sm: 8,
  };

  const [focused, setFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    onChangeText?.(newValue);
  };

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !multiline) {
      onSubmitEditing?.();
    }
  };

  const renderIcon = (iconName: string) => {
    // Simple icon representation for web preview
    const iconMap: Record<string, string> = {
      'search': '🔍',
      'email': '✉️',
      'lock': '🔒',
      'user': '👤',
      'phone': '📞',
      'eye': '👁',
      'eye-off': '🙈',
      'check': '✓',
      'close': '✕',
      'calendar': '📅',
      'location': '📍',
      'camera': '📷',
      'attachment': '📎',
      'send': '➤',
      'edit': '✎',
    };

    return (
      <span style={{ 
        fontSize: 16,
        color: colors.medium,
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {iconMap[iconName] || iconName}
      </span>
    );
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: spacing.sm,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    marginBottom: spacing.xs,
    color: colors.text,
    display: 'block',
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: multiline ? 'flex-start' : 'center',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: multiline ? 'auto' : 40,
    minHeight: multiline ? numberOfLines * 20 + 20 : 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: error ? colors.danger : (focused ? colors.primary : colors.border),
    borderRadius: borderRadius.sm,
    paddingTop: multiline ? spacing.sm : 0,
    paddingBottom: multiline ? spacing.sm : 0,
    paddingLeft: leftIcon ? 40 : spacing.md,
    paddingRight: rightIcon ? 40 : spacing.md,
    fontSize: fontSizes.md,
    color: disabled ? colors.medium : colors.text,
    backgroundColor: disabled ? colors.light : colors.white,
    outline: 'none',
    resize: multiline ? 'vertical' : 'none',
    transition: 'border-color 0.2s ease-in-out',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const leftIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: spacing.sm,
    top: multiline ? spacing.sm + 2 : '50%',
    transform: multiline ? 'none' : 'translateY(-50%)',
    zIndex: 1,
    pointerEvents: 'none',
  };

  const rightIconStyle: React.CSSProperties = {
    position: 'absolute',
    right: spacing.sm,
    top: multiline ? spacing.sm + 2 : '50%',
    transform: multiline ? 'none' : 'translateY(-50%)',
    zIndex: 1,
    pointerEvents: 'none',
  };

  const errorStyle: React.CSSProperties = {
    color: colors.danger,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    display: 'block',
  };

  const inputProps = {
    placeholder,
    value: value !== undefined ? value : internalValue,
    disabled,
    maxLength,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleChange,
    onKeyPress: handleKeyPress,
    'aria-label': accessibilityLabel || label,
    'data-testid': testID,
    autoComplete,
    style: inputStyle,
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputContainerStyle}>
        {leftIcon && (
          <div style={leftIconStyle}>
            {renderIcon(leftIcon)}
          </div>
        )}
        {multiline ? (
          <textarea
            {...inputProps}
            rows={numberOfLines}
          />
        ) : (
          <input
            {...inputProps}
            type={secureTextEntry ? 'password' : keyboardType === 'email-address' ? 'email' : keyboardType === 'numeric' || keyboardType === 'number-pad' ? 'number' : keyboardType === 'phone-pad' ? 'tel' : keyboardType === 'url' ? 'url' : 'text'}
          />
        )}
        {rightIcon && (
          <div style={rightIconStyle}>
            {renderIcon(rightIcon)}
          </div>
        )}
      </div>
      {error && errorMessage && (
        <span style={errorStyle}>{errorMessage}</span>
      )}
    </div>
  );
};

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile input component with support for various input types, validation states, icons, and mobile-specific features (web preview)'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label text displayed above the input',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown when input is empty',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled value of the input',
    },
    defaultValue: {
      control: { type: 'text' },
      description: 'Default value for uncontrolled input',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the input is in error state',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message to display when in error state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    multiline: {
      control: { type: 'boolean' },
      description: 'Whether the input supports multiple lines',
    },
    numberOfLines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of lines for multiline input',
    },
    secureTextEntry: {
      control: { type: 'boolean' },
      description: 'Whether to hide text input (password field)',
    },
    keyboardType: {
      control: { type: 'select' },
      options: ['default', 'email-address', 'numeric', 'phone-pad', 'url', 'number-pad'],
      description: 'Type of keyboard to show on mobile devices',
    },
    autoCapitalize: {
      control: { type: 'select' },
      options: ['none', 'sentences', 'words', 'characters'],
      description: 'Auto-capitalization behavior',
    },
    autoComplete: {
      control: { type: 'select' },
      options: ['off', 'email', 'name', 'tel', 'url', 'username', 'password'],
      description: 'Auto-complete behavior',
    },
    maxLength: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Maximum number of characters allowed',
    },
    leftIcon: {
      control: { type: 'select' },
      options: ['', 'search', 'email', 'lock', 'user', 'phone', 'calendar', 'location', 'camera', 'attachment', 'edit'],
      description: 'Icon to display on the left side',
    },
    rightIcon: {
      control: { type: 'select' },
      options: ['', 'eye', 'eye-off', 'check', 'close', 'send'],
      description: 'Icon to display on the right side',
    },
    returnKeyType: {
      control: { type: 'select' },
      options: ['done', 'go', 'next', 'search', 'send'],
      description: 'Return key type on mobile keyboards',
    },
    onChangeText: { action: 'text changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    onSubmitEditing: { action: 'submitted' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    onChangeText: (text: string) => console.log('Text changed:', text),
  },
};

// Basic input types
export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    onChangeText: (text: string) => console.log('Name changed:', text),
  },
};

export const EmailInput: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    keyboardType: 'email-address',
    autoComplete: 'email',
    autoCapitalize: 'none',
    leftIcon: 'email',
    onChangeText: (text: string) => console.log('Email changed:', text),
  },
};

export const PasswordInput: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    secureTextEntry: true,
    autoComplete: 'password',
    autoCapitalize: 'none',
    leftIcon: 'lock',
    rightIcon: 'eye',
    onChangeText: (text: string) => console.log('Password changed:', text),
  },
};

export const PhoneInput: Story = {
  args: {
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    keyboardType: 'phone-pad',
    autoComplete: 'tel',
    leftIcon: 'phone',
    onChangeText: (text: string) => console.log('Phone changed:', text),
  },
};

export const NumericInput: Story = {
  args: {
    label: 'Age',
    placeholder: 'Enter your age',
    keyboardType: 'numeric',
    maxLength: 3,
    onChangeText: (text: string) => console.log('Age changed:', text),
  },
};

export const URLInput: Story = {
  args: {
    label: 'Website',
    placeholder: 'https://example.com',
    keyboardType: 'url',
    autoComplete: 'url',
    autoCapitalize: 'none',
    onChangeText: (text: string) => console.log('URL changed:', text),
  },
};

// Validation states
export const ErrorState: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: true,
    errorMessage: 'Please enter a valid email address',
    keyboardType: 'email-address',
    leftIcon: 'email',
    onChangeText: (text: string) => console.log('Email changed:', text),
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: 'user@example.com',
    keyboardType: 'email-address',
    leftIcon: 'email',
    rightIcon: 'check',
    onChangeText: (text: string) => console.log('Email changed:', text),
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Username',
    value: 'john_doe',
    disabled: true,
    leftIcon: 'user',
    onChangeText: (text: string) => console.log('This should not be called'),
  },
};

// Multiline inputs
export const MultilineInput: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a detailed description...',
    multiline: true,
    numberOfLines: 4,
    onChangeText: (text: string) => console.log('Description changed:', text),
  },
};

export const MultilineWithIcon: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    multiline: true,
    numberOfLines: 3,
    leftIcon: 'edit',
    rightIcon: 'send',
    onChangeText: (text: string) => console.log('Message changed:', text),
  },
};

// Character limits
export const WithMaxLength: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself (max 100 characters)',
    maxLength: 100,
    multiline: true,
    numberOfLines: 3,
    onChangeText: (text: string) => console.log(`Bio changed (${text.length}/100):`, text),
  },
};

export const TwitterStyleInput: Story = {
  args: {
    label: 'Tweet',
    placeholder: "What's happening?",
    maxLength: 280,
    multiline: true,
    numberOfLines: 3,
    onChangeText: (text: string) => console.log(`Tweet (${text.length}/280):`, text),
  },
};

// Search inputs
export const SearchInput: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: 'search',
    returnKeyType: 'search',
    autoCapitalize: 'none',
    onChangeText: (text: string) => console.log('Search query:', text),
    onSubmitEditing: () => console.log('Search submitted'),
  },
};

export const SearchWithClear: Story = {
  args: {
    placeholder: 'Search todos...',
    leftIcon: 'search',
    rightIcon: 'close',
    returnKeyType: 'search',
    autoCapitalize: 'none',
    onChangeText: (text: string) => console.log('Search query:', text),
    onSubmitEditing: () => console.log('Search submitted'),
  },
};

// Form inputs with different return key types
export const FormInputs: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input
        label="First Name"
        placeholder="Enter first name"
        returnKeyType="next"
        onChangeText={(text) => console.log('First name:', text)}
      />
      <Input
        label="Last Name"
        placeholder="Enter last name"
        returnKeyType="next"
        onChangeText={(text) => console.log('Last name:', text)}
      />
      <Input
        label="Email"
        placeholder="Enter email"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        returnKeyType="done"
        leftIcon="email"
        onChangeText={(text) => console.log('Email:', text)}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Form inputs with different return key types for better mobile UX'
      }
    }
  },
};

// Real-world examples
export const LoginForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input
        label="Username or Email"
        placeholder="Enter username or email"
        autoComplete="username"
        autoCapitalize="none"
        leftIcon="user"
        returnKeyType="next"
        onChangeText={(text) => console.log('Username:', text)}
      />
      <Input
        label="Password"
        placeholder="Enter password"
        secureTextEntry={true}
        autoComplete="password"
        autoCapitalize="none"
        leftIcon="lock"
        rightIcon="eye"
        returnKeyType="done"
        onChangeText={(text) => console.log('Password:', text)}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Login form with username and password inputs'
      }
    }
  },
};

export const ContactForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        autoComplete="name"
        leftIcon="user"
        returnKeyType="next"
        onChangeText={(text) => console.log('Name:', text)}
      />
      <Input
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        leftIcon="email"
        returnKeyType="next"
        onChangeText={(text) => console.log('Email:', text)}
      />
      <Input
        label="Phone"
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
        autoComplete="tel"
        leftIcon="phone"
        returnKeyType="next"
        onChangeText={(text) => console.log('Phone:', text)}
      />
      <Input
        label="Message"
        placeholder="Enter your message..."
        multiline={true}
        numberOfLines={4}
        leftIcon="edit"
        onChangeText={(text) => console.log('Message:', text)}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Contact form with various input types and proper mobile keyboard types'
      }
    }
  },
};

export const TodoForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input
        label="Todo Title"
        placeholder="What needs to be done?"
        returnKeyType="next"
        onChangeText={(text) => console.log('Title:', text)}
      />
      <Input
        label="Description"
        placeholder="Add more details..."
        multiline={true}
        numberOfLines={3}
        leftIcon="edit"
        onChangeText={(text) => console.log('Description:', text)}
      />
      <Input
        label="Due Date"
        placeholder="Select due date"
        leftIcon="calendar"
        onChangeText={(text) => console.log('Due date:', text)}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Todo creation form with title, description, and due date inputs'
      }
    }
  },
};

// Error validation examples
export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input
        label="Required Field"
        placeholder="This field is required"
        error={true}
        errorMessage="This field is required"
        onChangeText={(text) => console.log('Required field:', text)}
      />
      <Input
        label="Email Validation"
        placeholder="Enter valid email"
        value="invalid-email"
        keyboardType="email-address"
        leftIcon="email"
        error={true}
        errorMessage="Please enter a valid email address"
        onChangeText={(text) => console.log('Email:', text)}
      />
      <Input
        label="Password Strength"
        placeholder="Enter strong password"
        secureTextEntry={true}
        leftIcon="lock"
        error={true}
        errorMessage="Password must be at least 8 characters long"
        onChangeText={(text) => console.log('Password:', text)}
      />
      <Input
        label="Valid Input"
        placeholder="This input is valid"
        value="valid@example.com"
        keyboardType="email-address"
        leftIcon="email"
        rightIcon="check"
        onChangeText={(text) => console.log('Valid email:', text)}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Various validation states showing error and success feedback'
      }
    }
  },
};

// Mobile-specific features
export const MobileKeyboardTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input
        label="Default Keyboard"
        placeholder="Default text input"
        keyboardType="default"
        onChangeText={(text) => console.log('Default:', text)}
      />
      <Input
        label="Email Keyboard"
        placeholder="email@example.com"
        keyboardType="email-address"
        leftIcon="email"
        onChangeText={(text) => console.log('Email:', text)}
      />
      <Input
        label="Numeric Keyboard"
        placeholder="123456"
        keyboardType="numeric"
        onChangeText={(text) => console.log('Numeric:', text)}
      />
      <Input
        label="Phone Keyboard"
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
        leftIcon="phone"
        onChangeText={(text) => console.log('Phone:', text)}
      />
      <Input
        label="URL Keyboard"
        placeholder="https://example.com"
        keyboardType="url"
        onChangeText={(text) => console.log('URL:', text)}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Different keyboard types optimized for mobile input'
      }
    }
  },
};

// Interactive example
export const InteractiveExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      message: '',
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleNameChange = (text: string) => {
      setFormData(prev => ({ ...prev, name: text }));
      if (errors.name && text.trim()) {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    };

    const handleEmailChange = (text: string) => {
      setFormData(prev => ({ ...prev, email: text }));
      if (errors.email && validateEmail(text)) {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    };

    const handleMessageChange = (text: string) => {
      setFormData(prev => ({ ...prev, message: text }));
      if (errors.message && text.trim()) {
        setErrors(prev => ({ ...prev, message: '' }));
      }
    };

    const handleSubmit = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        console.log('Form submitted:', formData);
        alert('Form submitted successfully!');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <Input
          label="Name"
          placeholder="Enter your name"
          value={formData.name}
          error={!!errors.name}
          errorMessage={errors.name}
          leftIcon="user"
          onChangeText={handleNameChange}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          error={!!errors.email}
          errorMessage={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="email"
          rightIcon={formData.email && validateEmail(formData.email) ? 'check' : undefined}
          onChangeText={handleEmailChange}
        />
        <Input
          label="Message"
          placeholder="Enter your message"
          value={formData.message}
          error={!!errors.message}
          errorMessage={errors.message}
          multiline={true}
          numberOfLines={4}
          leftIcon="edit"
          onChangeText={handleMessageChange}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 16px',
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
          Submit Form
        </button>
        <div style={{ fontSize: '14px', color: '#8E8E93' }}>
          <strong>Form Data:</strong>
          <pre style={{ fontSize: '12px', marginTop: '4px' }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Interactive form with real-time validation and state management'
      }
    }
  },
};