import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.title}>Todo Management</Text>
          <Text style={styles.subtitle}>
            Todo list functionality will be implemented in the next task.
          </Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusItem}>✓ Expo React Native structure created</Text>
            <Text style={styles.statusItem}>✓ Expo Router navigation configured</Text>
            <Text style={styles.statusItem}>✓ Basic layout and screens</Text>
            <Text style={styles.statusItem}>⏳ Todo CRUD operations (next task)</Text>
            <Text style={styles.statusItem}>⏳ Mobile wallet integration (next task)</Text>
            <Text style={styles.statusItem}>⏳ Blockchain storage (next task)</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
});