import React from 'react';
import { render } from '@testing-library/react-native';
import FormField from '../lib/components/FormField';
import { TextInput } from 'react-native';

describe('FormField', () => {
  it('shows label and hint when no error', () => {
    const { queryByTestId, toJSON } = render(
      <FormField label="Email" hint="We will not spam" testID="email-field">
        <TextInput />
      </FormField>,
    );
    expect(queryByTestId('email-field-hint')).toBeTruthy();
    expect(queryByTestId('email-field-error')).toBeNull();
    const tree: any = toJSON();
    expect(tree.props.accessibilityLabel).toBe('Email');
  });

  it('shows error precedence over hint', () => {
    const { queryByTestId } = render(
      <FormField label="Email" hint="We will not spam" error="Invalid" testID="email-field">
        <TextInput />
      </FormField>,
    );
    expect(queryByTestId('email-field-error')).toBeTruthy();
    expect(queryByTestId('email-field-hint')).toBeNull();
  });

  it('includes describedBy ids when error present', () => {
    const { toJSON } = render(
      <FormField label="Email" error="Invalid" testID="email-field">
        <TextInput />
      </FormField>,
    );
    const tree: any = toJSON();
    expect(tree.props.accessibilityDescribedBy).toContain('email-field-error');
  });
});
