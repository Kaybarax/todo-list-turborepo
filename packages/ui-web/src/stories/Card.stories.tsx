import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component built on Radix UI with header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

// Card with badge
export const WithBadge: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notification</CardTitle>
          <Badge>New</Badge>
        </div>
        <CardDescription>You have a new message.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is an important notification that requires your attention.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Dismiss</Button>
        <Button>View</Button>
      </CardFooter>
    </Card>
  ),
};

// Simple card without footer
export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>A card without a footer section.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card only has header and content sections.</p>
      </CardContent>
    </Card>
  ),
};

// Card with only content
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>This card only has content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

// Complex card with multiple elements
export const Complex: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Project Dashboard</CardTitle>
            <CardDescription>Overview of your current projects</CardDescription>
          </div>
          <Badge variant="secondary">3 Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Website Redesign</span>
            <Badge variant="outline">Design</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Mobile App</span>
            <Badge>Development</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>API Integration</span>
            <Badge variant="destructive">Blocked</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View All</Button>
        <Button>New Project</Button>
      </CardFooter>
    </Card>
  ),
};

// Card as different HTML element
export const AsArticle: Story = {
  render: () => (
    <Card asChild>
      <article className="w-[350px]">
        <CardHeader>
          <CardTitle>Blog Post</CardTitle>
          <CardDescription>Published on March 15, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card is rendered as an article element for better semantics.</p>
        </CardContent>
        <CardFooter>
          <Button variant="link">Read More</Button>
        </CardFooter>
      </article>
    </Card>
  ),
};

// Visual regression test: Multiple card layouts
export const AllLayouts: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Basic Card</CardTitle>
          <CardDescription>Simple card layout</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Basic content</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>With Badge</CardTitle>
            <Badge>New</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p>Card with badge in header</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p>Content-only card without header or footer</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>No Footer</CardTitle>
          <CardDescription>Card without footer</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has no footer section</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual regression test showing different card layouts and configurations.',
      },
    },
  },
};

// Dark mode test
export const DarkMode: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Dark Mode Card</CardTitle>
        <CardDescription>Card in dark theme</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card is displayed in dark mode.</p>
      </CardContent>
      <CardFooter>
        <Button>Dark Action</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Responsive test
export const ResponsiveTest: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Responsive Card</CardTitle>
          <CardDescription>This card adapts to different screen sizes</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content that should be readable on all devices.</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto">Primary</Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Secondary
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
  },
};
