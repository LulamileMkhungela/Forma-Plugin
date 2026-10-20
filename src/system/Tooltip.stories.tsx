import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Tooltip } from './components';

const meta = {
  title: 'Forma / Overlays / Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { controls: { exclude: ['children'] } },
  args: { content: 'Use the canonical token source for new themes.' }
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  args: { content: 'Use the canonical token source for new themes.', children: 'Token guidance' },
  render: (args) => <Tooltip {...args}><Button variant="secondary">Token guidance</Button></Tooltip>
};
