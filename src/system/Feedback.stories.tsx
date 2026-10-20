import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Badge, Alert, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from './components';

const badgeMeta = {
  title: 'Forma / Feedback',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Published', tone: 'success', dot: true, size: 'md' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md'] }
  }
} satisfies Meta<typeof Badge>;

export default badgeMeta;
type Story = StoryObj<typeof badgeMeta>;

export const BadgePlayground: Story = {};
export const AvatarExample = {
  render: () => <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <Avatar name="Lulamile Mkhungela" size="sm" />
    <Avatar name="Lulamile Mkhungela" size="md" />
    <Avatar name="Lulamile Mkhungela" size="lg" />
    <Avatar name="Forma Design Team" />
  </div>
};
export const AlertStates = {
  render: () => <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
    <Alert tone="success" title="Your changes are saved.">The new theme is now available to your team.</Alert>
    <Alert tone="warning" title="Review before publishing.">Two color pairs need a contrast check.</Alert>
    <Alert tone="danger" title="Something went wrong.">Please try again in a moment.</Alert>
  </div>
};
export const CardExample = {
  render: () => <Card style={{ maxWidth: 360 }}>
    <CardHeader><Badge tone="brand">Design system</Badge><CardTitle>One source of truth</CardTitle><CardDescription>Tokens travel with every component.</CardDescription></CardHeader>
    <CardContent>Keep design decisions close to the code that uses them.</CardContent>
    <CardFooter><Button variant="secondary" size="sm">Explore tokens</Button></CardFooter>
  </Card>
};
