import { ReactElement } from 'react';
import { RenderResult } from '@testing-library/react-native';

declare global {
  var renderWithEvaTheme: (component: ReactElement) => RenderResult;
}

export {};
