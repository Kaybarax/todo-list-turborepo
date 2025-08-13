import React from 'react';

// Mock UI Kitten components for testing
export const mockUIKittenComponent = (name: string) => {
  return ({ children, ...props }: any) =>
    React.createElement('View', { 'data-testid': `ui-kitten-${name.toLowerCase()}`, ...props }, children);
};

// ApplicationProvider mock
export const ApplicationProvider = ({ children }: any) => children;

// Common UI Kitten mocks
export const Button = mockUIKittenComponent('Button');
export const Card = mockUIKittenComponent('Card');
export const Input = mockUIKittenComponent('Input');
export const Text = mockUIKittenComponent('Text');
export const Layout = mockUIKittenComponent('Layout');
export const CheckBox = mockUIKittenComponent('CheckBox');
export const Toggle = mockUIKittenComponent('Toggle');
export const Avatar = mockUIKittenComponent('Avatar');
