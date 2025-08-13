import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import { Input, Button } from '@todo/ui-mobile';
import ComponentExample from '../components/ComponentExample';

const InputScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Form submitted successfully!');
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Component Description */}
        <Card style={styles.descriptionCard}>
          <Layout style={styles.cardHeaderLayout}>
            <Text category="h5">Input Component</Text>
          </Layout>
          <Layout style={styles.cardContent}>
            <Text category="p1">
              Form input component with validation and error states. Built on UI Kitten Input primitive with custom
              styling and functionality.
            </Text>
          </Layout>
        </Card>

        {/* Basic Inputs */}
        <ComponentExample title="Basic Inputs" description="Standard input fields with different types.">
          <View style={styles.inputGroup}>
            <Input placeholder="Enter your name" onChangeText={text => {}} />
            <Input placeholder="Enter your email" keyboardType="email-address" onChangeText={text => {}} />
            <Input placeholder="Enter your password" secureTextEntry onChangeText={text => {}} />
          </View>
        </ComponentExample>

        {/* Input Variants */}
        <ComponentExample title="Input Variants" description="Different visual styles for various use cases.">
          <View style={styles.inputGroup}>
            <Input variant="default" placeholder="Default input" onChangeText={text => {}} />
            <Input variant="outline" placeholder="Outline input" onChangeText={text => {}} />
            <Input variant="filled" placeholder="Filled input" onChangeText={text => {}} />
          </View>
        </ComponentExample>

        {/* Input Sizes */}
        <ComponentExample title="Input Sizes" description="Different sizes to fit various layouts.">
          <View style={styles.inputGroup}>
            <Input size="small" placeholder="Small input" onChangeText={text => {}} />
            <Input size="medium" placeholder="Medium input" onChangeText={text => {}} />
            <Input size="large" placeholder="Large input" onChangeText={text => {}} />
          </View>
        </ComponentExample>

        {/* Input with Labels and Icons */}
        <ComponentExample
          title="Inputs with Labels and Icons"
          description="Inputs with labels, helper text, and icons."
        >
          <View style={styles.inputGroup}>
            <Input label="Full Name" placeholder="John Doe" leftIcon="person" onChangeText={text => {}} />
            <Input
              label="Email Address"
              placeholder="john@example.com"
              leftIcon="email"
              rightIcon="check"
              helperText="We'll never share your email"
              onChangeText={text => {}}
            />
            <Input
              label="Password"
              placeholder="Enter password"
              leftIcon="lock"
              rightIcon="visibility"
              secureTextEntry
              required
              onChangeText={text => {}}
            />
          </View>
        </ComponentExample>

        {/* Input States */}
        <ComponentExample title="Input States" description="Different input states including disabled and error.">
          <View style={styles.inputGroup}>
            <Input placeholder="Normal input" onChangeText={text => {}} />
            <Input placeholder="Disabled input" disabled onChangeText={text => {}} />
            <Input placeholder="Error input" error errorMessage="This field is required" onChangeText={text => {}} />
            <Input placeholder="Success input" status="success" rightIcon="check" onChangeText={text => {}} />
          </View>
        </ComponentExample>

        {/* Form Example */}
        <ComponentExample
          title="Complete Form Example"
          description="Interactive form with validation and error handling."
        >
          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={text => handleInputChange('name', text)}
              error={!!errors.name}
              errorMessage={errors.name}
              leftIcon="person"
              required
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={text => handleInputChange('email', text)}
              error={!!errors.email}
              errorMessage={errors.email}
              leftIcon="email"
              keyboardType="email-address"
              required
            />

            <Input
              label="Password"
              placeholder="Enter password"
              value={formData.password}
              onChangeText={text => handleInputChange('password', text)}
              error={!!errors.password}
              errorMessage={errors.password}
              leftIcon="lock"
              secureTextEntry
              required
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={text => handleInputChange('confirmPassword', text)}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              leftIcon="lock"
              secureTextEntry
              required
            />

            <Button
              title="Create Account"
              variant="primary"
              fullWidth
              onPress={handleSubmit}
              style={styles.submitButton}
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
  inputGroup: {
    gap: 16,
  },
  formContainer: {
    gap: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default InputScreen;
