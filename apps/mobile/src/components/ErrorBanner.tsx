import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { message: string };

export const ErrorBanner: React.FC<Props> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  title: { fontWeight: '600', color: '#991B1B', marginBottom: 4 },
  text: { color: '#7F1D1D' },
});

export default ErrorBanner;
