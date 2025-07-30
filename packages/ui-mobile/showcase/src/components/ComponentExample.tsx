import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, CardHeader, Layout, Text } from '@ui-kitten/components';

interface ComponentExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ComponentExample: React.FC<ComponentExampleProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <View>
          <Text category="h6" style={styles.title}>
            {title}
          </Text>
          <Text category="p2" appearance="hint" style={styles.description}>
            {description}
          </Text>
        </View>
      </CardHeader>
      <Layout style={styles.content}>
        {children}
      </Layout>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    margin: 16,
    padding: 16,
  },
});

export default ComponentExample;