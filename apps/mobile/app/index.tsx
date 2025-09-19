import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Button } from '@todo/ui-mobile';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚀 Fresh Expo Router App (Web)</Text>
      <Text style={styles.subtext}>If you can read this, web rendering works.</Text>

      <View style={styles.buttons}>
        <Button variant="primary" onPress={() => router.push('/todos')}>
          UI Kit Button → Todos
        </Button>
        <Pressable style={styles.button} onPress={() => router.push('/todos')}>
          <Text style={styles.buttonText}>Go to Todos</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push('/wallet')}>
          <Text style={styles.buttonText}>Go to Wallet</Text>
        </Pressable>
      </View>
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
  buttons: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
