import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';
import { Text } from '../Text';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
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
        <Card.Header>
          <Card.Title>Elevated Card</Card.Title>
          <Card.Description>This is an elevated card with shadow</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Card content goes here. This variant has a subtle shadow for depth.</Text>
        </Card.Content>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <Card.Header>
          <Card.Title>Outlined Card</Card.Title>
          <Card.Description>This is an outlined card with border</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Card content goes here. This variant has a border instead of shadow.</Text>
        </Card.Content>
      </>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <>
        <Card.Header>
          <Card.Title>Filled Card</Card.Title>
          <Card.Description>This is a filled card with background</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Card content goes here. This variant has a filled background.</Text>
        </Card.Content>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <Card.Header>
          <Card.Title>Card with Footer</Card.Title>
          <Card.Description>This card includes footer actions</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Main content of the card goes here.</Text>
        </Card.Content>
        <Card.Footer>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </Card.Footer>
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
        <Card.Header>
          <Card.Title>Interactive Card</Card.Title>
          <Card.Description>This card is pressable</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Click anywhere on this card to trigger the onPress action.</Text>
        </Card.Content>
      </>
    ),
  },
};

export const MinimalContent: Story = {
  args: {
    variant: 'elevated',
    children: (
      <Card.Content>
        <Text>Simple card with just content</Text>
      </Card.Content>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <Card variant="elevated">
        <Card.Header>
          <Card.Title>Elevated Card</Card.Title>
          <Card.Description>With shadow effect</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Elevated variant content</Text>
        </Card.Content>
      </Card>

      <Card variant="outlined">
        <Card.Header>
          <Card.Title>Outlined Card</Card.Title>
          <Card.Description>With border styling</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Outlined variant content</Text>
        </Card.Content>
      </Card>

      <Card variant="filled">
        <Card.Header>
          <Card.Title>Filled Card</Card.Title>
          <Card.Description>With background fill</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>Filled variant content</Text>
        </Card.Content>
      </Card>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
};
