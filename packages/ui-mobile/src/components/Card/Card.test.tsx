import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './Card';

describe('Card Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Card testID="test-card" />);
    expect(getByTestId('test-card')).toBeTruthy();
  });

  it('renders with children', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Card Content</Text>
        </CardContent>
        <CardFooter>
          <Text>Card Footer</Text>
        </CardFooter>
      </Card>
    );
    
    expect(getByText('Card Title')).toBeTruthy();
    expect(getByText('Card Description')).toBeTruthy();
    expect(getByText('Card Content')).toBeTruthy();
    expect(getByText('Card Footer')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <Card 
        testID="styled-card" 
        style={{ backgroundColor: 'red' }} 
      />
    );
    
    const card = getByTestId('styled-card');
    expect(card.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: 'red' })
    );
  });
});