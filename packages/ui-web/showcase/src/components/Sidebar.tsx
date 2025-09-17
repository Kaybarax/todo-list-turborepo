import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../src';
import type { ComponentData } from '../App';

interface SidebarProps {
  components: ComponentData[];
  activeComponent: string;
  onSelect: (componentName: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

const storageKey = 'ui-web-showcase:sidebar-collapsed';

const Sidebar: React.FC<SidebarProps> = ({
  components,
  activeComponent,
  onSelect,
  collapsed: collapsedProp,
  onToggleCollapsed,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);

  // Allow controlled or uncontrolled collapsed state
  const collapsed = useMemo(
    () => (typeof collapsedProp === 'boolean' ? collapsedProp : internalCollapsed),
    [collapsedProp, internalCollapsed],
  );

  useEffect(() => {
    // Initialize from localStorage only if uncontrolled
    if (typeof collapsedProp !== 'boolean') {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'true') setInternalCollapsed(true);
    }
  }, [collapsedProp]);

  const handleToggle = () => {
    if (onToggleCollapsed) {
      onToggleCollapsed();
    } else {
      setInternalCollapsed(prev => {
        const next = !prev;
        localStorage.setItem(storageKey, String(next));
        return next;
      });
    }
  };

  return (
    <aside
      className={
        'h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 rounded-lg lg:rounded-none shadow-sm lg:shadow-none flex flex-col'
      }
      aria-label="Component navigation"
    >
      {/* Header / controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Components</h2>}
        <Button
          variant="ghost"
          size="sm"
          shape="square"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-pressed={collapsed ? 'true' : 'false'}
          onClick={handleToggle}
          className="ml-auto"
        >
          <span aria-hidden="true">{collapsed ? '»' : '«'}</span>
        </Button>
      </div>

      {/* Nav items */}
      <div className="p-2 flex-1 overflow-y-auto">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            {components.map(component => {
              const isActive = activeComponent === component.name;
              const initials = component.name
                .split(/\s+/)
                .map(w => w.charAt(0))
                .join('')
                .slice(0, 2)
                .toUpperCase();
              return (
                <Button
                  key={component.name}
                  title={component.name}
                  aria-label={component.name}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  shape="square"
                  className={isActive ? 'ring-1 ring-blue-500/30' : ''}
                  onClick={() => onSelect(component.name)}
                >
                  {initials}
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {components.map(component => {
              const isActive = activeComponent === component.name;
              return (
                <Button
                  key={component.name}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`w-full justify-start ${
                    isActive ? 'ring-1 ring-blue-500/20 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSelect(component.name)}
                >
                  {component.name}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links only when expanded */}
      {!collapsed && (
        <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Links</h3>
          <div className="space-y-1 text-sm">
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
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
