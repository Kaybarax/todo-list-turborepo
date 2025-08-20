import React, { useState } from 'react';
import { Button, Badge } from '../../src';
import ThemeToggle from './components/ThemeToggle';
import ComponentShowcase from './components/ComponentShowcase';
import Navigation from './components/Navigation';
import './App.css';

// Import component data
import { buttonExamples } from './data/buttonExamples';
import { cardExamples } from './data/cardExamples';
import { inputExamples } from './data/inputExamples';
import { badgeExamples } from './data/badgeExamples';

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
  component: React.ReactNode;
}

export interface ComponentData {
  name: string;
  description: string;
  examples: ComponentExample[];
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
];

function App() {
  const [activeComponent, setActiveComponent] = useState<string>('Button');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const currentComponent = components.find(comp => comp.name === activeComponent);

  return (
    <div className="app-container min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent dark:via-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">UI Web Components</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Interactive showcase of DaisyUI-based components</p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-auto">
              <ThemeToggle />
              <Badge variant="default">v0.1.0</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full justify-between"
          >
            <span>Components Menu</span>
            <span>{mobileMenuOpen ? '−' : '+'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className={`lg:col-span-1 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-8">
              <Navigation
                components={components}
                activeComponent={activeComponent}
                onComponentSelect={component => {
                  setActiveComponent(component);
                  setMobileMenuOpen(false); // Close mobile menu on selection
                }}
              />
            </div>
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
            <p>Built with React, Vite, Tailwind CSS, and DaisyUI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
