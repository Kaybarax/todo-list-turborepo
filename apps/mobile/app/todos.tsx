import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Todos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos</Text>
      <Text>Placeholder list</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
});
