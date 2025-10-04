import React from 'react';
import { Tabs } from 'expo-router';
import { Icon, useEnhancedTheme } from '@todo/ui-mobile';

export default function TabLayout() {
  const { evaTheme } = useEnhancedTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: evaTheme['background-basic-color-1'],
          borderTopColor: evaTheme['border-basic-color-3'],
        },
        tabBarActiveTintColor: evaTheme['color-primary-default'],
        tabBarInactiveTintColor: evaTheme['text-hint-color'],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => <Icon name={focused ? 'home' : 'home-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'Todos',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'checkmark-square-2' : 'checkmark-square-2-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'credit-card' : 'credit-card-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
