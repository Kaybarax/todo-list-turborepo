import React from 'react';
import { type Meta, type StoryObj } from '@storybook/react';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface WebCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  onPress?: () => void;
}

const baseCardStyle: React.CSSProperties = {
  borderRadius: 12,
  padding: 16,
  width: 320,
  background: '#FFFFFF',
  color: '#1C1C1E',
  border: '1px solid transparent',
  boxSizing: 'border-box',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const cardVariantStyle: Record<CardVariant, React.CSSProperties> = {
  elevated: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderColor: '#00000000' },
  outlined: { borderColor: '#CECED2' },
  filled: { background: '#F8F9FB' },
};

const sectionTitleStyle: React.CSSProperties = { fontWeight: 600, fontSize: 18, margin: 0 };
const sectionDescStyle: React.CSSProperties = { color: '#6B7280', margin: '4px 0 0 0' };
const footerStyle: React.CSSProperties = { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 };

const WebCard: React.FC<WebCardProps> & {
  Header: React.FC<React.PropsWithChildren<{}>>;
  Title: React.FC<React.PropsWithChildren<{}>>;
  Description: React.FC<React.PropsWithChildren<{}>>;
  Content: React.FC<React.PropsWithChildren<{}>>;
  Footer: React.FC<React.PropsWithChildren<{}>>;
} = ({ variant = 'elevated', onPress, style, children, ...rest }) => {
  const styleMerged: React.CSSProperties = {
    ...baseCardStyle,
    ...cardVariantStyle[variant],
    ...(style as React.CSSProperties),
    cursor: onPress ? 'pointer' : undefined,
  };
  return (
    <div style={styleMerged} onClick={onPress} {...rest}>
      {children}
    </div>
  );
};

WebCard.Header = ({ children }) => <div style={{ marginBottom: 12 }}>{children}</div>;
WebCard.Title = ({ children }) => <h3 style={sectionTitleStyle}>{children}</h3>;
WebCard.Description = ({ children }) => <p style={sectionDescStyle}>{children}</p>;
WebCard.Content = ({ children }) => <div>{children}</div>;
WebCard.Footer = ({ children }) => <div style={footerStyle}>{children}</div>;

const WebButton: React.FC<React.PropsWithChildren<{ variant?: 'primary' | 'outline'; onPress?: () => void }>> = ({
  children,
  variant = 'primary',
  onPress,
}) => {
  const style: React.CSSProperties =
    variant === 'outline'
      ? {
          border: '1px solid #CECED2',
          background: '#FFFFFF',
          color: '#1C1C1E',
          padding: '8px 12px',
          borderRadius: 8,
        }
      : {
          border: '1px solid #007AFF',
          background: '#007AFF',
          color: '#FFFFFF',
          padding: '8px 12px',
          borderRadius: 8,
        };
  return (
    <button style={style} onClick={onPress}>
      {children}
    </button>
  );
};

const meta: Meta<typeof WebCard> = {
  title: 'Components/Card',
  component: WebCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card component with compound pattern support. Includes Card.Header, Card.Title, Card.Description, Card.Content, and Card.Footer subcomponents.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevated', 'outlined', 'filled'],
      description: 'Visual style variant of the card',
    },
    onPress: { action: 'card pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <WebCard.Header>
          <WebCard.Title>Elevated Card</WebCard.Title>
          <WebCard.Description>This is an elevated card with shadow</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Card content goes here. This variant has a subtle shadow for depth.</WebCard.Content>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <WebCard.Header>
          <WebCard.Title>Outlined Card</WebCard.Title>
          <WebCard.Description>This is an outlined card with border</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Card content goes here. This variant has a border instead of shadow.</WebCard.Content>
      </>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <>
        <WebCard.Header>
          <WebCard.Title>Filled Card</WebCard.Title>
          <WebCard.Description>This is a filled card with background</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Card content goes here. This variant has a filled background.</WebCard.Content>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <WebCard.Header>
          <WebCard.Title>Card with Footer</WebCard.Title>
          <WebCard.Description>This card includes footer actions</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Main content of the card goes here.</WebCard.Content>
        <WebCard.Footer>
          <WebButton variant="outline" onPress={() => {}}>
            Cancel
          </WebButton>
          <WebButton onPress={() => {}}>Save</WebButton>
        </WebCard.Footer>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: 'outlined',
    onPress: () => console.log('Card pressed'),
    children: (
      <>
        <WebCard.Header>
          <WebCard.Title>Interactive Card</WebCard.Title>
          <WebCard.Description>This card is pressable</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Click anywhere on this card to trigger the onPress action.</WebCard.Content>
      </>
    ),
  },
};

export const MinimalContent: Story = {
  args: {
    variant: 'elevated',
    children: <WebCard.Content>Simple card with just content</WebCard.Content>,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <WebCard variant="elevated">
        <WebCard.Header>
          <WebCard.Title>Elevated Card</WebCard.Title>
          <WebCard.Description>With shadow effect</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Elevated variant content</WebCard.Content>
      </WebCard>

      <WebCard variant="outlined">
        <WebCard.Header>
          <WebCard.Title>Outlined Card</WebCard.Title>
          <WebCard.Description>With border styling</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Outlined variant content</WebCard.Content>
      </WebCard>

      <WebCard variant="filled">
        <WebCard.Header>
          <WebCard.Title>Filled Card</WebCard.Title>
          <WebCard.Description>With background fill</WebCard.Description>
        </WebCard.Header>
        <WebCard.Content>Filled variant content</WebCard.Content>
      </WebCard>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
};
