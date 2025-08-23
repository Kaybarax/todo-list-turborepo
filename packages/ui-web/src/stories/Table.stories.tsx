import { type Meta, type StoryObj } from '@storybook/react';

import { Table, type Column } from '../../lib/components/Table/Table';

type Row = { name: string; age: number };

const meta: Meta<typeof Table<Row>> = {
  title: 'Data Display/Table',
  component: Table as any,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
];

const data: Row[] = [
  { name: 'Alice', age: 31 },
  { name: 'Bob', age: 27 },
  { name: 'Carol', age: 40 },
];

export const Default: Story = {
  render: () => <Table<Row> columns={columns} data={data} caption="People" />,
};
