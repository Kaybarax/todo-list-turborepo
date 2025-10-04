import React from 'react';
import { cn } from '@todo/utils/ui/web';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ className, value, onValueChange, children, ...props }) => {
  const items = React.Children.toArray(children).filter(React.isValidElement);

  return (
    <div className={cn('join', className)} {...props}>
      {items.map(item => {
        const itemProps = item.props as { value: string; className?: string };
        const itemValue = itemProps.value;
        const isSelected = value === itemValue;

        return React.cloneElement(item as React.ReactElement<any>, {
          className: cn('join-item', itemProps.className, isSelected && 'btn-active'),
          onClick: () => onValueChange(itemValue),
        });
      })}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
