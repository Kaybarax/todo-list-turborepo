import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable text component with typography variants, colors, and accessibility features.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'overline'],
      description: 'Typography variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'inverse', 'success', 'warning', 'error'],
      description: 'Text color variant',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Text variant="h1">Heading 1 - Main page title</Text>
      <Text variant="h2">Heading 2 - Section title</Text>
      <Text variant="h3">Heading 3 - Subsection title</Text>
      <Text variant="h4">Heading 4 - Component title</Text>
      <Text variant="h5">Heading 5 - Small section</Text>
      <Text variant="h6">Heading 6 - Smallest heading</Text>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const BodyText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Text variant="body1">
        Body 1 - This is the primary body text used for most content. It provides good readability and is suitable for
        paragraphs and longer text blocks.
      </Text>
      <Text variant="body2">
        Body 2 - This is secondary body text, slightly smaller than body1. It's useful for supporting information and
        secondary content.
      </Text>
      <Text variant="caption">Caption - Small text used for captions, labels, and supplementary information.</Text>
      <Text variant="overline">OVERLINE - UPPERCASE TEXT FOR CATEGORIES AND LABELS</Text>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text color="primary">Primary text color</Text>
      <Text color="secondary">Secondary text color</Text>
      <Text color="tertiary">Tertiary text color</Text>
      <Text color="success">Success text color</Text>
      <Text color="warning">Warning text color</Text>
      <Text color="error">Error text color</Text>
      <div style={{ backgroundColor: '#333', padding: '12px', borderRadius: '4px' }}>
        <Text color="inverse">Inverse text color on dark background</Text>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text weight="light">Light weight text</Text>
      <Text weight="normal">Normal weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Alignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <Text align="left">Left aligned text - This text is aligned to the left side of the container.</Text>
      <Text align="center">Center aligned text - This text is centered in the container.</Text>
      <Text align="right">Right aligned text - This text is aligned to the right side of the container.</Text>
      <Text align="justify">
        Justified text - This text is justified to fill the entire width of the container, creating even margins on both
        sides.
      </Text>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Interactive: Story = {
  args: {
    children: 'Customizable Text Component',
    variant: 'h3',
    color: 'primary',
    weight: 'medium',
    align: 'center',
  },
};
