import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚀 Fresh Expo Router App (Web)</Text>
      <Text style={styles.subtext}>If you can read this, web rendering works.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
});
