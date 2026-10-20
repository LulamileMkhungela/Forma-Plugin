import { ArrowRight, BookOpen, Braces, Check, Code2, FileText, PenTool, Palette, Shapes } from 'lucide-react';
import { Badge, Button, Card, CardContent } from '../system';
import { componentHandoff, componentUsageNotes, type ComponentFamily } from '../data/component-handoff';
import type { PageId } from '../data/navigation';
import { copyText } from '../data/clipboard';

const flow = [
  { label: 'Figma set', icon: PenTool, page: 'figma' as const },
  { label: 'Token paths', icon: Braces, page: 'tokens' as const },
  { label: 'Framework code', icon: Code2, page: 'frameworks' as const },
  { label: 'Shared styles', icon: Palette, page: 'frameworks' as const },
  { label: 'Storybook', icon: BookOpen, page: 'storybook' as const },
  { label: 'Usage guide', icon: FileText, page: 'documentation' as const }
];

export function ComponentCoverageIndex({ onNavigate, onToast }: { onNavigate: (page: PageId) => void; onToast: (message: string) => void }) {
  const pageByFamily: Record<ComponentFamily, PageId> = {
    buttons: 'buttons', fields: 'fields', selects: 'selects', selection: 'selection', feedback: 'feedback'
  };
  return (
    <section className="component-coverage" aria-labelledby="component-coverage-title">
      <div className="component-handoff__header">
        <div><span className="eyebrow eyebrow--muted"><Shapes size={12} /> THE COMPLETE COMPONENT MAP</span><h2 id="component-coverage-title">Follow every component across the system.</h2><p>Each row opens its component family. The handoff detail shows the exact plugin set, token paths, framework usage, CSS selectors, Storybook story and guide.</p></div>
        <Badge tone="success" dot>16 of 16 mapped</Badge>
      </div>
      <div className="component-coverage__head" aria-hidden="true"><span>COMPONENT · FIGMA SET</span><span>CONNECTED ARTIFACTS</span><span /></div>
      <div className="component-coverage__rows">{componentHandoff.map((entry, index) => <button className="component-coverage__row" key={entry.id} onClick={() => onNavigate(pageByFamily[entry.family])}>
        <span className="component-coverage__name"><i>{String(index + 1).padStart(2, '0')}</i><span><b>{entry.name}</b><small>Figma set · {entry.figmaSet}</small></span></span>
        <span className="component-coverage__stages"><b>Tokens</b><b>React</b><b>Angular path</b><b>CSS</b><b>Story</b><b>Guide</b></span>
        <ArrowRight size={14} />
      </button>)}</div>
      <div className="component-coverage__foot"><span><Check size={13} /> React exports, shared styles and React Storybook stories cover all 16 plugin sets.</span><span>Angular guidance identifies standalone adapters or native markup + shared CSS.</span></div>
      <div className="component-coverage__action"><button className="inline-link" onClick={() => { void copyText(componentHandoff.map((component) => component.figmaSet).join(', ')).then((ok) => onToast(ok ? '16 Figma set names copied' : 'Copy failed in this browser — select the text manually')); }}>Copy Figma set names</button><Button variant="secondary" onClick={() => onNavigate('workflow')} trailingIcon={<ArrowRight size={13} />}>See what to do next</Button></div>
    </section>
  );
}

export function ComponentHandoff({ family, onNavigate, compact = false }: {
  family?: ComponentFamily;
  onNavigate: (page: PageId) => void;
  compact?: boolean;
}) {
  const entries = family ? componentHandoff.filter((component) => component.family === family) : componentHandoff;
  return (
    <section className={`component-handoff${compact ? ' component-handoff--compact' : ''}`} aria-labelledby={compact ? 'component-handoff-title-compact' : 'component-handoff-title'}>
      <div className="component-handoff__header">
        <div><span className="eyebrow eyebrow--muted"><Shapes size={12} /> TRACE EACH COMPONENT</span><h2 id={compact ? 'component-handoff-title-compact' : 'component-handoff-title'}>{compact ? 'This component’s handoff.' : 'Every set has an implementation trail.'}</h2><p>{compact ? 'Follow the same names from the Figma plugin into tokens, source, styles, stories and usage guidance.' : 'The 16 plugin sets now have named token paths, React exports, shared styles, Storybook stories and component-specific usage notes.'}</p></div>
        {!compact && <Badge tone="success" dot>{entries.length} mapped components</Badge>}
      </div>
      <div className="component-handoff__flow" aria-label="Figma set, tokens, framework code, styles, Storybook and usage guidance">
        {flow.map(({ label, icon: Icon, page }, index) => <span className="component-handoff__flow-item" key={label}><button onClick={() => onNavigate(page)}><Icon size={13} />{label}</button>{index < flow.length - 1 && <i aria-hidden="true" />}</span>)}
      </div>
      <div className="component-handoff__grid">
        {entries.map((entry, index) => <Card className="component-handoff__card" key={entry.id}><CardContent>
          <div className="component-handoff__card-head"><span className="component-handoff__index">{String(index + 1).padStart(2, '0')}</span><div><h3>{entry.name}</h3><span>Figma set · {entry.figmaSet}</span></div><Badge tone="success" size="sm">Mapped</Badge></div>
          <p className="component-handoff__usage">{componentUsageNotes[entry.id]}</p>
          <dl className="component-handoff__details">
            <div><dt>React</dt><dd><code>{entry.reactExport}</code></dd></div>
            <div><dt>Angular</dt><dd>{entry.angularUsage}</dd></div>
            <div><dt>Styles</dt><dd>{entry.styleSelectors.map((selector) => <code key={selector}>{selector}</code>)}</dd></div>
            <div><dt>Storybook</dt><dd><span>{entry.storyTitle}</span><small>{entry.storyNames.join(' · ')}</small><code>{entry.storyFile}</code></dd></div>
            <div><dt>Guideline</dt><dd><code>docs/component-guidelines.md#{entry.guideline}</code></dd></div>
          </dl>
          <div className="component-handoff__tokens"><b>Token paths</b><div>{entry.tokenPaths.map((token) => <code key={token}>{token}</code>)}</div></div>
          <div className="component-handoff__actions"><Button size="sm" variant="tertiary" onClick={() => onNavigate('figma')}>Figma guide <ArrowRight size={12} /></Button><Button size="sm" variant="tertiary" onClick={() => onNavigate('tokens')}>Inspect tokens <ArrowRight size={12} /></Button><Button size="sm" variant="tertiary" onClick={() => onNavigate('storybook')}>Find story <ArrowRight size={12} /></Button><Button size="sm" variant="tertiary" onClick={() => onNavigate('documentation')}>Read guidance <ArrowRight size={12} /></Button></div>
        </CardContent></Card>)}
      </div>
    </section>
  );
}
