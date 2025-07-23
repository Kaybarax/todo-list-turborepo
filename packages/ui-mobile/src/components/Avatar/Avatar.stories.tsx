import React from 'react';
import { View, Platform } from 'react-native';
import { Avatar } from './Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
};

// Using a placeholder image URL for examples
const placeholderImage = { uri: 'https://via.placeholder.com/150' };

export const WithInitials = () => (
  <Avatar initials="JD" />
);

export const WithImage = () => (
  <Avatar source={placeholderImage} />
);

export const Sizes = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
    <Avatar initials="XS" size="xs" />
    <Avatar initials="SM" size="sm" />
    <Avatar initials="MD" size="md" />
    <Avatar initials="LG" size="lg" />
    <Avatar initials="XL" size="xl" />
  </View>
);

export const ImageSizes = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
    <Avatar source={placeholderImage} size="xs" />
    <Avatar source={placeholderImage} size="sm" />
    <Avatar source={placeholderImage} size="md" />
    <Avatar source={placeholderImage} size="lg" />
    <Avatar source={placeholderImage} size="xl" />
  </View>
);

export const CustomColors = () => (
  <View style={{ flexDirection: 'row', gap: 16 }}>
    <Avatar initials="JD" backgroundColor="#6366F1" />
    <Avatar initials="AB" backgroundColor="#10B981" />
    <Avatar initials="CD" backgroundColor="#F59E0B" />
    <Avatar initials="EF" backgroundColor="#EF4444" />
    <Avatar initials="GH" backgroundColor="#8B5CF6" />
  </View>
);

export const WithBorder = () => (
  <View style={{ flexDirection: 'row', gap: 16 }}>
    <Avatar 
      initials="JD" 
      style={{ 
        borderWidth: 2, 
        borderColor: 'white',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
      }} 
    />
    <Avatar 
      source={placeholderImage} 
      style={{ 
        borderWidth: 2, 
        borderColor: 'white',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
      }} 
    />
  </View>
);

export const AvatarGroup = () => (
  <View style={{ flexDirection: 'row' }}>
    {['JD', 'AB', 'CD', 'EF'].map((initials, index) => (
      <View 
        key={initials}
        style={{ 
          marginLeft: index > 0 ? -12 : 0,
          zIndex: 4 - index,
        }}
      >
        <Avatar 
          initials={initials} 
          size="md"
          backgroundColor={['#6366F1', '#10B981', '#F59E0B', '#EF4444'][index]}
          style={{ 
            borderWidth: 2, 
            borderColor: 'white',
          }} 
        />
      </View>
    ))}
  </View>
);