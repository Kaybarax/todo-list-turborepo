import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../components/Select/Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'boolean',
      description: 'Whether the select has an error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the select',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[180px]',
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const WithHelperText: Story = {
  args: {
    className: 'w-[180px]',
    helperText: 'Choose your favorite fruit',
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    className: 'w-[180px]',
    error: true,
    helperText: 'Please select a fruit',
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    className: 'w-[180px]',
    disabled: true,
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const WithGroups: Story = {
  args: {
    className: 'w-[200px]',
    children: (
      <>
        <option value="">Select a timezone</option>
        <optgroup label="North America">
          <option value="est">Eastern Standard Time (EST)</option>
          <option value="cst">Central Standard Time (CST)</option>
          <option value="mst">Mountain Standard Time (MST)</option>
          <option value="pst">Pacific Standard Time (PST)</option>
        </optgroup>
        <optgroup label="Europe & Africa">
          <option value="gmt">Greenwich Mean Time (GMT)</option>
          <option value="cet">Central European Time (CET)</option>
          <option value="eet">Eastern European Time (EET)</option>
        </optgroup>
        <optgroup label="Asia">
          <option value="ist">India Standard Time (IST)</option>
          <option value="jst">Japan Standard Time (JST)</option>
          <option value="kst">Korea Standard Time (KST)</option>
        </optgroup>
      </>
    ),
  },
};
