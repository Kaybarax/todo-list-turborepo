import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';

type WebTab = {
  label?: string;
  icon?: string;
  badge?: { count?: number; dot?: boolean };
};

interface WebTabBarProps {
  tabs: WebTab[];
  activeIndex: number;
  onTabPress?: (index: number) => void;
}

const WebTabBar: React.FC<WebTabBarProps> = ({ tabs, activeIndex, onTabPress }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
      }}
    >
      {tabs.map((t, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => onTabPress?.(i)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: active ? '#007AFF' : '#6B7280',
              position: 'relative',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 18 }}>{t.icon || '•'}</div>
            {t.label && <div style={{ fontSize: 12, marginTop: 4 }}>{t.label}</div>}
            {t.badge && (t.badge.dot || t.badge.count) && (
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: '20%',
                  background: '#EF4444',
                  color: 'white',
                  borderRadius: 9999,
                  padding: t.badge.dot ? 4 : '2px 6px',
                  fontSize: 10,
                  lineHeight: 1,
                }}
              >
                {t.badge.dot ? '' : t.badge.count}
              </div>
            )}
            {active && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  height: 3,
                  width: 32,
                  background: '#007AFF',
                  borderRadius: 2,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const meta: Meta<typeof WebTabBar> = {
  title: 'Components/TabBar',
  component: WebTabBar,
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
      <WebTabBar
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
