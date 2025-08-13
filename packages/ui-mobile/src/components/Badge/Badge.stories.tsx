import React from 'react';
import { View } from 'react-native';
import { Badge } from './Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
};

export const Default = () => <Badge text="Default" />;

export const Variants = () => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
    <Badge text="Default" variant="default" />
    <Badge text="Primary" variant="primary" />
    <Badge text="Secondary" variant="secondary" />
    <Badge text="Success" variant="success" />
    <Badge text="Warning" variant="warning" />
    <Badge text="Danger" variant="danger" />
  </View>
);

export const Sizes = () => (
  <View style={{ flexDirection: 'column', gap: 8 }}>
    <Badge text="Small" size="small" />
    <Badge text="Medium" size="medium" />
    <Badge text="Large" size="large" />
  </View>
);

export const WithLongText = () => (
  <View style={{ width: 100 }}>
    <Badge text="This is a very long text that should be truncated" />
  </View>
);

export const CustomStyles = () => (
  <Badge
    text="Custom"
    style={{
      backgroundColor: '#6B46C1',
      borderWidth: 1,
      borderColor: '#4C1D95',
    }}
    textStyle={{
      color: 'white',
      fontWeight: 'bold',
    }}
  />
);

export const UsageExamples = () => (
  <View style={{ gap: 16 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Badge text="New" variant="primary" size="small" />
      <Badge text="Featured" variant="secondary" size="small" />
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Badge text="Completed" variant="success" />
      <Badge text="In Progress" variant="warning" />
      <Badge text="Failed" variant="danger" />
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Badge text="React Native" />
      <Badge text="TypeScript" />
      <Badge text="Mobile" />
    </View>
  </View>
);
