import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TextField } from './components';

const meta = {
  title: 'Forma / Navigation / Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { controls: { exclude: ['tabs'] } }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { tabs: [] },
  render: () => <Tabs ariaLabel="Project details" defaultValue="overview" tabs={[
    { id: 'overview', label: 'Overview', content: <p>See the purpose, owner and current status of this project.</p> },
    { id: 'tokens', label: 'Tokens', content: <p>Review the semantic color, spacing and type decisions behind this screen.</p> },
    { id: 'activity', label: 'Activity', content: <p>Recent updates from the people building this work.</p> }
  ]} />
};

export const WithFormField: Story = {
  args: { tabs: [] },
  render: () => <Tabs ariaLabel="Account settings" defaultValue="profile" tabs={[
    { id: 'profile', label: 'Profile', content: <TextField label="Display name" defaultValue="Lulamile Mkhungela" /> },
    { id: 'notifications', label: 'Notifications', content: <p>Choose how Forma shares useful updates with you.</p> }
  ]} />
};
