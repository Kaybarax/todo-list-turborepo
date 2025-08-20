// React import removed as it's not used in this file
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../../../src';
import type { ComponentExample } from '../App';

export const cardExamples: ComponentExample[] = [
  {
    title: 'Basic Card',
    description: 'Simple card with header, content, and footer.',
    code: `import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button 
} from '@todo/ui-web'

<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      Card description goes here. This provides additional context.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the main content of the card.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`,
    component: (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here. This provides additional context.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
        <CardFooter>
          <Button>Action</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    title: 'Card with Badge',
    description: 'Card featuring a status badge in the header.',
    code: `import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge 
} from '@todo/ui-web'

<Card className="w-[350px]">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Project Status</CardTitle>
      <Badge variant="success">Active</Badge>
    </div>
    <CardDescription>
      Current project development status and metrics.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Progress:</span>
        <span>75%</span>
      </div>
      <div className="flex justify-between">
        <span>Tasks:</span>
        <span>12/16</span>
      </div>
    </div>
  </CardContent>
</Card>`,
    component: (
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Status</CardTitle>
            <Badge variant="secondary">Active</Badge>
          </div>
          <CardDescription>Current project development status and metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Progress:</span>
              <span>75%</span>
            </div>
            <div className="flex justify-between">
              <span>Tasks:</span>
              <span>12/16</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    title: 'Interactive Card',
    description: 'Card with multiple actions and interactive elements.',
    code: `import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button 
} from '@todo/ui-web'

<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>
      Manage your account settings and preferences.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <p className="text-sm text-gray-600">John Doe</p>
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <p className="text-sm text-gray-600">john@example.com</p>
      </div>
    </div>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>`,
    component: (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-gray-600">John Doe</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-gray-600">john@example.com</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    title: 'Minimal Card',
    description: 'Simple card with just content.',
    code: `import { Card, CardContent } from '@todo/ui-web'

<Card className="w-[350px]">
  <CardContent className="pt-6">
    <div className="text-center">
      <h3 className="text-lg font-semibold">Simple Card</h3>
      <p className="text-sm text-gray-600 mt-2">
        This card only contains content without header or footer.
      </p>
    </div>
  </CardContent>
</Card>`,
    component: (
      <Card className="w-[350px]">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Simple Card</h3>
            <p className="text-sm text-gray-600 mt-2">This card only contains content without header or footer.</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
];
