import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../src/components/Card/Card';

describe('Card', () => {
  it('renders correctly with default props', () => {
    render(<Card data-testid="card">Card content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toBeDefined();
    expect(card.className).toContain('card');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-card" data-testid="card">
        Test
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card.className).toContain('custom-card');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Test</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardHeader', () => {
  it('renders correctly', () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toBeDefined();
  });

  it('applies custom className', () => {
    render(
      <CardHeader className="custom-header" data-testid="header">
        Test
      </CardHeader>,
    );
    const header = screen.getByTestId('header');
    expect(header.className).toContain('custom-header');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Test</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardTitle', () => {
  it('renders correctly', () => {
    render(<CardTitle data-testid="title">Title content</CardTitle>);
    const title = screen.getByTestId('title');
    expect(title).toBeDefined();
  });

  it('applies custom className', () => {
    render(
      <CardTitle className="custom-title" data-testid="title">
        Test
      </CardTitle>,
    );
    const title = screen.getByTestId('title');
    expect(title.className).toContain('custom-title');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<CardTitle ref={ref}>Test</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe('CardDescription', () => {
  it('renders correctly', () => {
    render(<CardDescription data-testid="description">Description content</CardDescription>);
    const description = screen.getByTestId('description');
    expect(description).toBeDefined();
  });

  it('applies custom className', () => {
    render(
      <CardDescription className="custom-description" data-testid="description">
        Test
      </CardDescription>,
    );
    const description = screen.getByTestId('description');
    expect(description.className).toContain('custom-description');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<CardDescription ref={ref}>Test</CardDescription>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('CardContent', () => {
  it('renders correctly', () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toBeDefined();
  });

  it('applies custom className', () => {
    render(
      <CardContent className="custom-content" data-testid="content">
        Test
      </CardContent>,
    );
    const content = screen.getByTestId('content');
    expect(content.className).toContain('custom-content');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Test</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardFooter', () => {
  it('renders correctly', () => {
    render(<CardFooter data-testid="footer">Footer content</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toBeDefined();
  });

  it('applies custom className', () => {
    render(
      <CardFooter className="custom-footer" data-testid="footer">
        Test
      </CardFooter>,
    );
    const footer = screen.getByTestId('footer');
    expect(footer.className).toContain('custom-footer');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Test</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Card composition', () => {
  it('renders complete card structure', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Card Title</CardTitle>
          <CardDescription data-testid="description">Card Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="content">Card Content</CardContent>
        <CardFooter data-testid="footer">Card Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByTestId('card')).toBeDefined();
    expect(screen.getByTestId('header')).toBeDefined();
    expect(screen.getByTestId('title')).toBeDefined();
    expect(screen.getByTestId('description')).toBeDefined();
    expect(screen.getByTestId('content')).toBeDefined();
    expect(screen.getByTestId('footer')).toBeDefined();
  });
});
