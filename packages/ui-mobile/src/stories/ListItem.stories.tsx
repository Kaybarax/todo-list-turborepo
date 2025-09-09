import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import ListItem, { type ListItemProps } from '../../lib/components/ListItem/ListItem';
import { withUIKitten } from './decorators/UIKittenProvider';

const meta: Meta<typeof ListItem> = {
  title: 'Components/ListItem',
  component: ListItem,
  decorators: [withUIKitten],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'Native ListItem component rendered via react-native-web. Uses enhanced theme + Eva tokens. Reference: https://akveo.github.io/react-native-ui-kitten/docs/components/list/overview#listitem',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    description: { control: 'text' },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    leading: { control: false },
    trailing: { control: false },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Dot = ({ color = '#3366FF' }: { color?: string }) => (
  <View
    style={{
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: color,
    }}
  />
);

export const Basic: Story = {
  args: {
    title: 'Settings',
    subtitle: 'Preferences',
    description: 'Configure notification & privacy options',
  },
};

export const Sizes: Story = {
  render: args => (
    <View style={{ gap: 12 }}>
      <ListItem {...args} size="sm" title="Small Item" subtitle="Subtitle" />
      <ListItem {...args} size="md" title="Medium Item" subtitle="Subtitle" />
      <ListItem
        {...args}
        size="lg"
        title="Large Item"
        subtitle="Subtitle"
        description="Two line description example for large size"
      />
    </View>
  ),
  parameters: { controls: { disable: true } },
};

export const WithAccessories: Story = {
  args: {
    title: 'Profile',
    subtitle: 'Account',
    leading: <Dot />,
    trailing: <Dot color="#FF3D71" />,
  } as Partial<ListItemProps>,
};

export const Interactive: Story = {
  args: {
    title: 'Tap Me',
    subtitle: 'Pressable',
    description: 'Triggers onPress action',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Archived',
    subtitle: 'Unavailable',
    disabled: true,
  },
};
