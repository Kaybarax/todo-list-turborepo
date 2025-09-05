import { type Meta, type StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';

import { Button } from '../../lib/components/Button/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable button component with multiple variants, sizes, and states. Supports accessibility features and theme integration.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the button is in loading state',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the button takes full width of container',
    },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    variant: 'primary',
    size: 'md',
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    size: 'md',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={styles.container}>
      <Button variant="primary" onPress={() => {}}>
        Primary
      </Button>
      <Button variant="secondary" onPress={() => {}}>
        Secondary
      </Button>
      <Button variant="outline" onPress={() => {}}>
        Outline
      </Button>
      <Button variant="ghost" onPress={() => {}}>
        Ghost
      </Button>
      <Button variant="link" onPress={() => {}}>
        Link
      </Button>
    </View>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const AllSizes: Story = {
  render: () => (
    <View style={styles.container}>
      <Button variant="primary" size="sm" onPress={() => {}}>
        Small
      </Button>
      <Button variant="primary" size="md" onPress={() => {}}>
        Medium
      </Button>
      <Button variant="primary" size="lg" onPress={() => {}}>
        Large
      </Button>
    </View>
  ),
  parameters: {
    controls: { disable: true },
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
    width: 200,
    alignItems: 'flex-start',
  },
});
