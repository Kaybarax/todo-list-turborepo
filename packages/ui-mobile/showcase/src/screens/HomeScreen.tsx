import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Layout, Text, Card, Button } from '@ui-kitten/components';
import { Badge } from '@todo/ui-mobile';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type HomeScreenProps = {
  navigation: DrawerNavigationProp<any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const components = [
    {
      name: 'Button',
      description: 'Interactive button component with multiple variants and sizes.',
      screen: 'Button',
    },
    {
      name: 'Card',
      description: 'Flexible container component for displaying content.',
      screen: 'Card',
    },
    {
      name: 'Input',
      description: 'Form input component with validation and error states.',
      screen: 'Input',
    },
    {
      name: 'Badge',
      description: 'Small status indicator component with color variants.',
      screen: 'Badge',
    },
    {
      name: 'Avatar',
      description: 'User avatar component with image and initials support.',
      screen: 'Avatar',
    },
    {
      name: 'Switch',
      description: 'Toggle switch component for boolean values.',
      screen: 'Switch',
    },
    {
      name: 'Checkbox',
      description: 'Checkbox component for multiple selections.',
      screen: 'Checkbox',
    },
  ];

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Layout style={styles.header}>
          <Text category="h1" style={styles.title}>
            UI Mobile Components
          </Text>
          <Text category="s1" appearance="hint" style={styles.subtitle}>
            Interactive showcase of UI Kitten-based components
          </Text>
          <Badge variant="primary" size="small" text="v0.1.0" style={styles.badge} />
        </Layout>

        {/* Component Grid */}
        <Layout style={styles.grid}>
          {components.map((component, index) => (
            <Card key={index} style={styles.componentCard} onPress={() => navigation.navigate(component.screen)}>
              <Layout style={styles.cardHeader}>
                <Text category="h6">{component.name}</Text>
              </Layout>
              <Layout style={styles.cardContent}>
                <Text category="p2" appearance="hint">
                  {component.description}
                </Text>
                <Button
                  size="small"
                  appearance="ghost"
                  onPress={() => navigation.navigate(component.screen)}
                  style={styles.cardButton}
                >
                  View Examples
                </Button>
              </Layout>
            </Card>
          ))}
        </Layout>

        {/* Footer */}
        <Layout style={styles.footer}>
          <Text category="c1" appearance="hint" style={styles.footerText}>
            Built with React Native, Expo, and UI Kitten
          </Text>
        </Layout>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'center',
  },
  grid: {
    gap: 16,
  },
  componentCard: {
    marginBottom: 16,
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 16,
  },
  footerText: {
    textAlign: 'center',
  },
});

export default HomeScreen;
