import { useMemo, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, Bell, Bookmark, Braces, Check, CircleAlert, CircleCheck,
  CircleHelp, Clipboard, Code2, Compass, Copy, Download, FileCheck2, Fingerprint, Flag,
  Folder, Gauge, Heart, Home, Info, Layers3, Link2, LockKeyhole, Menu, MessageCircle,
  Minus, Moon, MoreHorizontal, MousePointer2, Palette, Plus, Search, Settings2, ShieldCheck,
  Sparkles, Sun, Tag, Timer, Type as TypeIcon, Upload, UserRound, Users, Workflow, X,
  Zap, ZoomIn
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../system';
import {
  allTokens, colorTokens, cssTokenName, cssValue, tokenReference, type TokenRecord
} from '../data/tokens';
import type { PageId } from '../data/navigation';
import { copyText } from '../data/clipboard';

interface FoundationPageProps {
  onToast: (message: string) => void;
  onNavigate: (page: PageId) => void;
}

function copyToken(token: TokenRecord, onToast: (message: string) => void) {
  void copyText(tokenReference(token)).then((ok) => onToast(ok ? `${token.name} copied` : 'Copy failed in this browser — select the text manually'));
}

const paletteNames = ['forest', 'neutral', 'lime', 'blue', 'amber', 'red'];
const themeGroups = ['background', 'text', 'action', 'border', 'focus', 'status'];

export function ColorsPage({ onToast, onNavigate }: FoundationPageProps) {
  const palettes = colorTokens.filter((token) => token.path[0] === 'color');
  const paletteCount = new Set(palettes.map((token) => token.path[1])).size;
  const themeTokens = allTokens.filter((token) => token.path[0] === 'theme' && token.type === 'color');
  return (
    <div className="page-content foundation-page colour-page">
      <PageIntro
        eyebrow="FOUNDATIONS · COLOUR"
        title="A visual language rooted in nature."
        description="Forest greens bring focus, lime adds a lively note, and grounded neutrals keep the interface clear. Semantic roles make every hue work in both themes."
        count={`${paletteCount} palettes · 2 modes`}
      />
      <div className="reference-page-banner colour-banner">
        <span className="reference-banner-mark"><Palette size={18} /></span>
        <p><strong>Colour with a clear job.</strong> Start with the primitive palette for expression; use semantic aliases for interface decisions. Select any swatch to copy its DTCG reference.</p>
        <Badge tone="success" dot>Light + dark</Badge>
      </div>
      {paletteNames.map((family) => {
        const tokens = palettes.filter((token) => token.path[1] === family);
        return (
          <section className="token-section palette-section" key={family}>
            <div className="token-section-heading">
              <div><h2>{capitalize(family)}</h2><p>{paletteDescription(family)}</p></div>
              <span>{tokens.length} steps</span>
            </div>
            <div className={`swatch-grid swatch-grid--${family}`}>
              {tokens.map((token) => <button key={token.name} className="swatch-token" onClick={() => copyToken(token, onToast)} title={`Copy ${tokenReference(token)}`}>
                <span className="swatch-token__color" style={{ backgroundColor: String(token.value) }}><span className="swatch-copy"><Clipboard size={14} /></span></span>
                <span className="swatch-token__info"><b>{token.path.at(-1)}</b><small>{String(token.value).toUpperCase()}</small></span>
              </button>)}
            </div>
          </section>
        );
      })}
      <section className="token-section theme-token-section">
        <div className="token-section-heading">
          <div><h2>Semantic colour</h2><p>One role, two considered appearances. Compare the light and dark values side by side.</p></div>
          <button className="inline-link" onClick={() => onNavigate('tokens')}>Explore all tokens <ArrowRight size={13} /></button>
        </div>
        <div className="theme-comparison-grid">
          {(['light', 'dark'] as const).map((mode) => <Card className={`theme-comparison-card theme-comparison-card--${mode}`} key={mode}>
            <CardHeader><div><span className={`theme-mode-dot theme-mode-dot--${mode}`}>{mode === 'light' ? <Sun size={13} /> : <Moon size={13} />}</span><CardTitle>{capitalize(mode)} mode</CardTitle><CardDescription>Semantic color aliases</CardDescription></div><Badge tone={mode === 'light' ? 'neutral' : 'brand'}>{mode === 'light' ? 'Default' : 'Alternate'}</Badge></CardHeader>
            <CardContent><div className="semantic-role-list">
              {themeGroups.map((group) => {
                const tokens = themeTokens.filter((token) => token.path[1] === mode && token.path[2] === group);
                if (!tokens.length) return null;
                return <div className="semantic-role-group" key={group}><span>{capitalize(group)}</span><div>{tokens.map((token) => <button className="semantic-token" key={token.name} onClick={() => copyToken(token, onToast)} title={`Copy ${tokenReference(token)}`}><span className="semantic-token__preview" style={{ background: String(token.value) }} /><span><b>{token.path.slice(3).join(' / ') || token.path.at(-1)}</b><small>{String(token.value).toUpperCase()}</small></span><Clipboard size={12} /></button>)}</div></div>;
              })}
            </div></CardContent>
          </Card>)}
        </div>
      </section>
      <div className="usage-callout"><div><span className="eyebrow eyebrow--muted">USAGE RULE</span><h3>Prefer meaning over memory.</h3><p>Reach for <code>theme.light.action.primary</code> when you need a primary action, not a hard-coded hex value.</p></div><pre className="mini-code"><code>{`background: var(${cssTokenName('theme-light-action-primary')});`}</code></pre></div>
    </div>
  );
}

export function TypographyPage({ onToast }: Pick<FoundationPageProps, 'onToast'>) {
  const sizeTokens = allTokens.filter((token) => token.path[0] === 'font' && token.path[1] === 'size');
  const weightTokens = allTokens.filter((token) => token.path[0] === 'font' && token.path[1] === 'weight');
  const familyTokens = allTokens.filter((token) => token.path[0] === 'font' && token.path[1] === 'family');
  const lineHeightTokens = allTokens.filter((token) => token.path[0] === 'font' && token.path[1] === 'lineHeight');
  const sansFamily = familyTokens.find((token) => token.path.at(-1) === 'sans')?.value;
  const monoFamily = familyTokens.find((token) => token.path.at(-1) === 'mono')?.value;
  return (
    <div className="page-content foundation-page typography-page">
      <PageIntro eyebrow="FOUNDATIONS · TYPOGRAPHY" title="A clear voice, at every size." description="DM Sans Variable gives Forma its warm, modern voice. DM Mono brings precision to code and token values. A compact scale keeps the hierarchy legible." count={`${sizeTokens.length} sizes · ${weightTokens.length} weights`} />
      <Card className="type-specimen"><CardContent>
        <div className="type-specimen__top"><Badge tone="brand">Display · 56px</Badge><span>font.family.sans · weight 600 · line-height 1.15</span></div>
        <h2 style={{ fontFamily: String(sansFamily), fontSize: 'var(--font-size-display)', lineHeight: 'var(--font-line-height-tight)' }}>Good design.<br />A shared language.</h2>
        <div className="type-specimen__footer"><span>DM Sans Variable · Inter fallback</span><span className="type-specimen__font" style={{ fontFamily: String(monoFamily) }}>Aa&nbsp; 012345</span></div>
      </CardContent></Card>
      <div className="type-layout">
        <section className="type-scale-section"><div className="section-title-row"><div><div className="eyebrow eyebrow--muted">TYPE SCALE</div><h2>Responsive by design.</h2></div><span className="small-muted">9 named sizes</span></div>
          <Card className="type-scale-card">{sizeTokens.map((token) => <div className="type-scale-row" key={token.name}><div className="type-scale-meta"><b>{token.path.at(-1)}</b><small>{cssValue(token.value)}</small></div><span style={{ fontSize: String(token.value), lineHeight: 1.3, fontFamily: String(sansFamily) }} className="type-scale-preview">The quick brown fox</span><button className="icon-button" title={`Copy ${tokenReference(token)}`} onClick={() => copyToken(token, onToast)}><Clipboard size={14} /></button></div>)}</Card>
        </section>
        <Card className="type-guidance-card"><CardHeader><span className="tiny-icon-tile"><TypeIcon size={17} /></span><CardTitle>Type in practice</CardTitle><CardDescription>Structure is a kindness. Give every text style a job.</CardDescription></CardHeader><CardContent>
          <div className="type-guidance-list"><div><b>Display</b><span>One focused statement per page.</span></div><div><b>Heading</b><span>Short, scannable section anchors.</span></div><div><b>Body</b><span>14–16px for most product copy.</span></div><div><b>Label</b><span>12px minimum; never use size alone for hierarchy.</span></div></div>
          <div className="weight-list"><span className="eyebrow eyebrow--muted">WEIGHTS</span>{weightTokens.map((token) => <span key={token.name} style={{ fontWeight: Number(token.value) }}><b>{token.path.at(-1)}</b><small>{String(token.value)}</small></span>)}</div>
          <div className="line-height-list"><span className="eyebrow eyebrow--muted">LINE HEIGHT</span>{lineHeightTokens.map((token) => <span key={token.name}><b>{token.path.at(-1)}</b><small>{String(token.value)}</small></span>)}</div>
        </CardContent></Card>
      </div>
      <div className="reference-page-banner font-banner"><span className="reference-banner-mark"><Code2 size={17} /></span><p><strong>Designed for resilient typography.</strong> DM Sans Variable and DM Mono are declared as the preferred families; the interface uses safe sans-serif and monospace fallbacks when those fonts are not installed.</p><Badge tone="neutral">2 font families</Badge></div>
    </div>
  );
}

export function SpacingPage({ onNavigate, onToast }: FoundationPageProps) {
  const spaces = allTokens.filter((token) => token.path[0] === 'space');
  const radii = allTokens.filter((token) => token.path[0] === 'radius');
  const borderWidths = allTokens.filter((token) => token.path[0] === 'border' && token.path[1] === 'width');
  return (
    <div className="page-content foundation-page spacing-page">
      <PageIntro eyebrow="FOUNDATIONS · SPACING & SHAPE" title="Give everything room to breathe." description="A four-point base scale keeps layouts calm and repeatable. Larger steps create rhythm; consistent radii and border weights keep the details in balance." count={`${spaces.length} spacing steps`} />
      <div className="space-grid">{spaces.map((token) => <Card className="space-tile" key={token.name}><CardContent><div className="space-tile__label"><b>{token.name.split('.').at(-1)}</b><span>{cssValue(token.value)}</span></div><div className="space-visual"><span style={{ width: `min(${Math.max(Number.parseFloat(String(token.value)) * 2, 0)}px, 100%)` }} /></div><div className="space-tile__usage">{spacingUse(Number.parseFloat(String(token.value)))}</div></CardContent></Card>)}</div>
      <div className="shape-grid"><Card><CardHeader><div><div className="eyebrow eyebrow--muted">RADIUS</div><CardTitle>Soft, not sugary.</CardTitle><CardDescription>Pick a radius based on the surface’s role.</CardDescription></div></CardHeader><CardContent><div className="radius-list">{radii.map((token) => <button key={token.name} className="radius-token" onClick={() => copyToken(token, onToast)}><span style={{ borderRadius: String(token.value) }} /><b>{token.path.at(-1)}</b><small>{String(token.value)}</small></button>)}</div></CardContent></Card>
        <Card><CardHeader><div><div className="eyebrow eyebrow--muted">BORDER WIDTH</div><CardTitle>Weight with restraint.</CardTitle><CardDescription>Keep dividers quiet; use the focus width to make keyboard position unmistakable.</CardDescription></div></CardHeader><CardContent><div className="border-width-list">{borderWidths.map((token) => <button className="border-width-token" key={token.name} onClick={() => { void copyText(tokenReference(token)).then((ok) => onToast(ok ? `${token.name} copied` : 'Copy failed in this browser — select the text manually')); }}><span style={{ height: String(token.value), background: 'var(--brand)' }} /><b>{token.path.at(-1)}</b><small>{String(token.value)}</small></button>)}</div></CardContent></Card>
      </div>
      <Card className="spacing-principle-card"><CardContent><span className="reference-banner-mark"><Layers3 size={17} /></span><div><span className="eyebrow eyebrow--muted">A REPEATABLE RHYTHM</span><h3>Build with the scale before inventing a new value.</h3><p>Use <code>space.4</code> for a familiar gap and <code>space.12</code> for a larger section break. The token explorer lists every step and CSS variable.</p></div><Button variant="secondary" size="sm" trailingIcon={<ArrowRight size={14} />} onClick={() => onNavigate('tokens')}>Browse tokens</Button></CardContent></Card>
    </div>
  );
}

export function MotionPage() {
  const [playing, setPlaying] = useState(false);
  const durations = allTokens.filter((token) => token.path[0] === 'motion' && token.path[1] === 'duration');
  const easing = allTokens.filter((token) => token.path[0] === 'motion' && token.path[1] === 'ease');
  return (
    <div className="page-content foundation-page motion-page">
      <PageIntro eyebrow="FOUNDATIONS · MOTION" title="Motion that feels considered." description="Motion is feedback, not decoration. Three durations and one easing curve provide a small, predictable vocabulary for purposeful transitions." count={`${durations.length} durations · ${easing.length} curve`} />
      <Card className="motion-demo-card"><CardContent><div><Badge tone="brand">Live token preview</Badge><h2>Make every transition earn its place.</h2><p>Use quick, quiet movement to confirm an action or bring attention to a meaningful change.</p><Button variant="secondary" size="sm" onClick={() => setPlaying((value) => !value)} leadingIcon={playing ? <X size={15} /> : <Zap size={15} />}>{playing ? 'Reset preview' : 'Play preview'}</Button></div><div className={`motion-stage${playing ? ' is-playing' : ''}`}><div className="motion-orbit" /><span className="motion-demo-dot"><Sparkles size={17} /></span><div className="motion-stage__label"><Timer size={13} /> 180ms · standard</div></div></CardContent></Card>
      <div className="motion-token-grid"><Card><CardHeader><span className="eyebrow eyebrow--muted">DURATION</span><CardTitle>How long</CardTitle><CardDescription>Use the shortest time that still communicates change.</CardDescription></CardHeader><CardContent><div className="motion-token-list">{durations.map((token) => <div className="motion-token-row" key={token.name}><b>{token.path.at(-1)}</b><span>{String(token.value)}</span><i style={{ animationDuration: String(token.value) }} /></div>)}</div></CardContent></Card><Card><CardHeader><span className="eyebrow eyebrow--muted">EASING</span><CardTitle>How it moves</CardTitle><CardDescription>The standard curve keeps movement composed and natural.</CardDescription></CardHeader><CardContent><div className="motion-token-list">{easing.map((token) => <div className="easing-row" key={token.name}><b>{token.path.at(-1)}</b><code>cubic-bezier({cssValue(token.value)})</code></div>)}</div></CardContent></Card></div>
      <div className="reduced-motion-note"><Info size={15} /><span>Always honor <code>prefers-reduced-motion</code>. Non-essential Forma motion is reduced when a visitor asks for less animation.</span></div>
    </div>
  );
}

const iconCatalog = [
  ['Activity', Activity], ['Arrow right', ArrowRight], ['Arrow up right', ArrowUpRight], ['Bell', Bell],
  ['Bookmark', Bookmark], ['Braces', Braces], ['Check', Check], ['Circle alert', CircleAlert],
  ['Circle check', CircleCheck], ['Circle help', CircleHelp], ['Clipboard', Clipboard], ['Code', Code2],
  ['Compass', Compass], ['Copy', Copy], ['Download', Download], ['File check', FileCheck2],
  ['Fingerprint', Fingerprint], ['Flag', Flag], ['Folder', Folder], ['Gauge', Gauge], ['Heart', Heart],
  ['Home', Home], ['Info', Info], ['Layers', Layers3], ['Link', Link2], ['Lock', LockKeyhole],
  ['Menu', Menu], ['Message', MessageCircle], ['Minus', Minus], ['More horizontal', MoreHorizontal],
  ['Mouse pointer', MousePointer2], ['Palette', Palette], ['Plus', Plus], ['Search', Search],
  ['Settings', Settings2], ['Shield check', ShieldCheck], ['Sparkles', Sparkles], ['Sun', Sun],
  ['Moon', Moon], ['Tag', Tag], ['Timer', Timer], ['Type', TypeIcon], ['Upload', Upload],
  ['User', UserRound], ['Users', Users], ['Workflow', Workflow], ['X', X], ['Zap', Zap], ['Zoom in', ZoomIn]
] as const;

export function IconographyPage({ onToast }: Pick<FoundationPageProps, 'onToast'>) {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState(20);
  const icons = useMemo(() => iconCatalog.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <div className="page-content foundation-page iconography-page">
      <PageIntro eyebrow="FOUNDATIONS · ICONOGRAPHY" title="A useful icon, never just decoration." description="Forma uses a consistent line-icon language for navigation, status and small actions. Keep icons legible, pair meaning with a label, and avoid relying on color alone." count={`${iconCatalog.length} Lucide icons`} />
      <Card className="iconography-toolbar"><CardContent><label className="icon-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an icon…" /><kbd>{icons.length} shown</kbd></label><div className="icon-size-control"><span>Preview size</span>{[16, 20, 24].map((value) => <button key={value} className={size === value ? 'is-active' : ''} onClick={() => setSize(value)} aria-pressed={size === value}>{value}</button>)}</div></CardContent></Card>
      <div className="icon-catalog-grid">{icons.map(([name, Icon]) => <button className="icon-catalog-item" key={name} onClick={() => { void copyText(name.replaceAll(' ', '')).then((ok) => onToast(ok ? `${name.replaceAll(' ', '')} copied` : 'Copy failed in this browser — select the text manually')); }} title={`Copy ${name} icon name`}><span><Icon size={size} strokeWidth={1.8} /></span><b>{name}</b><small>Lucide · {size}px</small><Copy size={12} className="icon-copy" /></button>)}</div>
      {!icons.length && <div className="empty-resources"><Search size={20} /><h3>No icons found.</h3><p>Try another name.</p></div>}
      <div className="reference-page-banner"><span className="reference-banner-mark"><ShieldCheck size={17} /></span><p><strong>Make every icon accessible.</strong> Decorative icons are hidden from assistive technology. When an icon communicates an action or status, provide a visible label or a clear accessible name.</p><Badge tone="success">Accessible by intent</Badge></div>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, count }: { eyebrow: string; title: string; description: string; count: string }) {
  return <div className="page-intro"><div><div className="eyebrow eyebrow--muted">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><Badge tone="neutral">{count}</Badge></div>;
}

function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
function paletteDescription(name: string) {
  const descriptions: Record<string, string> = {
    forest: 'The Forma signature, from fresh leaf to deep forest.',
    neutral: 'Warm, grounded surfaces and reliable text.',
    lime: 'A bright accent for focus and contrast.',
    blue: 'Clear, cool information and focus states.',
    amber: 'An attentive note for warnings and cautions.',
    red: 'Direct, thoughtful feedback for errors and danger.'
  };
  return descriptions[name] ?? 'A considered color family.';
}
function spacingUse(value: number) {
  if (value === 0) return 'Reset';
  if (value <= 8) return 'Micro';
  if (value <= 16) return 'Compact';
  if (value <= 32) return 'Default';
  if (value <= 48) return 'Section';
  return 'Page rhythm';
}
