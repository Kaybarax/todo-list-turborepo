import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import { Button } from '@todo/ui-mobile';
import ComponentExample from '../components/ComponentExample';

const ButtonScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Component Description */}
        <Card style={styles.descriptionCard}>
          <Layout style={styles.cardHeaderLayout}>
            <Text category="h5">Button Component</Text>
          </Layout>
          <Layout style={styles.cardContent}>
            <Text category="p1">
              Interactive button component with multiple variants, sizes, and states. 
              Built on UI Kitten Button primitive with custom styling and functionality.
            </Text>
          </Layout>
        </Card>

        {/* Button Variants */}
        <ComponentExample
          title="Button Variants"
          description="Different visual styles for various use cases."
        >
          <View style={styles.exampleGrid}>
            <Button title="Primary" variant="primary" onPress={() => {}} />
            <Button title="Secondary" variant="secondary" onPress={() => {}} />
            <Button title="Outline" variant="outline" onPress={() => {}} />
            <Button title="Danger" variant="danger" onPress={() => {}} />
            <Button title="Success" variant="success" onPress={() => {}} />
            <Button title="Ghost" variant="ghost" onPress={() => {}} />
          </View>
        </ComponentExample>

        {/* Button Sizes */}
        <ComponentExample
          title="Button Sizes"
          description="Different sizes to fit various layouts."
        >
          <View style={styles.exampleColumn}>
            <Button title="Small Button" size="small" onPress={() => {}} />
            <Button title="Medium Button" size="medium" onPress={() => {}} />
            <Button title="Large Button" size="large" onPress={() => {}} />
          </View>
        </ComponentExample>

        {/* Button States */}
        <ComponentExample
          title="Button States"
          description="Different button states including disabled and loading."
        >
          <View style={styles.exampleColumn}>
            <Button title="Normal Button" onPress={() => {}} />
            <Button title="Disabled Button" disabled onPress={() => {}} />
            <Button 
              title={loading ? "Loading..." : "Click to Load"} 
              loading={loading}
              onPress={handleLoadingDemo} 
            />
          </View>
        </ComponentExample>

        {/* Buttons with Icons */}
        <ComponentExample
          title="Buttons with Icons"
          description="Buttons with left and right icons."
        >
          <View style={styles.exampleColumn}>
            <Button 
              title="Download" 
              leftIcon="download" 
              variant="primary" 
              onPress={() => {}} 
            />
            <Button 
              title="Send Message" 
              rightIcon="arrow-forward" 
              variant="outline" 
              onPress={() => {}} 
            />
            <Button 
              title="Save & Continue" 
              leftIcon="save" 
              rightIcon="arrow-forward" 
              variant="success" 
              onPress={() => {}} 
            />
          </View>
        </ComponentExample>

        {/* Full Width Buttons */}
        <ComponentExample
          title="Full Width & Rounded"
          description="Buttons with full width and rounded styling."
        >
          <View style={styles.exampleColumn}>
            <Button 
              title="Full Width Button" 
              fullWidth 
              variant="primary" 
              onPress={() => {}} 
            />
            <Button 
              title="Rounded Button" 
              rounded 
              variant="secondary" 
              onPress={() => {}} 
            />
            <Button 
              title="Full Width & Rounded" 
              fullWidth 
              rounded 
              variant="success" 
              onPress={() => {}} 
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
  cardHeaderLayout: {
    padding: 16,
    paddingBottom: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  exampleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  exampleColumn: {
    gap: 12,
    alignItems: 'center',
  },
});

export default ButtonScreen;