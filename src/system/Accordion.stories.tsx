import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './components';

const meta = {
  title: 'Forma / Navigation / Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { controls: { exclude: ['items'] } }
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { items: [] },
  render: () => <Accordion defaultOpen={['source']} items={[
    { id: 'source', title: 'Where does the source live?', content: <p>The DTCG JSON in <code>tokens/forma.tokens.json</code> is the canonical source.</p> },
    { id: 'themes', title: 'How do themes stay aligned?', content: <p>Light and dark semantic values share primitive color, type and spacing tokens.</p> },
    { id: 'handoff', title: 'What happens after a design change?', content: <p>Review the token diff, update component stories, and verify the accessible states.</p> }
  ]} />
};

export const SingleOpenAtATime: Story = {
  args: { items: [] },
  render: () => <Accordion allowMultiple={false} items={[
    { id: 'one', title: 'First detail', content: <p>Only one panel can be open at a time.</p> },
    { id: 'two', title: 'Second detail', content: <p>Opening this closes the other panel.</p> }
  ]} />
};
