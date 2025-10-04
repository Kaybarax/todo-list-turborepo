import { ReactElement } from 'react';
import { ButtonProps } from '../Button';

export interface ButtonGroupProps {
  attached?: boolean;
  children: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
}
