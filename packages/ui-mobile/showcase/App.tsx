import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ButtonScreen from './src/screens/ButtonScreen';
import CardScreen from './src/screens/CardScreen';
import InputScreen from './src/screens/InputScreen';
import BadgeScreen from './src/screens/BadgeScreen';
import AvatarScreen from './src/screens/AvatarScreen';
import SwitchScreen from './src/screens/SwitchScreen';
import CheckboxScreen from './src/screens/CheckboxScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#3366FF',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              drawerStyle: {
                backgroundColor: '#F7F9FC',
              },
              drawerActiveTintColor: '#3366FF',
              drawerInactiveTintColor: '#8F9BB3',
            }}
          >
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'UI Mobile Components',
                drawerLabel: 'Home',
              }}
            />
            <Drawer.Screen
              name="Button"
              component={ButtonScreen}
              options={{
                title: 'Button Component',
                drawerLabel: 'Button',
              }}
            />
            <Drawer.Screen
              name="Card"
              component={CardScreen}
              options={{
                title: 'Card Component',
                drawerLabel: 'Card',
              }}
            />
            <Drawer.Screen
              name="Input"
              component={InputScreen}
              options={{
                title: 'Input Component',
                drawerLabel: 'Input',
              }}
            />
            <Drawer.Screen
              name="Badge"
              component={BadgeScreen}
              options={{
                title: 'Badge Component',
                drawerLabel: 'Badge',
              }}
            />
            <Drawer.Screen
              name="Avatar"
              component={AvatarScreen}
              options={{
                title: 'Avatar Component',
                drawerLabel: 'Avatar',
              }}
            />
            <Drawer.Screen
              name="Switch"
              component={SwitchScreen}
              options={{
                title: 'Switch Component',
                drawerLabel: 'Switch',
              }}
            />
            <Drawer.Screen
              name="Checkbox"
              component={CheckboxScreen}
              options={{
                title: 'Checkbox Component',
                drawerLabel: 'Checkbox',
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
