import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './components';

const meta = {
  title: 'Forma / Data display / Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { controls: { exclude: ['columns', 'rows'] } },
  args: { caption: 'Recent Forma component updates' }
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  args: { caption: 'Recent Forma component updates', columns: [], rows: [] },
  render: (args) => <Table
    {...args}
    columns={[
      { key: 'component', label: 'Component' },
      { key: 'owner', label: 'Owner' },
      { key: 'status', label: 'Status' }
    ]}
    rows={[
      { id: 'button', component: 'Button', owner: 'Design systems', status: 'Ready' },
      { id: 'field', component: 'Text field', owner: 'Product design', status: 'Review' },
      { id: 'tokens', component: 'Theme tokens', owner: 'Engineering', status: 'Ready' }
    ]}
  />
};
