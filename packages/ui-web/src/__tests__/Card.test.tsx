import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../components/Card/Card';

describe('Card', () => {
  it('renders correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="test-class">Card Content</Card>);
    expect(screen.getByText('Card Content')).toHaveClass('test-class');
  });

  it('renders with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('renders CardHeader with correct classes', () => {
    render(<CardHeader className="test-class">Header Content</CardHeader>);
    const header = screen.getByText('Header Content');
    expect(header).toHaveClass('test-class');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
    expect(header).toHaveClass('p-6');
  });

  it('renders CardTitle with correct classes', () => {
    render(<CardTitle className="test-class">Title Content</CardTitle>);
    const title = screen.getByText('Title Content');
    expect(title).toHaveClass('test-class');
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('font-semibold');
  });

  it('renders CardDescription with correct classes', () => {
    render(<CardDescription className="test-class">Description Content</CardDescription>);
    const description = screen.getByText('Description Content');
    expect(description).toHaveClass('test-class');
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('renders CardContent with correct classes', () => {
    render(<CardContent className="test-class">Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveClass('test-class');
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
  });

  it('renders CardFooter with correct classes', () => {
    render(<CardFooter className="test-class">Footer Content</CardFooter>);
    const footer = screen.getByText('Footer Content');
    expect(footer).toHaveClass('test-class');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
  });
});
