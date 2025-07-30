import React from 'react'
import { Input } from '../../../lib'
import type { ComponentExample } from '../App'

export const inputExamples: ComponentExample[] = [
  {
    title: 'Basic Input',
    description: 'Standard input field with placeholder text.',
    code: `import { Input } from '@todo/ui-web'

<Input placeholder="Enter your name" />
<Input placeholder="Enter your email" type="email" />
<Input placeholder="Enter your password" type="password" />`,
    component: (
      <div className="space-y-4 w-full max-w-sm">
        <Input placeholder="Enter your name" />
        <Input placeholder="Enter your email" type="email" />
        <Input placeholder="Enter your password" type="password" />
      </div>
    ),
  },
  {
    title: 'Input with Labels',
    description: 'Input fields with associated labels.',
    code: `import { Input } from '@todo/ui-web'

<div className="space-y-2">
  <label htmlFor="name" className="text-sm font-medium">
    Full Name
  </label>
  <Input id="name" placeholder="John Doe" />
</div>

<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email Address
  </label>
  <Input id="email" type="email" placeholder="john@example.com" />
</div>`,
    component: (
      <div className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input id="email" type="email" placeholder="john@example.com" />
        </div>
      </div>
    ),
  },
  {
    title: 'Disabled State',
    description: 'Input fields in disabled state.',
    code: `import { Input } from '@todo/ui-web'

<Input placeholder="Disabled input" disabled />
<Input placeholder="Disabled with value" value="Cannot edit this" disabled />`,
    component: (
      <div className="space-y-4 w-full max-w-sm">
        <Input placeholder="Disabled input" disabled />
        <Input placeholder="Disabled with value" value="Cannot edit this" disabled />
      </div>
    ),
  },
  {
    title: 'Input Sizes',
    description: 'Different input sizes for various use cases.',
    code: `import { Input } from '@todo/ui-web'

<Input placeholder="Small input" className="h-8 text-sm" />
<Input placeholder="Default input" />
<Input placeholder="Large input" className="h-12 text-lg" />`,
    component: (
      <div className="space-y-4 w-full max-w-sm">
        <Input placeholder="Small input" className="h-8 text-sm" />
        <Input placeholder="Default input" />
        <Input placeholder="Large input" className="h-12 text-lg" />
      </div>
    ),
  },
  {
    title: 'Form Example',
    description: 'Complete form with multiple input types.',
    code: `import { Input, Button } from '@todo/ui-web'

<form className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">Username</label>
    <Input placeholder="Enter username" />
  </div>
  
  <div className="space-y-2">
    <label className="text-sm font-medium">Email</label>
    <Input type="email" placeholder="Enter email" />
  </div>
  
  <div className="space-y-2">
    <label className="text-sm font-medium">Password</label>
    <Input type="password" placeholder="Enter password" />
  </div>
  
  <Button type="submit" className="w-full">
    Create Account
  </Button>
</form>`,
    component: (
      <form className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <Input placeholder="Enter username" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="Enter email" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" placeholder="Enter password" />
        </div>
        
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    ),
  },
]