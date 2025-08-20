// React import removed as it's not used in this file
import { Badge } from '../../../src';
import type { ComponentExample } from '../App';

export const badgeExamples: ComponentExample[] = [
  {
    title: 'Badge Variants',
    description: 'Different visual styles for various use cases.',
    code: `import { Badge } from '@todo/ui-web'

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`,
    component: (
      <>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </>
    ),
  },
  {
    title: 'Badge Sizes',
    description: 'Different sizes to fit various layouts.',
    code: `import { Badge } from '@todo/ui-web'

<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>`,
    component: (
      <>
        <Badge>Small</Badge>
        <Badge>Default</Badge>
        <Badge>Large</Badge>
      </>
    ),
  },
  {
    title: 'Status Badges',
    description: 'Badges commonly used for status indicators.',
    code: `import { Badge } from '@todo/ui-web'

<Badge variant="default">New</Badge>
<Badge variant="secondary">In Progress</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Pending</Badge>`,
    component: (
      <>
        <Badge variant="default">New</Badge>
        <Badge variant="secondary">In Progress</Badge>
        <Badge variant="destructive">Error</Badge>
        <Badge variant="outline">Pending</Badge>
      </>
    ),
  },
  {
    title: 'Notification Badges',
    description: 'Badges used for notifications and counts.',
    code: `import { Badge } from '@todo/ui-web'

<div className="flex items-center gap-2">
  <span>Messages</span>
  <Badge variant="destructive" size="sm">3</Badge>
</div>

<div className="flex items-center gap-2">
  <span>Notifications</span>
  <Badge variant="default" size="sm">12</Badge>
</div>

<div className="flex items-center gap-2">
  <span>Updates</span>
  <Badge variant="secondary" size="sm">99+</Badge>
</div>`,
    component: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span>Messages</span>
          <Badge variant="destructive">3</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Notifications</span>
          <Badge variant="default">12</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Updates</span>
          <Badge variant="secondary">99+</Badge>
        </div>
      </div>
    ),
  },
  {
    title: 'Custom Styled Badges',
    description: 'Badges with custom styling and colors.',
    code: `import { Badge } from '@todo/ui-web'

<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
  Custom Blue
</Badge>
<Badge className="bg-green-100 text-green-800 hover:bg-green-200">
  Custom Green
</Badge>
<Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
  Custom Purple
</Badge>`,
    component: (
      <>
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Custom Blue</Badge>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Custom Green</Badge>
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Custom Purple</Badge>
      </>
    ),
  },
];
