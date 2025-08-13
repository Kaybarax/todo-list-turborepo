import React from 'react';

interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  componentName: string;
}

const PropsTable: React.FC<PropsTableProps> = ({ componentName }) => {
  const props = getComponentProps(componentName);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Prop
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Default
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {props.map((prop, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">{prop.name}</code>
                  {prop.required && <span className="ml-2 text-red-500 text-xs">*</span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {prop.default ? (
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{prop.default}</code>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component props definitions
const getComponentProps = (componentName: string): PropDefinition[] => {
  switch (componentName) {
    case 'Button':
      return [
        {
          name: 'variant',
          type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
          default: '"default"',
          description: 'The visual style variant of the button',
        },
        {
          name: 'size',
          type: '"default" | "sm" | "lg" | "icon"',
          default: '"default"',
          description: 'The size of the button',
        },
        {
          name: 'asChild',
          type: 'boolean',
          default: 'false',
          description: 'Change the default rendered element for the one passed as a child',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Whether the button is disabled',
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent) => void',
          description: 'Function called when the button is clicked',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'The content to display inside the button',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes to apply',
        },
      ];
    case 'Card':
      return [
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes to apply to the card',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'The content to display inside the card',
        },
      ];
    case 'Input':
      return [
        {
          name: 'type',
          type: 'string',
          default: '"text"',
          description: 'The type of input (text, email, password, etc.)',
        },
        {
          name: 'placeholder',
          type: 'string',
          description: 'Placeholder text to display when input is empty',
        },
        {
          name: 'value',
          type: 'string',
          description: 'The controlled value of the input',
        },
        {
          name: 'defaultValue',
          type: 'string',
          description: 'The default value for uncontrolled input',
        },
        {
          name: 'onChange',
          type: '(event: ChangeEvent<HTMLInputElement>) => void',
          description: 'Function called when the input value changes',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Whether the input is disabled',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes to apply',
        },
      ];
    case 'Badge':
      return [
        {
          name: 'variant',
          type: '"default" | "secondary" | "destructive" | "outline"',
          default: '"default"',
          description: 'The visual style variant of the badge',
        },
        {
          name: 'size',
          type: '"default" | "sm" | "lg"',
          default: '"default"',
          description: 'The size of the badge',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'The content to display inside the badge',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes to apply',
        },
      ];
    default:
      return [
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes to apply',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'The content to display inside the component',
        },
      ];
  }
};

export default PropsTable;
