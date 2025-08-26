import { type Meta, type StoryObj } from '@storybook/react';
import { useState } from 'react';

import { TabBar } from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Components/TabBar',
  component: TabBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A bottom navigation TabBar component with animated indicator, icons, labels, and badge support.',
      },
    },
  },
  argTypes: {
    activeIndex: {
      control: { type: 'number', min: 0, max: 4 },
      description: 'Currently active tab index',
    },
    onTabPress: { action: 'tab pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TabBarWrapper = ({ tabs, ...args }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <div
        style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2>Tab Content: {tabs[activeIndex]?.label}</h2>
          <p>This is the content for the {tabs[activeIndex]?.label} tab.</p>
        </div>
      </div>
      <TabBar
        {...args}
        tabs={tabs}
        activeIndex={activeIndex}
        onTabPress={index => {
          setActiveIndex(index);
          args.onTabPress?.(index);
        }}
      />
    </div>
  );
};

export const Basic: Story = {
  render: args => (
    <TabBarWrapper
      {...args}
      tabs={[
        { label: 'Home', icon: 'home' },
        { label: 'Search', icon: 'search' },
        { label: 'Profile', icon: 'person' },
      ]}
    />
  ),
};

export const WithBadges: Story = {
  render: args => (
    <TabBarWrapper
      {...args}
      tabs={[
        { label: 'Home', icon: 'home' },
        { label: 'Messages', icon: 'mail', badge: { count: 3 } },
        { label: 'Notifications', icon: 'notifications', badge: { count: 12 } },
        { label: 'Profile', icon: 'person' },
      ]}
    />
  ),
};

export const FiveTabs: Story = {
  render: args => (
    <TabBarWrapper
      {...args}
      tabs={[
        { label: 'Home', icon: 'home' },
        { label: 'Search', icon: 'search' },
        { label: 'Add', icon: 'add' },
        { label: 'Favorites', icon: 'heart' },
        { label: 'Profile', icon: 'person' },
      ]}
    />
  ),
};

export const WithDotBadges: Story = {
  render: args => (
    <TabBarWrapper
      {...args}
      tabs={[
        { label: 'Home', icon: 'home' },
        { label: 'Chat', icon: 'chat-bubble', badge: { dot: true } },
        { label: 'Updates', icon: 'notifications', badge: { dot: true } },
        { label: 'Settings', icon: 'settings' },
      ]}
    />
  ),
};

export const IconsOnly: Story = {
  render: args => (
    <TabBarWrapper {...args} tabs={[{ icon: 'home' }, { icon: 'search' }, { icon: 'add' }, { icon: 'person' }]} />
  ),
};

export const LabelsOnly: Story = {
  render: args => (
    <TabBarWrapper
      {...args}
      tabs={[{ label: 'Home' }, { label: 'Search' }, { label: 'Add New' }, { label: 'Profile' }]}
    />
  ),
};
