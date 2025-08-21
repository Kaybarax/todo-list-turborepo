import React from 'react';
import { render } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../lib/components/Card';

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Card', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <Card testID="test-card">
        <CardContent>Card content</CardContent>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByTestId('test-card')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['default', 'outlined', 'filled'] as const;

    variants.forEach(variant => {
      const { getByTestId, unmount } = render(
        <Card variant={variant} testID={`card-${variant}`}>
          <CardContent>Test content</CardContent>
        </Card>,
        { wrapper: TestWrapper },
      );

      expect(getByTestId(`card-${variant}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different elevation levels', () => {
    const elevations = ['none', 'low', 'medium', 'high'] as const;

    elevations.forEach(elevation => {
      const { getByTestId, unmount } = render(
        <Card elevation={elevation} testID={`card-${elevation}`}>
          <CardContent>Test content</CardContent>
        </Card>,
        { wrapper: TestWrapper },
      );

      expect(getByTestId(`card-${elevation}`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Card style={customStyle} testID="styled-card">
        <CardContent>Styled content</CardContent>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByTestId('styled-card')).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(
      <Card testID="props-card" accessibilityLabel="Custom card">
        <CardContent>Props test</CardContent>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByTestId('props-card')).toBeTruthy();
  });
});

describe('CardHeader', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Header Title</CardTitle>
        </CardHeader>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Header Title')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'blue' };
    const { getByText } = render(
      <Card>
        <CardHeader style={customStyle}>
          <CardTitle>Styled Header</CardTitle>
        </CardHeader>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Styled Header')).toBeTruthy();
  });
});

describe('CardTitle', () => {
  it('renders correctly with default category', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Default Title</CardTitle>
        </CardHeader>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Default Title')).toBeTruthy();
  });

  it('renders with different categories', () => {
    const categories = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

    categories.forEach(category => {
      const { getByText, unmount } = render(
        <Card>
          <CardHeader>
            <CardTitle category={category}>{category} Title</CardTitle>
          </CardHeader>
        </Card>,
        { wrapper: TestWrapper },
      );

      expect(getByText(`${category} Title`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom style', () => {
    const customStyle = { color: 'red' };
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle style={customStyle}>Styled Title</CardTitle>
        </CardHeader>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Styled Title')).toBeTruthy();
  });
});

describe('CardDescription', () => {
  it('renders correctly with default category', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardDescription>Default description</CardDescription>
        </CardHeader>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Default description')).toBeTruthy();
  });

  it('renders with different categories', () => {
    const categories = ['p1', 'p2', 's1', 's2', 'c1', 'c2'] as const;

    categories.forEach(category => {
      const { getByText, unmount } = render(
        <Card>
          <CardHeader>
            <CardDescription category={category}>{category} description</CardDescription>
          </CardHeader>
        </Card>,
        { wrapper: TestWrapper },
      );

      expect(getByText(`${category} description`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom style', () => {
    const customStyle = { fontSize: 16 };
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardDescription style={customStyle}>Styled description</CardDescription>
        </CardHeader>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Styled description')).toBeTruthy();
  });
});

describe('CardContent', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Card>
        <CardContent>Content text</CardContent>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Content text')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { padding: 20 };
    const { getByText } = render(
      <Card>
        <CardContent style={customStyle}>Styled content</CardContent>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Styled content')).toBeTruthy();
  });
});

describe('CardFooter', () => {
  it('renders correctly with default alignment', () => {
    const { getByText } = render(
      <Card>
        <CardFooter>
          <CardTitle>Footer content</CardTitle>
        </CardFooter>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Footer content')).toBeTruthy();
  });

  it('renders with different alignments', () => {
    const alignments = ['left', 'center', 'right', 'space-between'] as const;

    alignments.forEach(alignment => {
      const { getByText, unmount } = render(
        <Card>
          <CardFooter alignment={alignment}>
            <CardTitle>{alignment} footer</CardTitle>
          </CardFooter>
        </Card>,
        { wrapper: TestWrapper },
      );

      expect(getByText(`${alignment} footer`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'gray' };
    const { getByText } = render(
      <Card>
        <CardFooter style={customStyle}>
          <CardTitle>Styled footer</CardTitle>
        </CardFooter>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Styled footer')).toBeTruthy();
  });
});

describe('Complete Card Structure', () => {
  it('renders a complete card with all components', () => {
    const { getByText } = render(
      <Card testID="complete-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>This is the main content of the card.</CardTitle>
        </CardContent>
        <CardFooter>
          <CardTitle>Footer Action</CardTitle>
        </CardFooter>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Card Title')).toBeTruthy();
    expect(getByText('Card description goes here')).toBeTruthy();
    expect(getByText('This is the main content of the card.')).toBeTruthy();
    expect(getByText('Footer Action')).toBeTruthy();
  });

  it('renders complex card with all features', () => {
    const { getByText } = render(
      <Card variant="outlined" elevation="high" testID="complex-card">
        <CardHeader>
          <CardTitle category="h3">Complex Card</CardTitle>
          <CardDescription category="p1">This is a complex card example</CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>Main content with various features</CardTitle>
        </CardContent>
        <CardFooter alignment="space-between">
          <CardTitle>Left</CardTitle>
          <CardTitle>Right</CardTitle>
        </CardFooter>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Complex Card')).toBeTruthy();
    expect(getByText('This is a complex card example')).toBeTruthy();
    expect(getByText('Main content with various features')).toBeTruthy();
    expect(getByText('Left')).toBeTruthy();
    expect(getByText('Right')).toBeTruthy();
  });

  it('maintains proper component hierarchy', () => {
    const { getByTestId } = render(
      <Card testID="hierarchy-card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>Content</CardTitle>
        </CardContent>
        <CardFooter>
          <CardTitle>Footer</CardTitle>
        </CardFooter>
      </Card>,
      { wrapper: TestWrapper },
    );

    const card = getByTestId('hierarchy-card');
    expect(card).toBeTruthy();
  });

  it('handles nested content correctly', () => {
    const { getByText } = render(
      <Card>
        <CardContent>
          <Card variant="outlined">
            <CardContent>
              <CardTitle>Nested card content</CardTitle>
            </CardContent>
          </Card>
        </CardContent>
      </Card>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Nested card content')).toBeTruthy();
  });
});
