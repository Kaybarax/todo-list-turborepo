import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text, Card as KittenCard } from '@ui-kitten/components';
import { 
  Card, 
  CardHeader as CustomCardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button,
  Badge 
} from '@todo/ui-mobile';
import ComponentExample from '../components/ComponentExample';

const CardScreen: React.FC = () => {
  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Component Description */}
        <KittenCard style={styles.descriptionCard}>
          <Layout style={styles.cardHeaderLayout}>
            <Text category="h5">Card Component</Text>
          </Layout>
          <Layout style={styles.cardContent}>
            <Text category="p1">
              Flexible container component for displaying content. Built on UI Kitten Card 
              primitive with custom header, content, and footer components.
            </Text>
          </Layout>
        </KittenCard>

        {/* Basic Card */}
        <ComponentExample
          title="Basic Card"
          description="Simple card with header, content, and footer."
        >
          <Card style={styles.exampleCard}>
            <CustomCardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                Card description goes here. This provides additional context.
              </CardDescription>
            </CustomCardHeader>
            <CardContent>
              <Text category="p1">This is the main content of the card.</Text>
            </CardContent>
            <CardFooter>
              <Button title="Action" size="small" onPress={() => {}} />
            </CardFooter>
          </Card>
        </ComponentExample>

        {/* Card with Badge */}
        <ComponentExample
          title="Card with Badge"
          description="Card featuring a status badge in the header."
        >
          <Card style={styles.exampleCard}>
            <CustomCardHeader>
              <View style={styles.headerWithBadge}>
                <View style={styles.headerText}>
                  <CardTitle>Project Status</CardTitle>
                  <CardDescription>
                    Current project development status and metrics.
                  </CardDescription>
                </View>
                <Badge variant="success" size="small" text="Active" />
              </View>
            </CustomCardHeader>
            <CardContent>
              <View style={styles.statusContent}>
                <View style={styles.statusRow}>
                  <Text category="p2">Progress:</Text>
                  <Text category="p2">75%</Text>
                </View>
                <View style={styles.statusRow}>
                  <Text category="p2">Tasks:</Text>
                  <Text category="p2">12/16</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </ComponentExample>

        {/* Interactive Card */}
        <ComponentExample
          title="Interactive Card"
          description="Card with multiple actions and interactive elements."
        >
          <Card style={styles.exampleCard}>
            <CustomCardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CustomCardHeader>
            <CardContent>
              <View style={styles.profileContent}>
                <View style={styles.profileField}>
                  <Text category="label" style={styles.fieldLabel}>Name</Text>
                  <Text category="p2" appearance="hint">John Doe</Text>
                </View>
                <View style={styles.profileField}>
                  <Text category="label" style={styles.fieldLabel}>Email</Text>
                  <Text category="p2" appearance="hint">john@example.com</Text>
                </View>
              </View>
            </CardContent>
            <CardFooter alignment="space-between">
              <Button title="Cancel" variant="outline" size="small" onPress={() => {}} />
              <Button title="Save Changes" variant="primary" size="small" onPress={() => {}} />
            </CardFooter>
          </Card>
        </ComponentExample>

        {/* Card Variants */}
        <ComponentExample
          title="Card Variants"
          description="Different card styles and elevations."
        >
          <View style={styles.cardVariants}>
            <Card variant="default" elevation="low" style={styles.variantCard}>
              <CardContent>
                <Text category="h6" style={styles.variantTitle}>Default Card</Text>
                <Text category="p2" appearance="hint">Low elevation</Text>
              </CardContent>
            </Card>
            
            <Card variant="outlined" elevation="medium" style={styles.variantCard}>
              <CardContent>
                <Text category="h6" style={styles.variantTitle}>Outlined Card</Text>
                <Text category="p2" appearance="hint">Medium elevation</Text>
              </CardContent>
            </Card>
            
            <Card variant="filled" elevation="high" style={styles.variantCard}>
              <CardContent>
                <Text category="h6" style={styles.variantTitle}>Filled Card</Text>
                <Text category="p2" appearance="hint">High elevation</Text>
              </CardContent>
            </Card>
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
  cardHeaderLayout: {
    padding: 16,
    paddingBottom: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  exampleCard: {
    width: '100%',
  },
  headerWithBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  statusContent: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileContent: {
    gap: 16,
  },
  profileField: {
    gap: 4,
  },
  fieldLabel: {
    fontWeight: '600',
  },
  cardVariants: {
    gap: 12,
  },
  variantCard: {
    width: '100%',
  },
  variantTitle: {
    marginBottom: 4,
  },
});

export default CardScreen;