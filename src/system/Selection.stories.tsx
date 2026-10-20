import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Switch } from './components';

const meta = {
  title: 'Forma / Forms / Selection controls',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Keep me in the loop', description: 'Get occasional updates about new features.' }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxPlayground: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const SwitchControl = {
  render: () => <Switch label="Enable weekly digest" description="A concise summary every Monday." defaultChecked />
};
