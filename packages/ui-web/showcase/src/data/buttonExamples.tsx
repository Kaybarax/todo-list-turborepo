// React import removed as it's not used in this file
import { Button } from '../../../lib'
import type { ComponentExample } from '../App'

export const buttonExamples: ComponentExample[] = [
  {
    title: 'Button Variants',
    description: 'Different visual styles for various use cases.',
    code: `import { Button } from '@todo/ui-web'

<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`,
    component: (
      <>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </>
    ),
  },
  {
    title: 'Button Sizes',
    description: 'Different sizes to fit various layouts.',
    code: `import { Button } from '@todo/ui-web'

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`,
    component: (
      <>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </>
    ),
  },
  {
    title: 'Disabled State',
    description: 'Buttons in disabled state.',
    code: `import { Button } from '@todo/ui-web'

<Button disabled>Disabled Default</Button>
<Button variant="outline" disabled>Disabled Outline</Button>
<Button variant="secondary" disabled>Disabled Secondary</Button>`,
    component: (
      <>
        <Button disabled>Disabled Default</Button>
        <Button variant="outline" disabled>Disabled Outline</Button>
        <Button variant="secondary" disabled>Disabled Secondary</Button>
      </>
    ),
  },
  {
    title: 'With Icons',
    description: 'Buttons with icons using Lucide React.',
    code: `import { Button } from '@todo/ui-web'
import { Download, Mail, Plus } from 'lucide-react'

<Button>
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>
<Button variant="outline">
  <Mail className="mr-2 h-4 w-4" />
  Email
</Button>
<Button size="sm">
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>`,
    component: (
      <>
        <Button>
          <span className="mr-2">⬇</span>
          Download
        </Button>
        <Button variant="outline">
          <span className="mr-2">✉</span>
          Email
        </Button>
        <Button size="sm">
          <span className="mr-2">+</span>
          Add Item
        </Button>
      </>
    ),
  },
  {
    title: 'Loading State',
    description: 'Buttons with loading indicators.',
    code: `import { Button } from '@todo/ui-web'

<Button disabled>
  <span className="animate-spin mr-2">⟳</span>
  Loading...
</Button>
<Button variant="outline" disabled>
  <span className="animate-spin mr-2">⟳</span>
  Please wait
</Button>`,
    component: (
      <>
        <Button disabled>
          <span className="animate-spin mr-2">⟳</span>
          Loading...
        </Button>
        <Button variant="outline" disabled>
          <span className="animate-spin mr-2">⟳</span>
          Please wait
        </Button>
      </>
    ),
  },
]