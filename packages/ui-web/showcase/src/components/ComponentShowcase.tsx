import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../../lib'
import CodeBlock from './CodeBlock'
import type { ComponentExample } from '../App'

interface ComponentShowcaseProps {
  name: string
  description: string
  examples: ComponentExample[]
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  name,
  description,
  examples,
}) => {
  const [showCode, setShowCode] = useState<{ [key: number]: boolean }>({})

  const toggleCode = (index: number) => {
    setShowCode(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="component-content">
      {/* Component Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {name}
          </h1>
          <Badge variant="secondary" size="sm">
            Component
          </Badge>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* Examples Grid */}
      <div className="space-y-8">
        {examples.map((example, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {example.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {example.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCode(index)}
                >
                  {showCode[index] ? 'Hide Code' : 'Show Code'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Component Preview */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-4">
                  {example.component}
                </div>
              </div>

              {/* Code Block */}
              {showCode[index] && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <CodeBlock code={example.code} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Component API Documentation */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            For detailed API documentation, TypeScript definitions, and advanced usage examples, 
            please refer to the component source files and Storybook documentation.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              View Source
            </Button>
            <Button variant="outline" size="sm">
              Storybook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComponentShowcase