import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// Web-compatible Card components for Storybook
interface CardProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  testID?: string;
}

interface CardHeaderProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface CardTitleProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface CardDescriptionProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface CardContentProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface CardFooterProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Theme colors matching the React Native theme
const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  light: '#F2F2F7',
  medium: '#8E8E93',
  white: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  border: '#E5E5EA',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const fontSizes = {
  sm: 14,
  md: 16,
  lg: 18,
};

const fontWeights = {
  medium: '500',
  bold: '700',
};

const borderRadius = {
  md: 8,
};

const shadows = {
  md: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
};

const Card: React.FC<CardProps> = ({ style, children, testID }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    ...shadows.md,
    overflow: 'hidden',
    border: `1px solid ${colors.border}`,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    ...style,
  };

  return (
    <div style={cardStyle} data-testid={testID}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ style, children }) => {
  const headerStyle: React.CSSProperties = {
    padding: spacing.md,
    paddingBottom: spacing.sm,
    ...style,
  };

  return <div style={headerStyle}>{children}</div>;
};

const CardTitle: React.FC<CardTitleProps> = ({ style, children }) => {
  const titleStyle: React.CSSProperties = {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    margin: 0,
    ...style,
  };

  return <h3 style={titleStyle}>{children}</h3>;
};

const CardDescription: React.FC<CardDescriptionProps> = ({ style, children }) => {
  const descriptionStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.medium,
    margin: 0,
    ...style,
  };

  return <p style={descriptionStyle}>{children}</p>;
};

const CardContent: React.FC<CardContentProps> = ({ style, children }) => {
  const contentStyle: React.CSSProperties = {
    padding: spacing.md,
    ...style,
  };

  return <div style={contentStyle}>{children}</div>;
};

const CardFooter: React.FC<CardFooterProps> = ({ style, children }) => {
  const footerStyle: React.CSSProperties = {
    padding: spacing.md,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
    ...style,
  };

  return <div style={footerStyle}>{children}</div>;
};

// Simple Button component for use in Card stories
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', size = 'small', disabled = false }) => {
  const variantStyles = {
    primary: { backgroundColor: colors.primary, color: colors.white, borderColor: colors.primary },
    secondary: { backgroundColor: colors.secondary, color: colors.white, borderColor: colors.secondary },
    outline: { backgroundColor: 'transparent', color: colors.primary, borderColor: colors.primary },
    danger: { backgroundColor: colors.danger, color: colors.white, borderColor: colors.danger },
    success: { backgroundColor: colors.success, color: colors.white, borderColor: colors.success },
    ghost: { backgroundColor: 'transparent', color: colors.primary, borderColor: 'transparent' },
  };

  const sizeStyles = {
    small: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, fontSize: fontSizes.sm },
    medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, fontSize: fontSizes.md },
    large: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, fontSize: fontSizes.lg },
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: borderRadius.md,
    paddingTop: sizeStyles[size].paddingVertical,
    paddingBottom: sizeStyles[size].paddingVertical,
    paddingLeft: sizeStyles[size].paddingHorizontal,
    paddingRight: sizeStyles[size].paddingHorizontal,
    backgroundColor: disabled ? colors.medium : variantStyles[variant].backgroundColor,
    color: disabled ? colors.light : variantStyles[variant].color,
    border: `1px solid ${disabled ? colors.medium : variantStyles[variant].borderColor}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: sizeStyles[size].fontSize,
    fontWeight: fontWeights.medium,
    textDecoration: 'none',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <button style={buttonStyle} onClick={onPress} disabled={disabled} type="button">
      {title}
    </button>
  );
};

// Simple Badge component for use in Card stories
interface BadgeProps {
  text: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium';
}

const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', size = 'small' }) => {
  const variantStyles = {
    default: { backgroundColor: colors.light, color: colors.medium },
    primary: { backgroundColor: colors.primary, color: colors.white },
    secondary: { backgroundColor: colors.secondary, color: colors.white },
    success: { backgroundColor: colors.success, color: colors.white },
    warning: { backgroundColor: colors.warning, color: colors.white },
    danger: { backgroundColor: colors.danger, color: colors.white },
  };

  const sizeStyles = {
    small: { paddingVertical: spacing.xs / 2, fontSize: 12 },
    medium: { paddingVertical: spacing.xs, fontSize: fontSizes.sm },
  };

  const badgeStyle: React.CSSProperties = {
    borderRadius: 9999,
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    paddingTop: sizeStyles[size].paddingVertical,
    paddingBottom: sizeStyles[size].paddingVertical,
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: variantStyles[variant].backgroundColor,
    color: variantStyles[variant].color,
    fontSize: sizeStyles[size].fontSize,
    fontWeight: fontWeights.medium,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    whiteSpace: 'nowrap',
  };

  return <span style={badgeStyle}>{text}</span>;
};

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile card component with header, content, and footer sections for displaying structured information in mobile interfaces (web preview)',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Content to display inside the card',
    },
    style: {
      control: false,
      description: 'Custom styles to apply to the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card stories
export const Default: Story = {
  render: () => (
    <Card style={{ width: 300 }}>
      <CardContent>
        <p style={{ margin: 0, color: colors.text }}>This is a basic card with default styling.</p>
      </CardContent>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card style={{ width: 300 }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card with a header section.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: colors.text }}>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card style={{ width: 300 }}>
      <CardContent>
        <p style={{ margin: 0, color: colors.text }}>This card has a footer with action buttons.</p>
      </CardContent>
      <CardFooter>
        <Button title="Cancel" variant="outline" onPress={() => {}} />
        <Button title="Save" variant="primary" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
};

export const Complete: Story = {
  render: () => (
    <Card style={{ width: 300 }}>
      <CardHeader>
        <CardTitle>Complete Card</CardTitle>
        <CardDescription>This card has all sections: header, content, and footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: colors.text }}>
          This is the main content area of the card. It can contain any type of content.
        </p>
      </CardContent>
      <CardFooter>
        <Button title="Cancel" variant="ghost" onPress={() => {}} />
        <Button title="Save" variant="primary" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
};

// Content variation stories
export const TodoCard: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <CardTitle>Complete project documentation</CardTitle>
            <CardDescription>Due: Tomorrow</CardDescription>
          </div>
          <Badge text="High Priority" variant="danger" size="small" />
        </div>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: colors.text, marginBottom: spacing.sm }}>
          Write comprehensive documentation for the new feature including API docs and user guides.
        </p>
        <div style={{ display: 'flex', gap: spacing.xs }}>
          <Badge text="Documentation" variant="primary" size="small" />
          <Badge text="API" variant="secondary" size="small" />
        </div>
      </CardContent>
      <CardFooter>
        <Button title="Edit" variant="outline" onPress={() => {}} />
        <Button title="Complete" variant="success" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card used for displaying todo items with status, priority, and actions',
      },
    },
  },
};

export const UserProfileCard: Story = {
  render: () => (
    <Card style={{ width: 280 }}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              fontSize: fontSizes.lg,
              fontWeight: fontWeights.bold,
            }}
          >
            JD
          </div>
          <div>
            <CardTitle style={{ marginBottom: 2 }}>John Doe</CardTitle>
            <CardDescription>Software Developer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <span style={{ color: colors.medium, fontSize: fontSizes.sm }}>Tasks Completed</span>
          <span style={{ color: colors.text, fontWeight: fontWeights.medium }}>24</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: colors.medium, fontSize: fontSizes.sm }}>Active Projects</span>
          <span style={{ color: colors.text, fontWeight: fontWeights.medium }}>3</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button title="View Profile" variant="primary" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card used for displaying user profile information with avatar and stats',
      },
    },
  },
};

export const NotificationCard: Story = {
  render: () => (
    <Card style={{ width: 300 }}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CardTitle style={{ marginBottom: 0 }}>New Message</CardTitle>
          <Badge text="New" variant="success" size="small" />
        </div>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: colors.text, marginBottom: spacing.sm }}>
          You have received a new message from your team member about the project update.
        </p>
        <p style={{ margin: 0, color: colors.medium, fontSize: fontSizes.sm }}>2 minutes ago</p>
      </CardContent>
      <CardFooter>
        <Button title="Dismiss" variant="ghost" onPress={() => {}} />
        <Button title="View" variant="primary" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card used for displaying notifications with timestamp and actions',
      },
    },
  },
};

// Layout and styling variations
export const CompactCard: Story = {
  render: () => (
    <Card style={{ width: 250 }}>
      <CardContent style={{ padding: spacing.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: fontSizes.md, fontWeight: fontWeights.bold, color: colors.text }}>
              Quick Task
            </h4>
            <p style={{ margin: 0, fontSize: fontSizes.sm, color: colors.medium }}>Review code</p>
          </div>
          <Badge text="Done" variant="success" size="small" />
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact card layout with minimal padding for dense information display',
      },
    },
  },
};

export const WideCard: Story = {
  render: () => (
    <Card style={{ width: 400 }}>
      <CardHeader>
        <CardTitle>Project Status Dashboard</CardTitle>
        <CardDescription>Overview of current project metrics and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.md }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.success }}>85%</div>
            <div style={{ fontSize: fontSizes.sm, color: colors.medium }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.warning }}>12</div>
            <div style={{ fontSize: fontSizes.sm, color: colors.medium }}>In Progress</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.danger }}>3</div>
            <div style={{ fontSize: fontSizes.sm, color: colors.medium }}>Overdue</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button title="View Details" variant="primary" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Wide card layout suitable for dashboard widgets and data display',
      },
    },
  },
};

// Interactive states
export const InteractiveCard: Story = {
  render: () => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    return (
      <Card style={{ width: 300 }}>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>This card demonstrates interactive states and user actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p style={{ margin: 0, color: colors.text }}>
            Click the buttons below to see how the card responds to user interactions.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            title={liked ? '❤️ Liked' : '🤍 Like'}
            variant={liked ? 'danger' : 'outline'}
            onPress={() => setLiked(!liked)}
          />
          <Button
            title={saved ? '📌 Saved' : '📋 Save'}
            variant={saved ? 'success' : 'outline'}
            onPress={() => setSaved(!saved)}
          />
        </CardFooter>
      </Card>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive card showing state changes and user feedback',
      },
    },
  },
};

// Error and loading states
export const LoadingCard: Story = {
  render: () => (
    <Card style={{ width: 300 }}>
      <CardHeader>
        <CardTitle>Loading Content</CardTitle>
        <CardDescription>Please wait while we load your data...</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div
            style={{
              width: 20,
              height: 20,
              border: `2px solid ${colors.light}`,
              borderTop: `2px solid ${colors.primary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ color: colors.medium }}>Loading...</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button title="Cancel" variant="outline" disabled onPress={() => {}} />
      </CardFooter>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card showing loading state with spinner and disabled actions',
      },
    },
  },
};

export const ErrorCard: Story = {
  render: () => (
    <Card style={{ width: 300, borderColor: colors.danger }}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ color: colors.danger, fontSize: fontSizes.lg }}>⚠️</span>
          <CardTitle style={{ color: colors.danger }}>Error Loading Data</CardTitle>
        </div>
        <CardDescription>Something went wrong while loading your content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: colors.text, fontSize: fontSizes.sm }}>
          Please check your internet connection and try again.
        </p>
      </CardContent>
      <CardFooter>
        <Button title="Retry" variant="danger" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card showing error state with visual indicators and recovery actions',
      },
    },
  },
};

// Multiple cards layout
export const CardGrid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: spacing.md,
        maxWidth: 800,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Task 1</CardTitle>
          <CardDescription>Complete the mobile UI components</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge text="In Progress" variant="warning" size="small" />
        </CardContent>
        <CardFooter>
          <Button title="View" variant="outline" onPress={() => {}} />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 2</CardTitle>
          <CardDescription>Review pull requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge text="Completed" variant="success" size="small" />
        </CardContent>
        <CardFooter>
          <Button title="View" variant="outline" onPress={() => {}} />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 3</CardTitle>
          <CardDescription>Update documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge text="Todo" variant="default" size="small" />
        </CardContent>
        <CardFooter>
          <Button title="Start" variant="primary" onPress={() => {}} />
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Multiple cards in a responsive grid layout',
      },
    },
  },
};

// Accessibility example
export const AccessibleCard: Story = {
  render: () => (
    <Card testID="accessible-card" style={{ width: 300 }}>
      <CardHeader>
        <CardTitle>Accessible Card</CardTitle>
        <CardDescription>This card demonstrates proper accessibility practices.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: colors.text }}>
          All interactive elements have proper labels and the card structure is semantic.
        </p>
      </CardContent>
      <CardFooter>
        <Button title="Learn More" variant="primary" onPress={() => {}} />
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with proper accessibility attributes and semantic structure',
      },
    },
  },
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
