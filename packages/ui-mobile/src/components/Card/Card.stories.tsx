import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from '../Button/Button';

export default {
  title: 'Components/Card',
  component: Card,
};

export const Default = () => (
  <Card style={{ width: 300 }}>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <Text>Card Content</Text>
    </CardContent>
    <CardFooter>
      <Text>Card Footer</Text>
    </CardFooter>
  </Card>
);

export const WithActions = () => (
  <Card style={{ width: 300 }}>
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      <View style={{ gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: '500' }}>Name</Text>
          <TextInput
            placeholder="Name of your project"
            style={{
              borderWidth: 1,
              borderColor: '#CECED2',
              borderRadius: 8,
              padding: 8,
              height: 40,
            }}
          />
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: '500' }}>Framework</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#CECED2',
              borderRadius: 8,
              padding: 8,
              height: 40,
              justifyContent: 'center',
            }}
          >
            <Text>Next.js</Text>
          </View>
        </View>
      </View>
    </CardContent>
    <CardFooter>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title="Cancel" variant="outline" onPress={() => {}} />
        <Button title="Deploy" onPress={() => {}} />
      </View>
    </CardFooter>
  </Card>
);

export const SimpleCard = () => (
  <Card style={{ width: 300, padding: 16 }}>
    <Text style={{ fontSize: 16 }}>This is a simple card with just some text content and no header or footer.</Text>
  </Card>
);
