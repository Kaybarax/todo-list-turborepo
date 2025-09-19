import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Wallet() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <Text>Placeholder wallet screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
});
