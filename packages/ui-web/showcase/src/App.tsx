import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '../../lib'
import ComponentShowcase from './components/ComponentShowcase'
import Navigation from './components/Navigation'
import './App.css'

// Import component data
import { buttonExamples } from './data/buttonExamples'
import { cardExamples } from './data/cardExamples'
import { inputExamples } from './data/inputExamples'
import { badgeExamples } from './data/badgeExamples'

export interface ComponentExample {
  title: string
  description: string
  code: string
  component: React.ReactNode
}

export interface ComponentData {
  name: string
  description: string
  examples: ComponentExample[]
}

const components: ComponentData[] = [
  {
    name: 'Button',
    description: 'Interactive button component with multiple variants and sizes.',
    examples: buttonExamples,
  },
  {
    name: 'Card',
    description: 'Flexible container component for displaying content.',
    examples: cardExamples,
  },
  {
    name: 'Input',
    description: 'Form input component with validation and error states.',
    examples: inputExamples,
  },
  {
    name: 'Badge',
    description: 'Small status indicator component with color variants.',
    examples: badgeExamples,
  },
]

function App() {
  const [activeComponent, setActiveComponent] = useState<string>('Button')

  const currentComponent = components.find(comp => comp.name === activeComponent)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                UI Web Components
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Interactive showcase of Radix UI-based components
              </p>
            </div>
            <Badge variant="primary" size="sm">
              v0.1.0
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Navigation
              components={components}
              activeComponent={activeComponent}
              onComponentSelect={setActiveComponent}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentComponent && (
              <ComponentShowcase
                name={currentComponent.name}
                description={currentComponent.description}
                examples={currentComponent.examples}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>Built with React, Vite, Tailwind CSS, and Radix UI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App