import { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BookOpen, Braces, Check, Code2, Component, FileText, Moon, PenTool,
  Sparkles, Sun, Layers3
} from 'lucide-react';
import { Badge, Button, Card, CardContent, TextField } from '../system';
import { allTokens, tokenCount } from '../data/tokens';
import type { PageId } from '../data/navigation';

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
  onToast: (message: string) => void;
}

const getToken = (name: string) => String(allTokens.find((token) => token.name === name)?.value ?? '');
const essentials = [
  { id: 'colors' as const, number: '01', label: 'COLOUR', title: 'Colour with purpose.', copy: 'Expressive. Semantic. Accessible.', icon: <Sparkles size={14} />, samples: [
    { name: 'Forest', token: 'color.forest.700' }, { name: 'Sage', token: 'color.forest.200' }, { name: 'Lime', token: 'color.lime.300' }, { name: 'Honey', token: 'color.amber.200' }, { name: 'Ink', token: 'color.neutral.950' }
  ] },
  { id: 'typography' as const, number: '02', label: 'TYPOGRAPHY', title: 'A little character.', copy: 'A considered scale. A clear hierarchy.', icon: <span className="overview-type-mark">T</span> },
  { id: 'spacing' as const, number: '03', label: 'SPACING & SHAPE', title: 'Room to breathe.', copy: 'A 4px rhythm. Shapes that belong.', icon: <Layers3 size={14} />, samples: ['space.2', 'space.4', 'space.6', 'space.8', 'space.12'] }
];

export function OverviewPage({ onNavigate, onToast }: OverviewPageProps) {
  const [demoTheme, setDemoTheme] = useState<'light' | 'dark'>('light');
  const [email, setEmail] = useState('');
  const metricCards = [
    { value: '16', label: 'Core components', icon: <Component size={16} />, action: () => onNavigate('components') },
    { value: String(tokenCount), label: 'Design tokens', icon: <Braces size={16} />, action: () => onNavigate('tokens') },
    { value: '02', label: 'Frameworks', icon: <Code2 size={16} />, action: () => onNavigate('frameworks') },
    { value: '02', label: 'Theme modes', icon: <Sun size={16} />, action: () => onNavigate('colors') }
  ];

  return (
    <div className="page-content overview-page">
      <section className="overview-intro">
        <div className="overview-intro__copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> DESIGN WITH INTENTION. BUILD WITH CONFIDENCE.</div>
          <h1>One system.<br />Infinite possibilities.</h1>
          <p>A shared language for beautiful, thoughtful products.<br className="overview-desktop-break" /> From the first pixel to the final line of code.</p>
          <div className="overview-hero-actions"><Button onClick={() => onNavigate('workflow')} trailingIcon={<ArrowRight size={14} />}>Start the end-to-end path</Button><Button variant="secondary" onClick={() => onNavigate('components')} trailingIcon={<ArrowUpRight size={13} />}>Browse components</Button></div>
          <div className="overview-byline"><span className="overview-byline__avatar">LM</span><span>Designed &amp; created by <strong>Lulamile Mkhungela</strong></span></div>
        </div>
        <div className="overview-hero-art"><img src="/images/forma/overview-art.png" alt="Forma’s forest-green and lime modular design mark" /></div>
      </section>

      <section className="overview-metrics" aria-label="Forma system at a glance">{metricCards.map((metric) => <button key={metric.label} className="overview-metric" onClick={metric.action}><span className="overview-metric__icon">{metric.icon}</span><span className="overview-metric__copy"><b>{metric.value}</b><small>{metric.label}</small></span></button>)}</section>

      <section className="overview-next-step" aria-labelledby="overview-next-step-title">
        <div className="overview-next-step__copy"><span className="eyebrow eyebrow--muted">WHAT NEXT?</span><h2 id="overview-next-step-title">Start with one component.</h2><p>Every component now has a visible route from its Figma set through tokens, code, styles, Storybook and usage guidance.</p><button className="inline-link" onClick={() => onNavigate('workflow')}>Open the guided lifecycle <ArrowRight size={13} /></button></div>
        <div className="overview-next-step__trail" aria-label="Figma, tokens, code and styles, Storybook, usage guidance">
          <button onClick={() => onNavigate('figma')}><PenTool size={14} /><span>Figma</span></button><i />
          <button onClick={() => onNavigate('tokens')}><Braces size={14} /><span>Tokens</span></button><i />
          <button onClick={() => onNavigate('frameworks')}><Code2 size={14} /><span>Code + styles</span></button><i />
          <button onClick={() => onNavigate('storybook')}><BookOpen size={14} /><span>Storybook</span></button><i />
          <button onClick={() => onNavigate('documentation')}><FileText size={14} /><span>Guidance</span></button>
        </div>
      </section>

      <section className="overview-essentials">
        <div className="overview-section-heading"><div><h2>Start with the essentials</h2><p>The small details that make the whole feel right.</p></div><button className="inline-link" onClick={() => onNavigate('colors')}>Explore foundations <ArrowRight size={13} /></button></div>
        <div className="overview-essential-grid">
          {essentials.map((item) => <button className={`overview-essential-card overview-essential-card--${item.id}`} key={item.id} onClick={() => onNavigate(item.id)}>
            <div className="overview-essential-card__top"><span>{item.icon}<b>{item.number} / {item.label}</b></span><ArrowUpRight size={13} /></div>
            {item.id === 'colors' && <div className="overview-palette-samples">{item.samples?.map((sample) => <span className="overview-palette-sample" key={sample.token}><i style={{ background: getToken(sample.token) }} /><small>{sample.name}</small></span>)}</div>}
            {item.id === 'typography' && <div className="overview-type-sample"><strong>Aa</strong><span><b>DM Sans</b><small>A voice for every moment.<br />A considered hierarchy.</small></span></div>}
            {item.id === 'spacing' && <div className="overview-space-samples">{item.samples?.map((token) => <span key={token}><i style={{ width: `min(${Number.parseFloat(getToken(token)) * 1.1}px, 48px)`, height: `min(${Number.parseFloat(getToken(token)) * 1.1}px, 48px)` }} /><small>{Number.parseFloat(getToken(token))}</small></span>)}</div>}
            <div className="overview-essential-card__foot"><b>{item.title}</b><small>{item.copy}</small></div>
          </button>)}
        </div>
      </section>

      <section className="overview-library-section">
        <div className="overview-section-heading"><div><h2>Not just a pretty library</h2><p>Real components. Ready to become something useful.</p></div><button className="inline-link" onClick={() => onNavigate('components')}>View all 16 components <ArrowRight size={13} /></button></div>
        <div className="overview-showcase-grid">
          <Card className={`overview-playground-card${demoTheme === 'dark' ? ' is-dark' : ''}`}><CardContent>
            <div className="overview-playground-head"><span><i /> A little playground</span><div className="overview-theme-toggle"><button className={demoTheme === 'light' ? 'is-active' : ''} onClick={() => setDemoTheme('light')}><Sun size={11} /> Light</button><button className={demoTheme === 'dark' ? 'is-active' : ''} onClick={() => setDemoTheme('dark')}><Moon size={11} /> Dark</button></div></div>
            <div className="overview-playground-body"><div className="overview-playground-actions"><span className="overview-field-label">ACTIONS</span><div><Button size="sm" onClick={() => onToast('The primary action is ready')} trailingIcon={<ArrowRight size={12} />}>Create project</Button><Button size="sm" variant="secondary" onClick={() => { setEmail(''); onToast('Preview reset'); }}>Cancel</Button><Badge tone="success" dot>Ready to build</Badge></div></div><div className="overview-project-field"><TextField label="Project name" className="overview-field" placeholder="Something great..." value={email} onChange={(event) => setEmail(event.target.value)} /></div></div>
            <div className="overview-playground-foot"><span><Check size={12} /> Native, accessible controls</span><button onClick={() => onNavigate('playground')}>Open form playground <ArrowRight size={12} /></button></div>
          </CardContent></Card>
          <Card className="overview-delivery-card"><CardContent><span className="eyebrow eyebrow--muted"><Sparkles size={12} /> FROM DESIGN TO DELIVERY</span><h3>Same language.<br />Every step of the way.</h3><p>Tokens travel with the work—no translation lost in the middle.</p><div className="overview-delivery-steps"><button onClick={() => onNavigate('figma')} title="Figma bridge"><PenTool size={15} /></button><span /><button onClick={() => onNavigate('tokens')} title="Design tokens"><Braces size={15} /></button><span /><button onClick={() => onNavigate('frameworks')} title="React and Angular"><Code2 size={15} /></button><span /><button className="overview-delivery-storybook" onClick={() => onNavigate('storybook')} title="Storybook"><BookOpen size={15} /></button></div><button className="overview-delivery-link" onClick={() => onNavigate('figma')}>Explore the handoff <ArrowRight size={13} /></button></CardContent></Card>
        </div>
      </section>
      <div className="overview-credit-note"><span><Sparkles size={14} /></span><p><strong>Made to be shared.</strong> Forma is created by Lulamile Mkhungela and released under the MIT License.</p><button onClick={() => onNavigate('documentation')}>How to get started <ArrowRight size={13} /></button></div>
    </div>
  );
}
