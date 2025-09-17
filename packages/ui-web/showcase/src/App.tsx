import React, { useEffect, useState } from 'react';
import { Button, Badge } from '../../src';
import ThemeToggle from './components/ThemeToggle';
import ComponentShowcase from './components/ComponentShowcase';
import Sidebar from './components/Sidebar';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('ui-web-showcase:sidebar-collapsed');
    if (saved === 'true') setSidebarCollapsed(true);
  }, []);

  const currentComponent = components.find(comp => comp.name === activeComponent);

  return (
    <div className="app-container min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent dark:via-gray-900/50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button variant="outline" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu">
                  Menu
                </Button>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">UI Web Components</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  Interactive showcase of DaisyUI-based components
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Badge variant="default">v0.1.0</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop layout with collapsible sidebar */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="hidden lg:flex lg:gap-6">
          {/* Collapsible Sidebar */}
          <div
            className={`sticky top-6 h-[calc(100vh-6rem)] ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}
          >
            <Sidebar
              components={components}
              activeComponent={activeComponent}
              onSelect={name => setActiveComponent(name)}
              collapsed={sidebarCollapsed}
              onToggleCollapsed={() => {
                setSidebarCollapsed(prev => {
                  const next = !prev;
                  localStorage.setItem('ui-web-showcase:sidebar-collapsed', String(next));
                  return next;
                });
              }}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {currentComponent && (
              <ComponentShowcase
                name={currentComponent.name}
                description={currentComponent.description}
                examples={currentComponent.examples}
              />
            )}
            <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Built with React, Vite, Tailwind CSS, and DaisyUI</p>
            </footer>
          </div>
        </div>

        {/* Mobile drawer overlay */}
        <div className="lg:hidden">
          {/* Content */}
          <div className="py-2">
            {currentComponent && (
              <ComponentShowcase
                name={currentComponent.name}
                description={currentComponent.description}
                examples={currentComponent.examples}
              />
            )}
            <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Built with React, Vite, Tailwind CSS, and DaisyUI</p>
            </footer>
          </div>

          {/* Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/40"
                aria-hidden="true"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] p-3">
                <div className="h-full rounded-lg overflow-hidden">
                  <Sidebar
                    components={components}
                    activeComponent={activeComponent}
                    onSelect={name => {
                      setActiveComponent(name);
                      setMobileMenuOpen(false);
                    }}
                    collapsed={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
