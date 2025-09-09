// Minimal web stub for React Native's codegenNativeComponent used by Fabric-specific modules.
// This prevents Vite from failing to resolve deep RN internals when libraries like
// react-native-svg (pulled in via @ui-kitten/eva-icons) import it.
// We return a forwardRef component rendering a basic span so props still flow & stories don't crash.
// If richer behavior is needed later (e.g. measuring, layout), this can be replaced with a more
// appropriate host element mapping.
import React from 'react';

// Generic signature approximation – we don't need strict typing for Storybook rendering.
export default function codegenNativeComponent<T = any>(/* viewConfigName: string */): React.ComponentType<T> {
  const Fallback = React.forwardRef<any, any>((props, ref) => {
    const { children, ...rest } = props || {};
    return React.createElement(
      'span',
      { ref, 'data-rn-host': true, style: { display: 'inline-block' }, ...rest },
      children,
    );
  });
  Fallback.displayName = 'RNWebStub';
  return Fallback as React.ComponentType<T>;
}
