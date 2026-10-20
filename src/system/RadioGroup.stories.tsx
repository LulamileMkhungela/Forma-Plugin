import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './components';

const meta = {
  title: 'Forma / Forms / Radio group',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Preferred density',
    name: 'density',
    defaultValue: 'comfortable',
    options: [
      { value: 'comfortable', label: 'Comfortable', description: 'More room to read and work.' },
      { value: 'compact', label: 'Compact', description: 'A tighter view for busy screens.' }
    ]
  },
  argTypes: { options: { control: false }, orientation: { control: 'select', options: ['vertical', 'horizontal'] } }
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const WithDisabledOption: Story = { args: { options: [
  { value: 'standard', label: 'Standard' },
  { value: 'compact', label: 'Compact', disabled: true }
] } };
