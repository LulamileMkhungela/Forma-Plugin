import { ArrowRight, BookOpen, Braces, Check, Code2, FileText, Layers3, PenTool, Workflow } from 'lucide-react';
import { Badge, Button, Card, CardContent } from '../system';
import type { PageId } from '../data/navigation';

interface WorkflowPageProps {
  onNavigate: (page: PageId) => void;
}

const handoffSteps: { number: string; eyebrow: string; title: string; copy: string; action: string; page: PageId; icon: typeof Workflow }[] = [
  { number: '01', eyebrow: 'CHOOSE', title: 'Start with a component', copy: 'Find one of the 16 components in the explorer. Preview, Figma, tokens, code, styles and story stay on one page.', action: 'Open the explorer', page: 'explorer', icon: Layers3 },
  { number: '02', eyebrow: 'DESIGN', title: 'Shape it in Figma', copy: 'Use the offline Forma plugin to create native variables, theme modes and component variants in your file.', action: 'Open Figma guide', page: 'figma', icon: PenTool },
  { number: '03', eyebrow: 'DECIDE', title: 'Keep tokens in sync', copy: 'Inspect the exact semantic and component token paths. The DTCG JSON remains the canonical source.', action: 'Browse token source', page: 'tokens', icon: Braces },
  { number: '04', eyebrow: 'IMPLEMENT', title: 'Build with shared styles', copy: 'Use React exports or the documented Angular adapter/native markup path. Shared CSS keeps the visual language aligned.', action: 'Open developer handoff', page: 'frameworks', icon: Code2 },
  { number: '05', eyebrow: 'VERIFY', title: 'Review the real states', copy: 'Open the component’s Storybook story, test its variants and keyboard behavior, then run the accessibility checks.', action: 'Explore Storybook stories', page: 'storybook', icon: BookOpen },
  { number: '06', eyebrow: 'SHIP', title: 'Apply the usage guidance', copy: 'Use the component-specific do/don’t guidance and accessibility notes before you adapt it to a product flow.', action: 'Read component guidance', page: 'documentation', icon: FileText }
];

const startingPoints = [
  { label: 'I’m designing', text: 'Open the Figma bridge and choose a component set.', page: 'figma' as const, icon: PenTool },
  { label: 'I’m implementing', text: 'Start from a React export or Angular usage example.', page: 'frameworks' as const, icon: Code2 },
  { label: 'I’m reviewing', text: 'Compare variants, focus states and usage notes.', page: 'storybook' as const, icon: BookOpen }
];

export function WorkflowPage({ onNavigate }: WorkflowPageProps) {
  return (
    <div className="page-content workflow-page">
      <div className="page-intro workflow-page__intro">
        <div><div className="eyebrow eyebrow--muted">START HERE · END-TO-END HANDOFF</div><h1>One component. Every step connected.</h1><p>Move a component from its Figma set through tokens, implementation, shared styles, Storybook and usage guidance—without guessing what to open next.</p></div>
        <Badge tone="brand" dot>16 component trails</Badge>
      </div>

      <section className="workflow-hero" aria-labelledby="workflow-hero-title">
        <div className="workflow-hero__copy">
          <span className="eyebrow eyebrow--light"><Workflow size={13} /> FOR DESIGNERS, ENGINEERS & REVIEWERS</span>
          <h2 id="workflow-hero-title">A visible path from<br /><em>design intent to shipped UI.</em></h2>
          <p>Start with the recommended first step or jump to the part of the lifecycle you own. Each component map links its actual Figma set, token paths, code export, CSS selectors, Storybook story and guideline.</p>
          <Button onClick={() => onNavigate('explorer')} trailingIcon={<ArrowRight size={14} />}>Choose a component</Button>
        </div>
        <div className="workflow-hero__trail" aria-label="Figma to production">
          <span><PenTool size={16} /><b>Figma</b></span><i />
          <span><Braces size={16} /><b>Tokens</b></span><i />
          <span><Code2 size={16} /><b>Code + CSS</b></span><i />
          <span><BookOpen size={16} /><b>Storybook</b></span>
        </div>
      </section>

      <section className="workflow-starting-points" aria-label="Choose your starting point">
        <div className="workflow-section-title"><div><span className="eyebrow eyebrow--muted">PICK UP WHERE YOU ARE</span><h2>Choose your starting point.</h2></div><span className="workflow-section-hint">All paths reconnect at the component map.</span></div>
        <div className="workflow-role-grid">{startingPoints.map(({ label, text, page, icon: Icon }) => <button className="workflow-role-card" key={label} onClick={() => onNavigate(page)}><span className="workflow-role-icon"><Icon size={16} /></span><span><b>{label}</b><small>{text}</small></span><ArrowRight size={14} /></button>)}</div>
      </section>

      <section className="workflow-steps-section" aria-labelledby="workflow-steps-title">
        <div className="workflow-section-title"><div><span className="eyebrow eyebrow--muted">THE RECOMMENDED ORDER</span><h2 id="workflow-steps-title">Follow the handoff.</h2><p>Six connected steps. Each one opens the working reference for that stage.</p></div><span className="workflow-step-count"><Check size={13} /> No step is a dead end</span></div>
        <ol className="workflow-steps">{handoffSteps.map(({ number, eyebrow, title, copy, action, page, icon: Icon }) => <li className="workflow-step" key={number}>
          <div className="workflow-step__number">{number}</div>
          <Card className="workflow-step__card"><CardContent>
            <div className="workflow-step__icon"><Icon size={17} /></div>
            <div className="workflow-step__copy"><span className="eyebrow eyebrow--muted">{eyebrow}</span><h3>{title}</h3><p>{copy}</p><button className="inline-link" onClick={() => onNavigate(page)}>{action} <ArrowRight size={13} /></button></div>
          </CardContent></Card>
        </li>)}</ol>
      </section>

      <Card className="workflow-credit-card"><CardContent><span className="workflow-credit-card__mark"><Layers3 size={17} /></span><div><b>Keep the chain unbroken.</b><p>Update the token source, implementation and story together; use the component-specific guidance to review the result. Forma is created by <strong>Lulamile Mkhungela</strong>.</p></div><Button variant="secondary" onClick={() => onNavigate('documentation')} trailingIcon={<ArrowRight size={13} />}>Open documentation</Button></CardContent></Card>
    </div>
  );
}
