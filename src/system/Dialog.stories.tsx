import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog } from './components';

const meta = {
  title: 'Forma / Overlays / Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { controls: { exclude: ['children', 'open', 'onOpenChange'] } }
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return <>
    <Button onClick={() => setOpen(true)}>Review workspace</Button>
    <Dialog open={open} onOpenChange={setOpen} title="Ready to publish?" description="A quick review keeps the handoff clear.">
      <p>Your latest component and token updates are ready for the team.</p>
      <div className="forma-dialog__actions"><Button variant="secondary" onClick={() => setOpen(false)}>Keep editing</Button><Button onClick={() => setOpen(false)}>Publish changes</Button></div>
    </Dialog>
  </>;
}

export const Playground: Story = {
  args: { open: false, onOpenChange: () => undefined, title: 'Dialog example', children: null },
  render: () => <DialogDemo />
};
