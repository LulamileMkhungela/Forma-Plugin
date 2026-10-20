import { useMemo, useState } from 'react';
import {
  ArrowRight, BookOpen, Check, Clipboard, Code2, Eye, ExternalLink, FileCode2,
  Palette, PenTool, RefreshCw, Shapes
} from 'lucide-react';
import {
  Accordion, Alert, Avatar, Badge, Button, Card, CardContent, Checkbox, Dialog,
  Progress, RadioGroup, SelectField, Switch, Table, Tabs, TextField, Tooltip,
  type ButtonVariant, type ControlSize
} from '../system';
import { componentHandoff } from '../data/component-handoff';
import { allTokens, cssValue, tokenReference } from '../data/tokens';
import { copyText } from '../data/clipboard';
import { requestTokenSelection } from '../data/searchBridge';
import type { PageId } from '../data/navigation';
import { buttonCode, getCode, type ComponentPageId } from './ComponentPages';

const views = [
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'figma', label: 'Figma', icon: PenTool },
  { id: 'tokens', label: 'Tokens', icon: Palette },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'styles', label: 'Styles', icon: Shapes },
  { id: 'storybook', label: 'Storybook', icon: BookOpen }
] as const;

type ExplorerView = typeof views[number]['id'];

const families = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'fields', label: 'Text fields' },
  { id: 'selects', label: 'Selects' },
  { id: 'selection', label: 'Selection controls' },
  { id: 'feedback', label: 'Feedback & surfaces' }
];

const COPY_FAIL = 'Copy failed in this browser — select the text manually';

/** Where the local Storybook lives: same host, port 6006. Null in a static build. */
function storybookBase(): string | null {
  if (typeof window === 'undefined') return null;
  const { hostname, protocol } = window.location;
  const proxied = hostname.match(/^(\d+)-(.+)$/);
  if (proxied) return `${protocol}//6006-${proxied[2]}`;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:6006';
  return null;
}

/** Mirror Storybook's storyId algorithm so deep links resolve to real stories. */
function storySlug(value: string): string {
  const spaced = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  return spaced.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function storyIdOf(title: string, name: string): string {
  return `${storySlug(title)}--${storySlug(name)}`;
}

function cssFileFor(selector: string): string {
  if (/^\.forma-(radio|tabs|accordion|tooltip|progress|table)/.test(selector)) return 'src/styles/advanced-components.css';
  return 'src/styles/components.css';
}

function ComponentDemo({ id }: { id: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  switch (id) {
    case 'button':
      return <div className="explorer-demo-row"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="tertiary">Tertiary</Button></div>;
    case 'text-field':
      return <div className="explorer-demo-narrow"><TextField label="Work email" type="email" placeholder="you@company.com" hint="We will only use this to contact you." /></div>;
    case 'select':
      return <div className="explorer-demo-narrow"><SelectField label="Team size" placeholder="Select a range" options={[{ value: '1-5', label: '1–5 people' }, { value: '6-20', label: '6–20 people' }]} /></div>;
    case 'checkbox':
      return <Checkbox label="Product updates" description="A thoughtful note when something new ships." />;
    case 'radio-group':
      return <RadioGroup label="Choose a plan" defaultValue="studio" options={[{ value: 'starter', label: 'Starter' }, { value: 'studio', label: 'Studio' }]} />;
    case 'switch':
      return <Switch label="Weekly summary" description="Every Monday morning." defaultChecked />;
    case 'badge':
      return <div className="explorer-demo-row"><Badge tone="success" dot>Published</Badge><Badge>Draft</Badge><Badge tone="warning">In review</Badge></div>;
    case 'avatar':
      return <div className="explorer-demo-row"><Avatar name="Ada Lovelace" size="lg" /><Avatar name="Grace Hopper" /><Avatar name="Alan Turing" size="sm" /></div>;
    case 'card':
      return <Card interactive className="explorer-demo-card"><CardContent><span className="eyebrow eyebrow--muted">CARD</span><b>A composable surface.</b><p>Cards group related content and actions with shared spacing and radius.</p></CardContent></Card>;
    case 'tabs':
      return <Tabs defaultValue="tokens" tabs={[{ id: 'tokens', label: 'Tokens', content: 'Token values and semantic roles.' }, { id: 'code', label: 'Code', content: 'Framework usage examples.' }]} />;
    case 'accordion':
      return <Accordion defaultOpen={['a']} items={[{ id: 'a', title: 'What is Forma?', content: 'A small design system connecting Figma, tokens and code.' }, { id: 'b', title: 'Who is it for?', content: 'Designers, engineers and reviewers.' }]} />;
    case 'dialog':
      return <>
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Invite teammate" description="They will join the workspace with editor access.">
          <div className="explorer-demo-narrow"><TextField label="Work email" type="email" placeholder="you@company.com" /></div>
          <div className="composed-dialog-actions"><Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={() => setDialogOpen(false)}>Send invite</Button></div>
        </Dialog>
      </>;
    case 'alert':
      return <Alert tone="success" title="Your changes are saved.">The new theme is ready for your team.</Alert>;
    case 'progress':
      return <div className="explorer-demo-narrow"><Progress label="Launch readiness" value={68} /></div>;
    case 'tooltip':
      return <Tooltip content="Saved automatically"><Button variant="secondary">Hover me</Button></Tooltip>;
    case 'table':
      return <Table caption="Team members" columns={[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]} rows={[{ name: 'Ada Lovelace', role: 'Design' }, { name: 'Grace Hopper', role: 'Engineering' }]} />;
    default:
      return null;
  }
}

interface ExplorerPageProps {
  onToast: (message: string) => void;
  onNavigate: (page: PageId) => void;
}

export function ExplorerPage({ onToast, onNavigate }: ExplorerPageProps) {
  const [selectedId, setSelectedId] = useState('button');
  const [view, setView] = useState<ExplorerView>('preview');
  const [codeTab, setCodeTab] = useState<'react' | 'angular'>('react');
  const [storyIndex, setStoryIndex] = useState(0);
  const [frameKey, setFrameKey] = useState(0);
  const selected = componentHandoff.find((entry) => entry.id === selectedId) ?? componentHandoff[0];
  const base = useMemo(storybookBase, []);
  const storyName = selected.storyNames[storyIndex] ?? selected.storyNames[0];
  const storyId = storyIdOf(selected.storyTitle, storyName);
  const primaryVariant: ButtonVariant = 'primary';
  const mediumSize: ControlSize = 'md';
  const code = selected.family === 'buttons'
    ? buttonCode(codeTab, primaryVariant, mediumSize, false, false, 'Send invite')
    : getCode(selected.family as ComponentPageId, codeTab);

  const copy = (value: string, message: string) => {
    void copyText(value).then((ok) => onToast(ok ? message : COPY_FAIL));
  };

  const pick = (id: string) => {
    setSelectedId(id);
    setStoryIndex(0);
  };

  return (
    <div className="page-content explorer-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow eyebrow--muted">ONE PAGE · EVERY LENS</div>
          <h1>Explore every component.</h1>
          <p>Pick a component, flip the switch. Preview, Figma, tokens, code, styles and Storybook stay on this page — nothing to install, unless you want to.</p>
        </div>
      </div>

      <ol className="explorer-flow">
        <li><b>1 · Pick</b><span>Choose one of the 16 components.</span></li>
        <li><b>2 · Switch</b><span>Change lens without losing your place.</span></li>
        <li><b>3 · Stay here</b><span>Everything renders on this page.</span></li>
      </ol>

      <div className="explorer-layout">
        <nav className="explorer-picker" aria-label="Choose a component">
          {families.map((family) => (
            <div className="explorer-picker__group" key={family.id}>
              <span>{family.label}</span>
              {componentHandoff.filter((entry) => entry.family === family.id).map((entry) => (
                <button
                  key={entry.id}
                  className={entry.id === selected.id ? 'is-active' : ''}
                  aria-current={entry.id === selected.id ? 'true' : undefined}
                  onClick={() => pick(entry.id)}
                >
                  {entry.name}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <section className="explorer-panel" aria-label={`${selected.name} explorer`}>
          <div className="explorer-switch" role="tablist" aria-label="Explorer lens">
            {views.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={view === id}
                className={view === id ? 'is-active' : ''}
                onClick={() => setView(id)}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {view === 'preview' && (
            <div className="explorer-stage">
              <ComponentDemo id={selected.id} />
              <div className="explorer-foot">
                <span>Live {selected.name} — rendered from the same React exports the guide uses.</span>
                <button className="inline-link" onClick={() => onNavigate(selected.family)}>Full {families.find((f) => f.id === selected.family)?.label.toLowerCase()} playground <ArrowRight size={13} /></button>
              </div>
            </div>
          )}

          {view === 'figma' && (
            <div className="explorer-figma">
              <div className="explorer-figma__grid">
                <Card><CardContent>
                  <span className="eyebrow eyebrow--muted">IN YOUR FIGMA FILE</span>
                  <h3>{selected.figmaSet}</h3>
                  <p>Native component set with variants for its states, bound to Forma variables in Light and Dark modes.</p>
                  <ul className="explorer-checks">
                    <li><Check size={13} /> Generated in the file you choose</li>
                    <li><Check size={13} /> No sync account, no network calls</li>
                    <li><Check size={13} /> Sample library page included</li>
                  </ul>
                  <div className="explorer-actions">
                    <a className="inline-link" href="/downloads/forma-figma-plugin.zip" download>Download plugin <ArrowRight size={13} /></a>
                    <button className="inline-link" onClick={() => onNavigate('figma')}>Full Figma guide <ArrowRight size={13} /></button>
                  </div>
                </CardContent></Card>
                <Card><CardContent>
                  <span className="eyebrow eyebrow--muted">FILE MAP · WHAT THE PLUGIN BUILDS</span>
                  <ul className="explorer-filetree">
                    <li><b>Forma · Primitives</b><small>Variable collection</small></li>
                    <li><b>Forma · Components</b><small>Variable collection</small></li>
                    <li><b>Forma · Semantics</b><small>Collection · Light + Dark</small></li>
                    {componentHandoff.map((entry) => (
                      <li key={entry.id} className={entry.id === selected.id ? 'is-active' : ''}>
                        <button onClick={() => pick(entry.id)}>{entry.figmaSet}</button><small>Component set</small>
                      </li>
                    ))}
                    <li><b>✳ Sample library</b><small>Starter page</small></li>
                  </ul>
                </CardContent></Card>
              </div>
              <figure className="explorer-figure">
                <img src="/images/forma/plugin-cover.png" alt="Forma Figma plugin cover showing the forest and lime component system" />
                <figcaption>Preview of what the offline plugin generates — install is optional, everything on this page is visible now.</figcaption>
              </figure>
              <details className="explorer-install">
                <summary>Optional · install the plugin in Figma</summary>
                <ol>
                  <li>Download and extract <a href="/downloads/forma-figma-plugin.zip" download>forma-figma-plugin.zip</a>.</li>
                  <li>In Figma: Plugins → Development → Import plugin from manifest.</li>
                  <li>Run “Forma Design System”, keep the bundled tokens or load your own DTCG JSON.</li>
                  <li>Build the library in the current file — variables, modes, 16 sets, sample page.</li>
                </ol>
              </details>
            </div>
          )}

          {view === 'tokens' && (
            <div className="explorer-tokens">
              <p className="explorer-lede">The exact token paths behind {selected.name}. Values resolve from the canonical DTCG source.</p>
              <ul className="explorer-token-list">
                {selected.tokenPaths.map((path) => {
                  const token = allTokens.find((entry) => entry.name === path || entry.path.join('.') === path);
                  return (
                    <li key={path}>
                      <code>{`{${path}}`}</code>
                      <b>{token ? String(cssValue(token.value)) : 'Resolves at build time'}</b>
                      {token && <button className="inline-link" onClick={() => copy(tokenReference(token), `${token.name} copied`)}><Clipboard size={13} /> Copy</button>}
                      {token && <button className="inline-link" onClick={() => { requestTokenSelection(token.name); onNavigate('tokens'); }}>Open in explorer <ArrowRight size={13} /></button>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {view === 'code' && (
            <div className="explorer-code">
              <div className="source-tabs">
                <button className={codeTab === 'react' ? 'is-active' : ''} onClick={() => setCodeTab('react')}><Code2 size={14} /> React</button>
                <button className={codeTab === 'angular' ? 'is-active' : ''} onClick={() => setCodeTab('angular')}><FileCode2 size={14} /> Angular</button>
                <button className="copy-code-button" onClick={() => copy(code, `${codeTab === 'react' ? 'React' : 'Angular'} example copied`)}><Clipboard size={14} /> Copy code</button>
              </div>
              <pre className="code-block"><code>{code}</code></pre>
              <div className="explorer-foot">
                <span>Family example · React export <code>{selected.reactExport}</code> · {selected.angularUsage}</span>
                <button className="inline-link" onClick={() => onNavigate('frameworks')}>Framework setup <ArrowRight size={13} /></button>
              </div>
            </div>
          )}

          {view === 'styles' && (
            <div className="explorer-styles">
              <p className="explorer-lede">Shared selectors — React, Angular and native markup all target the same classes.</p>
              <ul className="explorer-token-list">
                {selected.styleSelectors.map((selector) => (
                  <li key={selector}>
                    <code>{selector}</code>
                    <small>{cssFileFor(selector)}</small>
                    <button className="inline-link" onClick={() => copy(selector, `${selector} copied`)}><Clipboard size={13} /> Copy</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {view === 'storybook' && (
            <div className="explorer-storybook">
              <div className="explorer-storybar">
                <div className="explorer-storynames" role="group" aria-label="Stories">
                  {selected.storyNames.map((name, index) => (
                    <button key={name} className={index === storyIndex ? 'is-active' : ''} onClick={() => setStoryIndex(index)}>{name}</button>
                  ))}
                </div>
                <div className="explorer-storyactions">
                  <button className="inline-link" onClick={() => setFrameKey((key) => key + 1)}><RefreshCw size={13} /> Reload</button>
                  {base && <button className="inline-link" onClick={() => copy(`${base}/?path=/story/${storyId}`, 'Story link copied')}><Clipboard size={13} /> Copy link</button>}
                  {base && <a className="inline-link" href={`${base}/?path=/story/${storyId}`} target="_blank" rel="noreferrer">Open in Storybook <ExternalLink size={13} /></a>}
                </div>
              </div>
              {base ? (
                <iframe
                  key={`${storyId}-${frameKey}`}
                  className="explorer-frame"
                  title={`${selected.name} · ${storyName} story`}
                  src={`${base}/iframe.html?id=${storyId}&viewMode=story`}
                  loading="lazy"
                />
              ) : (
                <Card><CardContent>
                  <span className="eyebrow eyebrow--muted">STORYBOOK RUNS LOCALLY</span>
                  <h3>Start the workbench to embed stories here.</h3>
                  <p>One command starts the guide and Storybook together; stories then render inside this page.</p>
                  <div className="explorer-actions">
                    <code>npm run workbench</code>
                    <button className="inline-link" onClick={() => copy('npm run workbench', 'Workbench command copied')}><Clipboard size={13} /> Copy</button>
                  </div>
                </CardContent></Card>
              )}
              <p className="explorer-note">Live from your local Storybook ({selected.storyFile}) — embedded here, or open it externally anytime.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
