import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '../../../lib'

interface InteractivePlaygroundProps {
  componentName: string
}

const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({ componentName }) => {
  const [props, setProps] = useState<Record<string, any>>(getDefaultProps(componentName))

  const updateProp = (key: string, value: any) => {
    setProps(prev => ({ ...prev, [key]: value }))
  }

  const renderComponent = () => {
    switch (componentName) {
      case 'Button':
        return (
          <Button 
            variant={props.variant} 
            size={props.size} 
            disabled={props.disabled}
          >
            {props.children}
          </Button>
        )
      case 'Badge':
        return (
          <Badge 
            variant={props.variant} 
            size={props.size}
          >
            {props.children}
          </Badge>
        )
      case 'Input':
        return (
          <Input 
            placeholder={props.placeholder}
            disabled={props.disabled}
            type={props.type}
          />
        )
      default:
        return <div>Component not supported in playground</div>
    }
  }

  const renderControls = () => {
    switch (componentName) {
      case 'Button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Variant</label>
              <select 
                value={props.variant} 
                onChange={(e) => updateProp('variant', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="default">Default</option>
                <option value="destructive">Destructive</option>
                <option value="outline">Outline</option>
                <option value="secondary">Secondary</option>
                <option value="ghost">Ghost</option>
                <option value="link">Link</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <select 
                value={props.size} 
                onChange={(e) => updateProp('size', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="sm">Small</option>
                <option value="default">Default</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <Input 
                value={props.children} 
                onChange={(e) => updateProp('children', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={props.disabled} 
                onChange={(e) => updateProp('disabled', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Disabled</label>
            </div>
          </div>
        )
      case 'Badge':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Variant</label>
              <select 
                value={props.variant} 
                onChange={(e) => updateProp('variant', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="default">Default</option>
                <option value="secondary">Secondary</option>
                <option value="destructive">Destructive</option>
                <option value="outline">Outline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <select 
                value={props.size} 
                onChange={(e) => updateProp('size', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="sm">Small</option>
                <option value="default">Default</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <Input 
                value={props.children} 
                onChange={(e) => updateProp('children', e.target.value)}
                placeholder="Badge text"
              />
            </div>
          </div>
        )
      case 'Input':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select 
                value={props.type} 
                onChange={(e) => updateProp('type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Placeholder</label>
              <Input 
                value={props.placeholder} 
                onChange={(e) => updateProp('placeholder', e.target.value)}
                placeholder="Enter placeholder text"
              />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={props.disabled} 
                onChange={(e) => updateProp('disabled', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Disabled</label>
            </div>
          </div>
        )
      default:
        return <div>No controls available for this component</div>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Playground</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Controls</h3>
            {renderControls()}
          </div>
          
          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[200px] flex items-center justify-center">
              {renderComponent()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const getDefaultProps = (componentName: string): Record<string, any> => {
  switch (componentName) {
    case 'Button':
      return {
        variant: 'default',
        size: 'default',
        children: 'Click me',
        disabled: false
      }
    case 'Badge':
      return {
        variant: 'default',
        size: 'default',
        children: 'Badge'
      }
    case 'Input':
      return {
        type: 'text',
        placeholder: 'Enter text here',
        disabled: false
      }
    default:
      return {}
  }
}

export default InteractivePlayground