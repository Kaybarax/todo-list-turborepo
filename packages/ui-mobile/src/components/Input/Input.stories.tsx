import React from 'react';
import { View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Input } from './Input';
import theme from '../../theme';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = () => (
  <Input placeholder="Enter text here" />
);

export const WithLabel = () => (
  <Input 
    label="Email" 
    placeholder="Enter your email" 
    keyboardType="email-address" 
  />
);

export const WithError = () => (
  <Input 
    label="Email" 
    placeholder="Enter your email" 
    error={true} 
    errorMessage="Please enter a valid email address" 
  />
);

export const WithLeftIcon = () => (
  <Input 
    placeholder="Search..." 
    leftIcon={
      <MaterialIcons 
        name="search" 
        size={20} 
        color={theme.colors.medium} 
      />
    } 
  />
);

export const WithRightIcon = () => (
  <Input 
    placeholder="Password" 
    secureTextEntry 
    rightIcon={
      <MaterialIcons 
        name="visibility" 
        size={20} 
        color={theme.colors.medium} 
      />
    } 
  />
);

export const WithBothIcons = () => (
  <Input 
    placeholder="Search location" 
    leftIcon={
      <MaterialIcons 
        name="location-on" 
        size={20} 
        color={theme.colors.medium} 
      />
    }
    rightIcon={
      <MaterialIcons 
        name="my-location" 
        size={20} 
        color={theme.colors.medium} 
      />
    } 
  />
);

export const Disabled = () => (
  <Input 
    label="Username" 
    placeholder="Enter username" 
    value="johndoe" 
    editable={false} 
  />
);

export const FormExample = () => (
  <View style={{ width: 300, gap: 16 }}>
    <Input 
      label="Full Name" 
      placeholder="John Doe" 
    />
    <Input 
      label="Email" 
      placeholder="john@example.com" 
      keyboardType="email-address" 
    />
    <Input 
      label="Password" 
      placeholder="Enter password" 
      secureTextEntry 
      rightIcon={
        <MaterialIcons 
          name="visibility" 
          size={20} 
          color={theme.colors.medium} 
        />
      } 
    />
  </View>
);