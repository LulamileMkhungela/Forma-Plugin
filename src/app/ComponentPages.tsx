import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Blocks, Check, Clipboard, Code2, Component, FileCode2, Info, Layers3, PenTool, Sparkles, Terminal } from 'lucide-react';
import { Accordion, Alert, Avatar, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Dialog, Progress, RadioGroup, SelectField, Switch, Table, Tabs, TextAreaField, TextField, Tooltip } from '../system';
import type { PageId } from '../data/navigation';
import type { AlertTone, ButtonVariant, ControlSize } from '../system';
import { ComponentCoverageIndex, ComponentHandoff } from './ComponentHandoff';
import { copyText } from '../data/clipboard';

export type ComponentPageId = 'buttons' | 'fields' | 'selects' | 'selection' | 'feedback';

const componentLinks: { id: ComponentPageId; title: string; description: string; icon: typeof Component; count: string }[] = [
  { id: 'buttons', title: 'Buttons', description: 'Clear actions, thoughtful hierarchy, useful states.', icon: Component, count: '5 variants' },
  { id: 'fields', title: 'Text fields', description: 'Labels, hints and helpful validation in one place.', icon: FileCode2, count: 'Text + textarea' },
  { id: 'selects', title: 'Selects', description: 'Native, keyboard-friendly single-choice menus.', icon: Blocks, count: '3 demo states' },
  { id: 'selection', title: 'Selection', description: 'Checkboxes, radio groups and switches with accessible labels.', icon: Check, count: '3 controls' },
  { id: 'feedback', title: 'Feedback & patterns', description: 'Status, identity, surfaces, navigation, overlays and data display.', icon: Layers3, count: '10 components' }
];

export function ComponentIndexPage({ onNavigate, onToast }: { onNavigate: (page: PageId) => void; onToast: (message: string) => void }) {
  return (
    <div className="page-content component-index-page">
      <div className="page-intro component-index-intro"><div><div className="eyebrow eyebrow--muted">BUILD · COMPONENTS</div><h1>Small parts. Thoughtful defaults.</h1><p>Every one of Forma’s 16 native Figma sets now has a React export, shared token-based styles, a Storybook story and component-specific usage notes. Angular usage is shown honestly as a standalone adapter or native markup with the same CSS.</p></div><Badge tone="brand" dot>16 connected sets</Badge></div>
      <div className="component-library-hero"><div><span className="eyebrow eyebrow--light"><Component size={13} /> THE FORMA LIBRARY</span><h2>One language.<br /><span>Built to compose.</span></h2><p>Start with a component, then follow its named trail through the plugin set, DTCG token paths, framework usage, styles, Storybook and guidance.</p><div className="component-library-hero__actions"><Button onClick={() => onNavigate('workflow')} trailingIcon={<ArrowRight size={14} />}>See what to do next</Button><Button variant="secondary" onClick={() => onNavigate('figma')} leadingIcon={<PenTool size={14} />}>Figma bridge</Button></div></div><div className="component-library-hero__art"><img src="/images/forma/plugin-cover.png" alt="Forma Figma plugin showing the forest and lime component system" /><span>Native variables · 16 component sets</span></div></div>
      <div className="component-library-stats"><div><b>16</b><span>Figma sets mapped</span></div><div><b>17</b><span>React patterns incl. textarea</span></div><div><b>12</b><span>React Storybook story files</span></div><div><b>2</b><span>light + dark modes</span></div></div>
      <div className="section-title-row component-index-heading"><div><div className="eyebrow eyebrow--muted">COMPONENT FAMILIES</div><h2>Choose a building block.</h2><p>Open a family for its interactive preview, API and complete artifact handoff.</p></div><button className="inline-link" onClick={() => onNavigate('frameworks')}>Developer handoff <ArrowUpRight size={13} /></button></div>
      <div className="component-library-grid">{componentLinks.map((item) => { const Icon = item.icon; return <button className="component-library-card" key={item.id} onClick={() => onNavigate(item.id)}><span className="component-library-card__icon"><Icon size={17} /></span><span className="component-library-card__count">{item.count}</span><b>{item.title}</b><p>{item.description}</p><span className="component-library-card__link">Explore component <ArrowRight size={13} /></span></button>; })}</div>
      <ComponentCoverageIndex onNavigate={onNavigate} onToast={onToast} />
    </div>
  );
}

const content = {
  buttons: {
    eyebrow: 'ACTIONS · BUTTON', title: 'Make the next step feel clear.', description: 'Buttons turn intent into action. Use one primary action per group and keep secondary choices visually quiet.', count: '5 variants · 3 sizes'
  },
  fields: {
    eyebrow: 'FORMS · TEXT FIELD', title: 'Make input feel effortless.', description: 'Field labels stay visible, hints explain the why, and errors say what to do next.', count: '3 sizes · validation-ready'
  },
  selects: {
    eyebrow: 'FORMS · SELECT', title: 'Offer a focused set of choices.', description: 'Use a native select for concise, single-choice lists. Keep labels and help text close to the control.', count: 'Keyboard-friendly'
  },
  selection: {
    eyebrow: 'FORMS · SELECTION', title: 'Let people choose with confidence.', description: 'Checkboxes handle independent choices, radio groups choose one option, and switches show an immediate on/off setting.', count: 'Checkbox · radio · switch'
  },
  feedback: {
    eyebrow: 'FEEDBACK · PATTERNS', title: 'Close the loop with feedback.', description: 'Status, identity, surfaces, overlays and structured information should make the next action clear.', count: '10 mapped components'
  }
} as const;

const guidance: Record<ComponentPageId, [string, string][]> = {
  buttons: [
    ['One primary per group', 'If everything shouts, nothing is heard. Secondary and quiet actions support the lead.'],
    ['Verbs that promise an outcome', '“Create workspace” beats “Submit”. People should predict what happens next.'],
    ['Loading beats disabled', 'Show progress for pending work. Reserve disabled for actions that are truly unavailable.']
  ],
  fields: [
    ['Labels stay visible', 'Placeholders vanish. A persistent label keeps every field understandable.'],
    ['Hints explain why, errors explain next', '“A work address helps your team find you” motivates; “Enter a valid email” repairs.'],
    ['Validate on submit, clear on fix', 'Judge once, then forgive fast as people correct their input.']
  ],
  selects: [
    ['Native control, full keyboard support', 'Arrow keys, type-ahead and screen-reader names come free. Don’t rebuild them.'],
    ['Mind the option count', 'Under four options, a radio group scans faster. Past twelve, help people search.'],
    ['Placeholders are not labels', '“Select a range” hints at emptiness; the label still names the choice.']
  ],
  selection: [
    ['Match the control to the choice', 'Checkboxes for independent options, radios for one-of-many, switches for immediate settings.'],
    ['State beyond color alone', 'Checkmarks, position and labels carry meaning when color can’t.'],
    ['Descriptions earn their place', 'One short line of consequence (“Pause alerts overnight”) beats a paragraph.']
  ],
  feedback: [
    ['Match tone to urgency', 'Info informs, success confirms, warning cautions, danger blocks. Don’t cry wolf.'],
    ['Confirm what happened and what’s next', '“Saved. Your team sees the new theme.” closes the loop with direction.'],
    ['Compose, don’t stack', 'One feedback moment at a time. Let progress, status and review share a surface.']
  ]
};

const alertCopy: Record<AlertTone, { title: string; body: string }> = {
  info: { title: 'Heads up.', body: 'Two pages still need final copy before Friday.' },
  success: { title: 'Your changes are saved.', body: 'The new theme is now available to your team.' },
  warning: { title: 'A quick check before you go.', body: 'Two color pairs need a contrast review before publishing.' },
  danger: { title: 'Launch is blocked.', body: 'The payment step fails contrast checks on small text.' }
};

interface ComponentPagesProps {
  page: ComponentPageId;
  onToast: (message: string) => void;
  onNavigate: (page: PageId) => void;
}

export function ComponentPage({ page, onToast, onNavigate }: ComponentPagesProps) {
  const [codeTab, setCodeTab] = useState<'react' | 'angular'>('react');
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ControlSize>('md');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState('Create account');
  const [fieldLabel, setFieldLabel] = useState('Work email');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('you@company.com');
  const [fieldHint, setFieldHint] = useState('A work address helps your team find you.');
  const [fieldError, setFieldError] = useState('Enter a valid work email.');
  const [fieldShowError, setFieldShowError] = useState(false);
  const [fieldRequired, setFieldRequired] = useState(true);
  const [selectLabel, setSelectLabel] = useState('Team size');
  const [selectPlaceholder, setSelectPlaceholder] = useState('Select a range');
  const [selectRequired, setSelectRequired] = useState(true);
  const [selectionDisabled, setSelectionDisabled] = useState(false);
  const [plan, setPlan] = useState('studio');
  const [alertTone, setAlertTone] = useState<AlertTone>('success');
  const [progressValue, setProgressValue] = useState(68);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState('approve');
  const copy = page === 'buttons' ? buttonCode(codeTab, variant, size, disabled, loading, label) : getCode(page, codeTab);
  const meta = content[page];

  function renderPreview() {
    switch (page) {
      case 'buttons':
        return <div className="button-preview"><Button variant={variant} size={size} disabled={disabled} loading={loading} trailingIcon={<ArrowRight size={15} />}>{label || 'Button label'}</Button><Button variant="secondary" size="md">Secondary action</Button><div className="button-preview__hint"><Info size={14} />A clear verb helps people understand what happens next.</div></div>;
      case 'fields':
        return <div className="form-preview-grid"><TextField label={fieldLabel || 'Field label'} type="email" placeholder={fieldPlaceholder} size={size} required={fieldRequired} hint={fieldShowError ? undefined : fieldHint} error={fieldShowError ? fieldError : undefined} /><TextField label="Email with an error" type="email" defaultValue="not-an-email" error="Enter a valid work email." /><TextAreaField label="A little more context" placeholder="Tell us what you're building..." rows={3} hint="A sentence or two is perfect." /></div>;
      case 'selects':
        return <div className="form-preview-grid"><SelectField label={selectLabel || 'Select label'} size={size} options={[{ value: '1-5', label: '1–5 people' }, { value: '6-20', label: '6–20 people' }, { value: '21+', label: '21+ people' }]} placeholder={selectPlaceholder || 'Choose an option'} required={selectRequired} hint="We’ll tailor the setup for your team." /><SelectField label="Plan" defaultValue="studio" options={[{ value: 'starter', label: 'Starter' }, { value: 'studio', label: 'Studio' }, { value: 'enterprise', label: 'Enterprise' }]} /><SelectField label="Region" error="Choose a region to continue." options={[{ value: 'na', label: 'North America' }, { value: 'eu', label: 'Europe' }]} /></div>;
      case 'selection':
        return <div className="selection-preview">
          <div className="selection-card"><div className="selection-card__heading"><span className="eyebrow eyebrow--muted">EMAIL PREFERENCES</span><Badge tone="brand">Optional</Badge></div><Checkbox label="Product updates" size={size} description="A thoughtful note when something new ships." defaultChecked disabled={selectionDisabled} /><Checkbox label="Tips and inspiration" size={size} description="Ideas to help your team get more from Forma." disabled={selectionDisabled} /><div className="selection-divider" /><Switch label="Weekly summary" size={size} description="A quick digest, delivered every Monday." defaultChecked disabled={selectionDisabled} /><Switch label="Quiet hours" size={size} description="Pause non-essential notifications overnight." disabled={selectionDisabled} /></div>
          <div className="selection-card"><div className="selection-card__heading"><span className="eyebrow eyebrow--muted">WORKSPACE PLAN</span><Badge tone="neutral">One choice</Badge></div><RadioGroup label="Choose a plan" options={[{ value: 'starter', label: 'Starter', description: 'Free for small teams.' }, { value: 'studio', label: 'Studio', description: 'For growing workspaces.' }]} value={plan} onValueChange={setPlan} /></div>
          <div className="selection-preview__note"><Check size={14} />State is visible beyond color alone.</div>
        </div>;
      case 'feedback':
        return <div className="feedback-composed">
          <Card className="composed-status"><CardHeader><div><Badge tone="brand">Sprint 24</Badge><CardTitle>Website refresh</CardTitle><CardDescription>On track for Friday review.</CardDescription></div><Avatar name="Lulamile Mkhungela" /></CardHeader><CardContent>
            <Progress label="Launch readiness" value={progressValue} />
            <div className="composed-avatars"><Avatar name="Lulamile Mkhungela" size="sm" /><Avatar name="Amahle Dlamini" size="sm" /><Avatar name="Sipho Ndlovu" size="sm" /><span className="composed-avatars__more">3 contributors</span></div>
            <Alert tone={alertTone} title={alertCopy[alertTone].title}>{alertCopy[alertTone].body}</Alert>
            <div className="composed-actions"><Button size="sm" onClick={() => setDialogOpen(true)}>Review changes</Button><Tooltip content="Only reviewers can approve this launch."><button type="button" className="composed-tip">Review policy</button></Tooltip></div>
          </CardContent></Card>
          <div className="composed-panels"><Tabs ariaLabel="Project details" tabs={[
            { id: 'activity', label: 'Activity', content: <ul className="composed-activity"><li><Check size={13} /><span><b>Theme tokens merged</b><small>Lulamile · 2h ago</small></span></li><li><Check size={13} /><span><b>Contrast review passed</b><small>Amahle · 5h ago</small></span></li><li><Check size={13} /><span><b>Radio group shipped</b><small>Sipho · yesterday</small></span></li></ul> },
            { id: 'files', label: 'Files', content: <Table caption="Recent project files" columns={[{ key: 'name', label: 'File' }, { key: 'size', label: 'Size', align: 'end' }]} rows={[{ id: 'f1', name: 'Homepage hero', size: '2.4 MB' }, { id: 'f2', name: 'Token export', size: '84 KB' }, { id: 'f3', name: 'Launch checklist', size: '12 KB' }]} /> },
            { id: 'notes', label: 'Notes', content: <Accordion items={[{ id: 'a11y', title: 'Accessibility notes', content: <p>Focus order follows the visual order. Status never relies on color alone.</p> }, { id: 'tokens', title: 'Token decisions', content: <p>Semantic roles only — no hard-coded hex in product code.</p> }]} /> }
          ]} /></div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Review changes" description="Your review unblocks the Friday launch.">
            <RadioGroup label="Decision" options={[{ value: 'approve', label: 'Approve', description: 'Ship it on Friday.' }, { value: 'request', label: 'Request changes', description: 'Ask for one more pass.' }]} value={reviewDecision} onValueChange={setReviewDecision} />
            <div className="composed-dialog-actions"><Button variant="quiet" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button><Button size="sm" onClick={() => { setDialogOpen(false); onToast('Review submitted — nice work'); }}>Submit review</Button></div>
          </Dialog>
        </div>;
    }
  }

  function renderControls() {
    switch (page) {
      case 'buttons':
        return <>
          <label className="control-label">Label<input className="control-input" value={label} onChange={(event) => setLabel(event.target.value)} /></label>
          <label className="control-label">Variant<select className="control-select" value={variant} onChange={(event) => setVariant(event.target.value as ButtonVariant)}><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="tertiary">Tertiary</option><option value="danger">Danger</option><option value="quiet">Quiet</option></select></label>
          <label className="control-label">Size<select className="control-select" value={size} onChange={(event) => setSize(event.target.value as ControlSize)}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></label>
          <div className="control-toggle-list"><Switch label="Disabled" size="sm" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /><Switch label="Loading" size="sm" checked={loading} onChange={(event) => setLoading(event.target.checked)} /></div>
        </>;
      case 'fields':
        return <>
          <label className="control-label">Label<input className="control-input" value={fieldLabel} onChange={(event) => setFieldLabel(event.target.value)} /></label>
          <label className="control-label">Placeholder<input className="control-input" value={fieldPlaceholder} onChange={(event) => setFieldPlaceholder(event.target.value)} /></label>
          <label className="control-label">Hint<input className="control-input" value={fieldHint} onChange={(event) => setFieldHint(event.target.value)} /></label>
          <label className="control-label">Error message<input className="control-input" value={fieldError} onChange={(event) => setFieldError(event.target.value)} /></label>
          <label className="control-label">Size<select className="control-select" value={size} onChange={(event) => setSize(event.target.value as ControlSize)}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></label>
          <div className="control-toggle-list"><Switch label="Show error" size="sm" checked={fieldShowError} onChange={(event) => setFieldShowError(event.target.checked)} /><Switch label="Required" size="sm" checked={fieldRequired} onChange={(event) => setFieldRequired(event.target.checked)} /></div>
        </>;
      case 'selects':
        return <>
          <label className="control-label">Label<input className="control-input" value={selectLabel} onChange={(event) => setSelectLabel(event.target.value)} /></label>
          <label className="control-label">Placeholder<input className="control-input" value={selectPlaceholder} onChange={(event) => setSelectPlaceholder(event.target.value)} /></label>
          <label className="control-label">Size<select className="control-select" value={size} onChange={(event) => setSize(event.target.value as ControlSize)}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></label>
          <div className="control-toggle-list"><Switch label="Required" size="sm" checked={selectRequired} onChange={(event) => setSelectRequired(event.target.checked)} /></div>
        </>;
      case 'selection':
        return <>
          <label className="control-label">Size<select className="control-select" value={size} onChange={(event) => setSize(event.target.value as ControlSize)}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></label>
          <label className="control-label">Plan<select className="control-select" value={plan} onChange={(event) => setPlan(event.target.value)}><option value="starter">Starter</option><option value="studio">Studio</option></select></label>
          <div className="control-toggle-list"><Switch label="Disabled" size="sm" checked={selectionDisabled} onChange={(event) => setSelectionDisabled(event.target.checked)} /></div>
        </>;
      case 'feedback':
        return <>
          <label className="control-label">Alert tone<select className="control-select" value={alertTone} onChange={(event) => setAlertTone(event.target.value as AlertTone)}><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="danger">Danger</option></select></label>
          <label className="control-label">Readiness · {progressValue}%<span className="control-range-row"><input type="range" min={0} max={100} value={progressValue} onChange={(event) => setProgressValue(Number(event.target.value))} aria-label="Launch readiness percent" /></span></label>
          <div className="control-toggle-list"><Switch label="Review dialog" size="sm" checked={dialogOpen} onChange={(event) => setDialogOpen(event.target.checked)} /></div>
        </>;
    }
  }

  return (
    <div className="page-content component-docs-page">
      <div className="page-intro component-page-intro"><div><div className="eyebrow eyebrow--muted">COMPONENTS · {meta.eyebrow}</div><h1>{meta.title}</h1><p>{meta.description}</p></div><Badge tone="neutral">{meta.count}</Badge></div>
      <div className="component-docs-grid">
        <div className="component-main-column">
          <Card className="component-preview-card"><CardHeader className="component-preview-head"><div><span className="eyebrow eyebrow--muted">LIVE PREVIEW</span><CardTitle>Try it in context.</CardTitle><CardDescription>Change a few properties and see the component respond.</CardDescription></div><span className="preview-live-pill"><i /> Live</span></CardHeader><CardContent><div className={`component-playground component-playground--${page}`}>
            {renderPreview()}
          </div></CardContent></Card>
          <Card className="source-card"><div className="source-card__top"><div className="source-tabs"><button className={codeTab === 'react' ? 'is-active' : ''} onClick={() => setCodeTab('react')}><Code2 size={14} /> React</button><button className={codeTab === 'angular' ? 'is-active' : ''} onClick={() => setCodeTab('angular')}><FileCode2 size={14} /> Angular</button></div><button className="copy-code-button" onClick={() => { void copyText(copy).then((ok) => onToast(ok ? `${codeTab === 'react' ? 'React' : 'Angular'} example copied` : 'Copy failed in this browser — select the text manually')); }}><Clipboard size={14} /> Copy code</button></div><pre className="code-block"><code>{copy}</code></pre><div className="source-card__foot"><span><span className="source-dot" /> TypeScript · Forma v1.0</span><button className="inline-link" onClick={() => onNavigate('frameworks')}>Framework setup <ArrowRight size={13} /></button></div></Card>
          <Card className="component-guidance-card"><CardHeader><div><span className="eyebrow eyebrow--muted">DESIGN GUIDANCE</span><CardTitle>Small details, thoughtful defaults.</CardTitle></div><span className="guidance-icon"><Sparkles size={16} /></span></CardHeader><CardContent><div className="guidance-grid">{guidance[page].map(([title, body], index) => <div key={title}><span className="guidance-index">0{index + 1}</span><b>{title}</b><p>{body}</p></div>)}</div></CardContent></Card>
        </div>
        <aside className="component-side-column"><Card className="controls-card"><CardHeader><div className="controls-card__title"><span className="controls-icon"><Terminal size={15} /></span><div><CardTitle>Props & controls</CardTitle><CardDescription>Adjust the rendered state.</CardDescription></div></div></CardHeader><CardContent>{renderControls()}</CardContent></Card>
          <Card className="api-card"><CardHeader><div><span className="eyebrow eyebrow--muted">QUICK API</span><CardTitle>What you can tune.</CardTitle></div></CardHeader><CardContent><div className="api-list">{apiProps(page).map(([name, type, description]) => <div className="api-row" key={name}><span><code>{name}</code><small>{description}</small></span><b>{type}</b></div>)}</div><div className="api-note"><Info size={14} /><span>Defaults are tuned to work well without configuration.</span></div></CardContent></Card>
          <Card className="accessibility-card"><CardContent><div className="accessibility-card__icon"><Check size={15} /></div><div><b>Accessibility built in</b><p>Native semantics, labels, keyboard support and reduced-motion-friendly feedback.</p><button className="inline-link" onClick={() => onNavigate('resources')}>A11y reference <ArrowRight size={13} /></button></div></CardContent></Card>
        </aside>
      </div>
      <ComponentHandoff family={page} onNavigate={onNavigate} />
    </div>
  );
}

export function buttonCode(tab: 'react' | 'angular', variant: ButtonVariant, size: ControlSize, disabled: boolean, loading: boolean, label: string) {
  if (tab === 'angular') return `<forma-button\n  variant="${variant}"\n  size="${size}"\n  [disabled]="${disabled}"\n  [loading]="${loading}"\n>\n  ${label || 'Button label'}\n</forma-button>`;
  return `import { Button } from '../system';\n\n<Button\n  variant="${variant}"\n  size="${size}"\n  disabled={${disabled}}\n  loading={${loading}}\n>\n  ${label || 'Button label'}\n</Button>`;
}

export function getCode(page: ComponentPageId, tab: 'react' | 'angular') {
  const react: Record<ComponentPageId, string> = {
    buttons: '',
    fields: `import { TextField } from '../system';\n\n<TextField\n  label="Work email"\n  type="email"\n  placeholder="you@company.com"\n  hint="We’ll only use this to contact you."\n  required\n/>`,
    selects: `import { SelectField } from '../system';\n\n<SelectField\n  label="Team size"\n  placeholder="Select a range"\n  options={[\n    { value: '1-5', label: '1–5 people' },\n    { value: '6-20', label: '6–20 people' },\n    { value: '21+', label: '21+ people' },\n  ]}\n  required\n/>`,
    selection: `import { Checkbox, RadioGroup, Switch } from '../system';\n\n<Checkbox\n  label="Product updates"\n  description="A thoughtful note when something new ships."\n/>\n\n<RadioGroup\n  label="Choose a plan"\n  defaultValue="studio"\n  options={[\n    { value: 'starter', label: 'Starter', description: 'Free for small teams' },\n    { value: 'studio', label: 'Studio', description: 'For growing workspaces' },\n  ]}\n/>\n\n<Switch\n  label="Weekly summary"\n  defaultChecked\n/>`,
    feedback: `import { Alert, Badge, Progress } from '../system';\n\n<Badge tone="success" dot>Published</Badge>\n\n<Progress label="Launch readiness" value={68} />\n\n<Alert tone="success" title="Your changes are saved.">\n  The new theme is ready for your team.\n</Alert>`
  };
  const angular: Record<ComponentPageId, string> = {
    buttons: '',
    fields: `<forma-text-field\n  label="Work email"\n  type="email"\n  placeholder="you@company.com"\n  hint="We’ll only use this to contact you."\n  [required]="true"\n/>`,
    selects: `<forma-select
  label="Team size"
  placeholder="Select a range"
  [options]="[{ value: '1-5', label: '1–5 people' }, { value: '6-20', label: '6–20 people' }, { value: '21+', label: '21+ people' }]"
  [required]="true"
/>`,
    selection: `<forma-checkbox
  label="Product updates"
  description="A thoughtful note when something new ships."
/>

<fieldset class="forma-radio-group">
  <legend class="forma-field__label">Choose a plan</legend>
  <label class="forma-radio">
    <input class="forma-radio__input" type="radio" name="plan" value="studio" checked />
    <span class="forma-radio__indicator" aria-hidden="true"></span>
    <span>Studio</span>
  </label>
</fieldset>

<forma-switch label="Weekly summary" [checked]="true" />`,
    feedback: `<forma-badge tone="success" [dot]="true">Published</forma-badge>

<label class="forma-progress__heading" for="readiness">Launch readiness</label>
<progress id="readiness" class="forma-progress__bar" value="68" max="100">68%</progress>

<forma-alert tone="success" title="Your changes are saved.">
  The new theme is ready for your team.
</forma-alert>`
  };
  return tab === 'react' ? react[page] : angular[page];
}

function apiProps(page: ComponentPageId) {
  const props: Record<ComponentPageId, [string, string, string][]> = {
    buttons: [['variant', 'enum', 'visual intent'], ['size', 'enum', 'control height'], ['loading', 'boolean', 'pending state'], ['disabled', 'boolean', 'unavailable state'], ['leadingIcon', 'node', 'optional icon'] ],
    fields: [['label', 'string', 'visible label'], ['hint', 'string', 'supporting text'], ['error', 'string', 'validation state'], ['size', 'enum', 'control height'], ['required', 'boolean', 'native constraint'] ],
    selects: [['options', 'array', 'available choices'], ['placeholder', 'string', 'empty state'], ['hint', 'string', 'supporting text'], ['error', 'string', 'validation state'], ['required', 'boolean', 'native constraint'] ],
    selection: [['label', 'string', 'visible label'], ['description', 'string', 'supporting text'], ['checked', 'boolean', 'controlled state'], ['disabled', 'boolean', 'unavailable state'], ['size', 'enum', 'control scale'] ],
    feedback: [['tone', 'enum', 'status intent'], ['title', 'string', 'clear summary'], ['dot', 'boolean', 'status cue'], ['children', 'node', 'supporting content'], ['icon', 'node', 'optional cue'] ]
  };
  return props[page];
}
