import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import { Avatar } from '@todo/ui-mobile';
import ComponentExample from '../components/ComponentExample';

const AvatarScreen: React.FC = () => {
  const mockImageSource = { uri: 'https://via.placeholder.com/150/3366FF/FFFFFF?text=JD' };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Component Description */}
        <Card style={styles.descriptionCard}>
          <Layout style={styles.cardContent}>
            <Text category="h5" style={styles.cardTitle}>
              Avatar Component
            </Text>
            <Text category="p1">
              User avatar component with image and initials support. Built on UI Kitten Avatar primitive with custom
              fallback for initials display.
            </Text>
          </Layout>
        </Card>

        {/* Avatar Sizes */}
        <ComponentExample title="Avatar Sizes" description="Different sizes to fit various layouts.">
          <View style={styles.avatarRow}>
            <Avatar size="tiny" initials="XS" />
            <Avatar size="small" initials="SM" />
            <Avatar size="medium" initials="MD" />
            <Avatar size="large" initials="LG" />
            <Avatar size="giant" initials="XL" />
          </View>
        </ComponentExample>

        {/* Avatar Shapes */}
        <ComponentExample title="Avatar Shapes" description="Different shapes for various design needs.">
          <View style={styles.avatarRow}>
            <Avatar shape="round" initials="RD" size="large" />
            <Avatar shape="rounded" initials="RN" size="large" />
            <Avatar shape="square" initials="SQ" size="large" />
          </View>
        </ComponentExample>

        {/* Avatar with Images */}
        <ComponentExample title="Avatar with Images" description="Avatars displaying user profile images.">
          <View style={styles.avatarRow}>
            <Avatar source={mockImageSource} size="medium" />
            <Avatar source={mockImageSource} size="large" />
            <Avatar source={mockImageSource} size="giant" />
          </View>
        </ComponentExample>

        {/* Avatar with Initials */}
        <ComponentExample title="Avatar with Initials" description="Avatars with user initials as fallback.">
          <View style={styles.avatarRow}>
            <Avatar initials="JD" size="medium" />
            <Avatar initials="AS" size="medium" backgroundColor="#FF6B6B" />
            <Avatar initials="MK" size="medium" backgroundColor="#4ECDC4" />
            <Avatar initials="LW" size="medium" backgroundColor="#45B7D1" />
          </View>
        </ComponentExample>

        {/* Custom Colors */}
        <ComponentExample title="Custom Colors" description="Avatars with custom background and text colors.">
          <View style={styles.avatarRow}>
            <Avatar initials="RD" size="large" backgroundColor="#FF3B30" textColor="#FFFFFF" />
            <Avatar initials="GR" size="large" backgroundColor="#34C759" textColor="#FFFFFF" />
            <Avatar initials="BL" size="large" backgroundColor="#007AFF" textColor="#FFFFFF" />
            <Avatar initials="OR" size="large" backgroundColor="#FF9500" textColor="#FFFFFF" />
          </View>
        </ComponentExample>

        {/* Avatar in Context */}
        <ComponentExample title="Avatars in Context" description="Examples of avatars used in real-world scenarios.">
          <View style={styles.contextContainer}>
            {/* User List Item */}
            <View style={styles.userListItem}>
              <Avatar initials="JD" size="medium" />
              <View style={styles.userInfo}>
                <Text category="h6">John Doe</Text>
                <Text category="p2" appearance="hint">
                  Software Engineer
                </Text>
              </View>
            </View>

            {/* Comment Item */}
            <View style={styles.commentItem}>
              <Avatar initials="AS" size="small" backgroundColor="#4ECDC4" />
              <View style={styles.commentContent}>
                <Text category="s1">Alice Smith</Text>
                <Text category="p2">Great work on the new feature! Looking forward to testing it.</Text>
                <Text category="c1" appearance="hint">
                  2 hours ago
                </Text>
              </View>
            </View>

            {/* Team Member */}
            <View style={styles.teamMember}>
              <Avatar source={mockImageSource} size="large" />
              <View style={styles.memberInfo}>
                <Text category="h6">Michael Johnson</Text>
                <Text category="p2" appearance="hint">
                  Product Manager
                </Text>
                <Text category="c1" appearance="hint">
                  Online now
                </Text>
              </View>
            </View>
          </View>
        </ComponentExample>

        {/* Avatar Groups */}
        <ComponentExample title="Avatar Groups" description="Multiple avatars displayed together.">
          <View style={styles.groupContainer}>
            <Text category="s1" style={styles.groupLabel}>
              Team Members (4)
            </Text>
            <View style={styles.avatarGroup}>
              <Avatar initials="JD" size="medium" style={styles.groupAvatar} />
              <Avatar initials="AS" size="medium" backgroundColor="#FF6B6B" style={styles.groupAvatar} />
              <Avatar initials="MJ" size="medium" backgroundColor="#4ECDC4" style={styles.groupAvatar} />
              <Avatar initials="+1" size="medium" backgroundColor="#8F9BB3" style={styles.groupAvatar} />
            </View>
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
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  contextContainer: {
    gap: 16,
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    gap: 12,
  },
  commentContent: {
    flex: 1,
    gap: 4,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    gap: 16,
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  groupContainer: {
    gap: 12,
  },
  groupLabel: {
    fontWeight: '600',
  },
  avatarGroup: {
    flexDirection: 'row',
    gap: -8, // Overlap avatars slightly
  },
  groupAvatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default AvatarScreen;
