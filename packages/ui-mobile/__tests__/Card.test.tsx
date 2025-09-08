import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';

import { Card } from '../lib/components/Card/Card';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';

describe('Card', () => {
  it('renders correctly with default props', () => {
    renderWithProvider(
      <Card testID="default-card">
        <Card.Content>Test Content</Card.Content>
      </Card>,
    );
    expect(screen.getByTestId('default-card')).toBeTruthy();
    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('renders all variants correctly', () => {
    const variants = ['elevated', 'outlined', 'filled'] as const;

    variants.forEach(variant => {
      const { unmount } = renderWithProvider(
        <Card variant={variant} testID={`card-${variant}`}>
          <Card.Content>{variant} Card</Card.Content>
        </Card>,
      );

      expect(screen.getByTestId(`card-${variant}`)).toBeTruthy();
      unmount();
    });
  });

  it('handles onPress correctly when interactive', () => {
    const onPressMock = jest.fn();
    renderWithProvider(
      <Card onPress={onPressMock} testID="interactive-card">
        <Card.Content>Interactive Card</Card.Content>
      </Card>,
    );

    fireEvent.press(screen.getByTestId('interactive-card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders compound components correctly', () => {
    renderWithProvider(
      <Card testID="compound-card">
        <Card.Header>
          <Card.Title>Test Title</Card.Title>
          <Card.Description>Test Description</Card.Description>
        </Card.Header>
        <Card.Content>Test Content</Card.Content>
        <Card.Footer>Test Footer</Card.Footer>
      </Card>,
    );

    expect(screen.getByTestId('compound-card')).toBeTruthy();
    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Test Description')).toBeTruthy();
    expect(screen.getByText('Test Content')).toBeTruthy();
    expect(screen.getByText('Test Footer')).toBeTruthy();
  });

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithProvider(
      <Card style={customStyle} testID="custom-style-card">
        <Card.Content>Custom Style Card</Card.Content>
      </Card>,
    );

    expect(screen.getByTestId('custom-style-card')).toBeTruthy();
  });

  it('has correct accessibility properties when interactive', () => {
    renderWithProvider(
      <Card onPress={() => {}} accessibilityLabel="Custom card label" testID="accessible-card">
        <Card.Content>Accessible Card</Card.Content>
      </Card>,
    );

    const card = screen.getByTestId('accessible-card');
    expect(card.props.accessibilityRole).toBe('button');
    expect(card.props.accessibilityLabel).toBe('Custom card label');
  });

  it('does not have button role when not interactive', () => {
    renderWithProvider(
      <Card testID="non-interactive-card">
        <Card.Content>Non-interactive Card</Card.Content>
      </Card>,
    );

    const card = screen.getByTestId('non-interactive-card');
    expect(card.props.accessibilityRole).toBeUndefined();
  });

  describe('Card.Header', () => {
    it('renders correctly', () => {
      renderWithProvider(<Card.Header testID="card-header">Header Content</Card.Header>);

      expect(screen.getByTestId('card-header')).toBeTruthy();
      expect(screen.getByText('Header Content')).toBeTruthy();
    });
  });

  describe('Card.Title', () => {
    it('renders correctly', () => {
      renderWithProvider(<Card.Title testID="card-title">Card Title</Card.Title>);

      expect(screen.getByTestId('card-title')).toBeTruthy();
      expect(screen.getByText('Card Title')).toBeTruthy();
    });
  });

  describe('Card.Description', () => {
    it('renders correctly', () => {
      renderWithProvider(<Card.Description testID="card-description">Card Description</Card.Description>);

      expect(screen.getByTestId('card-description')).toBeTruthy();
      expect(screen.getByText('Card Description')).toBeTruthy();
    });
  });

  describe('Card.Content', () => {
    it('renders correctly', () => {
      renderWithProvider(<Card.Content testID="card-content">Card Content</Card.Content>);

      expect(screen.getByTestId('card-content')).toBeTruthy();
      expect(screen.getByText('Card Content')).toBeTruthy();
    });
  });

  describe('Card.Footer', () => {
    it('renders correctly', () => {
      renderWithProvider(<Card.Footer testID="card-footer">Footer Content</Card.Footer>);

      expect(screen.getByTestId('card-footer')).toBeTruthy();
      expect(screen.getByText('Footer Content')).toBeTruthy();
    });
  });
});
