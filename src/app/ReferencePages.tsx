import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bookmark, Braces, Check, CheckCircle2, ChevronDown, Clipboard,
  Download, ExternalLink, FileCheck2, FileText, GitBranch, Info, Keyboard, Link2, LockKeyhole,
  Palette, Search, ShieldCheck, Sparkles, Sun, Moon, Trash2, TriangleAlert, WandSparkles
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../system';
import {
  allTokens, colorTokens, cssTokenName, cssValue, tokenCount, tokenReference, type TokenRecord
} from '../data/tokens';
import { consumePendingTokenSelection, onTokenSelection } from '../data/searchBridge';
import type { PageId } from '../data/navigation';
import { componentHandoff, componentUsageNotes } from '../data/component-handoff';
import { copyText } from '../data/clipboard';

type ToastHandler = (message: string) => void;

const tokenCategories = [
  { id: 'all', label: 'All tokens', match: (_token: TokenRecord) => true },
  { id: 'color', label: 'Colour', match: (token: TokenRecord) => token.type === 'color' },
  { id: 'space', label: 'Spacing', match: (token: TokenRecord) => token.path[0] === 'space' },
  { id: 'shape', label: 'Shape', match: (token: TokenRecord) => ['radius', 'border'].includes(token.path[0] ?? '') },
  { id: 'font', label: 'Typography', match: (token: TokenRecord) => token.path[0] === 'font' },
  { id: 'motion', label: 'Motion', match: (token: TokenRecord) => token.path[0] === 'motion' },
  { id: 'theme', label: 'Themes', match: (token: TokenRecord) => token.path[0] === 'theme' },
  { id: 'component', label: 'Components', match: (token: TokenRecord) => token.path[0] === 'component' }
] as const;

export function TokensPage({ onToast }: { onToast: ToastHandler }) {
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState(() => consumePendingTokenSelection() ?? 'theme.light.action.primary');
  useEffect(() => onTokenSelection((name) => {
    setSelectedName(name);
    setCategory('all');
    setQuery('');
  }), []);
  const selectedToken = allTokens.find((token) => token.name === selectedName) ?? allTokens[0];
  const activeCategory = tokenCategories.find((item) => item.id === category) ?? tokenCategories[0];
  const filteredTokens = useMemo(() => allTokens.filter((token) => {
    const searchText = `${token.name} ${cssTokenName(token)} ${cssValue(token.value)} ${token.description ?? ''}`.toLowerCase();
    return activeCategory.match(token) && searchText.includes(query.trim().toLowerCase());
  }), [activeCategory, query]);
  const copy = (value: string, message: string) => {
    void copyText(value).then((ok) => onToast(ok ? message : 'Copy failed in this browser — select the text manually'));
  };

  return (
    <div className="page-content tokens-page">
      <div className="page-intro"><div><div className="eyebrow eyebrow--muted">DESIGN TO CODE · TOKEN SOURCE</div><h1>One source. Every interface.</h1><p>170 DTCG tokens define Forma’s palette, typography, spacing, component details and light/dark semantic roles. Browse, inspect and copy the same names used in code.</p></div><Badge tone="brand" dot>{tokenCount} DTCG tokens</Badge></div>
      <div className="token-source-banner"><span className="token-source-banner__mark"><Braces size={18} /></span><div><b>Canonical source · <code>tokens/forma.tokens.json</code></b><small>Authored by Lulamile Mkhungela · aliases stay portable across tools.</small></div><div className="token-source-banner__actions"><a href="/tokens/forma.tokens.json" download><Download size={13} /> JSON</a><a href="/tokens/figma-tokens.json" download><Download size={13} /> Tokens Studio</a><a href="/tokens/forma.tokens.css" download><Download size={13} /> CSS</a></div></div>
      <div className="token-workbench">
        <section className="token-browser" aria-label="Browse Forma design tokens">
          <div className="token-browser__top"><div><span className="eyebrow eyebrow--muted">TOKEN EXPLORER</span><h2>Browse the vocabulary.</h2></div><Badge tone="neutral">{filteredTokens.length} shown</Badge></div>
          <label className="token-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names, values or aliases…" /><kbd>⌘ K</kbd></label>
          <div className="token-category-tabs" role="tablist" aria-label="Token categories">{tokenCategories.map((item) => <button key={item.id} className={category === item.id ? 'is-active' : ''} role="tab" aria-selected={category === item.id} onClick={() => setCategory(item.id)}>{item.label}<span>{allTokens.filter(item.match).length}</span></button>)}</div>
          <div className="token-table" role="group" aria-label="Tokens">
            <div className="token-table__head"><span>NAME / TYPE</span><span>VALUE</span><span /></div>
            <div className="token-table__rows">{filteredTokens.map((token) => <button className={`token-table__row${selectedToken.name === token.name ? ' is-selected' : ''}`} aria-current={selectedToken.name === token.name ? true : undefined} key={token.name} onClick={() => setSelectedName(token.name)}>
              <span className="token-table__name">{token.type === 'color' ? <i style={{ background: String(token.value) }} /> : <span className="token-type-icon"><Braces size={12} /></span>}<span><b>{token.name}</b><small>{token.type}</small></span></span>
              <span className="token-table__value">{cssValue(token.value)}</span><span className="token-table__chevron"><ArrowRight size={13} /></span>
            </button>)}</div>
            {!filteredTokens.length && <div className="token-empty"><Search size={20} /><b>No tokens match.</b><span>Try another search or category.</span></div>}
          </div>
          <div className="token-browser__foot"><span><span className="status-dot status-dot--green" /> Synced from the DTCG source</span><span>Sorted by token path</span></div>
        </section>
        <aside className="token-inspector" aria-label="Selected token details">
          {selectedToken && <>
            <div className="token-inspector__head"><span className="eyebrow eyebrow--muted">INSPECT TOKEN</span><span className="token-inspector__head-icon"><Palette size={15} /></span></div>
            <h2>{selectedToken.path.at(-1)}</h2><p className="token-inspector__path">{selectedToken.name}</p>
            <div className={`token-preview${selectedToken.type === 'color' ? ' token-preview--color' : ''}`}>
              {selectedToken.type === 'color' ? <span className="token-preview__swatch" style={{ background: String(selectedToken.value) }} /> : <span className="token-preview__dimension">{cssValue(selectedToken.value)}</span>}
              <span><small>{selectedToken.type}</small><b>{cssValue(selectedToken.value)}</b></span>
            </div>
            <div className="token-inspector__detail"><span>CSS variable</span><code>{cssTokenName(selectedToken)}</code><button onClick={() => copy(cssTokenName(selectedToken), 'CSS variable copied')} aria-label="Copy CSS variable"><Clipboard size={13} /></button></div>
            <div className="token-inspector__detail"><span>DTCG reference</span><code>{tokenReference(selectedToken)}</code><button onClick={() => copy(tokenReference(selectedToken), 'DTCG reference copied')} aria-label="Copy DTCG reference"><Clipboard size={13} /></button></div>
            <div className="token-inspector__snippet"><div><span>CSS</span><button onClick={() => copy(`${cssTokenName(selectedToken)}: ${cssValue(selectedToken.value)};`, 'CSS declaration copied')}><Clipboard size={12} /> Copy</button></div><pre><code>{`:root {\n  ${cssTokenName(selectedToken)}: ${cssValue(selectedToken.value)};\n}`}</code></pre></div>
            <div className="token-inspector__note"><Info size={14} /><span>Theme aliases resolve to the same semantic name in both modes. The value above is the selected source token’s light-mode value.</span></div>
          </>}
        </aside>
      </div>
      <div className="token-footer-note"><span><CheckCircle2 size={15} /></span><p><b>Changes flow from one source.</b> Edit <code>tokens/forma.tokens.json</code>, then run <code>npm run tokens</code> to rebuild CSS, Sass and Tokens Studio exports.</p><span className="token-footer-credit">Created by Lulamile Mkhungela</span></div>
    </div>
  );
}

interface ReviewSnapshot {
  id: string;
  token: string;
  value: string;
  note: string;
  savedAt: string;
}
const snapshotKey = 'forma-review-lab-snapshots-v1';
const reviewTokens = colorTokens.filter((token) => token.path[0] === 'theme' && token.path[1] === 'light');

export function ReviewLabPage({ onToast }: { onToast: ToastHandler }) {
  const [tokenName, setTokenName] = useState('theme.light.action.primary');
  const [draftColor, setDraftColor] = useState('#27563D');
  const [note, setNote] = useState('Check the main action against the neutral surface.');
  const [snapshots, setSnapshots] = useState<ReviewSnapshot[]>(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(snapshotKey) ?? '[]');
      return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === 'string' && typeof item.token === 'string' && typeof item.value === 'string').slice(0, 8) : [];
    } catch { return []; }
  });
  const selectedToken = reviewTokens.find((token) => token.name === tokenName) ?? reviewTokens[0];
  const contrast = contrastRatio(draftColor, '#FAFBF9');
  const status = contrast >= 4.5 ? 'AA pass' : contrast >= 3 ? 'Large text only' : 'Review contrast';
  const hasDraftChange = draftColor.toUpperCase() !== String(selectedToken?.value ?? '').toUpperCase();
  function saveSnapshot() {
    const snapshot: ReviewSnapshot = { id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`, token: tokenName, value: draftColor, note, savedAt: new Date().toISOString() };
    const next = [snapshot, ...snapshots].slice(0, 8);
    setSnapshots(next);
    window.localStorage.setItem(snapshotKey, JSON.stringify(next));
    onToast('Local review snapshot saved');
  }
  function deleteSnapshot(id: string) {
    const next = snapshots.filter((snapshot) => snapshot.id !== id);
    setSnapshots(next);
    window.localStorage.setItem(snapshotKey, JSON.stringify(next));
    onToast('Snapshot removed');
  }
  function selectToken(name: string) {
    setTokenName(name);
    const token = reviewTokens.find((item) => item.name === name);
    if (token?.value && isHex(String(token.value))) setDraftColor(String(token.value));
  }
  return (
    <div className="page-content review-page">
      <div className="page-intro"><div><div className="eyebrow eyebrow--muted">DESIGN TO CODE · REVIEW LAB</div><h1>See the change before it ships.</h1><p>Inspect a semantic token, try a local color adjustment, and save a lightweight review snapshot. Nothing here is uploaded or written back to the source file.</p></div><Badge tone="success" dot>Local to this browser</Badge></div>
      <div className="review-stats-grid"><Card><CardContent><span className="review-stat-icon"><GitBranch size={15} /></span><span className="review-stat-label">Draft changes</span><b>{hasDraftChange ? '01' : '00'}</b><small>{hasDraftChange ? 'Unsaved preview change' : 'Matches the source'}</small></CardContent></Card><Card><CardContent><span className="review-stat-icon review-stat-icon--amber"><ShieldCheck size={15} /></span><span className="review-stat-label">Contrast check</span><b>{contrast.toFixed(1)}:1</b><small>{status} · on canvas</small></CardContent></Card><Card><CardContent><span className="review-stat-icon review-stat-icon--blue"><Bookmark size={15} /></span><span className="review-stat-label">Saved snapshots</span><b>{String(snapshots.length).padStart(2, '0')} <small>/ 08</small></b><small>Stored in this browser</small></CardContent></Card><Card><CardContent><span className="review-stat-icon review-stat-icon--green"><LockKeyhole size={15} /></span><span className="review-stat-label">Source status</span><b>Untouched</b><small>Changes stay in the preview</small></CardContent></Card></div>
      <div className="review-layout">
        <Card className="review-editor-card"><CardHeader><div><span className="eyebrow eyebrow--muted">TOKEN INSPECTOR</span><CardTitle>Try a colour decision.</CardTitle><CardDescription>Pick a light semantic color, change its preview value, and compare the state.</CardDescription></div><span className="review-editor-badge"><span /> Draft only</span></CardHeader><CardContent>
          <label className="review-control-label">Semantic token<select value={tokenName} onChange={(event) => selectToken(event.target.value)}>{reviewTokens.map((token) => <option value={token.name} key={token.name}>{token.name}</option>)}</select><ChevronDown size={14} /></label>
          <div className="review-color-control"><label className="review-color-picker"><input type="color" value={isHex(draftColor) ? draftColor : '#27563D'} onChange={(event) => setDraftColor(event.target.value.toUpperCase())} aria-label="Choose a preview color" /><span>Draft value</span><b>{draftColor.toUpperCase()}</b></label><button className="review-reset" onClick={() => selectToken(tokenName)}><span>{String(selectedToken?.value ?? '#27563D')}</span><ArrowUpRight size={13} /> Reset</button></div>
          <label className="review-control-label review-note-label">Review note<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="What should reviewers look for?" /></label>
          <div className="review-actions"><Button onClick={saveSnapshot} leadingIcon={<Bookmark size={14} />}>Save snapshot</Button><Button variant="secondary" onClick={() => { void copyText(`${tokenReference(selectedToken)} → ${draftColor}`).then((ok) => onToast(ok ? 'Review note copied' : 'Copy failed in this browser — select the text manually')); }} leadingIcon={<Clipboard size={14} />}>Copy for review</Button></div>
          <div className="review-privacy-note"><LockKeyhole size={13} /> Snapshots use localStorage in this browser only. Clear browser storage to remove them.</div>
        </CardContent></Card>
        <div className="review-preview-column"><Card className="review-preview-card"><CardHeader><div><span className="eyebrow eyebrow--muted">COMPONENT PREVIEW</span><CardTitle>Primary action in context</CardTitle></div><Badge tone={contrast >= 4.5 ? 'success' : 'warning'} dot>{status}</Badge></CardHeader><CardContent><div className="review-ui-preview" style={{ '--review-accent': draftColor } as React.CSSProperties}>
          <div className="review-ui-preview__top"><span className="review-ui-mark">f.</span><span><i /> Workspace ready</span></div><h3>Make good things<br />together.</h3><p>A friendly invitation, with one clear next step.</p><div className="review-ui-input"><span>Work email</span><b>you@company.com</b></div><button className="review-ui-action">Create workspace <ArrowRight size={13} /></button><div className="review-ui-preview__foot"><span>Forma · component preview</span><span>{contrast.toFixed(1)}:1</span></div>
          </div><div className="review-swatch-row"><span style={{ background: draftColor }} /><div><b>{tokenReference(selectedToken)}</b><small>{draftColor.toUpperCase()} · preview override</small></div><span className="review-contrast-tag">{status}</span></div></CardContent></Card><img className="review-reference-image" src="/images/forma/review-lab.png" alt="Reference screenshot of the Forma design-system review lab" /></div>
      </div>
      <Card className="review-snapshot-card"><CardHeader><div><span className="eyebrow eyebrow--muted">REVIEW SNAPSHOTS</span><CardTitle>Keep the decision close to the work.</CardTitle><CardDescription>Saved drafts can be revisited while this browser’s local data remains available.</CardDescription></div><Badge tone="neutral">{snapshots.length} / 8 saved</Badge></CardHeader><CardContent>{snapshots.length ? <div className="review-snapshot-list">{snapshots.map((snapshot) => <div className="review-snapshot-row" key={snapshot.id}><span className="review-snapshot-swatch" style={{ background: snapshot.value }} /><div><b>{snapshot.token}</b><small>{snapshot.value} · {snapshot.note || 'No review note'}</small></div><time dateTime={snapshot.savedAt}>{new Date(snapshot.savedAt).toLocaleDateString()}</time><button onClick={() => deleteSnapshot(snapshot.id)} aria-label={`Remove snapshot for ${snapshot.token}`}><Trash2 size={13} /></button></div>)}</div> : <div className="review-empty"><span><Bookmark size={18} /></span><b>No snapshots saved yet.</b><p>Save the current token decision to keep a local review note.</p><button className="inline-link" onClick={saveSnapshot}>Save first snapshot <ArrowRight size={13} /></button></div>}</CardContent></Card>
      <div className="reference-page-banner review-boundary"><span className="reference-banner-mark"><Info size={17} /></span><p><strong>Review, don’t silently mutate.</strong> Draft colors are for local exploration only; the canonical JSON, generated CSS and Figma library remain unchanged until someone intentionally edits the source and rebuilds.</p><Badge tone="neutral">No network sync</Badge></div>
    </div>
  );
}

export function AccessibilityPage({ onToast }: { onToast: ToastHandler }) {
  const [foreground, setForeground] = useState('#27563D');
  const [background, setBackground] = useState('#FAFBF9');
  const ratio = contrastRatio(foreground, background);
  const meetsNormal = ratio >= 4.5;
  const meetsLarge = ratio >= 3;
  return (
    <div className="page-content accessibility-page">
      <div className="page-intro"><div><div className="eyebrow eyebrow--muted">RESOURCES · ACCESSIBILITY</div><h1>Make the inclusive path the easy one.</h1><p>Accessibility lives in the details: semantic names, keyboard focus, readable contrast and motion choices that respect people’s preferences.</p></div><Badge tone="success" dot>Built into the workflow</Badge></div>
      <div className="accessibility-hero"><div><span className="eyebrow eyebrow--light"><ShieldCheck size={13} /> REVIEW IN CONTEXT</span><h2>Accessible by default.<br /><span>Verified in the real interface.</span></h2><p>Forma’s components use native HTML controls, visible labels and a shared focus treatment. This quick contrast check is a useful signal—not a substitute for testing a complete interface.</p><div className="accessibility-hero__meta"><span><Check size={13} /> Keyboard operable</span><span><Check size={13} /> Reduced-motion aware</span><span><Check size={13} /> Accessible names</span></div></div><img src="/images/forma/colour.png" alt="Reference palette with semantic light and dark colors" /></div>
      <div className="accessibility-grid"><Card className="contrast-tool-card"><CardHeader><div><span className="eyebrow eyebrow--muted">CONTRAST QUICK CHECK</span><CardTitle>Test a foreground and background.</CardTitle><CardDescription>Contrast ratios use the WCAG relative-luminance formula for the selected hex colors.</CardDescription></div><span className="contrast-tool-icon"><Palette size={16} /></span></CardHeader><CardContent><div className="contrast-controls"><label>Text color<input type="color" value={foreground} onChange={(event) => setForeground(event.target.value.toUpperCase())} /><code>{foreground.toUpperCase()}</code></label><label>Surface color<input type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /><code>{background.toUpperCase()}</code></label></div><div className="contrast-preview" style={{ color: foreground, backgroundColor: background }}><span>Preview text</span><strong>Readable by design.</strong><small>The quick brown fox jumps over the lazy dog.</small></div><div className="contrast-results"><div className={meetsNormal ? 'is-pass' : 'is-review'}><b>{ratio.toFixed(2)}:1</b><span>Contrast ratio</span></div><div className={meetsNormal ? 'is-pass' : 'is-review'}><CheckCircle2 size={15} /><span>Normal text<br /><b>{meetsNormal ? 'Meets 4.5:1' : 'Needs 4.5:1'}</b></span></div><div className={meetsLarge ? 'is-pass' : 'is-review'}><CheckCircle2 size={15} /><span>Large text<br /><b>{meetsLarge ? 'Meets 3:1' : 'Needs 3:1'}</b></span></div></div><div className="contrast-tool-note"><TriangleAlert size={14} /> Check focus indicators, disabled states, imagery and text at actual sizes in the context where they appear.</div></CardContent></Card>
        <Card className="accessibility-checklist-card"><CardHeader><div><span className="eyebrow eyebrow--muted">A SMALL REVIEW CHECKLIST</span><CardTitle>Four practical questions.</CardTitle><CardDescription>Use these on every interface change, not only on component release day.</CardDescription></div></CardHeader><CardContent><div className="a11y-check-list"><div><span><Keyboard size={15} /></span><div><b>Can I do it without a pointer?</b><p>Tab through controls in a logical order. Confirm focus stays visible.</p></div></div><div><span><Info size={15} /></span><div><b>Does the label explain the control?</b><p>Keep names persistent. Make errors specific and tell people what to do.</p></div></div><div><span><Palette size={15} /></span><div><b>Does it work without color?</b><p>Pair status color with clear copy, an icon or another visual cue.</p></div></div><div><span><Moon size={15} /></span><div><b>Does motion respect preferences?</b><p>Reduce non-essential movement when reduced motion is requested.</p></div></div></div><button className="inline-link" onClick={() => { void copyText('Forma accessibility review\n1. Can I do it without a pointer? Tab order is logical and focus stays visible.\n2. Does the label explain the control? Names persist; errors are specific.\n3. Does it work without color? Status pairs color with copy or icon.\n4. Does motion respect preferences? Non-essential movement reduces with prefers-reduced-motion.').then((ok) => onToast(ok ? 'Accessibility review checklist copied' : 'Copy failed in this browser — select the text manually')); }}><Clipboard size={13} /> Copy checklist <ArrowRight size={13} /></button></CardContent></Card></div>
      <div className="accessibility-footer"><span><FileCheck2 size={15} /></span><p><b>Conformance is contextual.</b> A passing color ratio is only one part of accessibility. Validate complete flows with assistive technology and people with diverse access needs.</p><Badge tone="neutral">Human review matters</Badge></div>
    </div>
  );
}

export function DocumentationPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const links: { id: PageId; eyebrow: string; title: string; description: string; icon: typeof FileText }[] = [
    { id: 'tokens', eyebrow: 'SOURCE & EXPORTS', title: 'Tokens', description: 'Inspect all 170 values and download the DTCG, Tokens Studio or CSS export.', icon: Braces },
    { id: 'figma', eyebrow: 'DESIGN WORKFLOW', title: 'Figma bridge', description: 'Download the ready-to-import offline plugin and build native variables and sets.', icon: Palette },
    { id: 'frameworks', eyebrow: 'ENGINEERING', title: 'Developer handoff', description: 'Use all React exports, the core Angular adapters or native markup with shared CSS.', icon: Link2 },
    { id: 'storybook', eyebrow: 'COMPONENT REVIEW', title: 'Storybook', description: 'Find actual stories for all 16 component sets, with accessibility checks enabled.', icon: FileCheck2 },
    { id: 'review', eyebrow: 'DESIGN QA', title: 'Review lab', description: 'Explore a local token draft and save browser-only review snapshots.', icon: ShieldCheck },
    { id: 'resources', eyebrow: 'COMMUNITY', title: 'Resource library', description: 'Browse references for design systems, tokens, accessibility and tooling.', icon: GitBranch }
  ];
  return (
    <div className="page-content documentation-page">
      <div className="page-intro"><div><div className="eyebrow eyebrow--muted">RESOURCES · DOCUMENTATION</div><h1>Everything you need to get moving.</h1><p>A practical guide to the Forma source, design workflow and implementation paths. Start with the foundations, then follow the handoff that fits your team.</p></div><Badge tone="neutral">Forma v1.0.0</Badge></div>
      <div className="documentation-hero"><div><span className="eyebrow eyebrow--light"><Sparkles size={13} /> THE FORMA WAY</span><h2>One shared language.<br /><span>Open to your team.</span></h2><p>Forma is a small design system by Lulamile Mkhungela. Keep the source of truth portable, keep implementation choices practical, and make room for your product’s context.</p><span className="documentation-credit">Created by <b>Lulamile Mkhungela</b> · MIT licensed</span></div><img src="/images/forma/overview.png" alt="Forma design-system workspace overview" /></div>
      <div className="documentation-link-grid">{links.map(({ id, eyebrow, title, description, icon: Icon }) => <button className="documentation-link-card" key={id} onClick={() => onNavigate(id)}><span className="documentation-link-icon"><Icon size={17} /></span><span className="eyebrow eyebrow--muted">{eyebrow}</span><b>{title}</b><p>{description}</p><span className="documentation-link-card__go">Open guide <ArrowRight size={13} /></span></button>)}</div>
      <Card className="documentation-component-guide"><CardContent><span className="documentation-component-guide__icon"><FileText size={16} /></span><div><span className="eyebrow eyebrow--muted">COMPONENT-BY-COMPONENT USAGE</span><h3>Know what to do next for every component.</h3><p>Each of the 16 Figma sets has a practical usage note, linked token paths, implementation style, Storybook story and accessibility reminder in the component handoff map.</p></div><Button variant="secondary" onClick={() => onNavigate('components')} trailingIcon={<ArrowRight size={13} />}>Open component map</Button></CardContent></Card>
      <section className="documentation-component-guides" aria-labelledby="documentation-guides-title">
        <div className="documentation-component-guides__head"><div><span className="eyebrow eyebrow--muted">THE COMPONENT USAGE GUIDE</span><h2 id="documentation-guides-title">Sixteen components. Clear intent.</h2><p>Open a component to see when to use it, the shared tokens, code and style references, and its real Storybook story.</p></div><Badge tone="brand">{componentHandoff.length} guides</Badge></div>
        <div className="documentation-component-guides__list">{componentHandoff.map((entry) => <details className="documentation-guide-item" id={`guideline-${entry.id}`} key={entry.id}>
          <summary><span><b>{entry.name}</b><small>Figma set · {entry.figmaSet} · React <code>{entry.reactExport}</code></small></span><ArrowRight size={14} /></summary>
          <div className="documentation-guide-item__body"><p>{componentUsageNotes[entry.id]}</p>
            <div className="documentation-guide-facts"><div><b>Token paths</b><span>{entry.tokenPaths.map((token) => <code key={token}>{token}</code>)}</span></div><div><b>Shared styles</b><span>{entry.styleSelectors.map((selector) => <code key={selector}>{selector}</code>)}</span></div><div><b>Angular usage</b><span>{entry.angularUsage}</span></div><div><b>Storybook</b><span>{entry.storyTitle} · {entry.storyNames.join(' · ')}<code>{entry.storyFile}</code></span></div></div>
            <button className="inline-link" onClick={() => onNavigate('components')}>Open full component handoff <ArrowRight size={13} /></button>
          </div>
        </details>)}</div>
      </section>
      <div className="documentation-principles"><div><span>01</span><b>Names carry intent.</b><p>Use semantic tokens for roles; reserve primitive values for building the palette.</p></div><div><span>02</span><b>Prefer portable foundations.</b><p>JSON and CSS keep the design contract usable across tools and frameworks.</p></div><div><span>03</span><b>Credit the maker.</b><p>Preserve Lulamile Mkhungela’s authorship when you adapt or share Forma.</p></div></div>
    </div>
  );
}

export function ChangelogPage() {
  return (
    <div className="page-content changelog-page">
      <div className="page-intro"><div><div className="eyebrow eyebrow--muted">RESOURCES · CHANGELOG</div><h1>A small record of what changed.</h1><p>Forma evolves through reviewed, versioned decisions. This page records the current public release in a human-readable way.</p></div><Badge tone="success" dot>Current · v1.0.0</Badge></div>
      <div className="changelog-timeline"><div className="changelog-release"><div className="changelog-release__marker"><span /></div><div className="changelog-release__meta"><Badge tone="brand">Latest</Badge><span>Forma v1.0.0</span><small>Initial design-system release</small></div><Card className="changelog-release-card"><CardHeader><div><span className="eyebrow eyebrow--muted">A SHARED FOUNDATION</span><CardTitle>The Forma system arrives.</CardTitle><CardDescription>Created by Lulamile Mkhungela, Forma connects a portable token source to a Figma plugin and framework-ready interfaces.</CardDescription></div><span className="changelog-release-icon"><Sparkles size={17} /></span></CardHeader><CardContent><div className="changelog-change-list"><div><span className="change-kind change-kind--new">New</span><p><b>170 DTCG tokens</b> — forest, neutral and lime palettes; typography, spacing, component values, and semantic Light / Dark roles.</p></div><div><span className="change-kind change-kind--new">New</span><p><b>Figma bridge</b> — local plugin for native variables, 16 component sets, sample patterns and placement review.</p></div><div><span className="change-kind change-kind--new">New</span><p><b>React + Angular</b> — shared design variables and accessible form primitives, documented alongside Storybook stories.</p></div><div><span className="change-kind change-kind--polish">Polish</span><p><b>Developer handoff</b> — generated CSS, Sass and Tokens Studio exports from the canonical JSON source.</p></div></div><div className="changelog-release__foot"><span><span className="status-dot status-dot--green" /> By Lulamile Mkhungela</span><span>MIT licensed · Open for adaptation</span></div></CardContent></Card></div></div>
      <div className="changelog-note"><Info size={15} /><span>When you make changes, update the token source, regenerate exports, and add an entry describing the user-facing effect—not only the files touched.</span></div>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, count }: { eyebrow: string; title: string; description: string; count: string }) {
  return <div className="page-intro"><div><div className="eyebrow eyebrow--muted">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><Badge tone="neutral">{count}</Badge></div>;
}

function contrastRatio(colorA: string, colorB: string): number {
  const luminance = (color: string) => {
    const hex = color.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return 0;
    const channels = [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const [lighter, darker] = [luminance(colorA), luminance(colorB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}
function isHex(value: string) { return /^#[0-9a-fA-F]{6}$/.test(value); }
