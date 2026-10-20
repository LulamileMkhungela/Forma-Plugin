import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './components';

const meta = {
  title: 'Forma / Feedback / Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { label: 'Design review', value: 72, max: 100, showValue: true },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100, step: 1 } }, max: { control: { type: 'number', min: 1 } } }
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Indeterminate: Story = { args: { label: 'Preparing your workspace', value: undefined, showValue: false } };
