import { type Meta, type StoryObj } from '@storybook/react';

import { FormField, FormGroup } from '../components/FormField/FormField';
import { Input } from '../components/Input/Input';
import { Textarea } from '../components/Textarea/Textarea';
import { Select } from '../components/Select/Select';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  render: () => (
    <div className="w-[320px]">
      <FormField id="email" label="Email" helperText="We won't share your email" required>
        <Input type="email" placeholder="you@example.com" aria-label="Email" />
      </FormField>
    </div>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <div className="w-[320px]">
      <FormField id="bio" label="Bio" helperText="Tell us about yourself" optional>
        <Textarea placeholder="Short bio" aria-label="Bio" />
      </FormField>
    </div>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <div className="w-[320px]">
      <FormField id="fruit" label="Favorite Fruit" helperText="Choose one">
        <Select aria-label="Favorite Fruit">
          <option value="">Choose</option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </Select>
      </FormField>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="w-[360px]">
      <FormGroup legend="Profile" description="Basic information">
        <FormField id="name" label="Name" required>
          <Input placeholder="Your name" aria-label="Name" />
        </FormField>
        <FormField id="about" label="About" optional>
          <Textarea placeholder="About you" aria-label="About" />
        </FormField>
      </FormGroup>
    </div>
  ),
};
