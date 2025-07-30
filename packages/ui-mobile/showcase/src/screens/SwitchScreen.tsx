import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text, Card, CardHeader } from '@ui-kitten/components';
import { Switch } from '@todo/ui-mobile';
import ComponentExample from '../components/ComponentExample';

const SwitchScreen: React.FC = () => {
  const [switches, setSwitches] = useState({
    basic: false,
    notifications: true,
    darkMode: false,
    location: true,
    bluetooth: false,
    wifi: true,
    airplane: false,
  });

  const updateSwitch = (key: string, value: boolean) => {
    setSwitches(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Component Description */}
        <Card style={styles.descriptionCard}>
          <CardHeader>
            <Text category="h5">Switch Component</Text>
          </CardHeader>
          <Layout style={styles.cardContent}>
            <Text category="p1">
              Toggle switch component for boolean values. Built on UI Kitten Toggle 
              primitive with custom styling and status mapping.
            </Text>
          </Layout>
        </Card>

        {/* Basic Switches */}
        <ComponentExample
          title="Basic Switches"
          description="Simple on/off toggle switches."
        >
          <View style={styles.switchGroup}>
            <Switch
              value={switches.basic}
              onValueChange={(value) => updateSwitch('basic', value)}
              label="Basic Switch"
            />
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Always On"
            />
            <Switch
              value={false}
              onValueChange={() => {}}
              label="Always Off"
            />
          </View>
        </ComponentExample>

        {/* Switch Status */}
        <ComponentExample
          title="Switch Status"
          description="Different status colors for various use cases."
        >
          <View style={styles.switchGroup}>
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Primary Status"
              status="primary"
            />
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Success Status"
              status="success"
            />
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Info Status"
              status="info"
            />
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Warning Status"
              status="warning"
            />
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Danger Status"
              status="danger"
            />
          </View>
        </ComponentExample>

        {/* Disabled Switches */}
        <ComponentExample
          title="Disabled Switches"
          description="Switches in disabled state."
        >
          <View style={styles.switchGroup}>
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Disabled (On)"
              disabled
            />
            <Switch
              value={false}
              onValueChange={() => {}}
              label="Disabled (Off)"
              disabled
            />
          </View>
        </ComponentExample>

        {/* Switches without Labels */}
        <ComponentExample
          title="Switches without Labels"
          description="Standalone switches without text labels."
        >
          <View style={styles.switchRow}>
            <Switch
              value={switches.basic}
              onValueChange={(value) => updateSwitch('basic', value)}
            />
            <Switch
              value={true}
              onValueChange={() => {}}
              status="success"
            />
            <Switch
              value={false}
              onValueChange={() => {}}
              status="danger"
            />
          </View>
        </ComponentExample>

        {/* Settings Example */}
        <ComponentExample
          title="Settings Panel Example"
          description="Interactive settings panel with multiple switches."
        >
          <View style={styles.settingsPanel}>
            <Text category="h6" style={styles.sectionTitle}>Notifications</Text>
            <Switch
              value={switches.notifications}
              onValueChange={(value) => updateSwitch('notifications', value)}
              label="Push Notifications"
            />
            <Switch
              value={switches.notifications && true}
              onValueChange={() => {}}
              label="Email Notifications"
              disabled={!switches.notifications}
            />
            <Switch
              value={switches.notifications && false}
              onValueChange={() => {}}
              label="SMS Notifications"
              disabled={!switches.notifications}
            />

            <Text category="h6" style={[styles.sectionTitle, styles.sectionSpacing]}>
              Appearance
            </Text>
            <Switch
              value={switches.darkMode}
              onValueChange={(value) => updateSwitch('darkMode', value)}
              label="Dark Mode"
              status="info"
            />

            <Text category="h6" style={[styles.sectionTitle, styles.sectionSpacing]}>
              Connectivity
            </Text>
            <Switch
              value={switches.wifi}
              onValueChange={(value) => updateSwitch('wifi', value)}
              label="Wi-Fi"
              status="success"
            />
            <Switch
              value={switches.bluetooth}
              onValueChange={(value) => updateSwitch('bluetooth', value)}
              label="Bluetooth"
              status="info"
            />
            <Switch
              value={switches.location}
              onValueChange={(value) => updateSwitch('location', value)}
              label="Location Services"
              status="warning"
            />
            <Switch
              value={switches.airplane}
              onValueChange={(value) => updateSwitch('airplane', value)}
              label="Airplane Mode"
              status="danger"
            />
          </View>
        </ComponentExample>

        {/* Custom Styled Switches */}
        <ComponentExample
          title="Custom Styling"
          description="Switches with custom container and label styling."
        >
          <View style={styles.customSwitchGroup}>
            <Switch
              value={true}
              onValueChange={() => {}}
              label="Custom Container"
              containerStyle={styles.customContainer}
              labelStyle={styles.customLabel}
            />
            <Switch
              value={false}
              onValueChange={() => {}}
              label="Styled Switch"
              containerStyle={styles.customContainer2}
              labelStyle={styles.customLabel2}
            />
          </View>
        </ComponentExample>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  switchGroup: {
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  settingsPanel: {
    gap: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSpacing: {
    marginTop: 16,
  },
  customSwitchGroup: {
    gap: 16,
  },
  customContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  customLabel: {
    fontWeight: '600',
    color: '#1976D2',
  },
  customContainer2: {
    backgroundColor: '#F3E5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  customLabel2: {
    fontWeight: '600',
    color: '#9C27B0',
  },
});

export default SwitchScreen;