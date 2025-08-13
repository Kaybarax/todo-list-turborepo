import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import { Checkbox, Button } from '@todo/ui-mobile';
import ComponentExample from '../components/ComponentExample';

const CheckboxScreen: React.FC = () => {
  const [checkboxes, setCheckboxes] = useState({
    basic: false,
    terms: false,
    newsletter: true,
    notifications: false,
  });

  const [todoItems, setTodoItems] = useState([
    { id: 1, text: 'Complete project documentation', checked: false },
    { id: 2, text: 'Review pull requests', checked: true },
    { id: 3, text: 'Update dependencies', checked: false },
    { id: 4, text: 'Write unit tests', checked: false },
  ]);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['push']);

  const updateCheckbox = (key: string, value: boolean) => {
    setCheckboxes(prev => ({ ...prev, [key]: value }));
  };

  const updateTodoItem = (id: number, checked: boolean) => {
    setTodoItems(prev => prev.map(item => (item.id === id ? { ...item, checked } : item)));
  };

  const updateFeatureSelection = (feature: string, checked: boolean) => {
    setSelectedFeatures(prev => (checked ? [...prev, feature] : prev.filter(f => f !== feature)));
  };

  const selectAllTodos = () => {
    setTodoItems(prev => prev.map(item => ({ ...item, checked: true })));
  };

  const deselectAllTodos = () => {
    setTodoItems(prev => prev.map(item => ({ ...item, checked: false })));
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Component Description */}
        <Card style={styles.descriptionCard}>
          <Layout style={styles.cardHeaderLayout}>
            <Text category="h5">Checkbox Component</Text>
          </Layout>
          <Layout style={styles.cardContent}>
            <Text category="p1">
              Checkbox component for multiple selections. Built on UI Kitten CheckBox primitive with custom styling and
              status mapping.
            </Text>
          </Layout>
        </Card>

        {/* Basic Checkboxes */}
        <ComponentExample title="Basic Checkboxes" description="Simple checkboxes with labels.">
          <View style={styles.checkboxGroup}>
            <Checkbox
              checked={checkboxes.basic}
              onValueChange={value => updateCheckbox('basic', value)}
              label="Basic Checkbox"
            />
            <Checkbox checked={true} onValueChange={() => {}} label="Always Checked" />
            <Checkbox checked={false} onValueChange={() => {}} label="Always Unchecked" />
          </View>
        </ComponentExample>

        {/* Checkbox Status */}
        <ComponentExample title="Checkbox Status" description="Different status colors for various use cases.">
          <View style={styles.checkboxGroup}>
            <Checkbox checked={true} onValueChange={() => {}} label="Primary Status" status="primary" />
            <Checkbox checked={true} onValueChange={() => {}} label="Success Status" status="success" />
            <Checkbox checked={true} onValueChange={() => {}} label="Info Status" status="info" />
            <Checkbox checked={true} onValueChange={() => {}} label="Warning Status" status="warning" />
            <Checkbox checked={true} onValueChange={() => {}} label="Danger Status" status="danger" />
          </View>
        </ComponentExample>

        {/* Disabled Checkboxes */}
        <ComponentExample title="Disabled Checkboxes" description="Checkboxes in disabled state.">
          <View style={styles.checkboxGroup}>
            <Checkbox checked={true} onValueChange={() => {}} label="Disabled (Checked)" disabled />
            <Checkbox checked={false} onValueChange={() => {}} label="Disabled (Unchecked)" disabled />
          </View>
        </ComponentExample>

        {/* Indeterminate State */}
        <ComponentExample
          title="Indeterminate State"
          description="Checkboxes with indeterminate state for partial selections."
        >
          <View style={styles.checkboxGroup}>
            <Checkbox checked={false} onValueChange={() => {}} label="Indeterminate Checkbox" indeterminate={true} />
            <Checkbox checked={true} onValueChange={() => {}} label="Indeterminate + Checked" indeterminate={true} />
          </View>
        </ComponentExample>

        {/* Checkboxes without Labels */}
        <ComponentExample title="Checkboxes without Labels" description="Standalone checkboxes without text labels.">
          <View style={styles.checkboxRow}>
            <Checkbox checked={checkboxes.basic} onValueChange={value => updateCheckbox('basic', value)} />
            <Checkbox checked={true} onValueChange={() => {}} status="success" />
            <Checkbox checked={false} onValueChange={() => {}} status="danger" />
          </View>
        </ComponentExample>

        {/* Todo List Example */}
        <ComponentExample title="Todo List Example" description="Interactive todo list with checkboxes.">
          <View style={styles.todoContainer}>
            <View style={styles.todoHeader}>
              <Text category="h6">Tasks</Text>
              <View style={styles.todoActions}>
                <Button title="All" size="small" variant="outline" onPress={selectAllTodos} />
                <Button title="None" size="small" variant="outline" onPress={deselectAllTodos} />
              </View>
            </View>

            <View style={styles.todoList}>
              {todoItems.map(item => (
                <View key={item.id} style={styles.todoItem}>
                  <Checkbox
                    checked={item.checked}
                    onValueChange={checked => updateTodoItem(item.id, checked)}
                    label={item.text}
                    status={item.checked ? 'success' : 'basic'}
                  />
                </View>
              ))}
            </View>

            <Text category="c1" appearance="hint" style={styles.todoSummary}>
              {todoItems.filter(item => item.checked).length} of {todoItems.length} completed
            </Text>
          </View>
        </ComponentExample>

        {/* Form Example */}
        <ComponentExample title="Form Example" description="Checkboxes in a form context with validation.">
          <View style={styles.formContainer}>
            <Text category="h6" style={styles.formTitle}>
              Account Preferences
            </Text>

            <Checkbox
              checked={checkboxes.terms}
              onValueChange={value => updateCheckbox('terms', value)}
              label="I agree to the Terms and Conditions"
              status={checkboxes.terms ? 'success' : 'danger'}
            />

            <Checkbox
              checked={checkboxes.newsletter}
              onValueChange={value => updateCheckbox('newsletter', value)}
              label="Subscribe to newsletter"
            />

            <Checkbox
              checked={checkboxes.notifications}
              onValueChange={value => updateCheckbox('notifications', value)}
              label="Enable push notifications"
            />

            <Text category="s1" style={styles.sectionTitle}>
              Features (Select multiple)
            </Text>

            {[
              { id: 'push', label: 'Push Notifications' },
              { id: 'email', label: 'Email Alerts' },
              { id: 'sms', label: 'SMS Updates' },
              { id: 'analytics', label: 'Usage Analytics' },
            ].map(feature => (
              <Checkbox
                key={feature.id}
                checked={selectedFeatures.includes(feature.id)}
                onValueChange={checked => updateFeatureSelection(feature.id, checked)}
                label={feature.label}
                status="info"
              />
            ))}

            <Button
              title="Save Preferences"
              variant="primary"
              fullWidth
              disabled={!checkboxes.terms}
              style={styles.saveButton}
              onPress={() => alert('Preferences saved!')}
            />
          </View>
        </ComponentExample>

        {/* Custom Styled Checkboxes */}
        <ComponentExample title="Custom Styling" description="Checkboxes with custom container and label styling.">
          <View style={styles.customCheckboxGroup}>
            <Checkbox
              checked={true}
              onValueChange={() => {}}
              label="Custom Styled"
              containerStyle={styles.customContainer}
              labelStyle={styles.customLabel}
            />
            <Checkbox
              checked={false}
              onValueChange={() => {}}
              label="Another Style"
              containerStyle={styles.customContainer2}
              labelStyle={styles.customLabel2}
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
  checkboxGroup: {
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  todoContainer: {
    gap: 12,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  todoList: {
    gap: 8,
  },
  todoItem: {
    paddingVertical: 4,
  },
  todoSummary: {
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    gap: 16,
  },
  formTitle: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 8,
  },
  customCheckboxGroup: {
    gap: 16,
  },
  customContainer: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
  },
  customLabel: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  customContainer2: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  customLabel2: {
    fontWeight: '600',
    color: '#F57C00',
  },
});

export default CheckboxScreen;
