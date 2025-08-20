import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../../src';
import CodeBlock from './CodeBlock';
import PropsTable from './PropsTable';
import InteractivePlayground from './InteractivePlayground';
import type { ComponentExample } from '../App';

interface ComponentShowcaseProps {
  name: string;
  description: string;
  examples: ComponentExample[];
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ name, description, examples }) => {
  const [showCode, setShowCode] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'examples' | 'playground' | 'props' | 'usage'>('examples');

  const toggleCode = (index: number) => {
    setShowCode(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="component-content">
      {/* Component Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
          <Badge variant="secondary">Component</Badge>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex items-center">
          <nav className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800/70">
            {[
              { id: 'examples', label: 'Examples' },
              { id: 'playground', label: 'Playground' },
              { id: 'props', label: 'Props' },
              { id: 'usage', label: 'Usage' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/60'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'examples' && (
        <div className="space-y-8">
          {examples.map((example, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{example.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{example.description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toggleCode(index)}>
                    {showCode[index] ? 'Hide Code' : 'Show Code'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Component Preview */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4">{example.component}</div>
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
      )}

      {activeTab === 'playground' && <InteractivePlayground componentName={name} />}

      {activeTab === 'props' && (
        <Card>
          <CardHeader>
            <CardTitle>Component Props</CardTitle>
          </CardHeader>
          <CardContent>
            <PropsTable componentName={name} />
          </CardContent>
        </Card>
      )}

      {activeTab === 'usage' && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Installation</h3>
              <CodeBlock code={`npm install @todo/ui-web`} language="bash" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Import</h3>
              <CodeBlock code={`import { ${name} } from '@todo/ui-web'`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Usage</h3>
              <CodeBlock code={getBasicUsageExample(name)} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                {getBestPractices(name).map((practice, index) => (
                  <li key={index}>{practice}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Accessibility</h3>
              <p className="text-gray-600 dark:text-gray-300">
                This component follows WAI-ARIA guidelines and includes proper keyboard navigation, focus management,
                and screen reader support.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper functions for usage examples
const getBasicUsageExample = (componentName: string): string => {
  switch (componentName) {
    case 'Button':
      return `<Button variant="default" size="md">
  Click me
</Button>`;
    case 'Card':
      return `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>`;
    case 'Input':
      return `<Input 
  placeholder="Enter text here"
  onChange={(e) => console.log(e.target.value)}
/>`;
    case 'Badge':
      return `<Badge variant="default">
  New
</Badge>`;
    default:
      return `<${componentName} />`;
  }
};

const getBestPractices = (componentName: string): string[] => {
  switch (componentName) {
    case 'Button':
      return [
        'Use descriptive button text that clearly indicates the action',
        'Choose appropriate variants based on the action importance',
        'Include loading states for async operations',
        'Ensure sufficient color contrast for accessibility',
        'Use consistent sizing throughout your application',
      ];
    case 'Card':
      return [
        'Keep card content focused and related',
        'Use consistent spacing and alignment',
        'Include clear visual hierarchy with headers and descriptions',
        'Ensure cards are responsive across different screen sizes',
        'Group related actions in the card footer',
      ];
    case 'Input':
      return [
        'Always provide clear labels for form inputs',
        'Include helpful placeholder text when appropriate',
        'Implement proper validation and error messaging',
        'Use appropriate input types (email, password, etc.)',
        'Ensure inputs are keyboard accessible',
      ];
    case 'Badge':
      return [
        'Use badges sparingly to avoid visual clutter',
        'Choose colors that convey the right meaning',
        'Keep badge text short and descriptive',
        'Ensure badges have sufficient contrast',
        'Use consistent badge styles throughout your app',
      ];
    default:
      return [
        'Follow consistent design patterns',
        'Ensure accessibility compliance',
        'Test across different devices and browsers',
        'Use semantic HTML when possible',
      ];
  }
};

export default ComponentShowcase;
