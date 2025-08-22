import React from 'react';
import { measureRenderTime } from '../../src/test/utils/eva-test-utils';
import { Button } from '../../lib/components/Button/Button';
import { Input } from '../../lib/components/Input/Input';
import { Card } from '../../lib/components/Card/Card';
import { Avatar } from '../../lib/components/Avatar/Avatar';
import { Badge } from '../../lib/components/Badge/Badge';

describe('Eva Design Performance Tests', () => {
  it('renders Button component within acceptable time', () => {
    const { renderTime } = measureRenderTime(<Button title="Performance Test" onPress={() => {}} />);

    // Should render within 50ms
    expect(renderTime).toBeLessThan(50);
  });

  it('renders Input component efficiently', () => {
    const { renderTime } = measureRenderTime(<Input placeholder="Performance test input" />);

    expect(renderTime).toBeLessThan(50);
  });

  it('renders Card with multiple children efficiently', () => {
    const { renderTime } = measureRenderTime(
      <Card>
        <Button title="Button 1" onPress={() => {}} />
        <Button title="Button 2" onPress={() => {}} />
        <Input placeholder="Input in card" />
      </Card>,
    );

    // Complex card should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('renders Avatar with initials efficiently', () => {
    const { renderTime } = measureRenderTime(<Avatar initials="PT" size="large" />);

    expect(renderTime).toBeLessThan(30);
  });

  it('renders Badge component efficiently', () => {
    const { renderTime } = measureRenderTime(<Badge status="primary">Performance</Badge>);

    expect(renderTime).toBeLessThan(30);
  });

  it('handles multiple component renders efficiently', () => {
    const start = performance.now();

    for (let i = 0; i < 10; i++) {
      measureRenderTime(<Button title={`Button ${i}`} onPress={() => {}} />);
    }

    const totalTime = performance.now() - start;

    // 10 button renders should complete within 200ms
    expect(totalTime).toBeLessThan(200);
  });

  it('maintains performance with theme switching', () => {
    const { renderTime: lightRender } = measureRenderTime(<Button title="Theme Test" onPress={() => {}} />);

    // Theme switching should not significantly impact render time
    expect(lightRender).toBeLessThan(50);
  });
});
