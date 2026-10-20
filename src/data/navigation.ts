import {
  Accessibility, Activity, BookOpen, BookOpenText, Braces, CheckSquare2, Clock3, Code2,
  Component, FileText, GitBranch, Home, Layers3, Library, Palette, PenTool, Ruler,
  Shapes, ShieldCheck, Telescope, Type, Workflow
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type PageId =
  | 'overview' | 'workflow' | 'colors' | 'typography' | 'spacing' | 'iconography' | 'motion'
  | 'components' | 'explorer' | 'buttons' | 'fields' | 'selects' | 'selection' | 'feedback'
  | 'playground' | 'figma' | 'tokens' | 'review' | 'frameworks' | 'storybook'
  | 'accessibility' | 'documentation' | 'changelog' | 'resources';

export interface NavigationItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
  badge?: string;
  group?: string;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const navigation: NavigationGroup[] = [
  {
    label: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'workflow', label: 'End-to-end path', icon: Workflow, badge: '6' }
    ]
  },
  {
    label: 'Foundations',
    items: [
      { id: 'colors', label: 'Colour', icon: Palette },
      { id: 'typography', label: 'Typography', icon: Type },
      { id: 'spacing', label: 'Spacing & shape', icon: Ruler },
      { id: 'iconography', label: 'Iconography', icon: Shapes },
      { id: 'motion', label: 'Motion', icon: Activity }
    ]
  },
  {
    label: 'Build',
    items: [
      { id: 'explorer', label: 'Component explorer', icon: Telescope },
      { id: 'components', label: 'Components', icon: Component, badge: '16' },
      { id: 'playground', label: 'Patterns', icon: Workflow }
    ]
  },
  {
    label: 'Design to code',
    items: [
      { id: 'figma', label: 'Figma bridge', icon: PenTool },
      { id: 'tokens', label: 'Design tokens', icon: Braces },
      { id: 'review', label: 'Review lab', icon: ShieldCheck },
      { id: 'frameworks', label: 'Developer handoff', icon: Code2 },
      { id: 'storybook', label: 'Storybook', icon: BookOpen }
    ]
  },
  {
    label: 'Resources',
    items: [
      { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
      { id: 'documentation', label: 'Documentation', icon: BookOpenText },
      { id: 'changelog', label: 'Changelog', icon: Clock3 },
      { id: 'resources', label: 'Resource library', icon: Library }
    ]
  }
];

const hiddenComponentPages: NavigationItem[] = [
  { id: 'buttons', label: 'Buttons', icon: Component, group: 'Components' },
  { id: 'fields', label: 'Text fields', icon: Layers3, group: 'Components' },
  { id: 'selects', label: 'Selects', icon: Layers3, group: 'Components' },
  { id: 'selection', label: 'Selection controls', icon: CheckSquare2, group: 'Components' },
  { id: 'feedback', label: 'Feedback & surfaces', icon: Activity, group: 'Components' }
];

export const pageCatalog: NavigationItem[] = [
  ...navigation.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label }))),
  ...hiddenComponentPages
];

export const pageTitles: Record<PageId, string> = Object.fromEntries(
  pageCatalog.map((item) => [item.id, item.label])
) as Record<PageId, string>;

export const pageIcons: Record<PageId, LucideIcon> = Object.fromEntries(
  pageCatalog.map((item) => [item.id, item.icon])
) as Record<PageId, LucideIcon>;

export function isPageId(value: string): value is PageId {
  return pageCatalog.some((item) => item.id === value);
}
