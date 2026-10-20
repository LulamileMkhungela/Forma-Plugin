import { useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Braces, Check, ChevronRight, Clipboard, Code2, Download, ExternalLink, FileCode2, PenTool, FileJson2, GitBranch, Layers3, Play, Search, ShieldCheck, Sparkles, Terminal, WandSparkles, Workflow } from 'lucide-react';
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, RadioGroup, SelectField, TextField } from '../system';
import { resources, resourceCategories } from '../data/resources';
import { allTokens, tokenCount } from '../data/tokens';
import { componentHandoff } from '../data/component-handoff';
import type { PageId } from '../data/navigation';
import type { Resource } from '../data/resources';
import { copyText } from '../data/clipboard';

type ToastHandler = (message: string) => void;

export function FigmaPage({ onToast, onNavigate }: { onToast: ToastHandler; onNavigate: (page: PageId) => void }) {
  const steps = [
    { n: '01', icon: FileJson2, title: 'Keep one source', copy: 'Start from the DTCG JSON. Primitive values and Light / Dark roles stay portable.', tag: '170 tokens' },
    { n: '02', icon: Download, title: 'Install the bridge', copy: 'Download the ready-to-import offline package and open its manifest in Figma.', tag: 'No build step' },
    { n: '03', icon: WandSparkles, title: 'Create the library', copy: 'Build native variables, two theme modes, 16 variant sets and a sample pattern.', tag: '16 component sets' },
    { n: '04', icon: Code2, title: 'Review the handoff', copy: 'Export any edited variables as JSON, review the diff, then rebuild CSS and Sass.', tag: 'Tokens → code' }
  ];
  return (
    <div className="page-content integration-page figma-page">
      <PageIntro eyebrow="DESIGN TO CODE · FIGMA BRIDGE" title="Design it once. Bring it everywhere." description="The Forma plugin connects the source tokens to native Figma variables and component sets. Review the same language in React, Angular and Storybook." count={`${tokenCount} tokens`} />
      <div className="figma-hero figma-hero--reference">
        <div className="figma-hero__copy">
          <span className="eyebrow eyebrow--light"><PenTool size={13} /> FIGMA → TOKENS → CODE</span>
          <h2>One source.<br /><em>A shared language.</em></h2>
          <p>Created by Lulamile Mkhungela, the Forma plugin runs locally in Figma. It does not ask for an API key or connect to an external service.</p>
          <div className="figma-hero__actions"><a className="forma-button forma-button--primary forma-button--md" href="/downloads/forma-figma-plugin.zip" download><Download size={14} /><span>Download plugin package</span></a><Button variant="secondary" onClick={() => onNavigate('tokens')} trailingIcon={<ArrowRight size={14} />}>Browse token source</Button></div>
          <div className="figma-hero__meta"><span><Check size={13} /> Offline-first</span><span><Check size={13} /> 2 theme modes</span><span><Check size={13} /> 16 Figma component sets</span></div>
        </div>
        <div className="figma-reference-image"><img src="/images/forma/figma-bridge.png" alt="Forma Figma-to-code bridge reference interface" /><span>Forma · Figma bridge</span></div>
      </div>
      <div className="handoff-steps">{steps.map(({ n, icon: Icon, title, copy, tag }, index) => <div className="handoff-step" key={n}><div className="handoff-step__top"><span className="handoff-step__number">{n}</span><span className="handoff-step__icon"><Icon size={17} /></span>{index < steps.length - 1 && <span className="handoff-step__line" />}</div><h3>{title}</h3><p>{copy}</p><Badge tone="neutral">{tag}</Badge></div>)}</div>
      <div className="figma-details-grid">
        <Card><CardHeader><span className="eyebrow eyebrow--muted">INSTALL IN FIGMA</span><CardTitle>Start with the ready-to-import plugin.</CardTitle><CardDescription>The bundled plugin is offline-first and includes its manifest and compiled code. You do not need to build it before trying Forma.</CardDescription></CardHeader><CardContent><a href="/downloads/forma-figma-plugin.zip" download className="download-plugin-card"><span className="download-row__icon download-row__icon--green"><Download size={16} /></span><span><b>forma-figma-plugin.zip</b><small>Manifest · compiled code · UI · sources · tokens</small></span><Download size={14} /></a><ol className="numbered-steps numbered-steps--figma"><li><span>1</span><div><b>Extract the package</b><p>Keep the extracted folder in a stable local location.</p></div></li><li><span>2</span><div><b>Import its manifest in Figma</b><p>Choose Plugins → Development → Import plugin from manifest, then select the extracted <code>manifest.json</code>.</p></div></li><li><span>3</span><div><b>Choose tokens and build</b><p>Run the plugin, keep the bundled Forma source or load a local DTCG JSON, then build the library in the current file.</p></div></li><li><span>4</span><div><b>Follow the handoff</b><p>Use the component map to inspect each Figma set’s tokens, React export, styles, story and guidance.</p></div></li></ol><details className="figma-source-details"><summary>For maintainers · rebuild from source</summary><div><code>npm run build:figma</code><button onClick={() => { void copyText('npm run build:figma').then((ok) => onToast(ok ? 'Source build command copied' : 'Copy failed in this browser — select the text manually')); }}><Clipboard size={13} /> Copy</button></div><p>This repackages the vendored Forma plugin project in <code>figma-plugin/</code> into the downloadable ZIP byte for byte, without its images.</p></details></CardContent></Card>
        <Card><CardHeader><span className="eyebrow eyebrow--muted">TOKEN EXPORTS</span><CardTitle>Choose the file your tool needs.</CardTitle><CardDescription>Every output is generated from the canonical DTCG JSON.</CardDescription></CardHeader><CardContent><div className="download-list"><a href="/tokens/forma.tokens.json" download className="download-row"><span className="download-row__icon download-row__icon--green"><FileJson2 size={16} /></span><span><b>forma.tokens.json</b><small>DTCG · canonical source</small></span><Download size={14} /></a><a href="/tokens/figma-tokens.json" download className="download-row"><span className="download-row__icon download-row__icon--lime"><PenTool size={16} /></span><span><b>figma-tokens.json</b><small>Tokens Studio token sets</small></span><Download size={14} /></a><a href="/tokens/forma.tokens.css" download className="download-row"><span className="download-row__icon download-row__icon--green"><Braces size={16} /></span><span><b>forma.tokens.css</b><small>CSS custom properties</small></span><Download size={14} /></a><a href="/tokens/forma.tokens.scss" download className="download-row"><span className="download-row__icon download-row__icon--amber"><Terminal size={16} /></span><span><b>forma.tokens.scss</b><small>Sass variables</small></span><Download size={14} /></a></div><div className="export-note"><ShieldCheck size={14} /><span>Both Light and Dark semantic modes ship in the source. The plugin has <code>networkAccess: ["none"]</code>.</span></div></CardContent></Card>
      </div>
      <Card className="plugin-note-card"><CardContent><div className="plugin-note-icon"><WandSparkles size={18} /></div><div><span className="eyebrow eyebrow--muted">THE FORMA FIGMA PLUGIN</span><h3>Not just a handoff checklist.</h3><p>The plugin builds native token collections, generates 16 component variant sets, and lays out a sample Forma design library. All Figma document changes stay in the current file.</p></div><Button variant="tertiary" onClick={() => onNavigate('components')} trailingIcon={<ArrowRight size={14} />}>Explore the components</Button></CardContent></Card>
      <div className="figma-details-grid figma-update-grid">
        <Card><CardHeader><span className="eyebrow eyebrow--muted">SEE IT FIRST · NO INSTALL</span><CardTitle>Three ways to see the Figma file.</CardTitle><CardDescription>Looking costs nothing. Installing is a choice you make only when you want the library in your own file.</CardDescription></CardHeader><CardContent><ol className="numbered-steps"><li><span>1</span><div><b>Look inside this guide</b><p>Component explorer → Figma lens shows every set, collection and token. Nothing to install.</p></div></li><li><span>2</span><div><b>Generate it in your file</b><p>Sideload the plugin once with the steps above, run Build, and the library appears in minutes.</p></div></li><li><span>3</span><div><b>One-click install (in review)</b><p>Forma is submitted to Figma Community and awaiting review. Approval turns step 2 into a single click — same plugin, same files.</p></div></li></ol><Button variant="tertiary" onClick={() => onNavigate('explorer')} trailingIcon={<ArrowRight size={14} />}>Open the explorer</Button></CardContent></Card>
        <Card><CardHeader><span className="eyebrow eyebrow--muted">KEEP IT FRESH</span><CardTitle>Update your generated library.</CardTitle><CardDescription>Tokens change. Your Figma file can follow in three steps — safe to repeat.</CardDescription></CardHeader><CardContent><ol className="numbered-steps"><li><span>1</span><div><b>Change the tokens</b><p>Edit <code>tokens/forma.tokens.json</code>, or load your own DTCG file in the plugin with Import token JSON.</p></div></li><li><span>2</span><div><b>Run Build again, in the same file</b><p>Variables and text styles update in place. Your pages are never deleted.</p></div></li><li><span>3</span><div><b>Remove the previous boards</b><p>Visual sets regenerate as new boards below the old ones. Delete the old boards — or keep them until placed instances move to the new sets.</p></div></li></ol><div className="export-note"><ShieldCheck size={14} /><span>Renaming tokens is safe. Changing a value’s type (color → number) needs a new token name — the plugin stops and tells you.</span></div></CardContent></Card>
      </div>
    </div>
  );
}

export function FrameworksPage({ onToast }: { onToast: ToastHandler }) {
  const [tab, setTab] = useState<'react' | 'angular' | 'tokens'>('react');
  const code = {
    react: `// src/main.tsx — load the shared styles once
import './styles/global.css';
import './styles/reference-theme.css';

// src/app/InviteForm.tsx — compose accessible primitives
import { ArrowRight } from 'lucide-react';
import { Button, TextField } from '../system';

export function InviteForm() {
  return (
    <form className="form-stack">
      <TextField
        label="Work email"
        type="email"
        placeholder="you@company.com"
        required
      />
      <Button type="submit" trailingIcon={<ArrowRight />}>
        Send invite
      </Button>
    </form>
  );
}`,
    angular: `<!-- examples/angular/src/styles.css loads the shared token and component CSS. -->
<form class="form-stack">
  <forma-text-field
    label="Work email"
    type="email"
    placeholder="you@company.com"
    [required]="true"
  />
  <forma-button type="submit" variant="primary">
    Send invite
  </forma-button>
</form>`,
    tokens: `/* CSS variables are generated from the DTCG source. */
.form-stack {
  display: grid;
  gap: var(--space-4);
  max-width: 28rem;
}

.form-stack__surface {
  color: var(--theme-light-text-primary);
  background: var(--theme-light-background-surface);
  border: var(--border-width-default) solid var(--theme-light-border-default);
  border-radius: var(--component-card-radius);
}`
  }[tab];
  return (
    <div className="page-content integration-page">
      <PageIntro eyebrow="BUILD & SHIP · CODE" title="One language. Your framework." description="All 16 React components share the canonical token CSS. Angular includes standalone adapters for core controls; the map shows native-markup recipes for the rest." count="React · Angular · CSS" />
      <div className="framework-overview"><div className="framework-overview__copy"><Badge tone="success" dot>Framework-neutral foundations</Badge><h2>Keep the foundation shared.<br /><span>Meet each team where they build.</span></h2><p>Semantic tokens and shared CSS are the stable layer. React has a component for every Figma set; Angular guidance is explicit about adapter versus native markup.</p></div><div className="framework-pills"><div><span className="framework-logo framework-logo--react">◒</span><b>React</b><small>Typed components</small></div><div><span className="framework-logo framework-logo--angular">A</span><b>Angular</b><small>7 core adapters</small></div><div><span className="framework-logo framework-logo--css">✳</span><b>CSS</b><small>Portable tokens</small></div></div></div><figure className="developer-reference-image"><img src="/images/forma/developer-handoff.png" alt="Forma developer handoff reference screen" /><figcaption>Developer handoff · shared variables across product code</figcaption></figure>
      <div className="code-delivery-layout"><Card className="code-delivery-card"><div className="framework-tabs"><button className={tab === 'react' ? 'is-active' : ''} onClick={() => setTab('react')}><Code2 size={15} /> React</button><button className={tab === 'angular' ? 'is-active' : ''} onClick={() => setTab('angular')}><Braces size={15} /> Angular</button><button className={tab === 'tokens' ? 'is-active' : ''} onClick={() => setTab('tokens')}><Layers3 size={15} /> CSS tokens</button></div><div className="code-window-head"><span><i /><i /><i /></span><small>{tab === 'react' ? 'InviteForm.tsx' : tab === 'angular' ? 'invite-form.component.html' : 'app.css'}</small><button onClick={() => { void copyText(code).then((ok) => onToast(ok ? 'Example copied to clipboard' : 'Copy failed in this browser — select the text manually')); }}><Clipboard size={13} /> Copy</button></div><pre className="code-block code-block--large"><code>{code}</code></pre><div className="code-delivery-foot"><span><Check size={13} /> Semantic tokens stay consistent</span><span><Check size={13} /> Native keyboard behavior</span></div></Card>
        <div className="setup-steps"><div className="setup-steps__head"><span className="eyebrow eyebrow--muted">IN YOUR EDITOR</span><h3>From clone to component.</h3><p>Make the system tangible in your project.</p></div><div className="setup-step"><span className="setup-step__number">01</span><div><b>Start the paired previews</b><code>npm run workbench</code></div><ChevronRight size={15} /></div><div className="setup-step"><span className="setup-step__number">02</span><div><b>Use the React exports</b><code>src/system · 16 component patterns</code></div><ChevronRight size={15} /></div><div className="setup-step"><span className="setup-step__number">03</span><div><b>Build in Angular too</b><span>Use a standalone adapter or native markup with Forma CSS.</span></div><ChevronRight size={15} /></div><div className="editor-note"><span><Check size={14} /></span><p>Every code example on this page comes from the component contract shipped in this repo.</p></div></div></div>
      <div className="framework-footnotes"><Card><CardContent><span className="footnote-icon"><FileCode2 size={16} /></span><div><b>React components</b><p>Typed, composable source components with native HTML semantics. CSS is framework-neutral.</p></div></CardContent></Card><Card><CardContent><span className="footnote-icon footnote-icon--mint"><Braces size={16} /></span><div><b>Angular usage</b><p>Seven standalone adapters are included. The component map shows native HTML and shared CSS recipes for the remaining patterns.</p></div></CardContent></Card><Card><CardContent><span className="footnote-icon footnote-icon--amber"><Layers3 size={16} /></span><div><b>Token pipeline</b><p>Style Dictionary builds CSS and Sass from the DTCG JSON source.</p></div></CardContent></Card></div>
    </div>
  );
}

export function StorybookPage({ onToast, onNavigate }: { onToast: ToastHandler; onNavigate: (page: PageId) => void }) {
  return (
    <div className="page-content integration-page storybook-page">
      <PageIntro eyebrow="BUILD & SHIP · STORYBOOK" title="Every component has a story." description="All 16 native Figma sets map to a React export, a real Storybook story, shared token-based styles and usage guidance. Use the story index to find the exact file and state." count="16 components · 12 story files" />
      <div className="storybook-hero"><div>
        <div className="storybook-brand"><span className="storybook-mark">S</span><Badge tone="success" dot>React Storybook · accessibility addon</Badge></div>
        <h2>Inspect the state.<br /><em>Follow the source.</em></h2>
        <p>Story names and source files below match the actual Storybook. Open the linked component family to continue through tokens, framework usage and guidance.</p>
        <div className="storybook-actions"><Button onClick={() => onNavigate('components')} leadingIcon={<Layers3 size={15} />}>Open component map</Button><Button variant="tertiary" onClick={() => onNavigate('workflow')} leadingIcon={<ArrowRight size={14} />}>See what’s next</Button></div>
        <details className="storybook-maintainer-details"><summary>For maintainers · start both local previews</summary><div><p>One command starts the Forma guide and the React Storybook together.</p><code>npm run workbench</code><button onClick={() => { void copyText('npm run workbench').then((ok) => onToast(ok ? 'Workbench command copied' : 'Copy failed in this browser — select the text manually')); }} aria-label="Copy workbench command"><Clipboard size={13} /> Copy</button></div></details>
      </div><div className="storybook-mini"><div className="storybook-mini__top"><span><i /><i /><i /></span><b>Forma / component stories</b><span className="storybook-mini__toolbar"><BadgeCheck size={13} /></span></div><div className="storybook-mini__canvas"><div className="storybook-story-lines"><span><i /> Actions / Button</span><span><i /> Forms / Text field</span><span><i /> Navigation / Tabs</span><span><i /> Feedback / Avatar</span></div><div className="storybook-a11y"><BadgeCheck size={12} /> A11y checks enabled</div></div><div className="storybook-mini__bottom"><span>Controls</span><span>Docs</span><span>Accessibility</span></div></div></div>
      <div className="section-title-row storybook-list-heading"><div><div className="eyebrow eyebrow--muted">LIVE STORY INDEX</div><h2>Find the component you need.</h2><p>Stories are organized by component family; the file path and named stories are shown on each card.</p></div><Badge tone="neutral">{componentHandoff.length} mapped stories</Badge></div>
      <div className="storybook-component-grid storybook-component-grid--mapped">{componentHandoff.map((component, index) => {
        const familyPages: Record<typeof component.family, PageId> = { buttons: 'buttons', fields: 'fields', selects: 'selects', selection: 'selection', feedback: 'feedback' };
        return <Card className="storybook-component storybook-component--mapped" key={component.id}><CardContent>
          <div className="storybook-component__preview"><span className="storybook-story-mark"><BookOpen size={15} /></span><div><small>FIGMA SET · {component.figmaSet}</small><b>{component.reactExport}</b></div><Badge tone="success" size="sm">Story ready</Badge></div>
          <div className="storybook-component__meta"><div><span>{component.storyTitle}</span><h3>{component.name}</h3><p>{component.storyNames.join(' · ')}</p><code>{component.storyFile}</code><button className="inline-link" onClick={() => onNavigate(familyPages[component.family])}>Open component handoff <ArrowRight size={12} /></button></div><span className="story-index">{String(index + 1).padStart(2, '0')}</span></div>
        </CardContent></Card>;
      })}</div>
      <div className="storybook-info-grid"><Card><CardContent><span className="storybook-info-icon"><BookOpen size={17} /></span><div><b>Real Storybook stories</b><p>Stories are loaded from <code>src/system/*.stories.tsx</code>; the index above uses their actual titles and exports.</p></div></CardContent></Card><Card><CardContent><span className="storybook-info-icon storybook-info-icon--mint"><BadgeCheck size={17} /></span><div><b>Accessibility checks</b><p>The a11y addon is enabled. Use keyboard and screen-reader checks in context too.</p></div></CardContent></Card><Card><CardContent><span className="storybook-info-icon storybook-info-icon--amber"><Workflow size={17} /></span><div><b>Then complete the handoff</b><p>Follow each component’s token, implementation, style and guidance links in the component map.</p></div></CardContent></Card></div>
    </div>
  );
}

export function PlaygroundPage({ onToast, onNavigate }: { onToast: ToastHandler; onNavigate: (page: PageId) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitAttempt, setSubmitAttempt] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [plan, setPlan] = useState('studio');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; team?: string; consent?: string }>({});
  const errorList = [
    errors.name ? { id: 'signup-name', message: errors.name } : null,
    errors.email ? { id: 'signup-email', message: errors.email } : null,
    errors.team ? { id: 'signup-team', message: errors.team } : null,
    errors.consent ? { id: 'signup-consent', message: errors.consent } : null
  ].filter((item): item is { id: string; message: string } => item !== null);
  useEffect(() => {
    if (submitAttempt === 0) return;
    const target = errorList.length > 0 ? 'signup-errors' : submitted ? 'signup-success' : null;
    if (target) document.getElementById(target)?.focus();
  }, [submitAttempt]);
  function clearError(field: keyof typeof errors) {
    setErrors((previous) => previous[field] ? { ...previous, [field]: undefined } : previous);
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid work email.';
    if (!team) nextErrors.team = 'Choose a team size to continue.';
    if (!consent) nextErrors.consent = 'Please accept the workspace terms.';
    setErrors(nextErrors);
    setSubmitAttempt((attempt) => attempt + 1);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      onToast('Your workspace request is ready');
    } else setSubmitted(false);
  }
  return (
    <div className="page-content playground-page">
      <PageIntro eyebrow="PATTERNS · FORM PLAYGROUND" title="A complete pattern, not just a field." description="The primitives come together in a realistic workspace signup. Try the validation, choose a plan and submit the form." count="Interactive pattern" />
      <div className="playground-layout"><div className="playground-context"><Badge tone="brand">Forma pattern / 001</Badge><h2>Make space for the next big thing.</h2><p>A considered form helps a new team find its footing. Every field has a label. Every choice has a reason. Every error offers a next step.</p><div className="playground-checklist"><span><Check size={14} /> Native validation patterns</span><span><Check size={14} /> Helpful error messages</span><span><Check size={14} /> Keyboard-first flow</span></div><div className="playground-pattern-note"><span className="pattern-note-mark">f.</span><span><strong>Built with Forma</strong><small>Eight components · one shared language</small></span></div></div>
        <Card className="signup-card"><CardHeader><span className="signup-step"><span>01</span> YOUR WORKSPACE</span><CardTitle>Start with the basics.</CardTitle><CardDescription>Set up your team’s Forma workspace in a few steps.</CardDescription></CardHeader><CardContent><form onSubmit={submit} noValidate className="signup-form">{errorList.length > 0 && <div id="signup-errors" className="error-summary" tabIndex={-1}><Alert tone="danger" title={`Check ${errorList.length} ${errorList.length === 1 ? 'field' : 'fields'} to continue.`}><ul>{errorList.map((item) => <li key={item.id}><button type="button" onClick={() => document.getElementById(item.id)?.focus()}>{item.message}</button></li>)}</ul></Alert></div>}<TextField label="Your name" id="signup-name" placeholder="e.g. Lulamile Mkhungela" autoComplete="name" required value={name} onChange={(event) => { setName(event.target.value); clearError('name'); }} error={errors.name} /><TextField label="Work email" id="signup-email" type="email" placeholder="you@company.com" value={email} onChange={(event) => { setEmail(event.target.value); clearError('email'); }} autoComplete="email" required error={errors.email} hint={!errors.email ? 'A work address helps your team find you.' : undefined} /><SelectField label="Team size" id="signup-team" value={team} onChange={(event) => { setTeam(event.target.value); clearError('team'); }} placeholder="Select a range" required error={errors.team} options={[{ value: 'solo', label: 'Just me' }, { value: '2-5', label: '2–5 people' }, { value: '6-20', label: '6–20 people' }, { value: '21+', label: '21+ people' }]} /><RadioGroup label="Choose a plan" options={[{ value: 'starter', label: 'Starter', description: 'Up to 5 projects.' }, { value: 'studio', label: 'Studio', description: 'Unlimited projects.' }]} value={plan} onValueChange={setPlan} /><label className={`consent-row${errors.consent ? ' consent-row--error' : ''}`}><Checkbox label="I agree to the workspace terms and privacy notice." id="signup-consent" checked={consent} onChange={(event) => { setConsent(event.target.checked); clearError('consent'); }} />{errors.consent && <span className="consent-error">{errors.consent}</span>}</label><Button type="submit" fullWidth trailingIcon={<ArrowRight size={15} />}>Create your workspace</Button><p className="signup-footnote">By continuing, you agree to our <a href="#terms" onClick={(event) => { event.preventDefault(); onToast('Terms of service — demo link'); }}>terms</a> and <a href="#privacy" onClick={(event) => { event.preventDefault(); onToast('Privacy notice — demo link'); }}>privacy notice</a>.</p>{submitted && <div id="signup-success" tabIndex={-1}><Alert tone="success" title="You're all set.">Your workspace invitation is ready. Welcome to Forma.</Alert></div>}</form></CardContent></Card></div>
      <div className="pattern-chips"><span className="pattern-chips__label">Built with</span><button onClick={() => onNavigate('fields')}>TextField</button><button onClick={() => onNavigate('selects')}>SelectField</button><button onClick={() => onNavigate('selection')}>Checkbox</button><button onClick={() => onNavigate('selection')}>RadioGroup</button><button onClick={() => onNavigate('buttons')}>Button</button><button onClick={() => onNavigate('feedback')}>Card</button><button onClick={() => onNavigate('feedback')}>Alert</button><button onClick={() => onNavigate('feedback')}>Badge</button></div>
      <div className="playground-footer"><span><Sparkles size={14} /> Design-system patterns should prove themselves in a real flow.</span><button className="inline-link" onClick={() => { void copyText('Forma pattern checklist — workspace signup\n- Every field has a visible label\n- Hints explain the why; errors say what to do next\n- Validation runs on submit and clears as people fix input\n- One primary action per form\n- Success confirms what happened and what comes next').then((ok) => onToast(ok ? 'Pattern checklist copied' : 'Copy failed in this browser — select the text manually')); }}>Copy pattern checklist <ArrowRight size={13} /></button></div>
    </div>
  );
}

export function ResourcesPage({ onToast }: { onToast: ToastHandler }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All resources');
  const [featured, setFeatured] = useState<Resource | null>(null);
  const filtered = useMemo(() => resources.filter((resource) => {
    const matchesCategory = category === 'All resources' || resource.category === category;
    const terms = `${resource.title} ${resource.description} ${resource.category} ${resource.label ?? ''}`.toLowerCase();
    return matchesCategory && terms.includes(query.trim().toLowerCase());
  }), [category, query]);
  return (
    <div className="page-content resources-page">
      <PageIntro eyebrow="SYSTEM PRACTICE · LIBRARY" title="A shelf full of good starting points." description="A curated library from the design-system community: token tooling, Figma workflows, accessibility, component libraries and the books that shaped the practice." count={`${resources.length} resources`} />
      <Card className="resource-toolbar"><CardContent><label className="resource-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources, tools or topics…" /><kbd>⌘ K</kbd></label><div className="resource-filters"><button className={category === 'All resources' ? 'is-active' : ''} onClick={() => setCategory('All resources')}>All <span>{resources.length}</span></button>{resourceCategories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></CardContent></Card>
      <div className="resource-results-bar"><span>{filtered.length} results</span>{query && <button onClick={() => setQuery('')}>Clear search <span>×</span></button>}</div>
      {filtered.length ? <div className="resource-grid">{filtered.map((resource) => <a key={`${resource.title}-${resource.url}`} href={resource.url} target="_blank" rel="noreferrer" className="resource-card" onClick={() => setFeatured(resource)}><div className="resource-card__top"><span className="resource-kind-icon"><GitBranch size={15} /></span><span className="resource-category">{resource.category}</span><ArrowUpRight size={14} className="resource-open-icon" /></div><h3>{resource.title}</h3><p>{resource.description}</p><div className="resource-card__footer"><Badge tone="neutral">{resource.label ?? 'Resource'}</Badge><span>Visit resource <ExternalLink size={12} /></span></div></a>)}</div> : <div className="empty-resources"><Search size={22} /><h3>No matches yet.</h3><p>Try a different word or browse another category.</p></div>}
      <Card className="resource-footer-card"><CardContent><div className="resource-footer-mark"><Sparkles size={17} /></div><div><span className="eyebrow eyebrow--muted">COMMUNITY OVER COMPETITION</span><h3>Take what works. Make it yours.</h3><p>These links are references, not endorsements. Forma’s decisions should be grounded in your users, your product and your team.</p></div>{featured && <span className="resource-current">Last opened: <b>{featured.title}</b></span>}</CardContent></Card>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, count }: { eyebrow: string; title: string; description: string; count: string }) {
  return <div className="page-intro"><div><div className="eyebrow eyebrow--muted">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><Badge tone="neutral">{count}</Badge></div>;
}
