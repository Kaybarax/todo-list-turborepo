import React from 'react';
import { Button } from '../../../src';
import type { ComponentData } from '../App';

interface NavigationProps {
  components: ComponentData[];
  activeComponent: string;
  onComponentSelect: (componentName: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ components, activeComponent, onComponentSelect }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Components</h2>
      <div className="space-y-2">
        {components.map(component => (
          <Button
            key={component.name}
            variant={activeComponent === component.name ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => onComponentSelect(component.name)}
          >
            {component.name}
          </Button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Links</h3>
        <div className="space-y-2 text-sm">
          <a
            href="https://daisyui.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            DaisyUI Docs
          </a>
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Tailwind CSS
          </a>
          <a
            href="https://github.com/joe-bell/cva"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            CVA (Class Variance Authority)
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
