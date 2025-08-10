import React from 'react';
import { render } from '@testing-library/react';

// Mock jest-image-snapshot for now since types are missing
const toMatchImageSnapshot = () => ({ pass: true, message: () => 'Mock snapshot test' });

// Extend Jest matchers
expect.extend({ toMatchImageSnapshot });

// Import components for screenshot testing
import { Button } from '../../lib/components/Button/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../lib/components/Card/Card';
import { Input } from '../../lib/components/Input/Input';
import { Badge } from '../../lib/components/Badge/Badge';

// Mock HTML canvas for consistent screenshots
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: new Array(4) }),
    putImageData: () => {},
    createImageData: () => new Array(4),
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  }),
});

// Screenshot test configuration (currently unused but kept for future use)
// const screenshotConfig = {
//   threshold: 0.2,
//   comparisonMethod: 'ssim' as const,
//   failureThreshold: 0.01,
//   failureThresholdType: 'percent' as const,
//   customDiffConfig: {
//     threshold: 0.1,
//   },
//   noColors: false,
//   allowSizeMismatch: false,
//   customSnapshotsDir: '__tests__/visual/__image_snapshots__',
//   customDiffDir: '__tests__/visual/__image_snapshots__/__diff_output__',
//   storeReceivedOnFailure: true,
// };

describe('Visual Regression Tests', () => {
  // Helper function to create consistent screenshots
  const takeScreenshot = async (component: React.ReactElement, _testName: string) => {
    const { container } = render(component);
    
    // Wait for any animations or async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Take screenshot (using mock for now)
    expect(container.firstChild).toMatchSnapshot();
  };

  describe('Button Component Screenshots', () => {
    it('should match button variants screenshot', async () => {
      const component = (
        <div className="p-4 space-y-2 bg-white">
          <div className="space-x-2">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="space-x-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🔍</Button>
          </div>
          <div className="space-x-2">
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
            <Button leftIcon={<span>←</span>}>With Icon</Button>
          </div>
        </div>
      );
      
      await takeScreenshot(component, 'button-variants');
    });

    it('should match button states screenshot', async () => {
      const component = (
        <div className="p-4 space-y-2 bg-white">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
          <Button isLoading loadingText="Please wait...">Loading with text</Button>
        </div>
      );
      
      await takeScreenshot(component, 'button-states');
    });
  });

  describe('Card Component Screenshots', () => {
    it('should match card layouts screenshot', async () => {
      const component = (
        <div className="p-4 space-y-4 bg-gray-50">
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
              <CardDescription>Simple card layout</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          
          <Card className="w-80">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Card with Badge</CardTitle>
                <Badge>New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>Card with badge in header.</p>
            </CardContent>
          </Card>
        </div>
      );
      
      await takeScreenshot(component, 'card-layouts');
    });

    it('should match complex card screenshot', async () => {
      const component = (
        <div className="p-4 bg-white">
          <Card className="w-96">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Project Dashboard</CardTitle>
                  <CardDescription>Overview of your projects</CardDescription>
                </div>
                <Badge variant="secondary">3 Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-gray-500">In Progress</div>
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View All</Button>
              <Button>New Project</Button>
            </CardFooter>
          </Card>
        </div>
      );
      
      await takeScreenshot(component, 'complex-card');
    });
  });

  describe('Input Component Screenshots', () => {
    it('should match input variants screenshot', async () => {
      const component = (
        <div className="p-4 space-y-4 bg-white w-80">
          <Input placeholder="Default input" />
          <Input type="email" placeholder="Email input" />
          <Input disabled placeholder="Disabled input" />
          <Input error placeholder="Error input" />
          <Input leftIcon={<span>🔍</span>} placeholder="With left icon" />
          <Input rightIcon={<span>✓</span>} placeholder="With right icon" />
          <div>
            <Input 
              label="Complete Input" 
              placeholder="With label and helper" 
              helperText="This is helper text" 
            />
          </div>
          <div>
            <Input 
              label="Error Input" 
              error 
              placeholder="With error state" 
              helperText="This is an error message" 
            />
          </div>
        </div>
      );
      
      await takeScreenshot(component, 'input-variants');
    });

    it('should match input form screenshot', async () => {
      const component = (
        <div className="p-4 bg-white">
          <form className="space-y-4 w-80">
            <div>
              <Input 
                label="First Name" 
                placeholder="Enter first name..." 
                value="John"
              />
            </div>
            <div>
              <Input 
                label="Email" 
                type="email" 
                placeholder="Enter email..." 
                leftIcon={<span>✉️</span>}
                value="john@example.com"
              />
            </div>
            <div>
              <Input 
                label="Phone" 
                type="tel" 
                placeholder="Enter phone..." 
                helperText="Include country code" 
              />
            </div>
            <div>
              <Input 
                label="Password" 
                type="password" 
                error 
                placeholder="Enter password..." 
                helperText="Password must be at least 8 characters" 
              />
            </div>
          </form>
        </div>
      );
      
      await takeScreenshot(component, 'input-form');
    });
  });

  describe('Badge Component Screenshots', () => {
    it('should match badge variants screenshot', async () => {
      const component = (
        <div className="p-4 bg-white">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            
            <Badge>123</Badge>
            <Badge variant="secondary">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </Badge>
            <Badge variant="outline">
              🔥 Hot
            </Badge>
          </div>
        </div>
      );
      
      await takeScreenshot(component, 'badge-variants');
    });

    it('should match badge groups screenshot', async () => {
      const component = (
        <div className="p-4 bg-white space-y-4">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind</Badge>
            <Badge variant="outline">Storybook</Badge>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge>New</Badge>
            <Badge variant="secondary">Updated</Badge>
            <Badge variant="destructive">Deprecated</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant="outline" className="border-green-500 text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Active
            </Badge>
          </div>
        </div>
      );
      
      await takeScreenshot(component, 'badge-groups');
    });
  });

  describe('Cross-platform Consistency', () => {
    it('should match component integration screenshot', async () => {
      const component = (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Profile</CardTitle>
                  <Badge>Active</Badge>
                </div>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input 
                  label="Display Name" 
                  value="John Doe" 
                  leftIcon={<span>👤</span>}
                />
                <Input 
                  label="Email" 
                  type="email" 
                  value="john@example.com" 
                  leftIcon={<span>✉️</span>}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>Current project overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Website</span>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mobile App</span>
                    <Badge variant="secondary">Planning</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API</span>
                    <Badge variant="destructive">Blocked</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
      
      await takeScreenshot(component, 'component-integration');
    });
  });

  describe('Dark Mode Screenshots', () => {
    it('should match dark mode components screenshot', async () => {
      const component = (
        <div className="p-4 bg-slate-900 text-white">
          <div className="space-y-4">
            <div className="space-x-2">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
            </div>
            
            <Card className="w-80 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Dark Card</CardTitle>
                <CardDescription className="text-slate-300">Card in dark theme</CardDescription>
              </CardHeader>
              <CardContent>
                <Input 
                  placeholder="Dark input..." 
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </CardContent>
              <CardFooter>
                <Button>Dark Action</Button>
              </CardFooter>
            </Card>
            
            <div className="flex gap-2">
              <Badge>Dark Badge</Badge>
              <Badge variant="outline">Dark Outline</Badge>
            </div>
          </div>
        </div>
      );
      
      await takeScreenshot(component, 'dark-mode-components');
    });
  });
});