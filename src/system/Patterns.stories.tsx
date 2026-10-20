import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Check } from 'lucide-react';
import {
  Accordion, Alert, Avatar, Badge, Button, Card, CardContent, CardDescription,
  CardHeader, CardTitle, Checkbox, Dialog, Progress, RadioGroup, SelectField,
  Table, Tabs, TextField, Tooltip
} from './components';

const meta = {
  title: 'Forma / Patterns',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Composed, realistic flows built from Forma primitives. These patterns prove the components work together — validation, feedback, review and status in context.'
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkspaceSignupDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [plan, setPlan] = useState('studio');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; team?: string; consent?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid work email.';
    if (!team) next.team = 'Choose a team size to continue.';
    if (!consent) next.consent = 'Please accept the workspace terms.';
    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
  }

  return (
    <Card style={{ maxWidth: 460 }}>
      <CardHeader>
        <Badge tone="brand">Forma pattern / 001</Badge>
        <CardTitle>Start with the basics.</CardTitle>
        <CardDescription>Set up your team’s Forma workspace in a few steps.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 14 }}>
          <TextField label="Your name" placeholder="e.g. Lulamile Mkhungela" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} error={errors.name} />
          <TextField label="Work email" type="email" placeholder="you@company.com" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} hint={!errors.email ? 'A work address helps your team find you.' : undefined} />
          <SelectField label="Team size" value={team} onChange={(event) => setTeam(event.target.value)} placeholder="Select a range" required error={errors.team} options={[{ value: 'solo', label: 'Just me' }, { value: '2-5', label: '2–5 people' }, { value: '6-20', label: '6–20 people' }, { value: '21+', label: '21+ people' }]} />
          <RadioGroup label="Choose a plan" options={[{ value: 'starter', label: 'Starter', description: 'Up to 5 projects.' }, { value: 'studio', label: 'Studio', description: 'Unlimited projects.' }]} value={plan} onValueChange={setPlan} />
          <Checkbox label="I agree to the workspace terms and privacy notice." checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          {errors.consent && <p className="forma-field__error" style={{ margin: 0 }}>{errors.consent}</p>}
          <Button type="submit" fullWidth trailingIcon={<ArrowRight size={15} />}>Create your workspace</Button>
          {submitted && <Alert tone="success" title="You're all set.">Your workspace invitation is ready. Welcome to Forma.</Alert>}
        </form>
      </CardContent>
    </Card>
  );
}

export const WorkspaceSignup: Story = {
  render: () => <WorkspaceSignupDemo />
};

function ProjectStatusDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [decision, setDecision] = useState('approve');
  const [reviewed, setReviewed] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <Card>
        <CardHeader>
          <div><Badge tone="brand">Sprint 24</Badge><CardTitle>Website refresh</CardTitle><CardDescription>On track for Friday review.</CardDescription></div>
          <Avatar name="Lulamile Mkhungela" />
        </CardHeader>
        <CardContent style={{ display: 'grid', gap: 12 }}>
          <Progress label="Launch readiness" value={reviewed ? 100 : 68} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Avatar name="Lulamile Mkhungela" size="sm" /><Avatar name="Amahle Dlamini" size="sm" /><Avatar name="Sipho Ndlovu" size="sm" />
            <span style={{ marginLeft: 4, fontSize: 11, color: 'var(--text-muted)' }}>3 contributors</span>
          </div>
          {reviewed
            ? <Alert tone="success" title="Review submitted.">Launch readiness is at 100%. Ship it Friday.</Alert>
            : <Alert tone="warning" title="A quick check before you go.">Two color pairs need a contrast review before publishing.</Alert>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button size="sm" onClick={() => setDialogOpen(true)}>Review changes</Button>
            <Tooltip content="Only reviewers can approve this launch."><button type="button" className="composed-tip">Review policy</button></Tooltip>
          </div>
        </CardContent>
      </Card>
      <Tabs ariaLabel="Project details" tabs={[
        {
          id: 'activity', label: 'Activity', content: <ul className="composed-activity">
            <li><Check size={13} /><span><b>Theme tokens merged</b><small>Lulamile · 2h ago</small></span></li>
            <li><Check size={13} /><span><b>Contrast review passed</b><small>Amahle · 5h ago</small></span></li>
          </ul>
        },
        {
          id: 'files', label: 'Files', content: <Table caption="Recent project files" columns={[{ key: 'name', label: 'File' }, { key: 'size', label: 'Size', align: 'end' }]} rows={[{ id: 'f1', name: 'Homepage hero', size: '2.4 MB' }, { id: 'f2', name: 'Token export', size: '84 KB' }]} />
        },
        {
          id: 'notes', label: 'Notes', content: <Accordion items={[{ id: 'a11y', title: 'Accessibility notes', content: <p>Focus order follows the visual order. Status never relies on color alone.</p> }]} />
        }
      ]} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Review changes" description="Your review unblocks the Friday launch.">
        <RadioGroup label="Decision" options={[{ value: 'approve', label: 'Approve', description: 'Ship it on Friday.' }, { value: 'request', label: 'Request changes', description: 'Ask for one more pass.' }]} value={decision} onValueChange={setDecision} />
        <div className="composed-dialog-actions">
          <Button variant="quiet" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => { setDialogOpen(false); setReviewed(true); }}>Submit review</Button>
        </div>
      </Dialog>
    </div>
  );
}

export const ProjectStatus: Story = {
  render: () => <ProjectStatusDemo />
};
