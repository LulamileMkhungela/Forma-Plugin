import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from './components';

const meta = {
  title: 'Forma / Actions / Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Create account',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger', 'quiet'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithLeadingIcon: Story = { args: { leadingIcon: <Plus size={16} />, children: 'New project' } };
export const WithTrailingIcon: Story = { args: { trailingIcon: <ArrowRight size={16} />, children: 'Continue' } };
export const AllVariants: Story = {
  render: () => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="tertiary">Tertiary</Button><Button variant="quiet">Quiet</Button><Button variant="danger">Danger</Button>
  </div>
};
