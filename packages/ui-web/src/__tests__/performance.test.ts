import { describe, it, expect } from 'vitest';
import { testPerformance } from './test-utils';
import React from 'react';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { Card } from '../components/Card/Card';

describe('Performance Tests', () => {
  it('Button renders within performance threshold', () => {
    const renderTime = testPerformance(React.createElement(Button, { children: 'Test Button' }), 'Button');
    expect(renderTime).toBeLessThan(50);
  });

  it('Input renders within performance threshold', () => {
    const renderTime = testPerformance(React.createElement(Input, { placeholder: 'Test Input' }), 'Input');
    expect(renderTime).toBeLessThan(50);
  });

  it('Card renders within performance threshold', () => {
    const renderTime = testPerformance(React.createElement(Card, { children: 'Test Card Content' }), 'Card');
    expect(renderTime).toBeLessThan(50);
  });

  it('Multiple components render efficiently', () => {
    const startTime = performance.now();

    // Render multiple components
    for (let i = 0; i < 100; i++) {
      testPerformance(React.createElement(Button, { key: i, children: `Button ${i}` }), `Button-${i}`);
    }

    const totalTime = performance.now() - startTime;
    expect(totalTime).toBeLessThan(5000); // 5 seconds for 100 components
  });
});
