import { type Meta, type StoryFn } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '../../lib/components/Button';
import { ButtonGroup } from '../../lib/components/ButtonGroup';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

const SingleTemplate: StoryFn<typeof ButtonGroup> = args => {
  const [value, setValue] = useState<string | string[]>('medium');

  return (
    <ButtonGroup {...args} value={value} onValueChange={setValue}>
      <Button value="low">Low</Button>
      <Button value="medium">Medium</Button>
      <Button value="high">High</Button>
    </ButtonGroup>
  );
};

export const Single: StoryFn<typeof ButtonGroup> = SingleTemplate.bind({});
Single.args = {
  type: 'single',
};

const MultipleTemplate: StoryFn<typeof ButtonGroup> = args => {
  const [value, setValue] = useState<string | string[]>(['today']);

  return (
    <ButtonGroup {...args} value={value} onValueChange={setValue}>
      <Button value="today">Today</Button>
      <Button value="next-week">Next Week</Button>
    </ButtonGroup>
  );
};

export const Multiple: StoryFn<typeof ButtonGroup> = MultipleTemplate.bind({});
Multiple.args = {
  type: 'multiple',
};

export const Attached: StoryFn<typeof ButtonGroup> = SingleTemplate.bind({});
Attached.args = {
  type: 'single',
  attached: true,
};
