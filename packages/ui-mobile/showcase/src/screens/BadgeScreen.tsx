import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import { Badge } from '@todo/ui-mobile';
import ComponentExample from '../components/ComponentExample';

const BadgeScreen: React.FC = () => {
  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Component Description */}
        <Card style={styles.descriptionCard}>
          <Layout style={styles.cardHeaderLayout}>
            <Text category="h5">Badge Component</Text>
          </Layout>
          <Layout style={styles.cardContent}>
            <Text category="p1">
              Small status indicator component with color variants. Built with UI Kitten Text 
              component and custom styling for consistent design.
            </Text>
          </Layout>
        </Card>

        {/* Badge Variants */}
        <ComponentExample
          title="Badge Variants"
          description="Different visual styles for various use cases."
        >
          <View style={styles.badgeGrid}>
            <Badge variant="default" text="Default" />
            <Badge variant="primary" text="Primary" />
            <Badge variant="secondary" text="Secondary" />
            <Badge variant="success" text="Success" />
            <Badge variant="warning" text="Warning" />
            <Badge variant="danger" text="Danger" />
          </View>
        </ComponentExample>

        {/* Badge Sizes */}
        <ComponentExample
          title="Badge Sizes"
          description="Different sizes to fit various layouts."
        >
          <View style={styles.badgeColumn}>
            <Badge variant="primary" size="small" text="Small Badge" />
            <Badge variant="primary" size="medium" text="Medium Badge" />
            <Badge variant="primary" size="large" text="Large Badge" />
          </View>
        </ComponentExample>

        {/* Status Badges */}
        <ComponentExample
          title="Status Indicators"
          description="Badges commonly used for status indicators."
        >
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text category="p1">Order Status:</Text>
              <Badge variant="success" size="small" text="Delivered" />
            </View>
            <View style={styles.statusItem}>
              <Text category="p1">Payment:</Text>
              <Badge variant="warning" size="small" text="Pending" />
            </View>
            <View style={styles.statusItem}>
              <Text category="p1">Verification:</Text>
              <Badge variant="danger" size="small" text="Failed" />
            </View>
            <View style={styles.statusItem}>
              <Text category="p1">Account:</Text>
              <Badge variant="primary" size="small" text="Active" />
            </View>
          </View>
        </ComponentExample>

        {/* Notification Badges */}
        <ComponentExample
          title="Notification Badges"
          description="Badges used for notifications and counts."
        >
          <View style={styles.notificationContainer}>
            <View style={styles.notificationItem}>
              <Text category="p1">Messages</Text>
              <Badge variant="danger" size="small" text="3" />
            </View>
            <View style={styles.notificationItem}>
              <Text category="p1">Notifications</Text>
              <Badge variant="primary" size="small" text="12" />
            </View>
            <View style={styles.notificationItem}>
              <Text category="p1">Updates</Text>
              <Badge variant="secondary" size="small" text="99+" />
            </View>
            <View style={styles.notificationItem}>
              <Text category="p1">New Features</Text>
              <Badge variant="success" size="small" text="NEW" />
            </View>
          </View>
        </ComponentExample>

        {/* Badge in Context */}
        <ComponentExample
          title="Badges in Context"
          description="Examples of badges used in real-world scenarios."
        >
          <View style={styles.contextContainer}>
            {/* User Profile with Badge */}
            <View style={styles.contextItem}>
              <View style={styles.userProfile}>
                <View style={styles.userInfo}>
                  <Text category="h6">John Doe</Text>
                  <Text category="p2" appearance="hint">Software Engineer</Text>
                </View>
                <Badge variant="success" size="small" text="Online" />
              </View>
            </View>

            {/* Product with Badge */}
            <View style={styles.contextItem}>
              <View style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text category="h6">Premium Plan</Text>
                  <Text category="p2" appearance="hint">$29.99/month</Text>
                </View>
                <Badge variant="warning" size="small" text="Popular" />
              </View>
            </View>

            {/* Task with Priority Badge */}
            <View style={styles.contextItem}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Text category="h6">Fix critical bug</Text>
                  <Text category="p2" appearance="hint">Due: Today</Text>
                </View>
                <Badge variant="danger" size="small" text="High Priority" />
              </View>
            </View>
          </View>
        </ComponentExample>

        {/* Custom Styled Badges */}
        <ComponentExample
          title="Custom Styling"
          description="Badges with custom styling and colors."
        >
          <View style={styles.badgeGrid}>
            <Badge 
              variant="primary" 
              text="Custom Blue" 
              style={{ backgroundColor: '#007AFF' }}
            />
            <Badge 
              variant="success" 
              text="Custom Green" 
              style={{ backgroundColor: '#34C759' }}
            />
            <Badge 
              variant="warning" 
              text="Custom Orange" 
              style={{ backgroundColor: '#FF9500' }}
            />
            <Badge 
              variant="danger" 
              text="Custom Red" 
              style={{ backgroundColor: '#FF3B30' }}
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
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  badgeColumn: {
    gap: 12,
    alignItems: 'center',
  },
  statusContainer: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationContainer: {
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
  },
  contextContainer: {
    gap: 12,
  },
  contextItem: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    padding: 12,
  },
  userProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
});

export default BadgeScreen;