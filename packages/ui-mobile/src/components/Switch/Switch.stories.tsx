import React, { useState } from 'react';
import { View } from 'react-native';
import { Switch } from './Switch';
import theme from '../../theme';

export default {
  title: 'Components/Switch',
  component: Switch,
};

export const Default = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return <Switch value={isEnabled} onValueChange={setIsEnabled} />;
};

export const WithLabel = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return <Switch value={isEnabled} onValueChange={setIsEnabled} label="Enable notifications" />;
};

export const Disabled = () => {
  return (
    <View style={{ gap: 16 }}>
      <Switch value={false} onValueChange={() => {}} label="Disabled Off" disabled={true} />
      <Switch value={true} onValueChange={() => {}} label="Disabled On" disabled={true} />
    </View>
  );
};

export const CustomColors = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Switch
      value={isEnabled}
      onValueChange={setIsEnabled}
      label="Custom Colors"
      trackColor={{
        false: '#FFCDD2',
        true: '#4CAF50',
      }}
      thumbColor={{
        false: '#F44336',
        true: '#81C784',
      }}
    />
  );
};

export const MultipleSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);

  return (
    <View style={{ gap: 16, width: 300 }}>
      <Switch value={notifications} onValueChange={setNotifications} label="Enable notifications" />
      <Switch value={darkMode} onValueChange={setDarkMode} label="Dark mode" />
      <Switch value={location} onValueChange={setLocation} label="Location services" />
    </View>
  );
};
