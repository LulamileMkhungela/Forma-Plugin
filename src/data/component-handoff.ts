export type ComponentFamily = 'buttons' | 'fields' | 'selects' | 'selection' | 'feedback';

export interface ComponentHandoff {
  id: string;
  name: string;
  family: ComponentFamily;
  figmaSet: string;
  reactExport: string;
  angularUsage: string;
  tokenPaths: string[];
  styleSelectors: string[];
  storyTitle: string;
  storyNames: string[];
  storyFile: string;
  guideline: string;
}

/**
 * The source-of-truth map for every native Figma component set. Keep links here
 * aligned with src/figma-plugin/main.ts, tokens/forma.tokens.json,
 * src/system/*.stories.tsx and src/styles/*.css.
 *
 * The downloadable plugin package ships the author's supplied project verbatim from
 * figma-plugin/, so the descriptions it writes onto Figma component sets follow that
 * project's layout rather than the paths mapped here.
 */
export const componentHandoff: ComponentHandoff[] = [
  {
    id: 'button', name: 'Button', family: 'buttons', figmaSet: 'Button', reactExport: 'Button',
    angularUsage: '<forma-button> standalone adapter',
    tokenPaths: ['component.button.height.md', 'component.button.radius', 'theme.light.action.primary', 'theme.light.focus.ring'],
    styleSelectors: ['.forma-button', '.forma-button--primary', '.forma-button--secondary'],
    storyTitle: 'Forma / Actions / Button', storyNames: ['Playground', 'AllVariants', 'WithLeadingIcon', 'WithTrailingIcon'],
    storyFile: 'src/system/Button.stories.tsx', guideline: 'button'
  },
  {
    id: 'text-field', name: 'Text field', family: 'fields', figmaSet: 'Text field', reactExport: 'TextField',
    angularUsage: '<forma-text-field> standalone adapter',
    tokenPaths: ['component.field.height', 'component.field.radius', 'theme.light.border.default', 'theme.light.focus.ring'],
    styleSelectors: ['.forma-field', '.forma-control', '.forma-field__hint', '.forma-field__error'],
    storyTitle: 'Forma / Forms / Text field', storyNames: ['Playground', 'Error', 'Disabled', 'TextArea'],
    storyFile: 'src/system/Fields.stories.tsx', guideline: 'text-field'
  },
  {
    id: 'select', name: 'Select', family: 'selects', figmaSet: 'Select', reactExport: 'SelectField',
    angularUsage: '<forma-select> standalone adapter',
    tokenPaths: ['component.field.height', 'component.field.radius', 'theme.light.border.default', 'theme.light.focus.ring'],
    styleSelectors: ['.forma-select-wrap', '.forma-select', '.forma-select__icon'],
    storyTitle: 'Forma / Forms / Text field', storyNames: ['Select'],
    storyFile: 'src/system/Fields.stories.tsx', guideline: 'select'
  },
  {
    id: 'checkbox', name: 'Checkbox', family: 'selection', figmaSet: 'Checkbox', reactExport: 'Checkbox',
    angularUsage: '<forma-checkbox> standalone adapter',
    tokenPaths: ['radius.sm', 'theme.light.action.primary', 'theme.light.focus.ring', 'space.2'],
    styleSelectors: ['.forma-choice', '.forma-choice__indicator', '.forma-choice__input'],
    storyTitle: 'Forma / Forms / Selection controls', storyNames: ['CheckboxPlayground', 'Checked'],
    storyFile: 'src/system/Selection.stories.tsx', guideline: 'checkbox'
  },
  {
    id: 'radio-group', name: 'Radio group', family: 'selection', figmaSet: 'Radio group', reactExport: 'RadioGroup',
    angularUsage: 'Native radio inputs + shared Forma styles',
    tokenPaths: ['radius.full', 'theme.light.action.primary', 'theme.light.border.strong', 'theme.light.focus.ring'],
    styleSelectors: ['.forma-radio-group', '.forma-radio', '.forma-radio__indicator'],
    storyTitle: 'Forma / Forms / Radio group', storyNames: ['Playground', 'Horizontal', 'WithDisabledOption'],
    storyFile: 'src/system/RadioGroup.stories.tsx', guideline: 'radio-group'
  },
  {
    id: 'switch', name: 'Switch', family: 'selection', figmaSet: 'Switch', reactExport: 'Switch',
    angularUsage: '<forma-switch> standalone adapter',
    tokenPaths: ['radius.full', 'theme.light.action.primary', 'theme.light.border.strong', 'motion.duration.fast'],
    styleSelectors: ['.forma-switch-row', '.forma-switch__track', '.forma-switch__thumb'],
    storyTitle: 'Forma / Forms / Selection controls', storyNames: ['SwitchControl'],
    storyFile: 'src/system/Selection.stories.tsx', guideline: 'switch'
  },
  {
    id: 'badge', name: 'Badge', family: 'feedback', figmaSet: 'Badge', reactExport: 'Badge',
    angularUsage: '<forma-badge> standalone adapter',
    tokenPaths: ['theme.light.status.successSubtle', 'theme.light.status.warningSubtle', 'radius.full', 'font.size.xs'],
    styleSelectors: ['.forma-badge', '.forma-badge--success', '.forma-badge__dot'],
    storyTitle: 'Forma / Feedback', storyNames: ['BadgePlayground'],
    storyFile: 'src/system/Feedback.stories.tsx', guideline: 'badge'
  },
  {
    id: 'avatar', name: 'Avatar', family: 'feedback', figmaSet: 'Avatar', reactExport: 'Avatar',
    angularUsage: 'Native image or initials + .forma-avatar styles',
    tokenPaths: ['theme.light.action.subtle', 'theme.light.action.text', 'radius.full', 'font.weight.semibold'],
    styleSelectors: ['.forma-avatar', '.forma-avatar--sm', '.forma-avatar--lg'],
    storyTitle: 'Forma / Feedback', storyNames: ['AvatarExample'],
    storyFile: 'src/system/Feedback.stories.tsx', guideline: 'avatar'
  },
  {
    id: 'card', name: 'Card', family: 'feedback', figmaSet: 'Card', reactExport: 'Card',
    angularUsage: 'Native surface + .forma-card styles',
    tokenPaths: ['component.card.radius', 'component.card.padding', 'theme.light.background.surface', 'theme.light.border.default'],
    styleSelectors: ['.forma-card', '.forma-card__header', '.forma-card__content'],
    storyTitle: 'Forma / Feedback', storyNames: ['CardExample'],
    storyFile: 'src/system/Feedback.stories.tsx', guideline: 'card'
  },
  {
    id: 'tabs', name: 'Tabs', family: 'feedback', figmaSet: 'Tabs', reactExport: 'Tabs',
    angularUsage: 'Native buttons and panels + .forma-tabs styles',
    tokenPaths: ['theme.light.action.primary', 'theme.light.border.default', 'theme.light.focus.ring', 'space.3'],
    styleSelectors: ['.forma-tabs', '.forma-tabs__list', '.forma-tabs__panel'],
    storyTitle: 'Forma / Navigation / Tabs', storyNames: ['Playground', 'WithFormField'],
    storyFile: 'src/system/Tabs.stories.tsx', guideline: 'tabs'
  },
  {
    id: 'accordion', name: 'Accordion', family: 'feedback', figmaSet: 'Accordion', reactExport: 'Accordion',
    angularUsage: 'Native disclosure buttons + .forma-accordion styles',
    tokenPaths: ['theme.light.background.surface', 'theme.light.border.default', 'space.4', 'motion.duration.fast'],
    styleSelectors: ['.forma-accordion', '.forma-accordion__trigger', '.forma-accordion__panel'],
    storyTitle: 'Forma / Navigation / Accordion', storyNames: ['Playground', 'SingleOpenAtATime'],
    storyFile: 'src/system/Accordion.stories.tsx', guideline: 'accordion'
  },
  {
    id: 'dialog', name: 'Dialog', family: 'feedback', figmaSet: 'Dialog', reactExport: 'Dialog',
    angularUsage: 'Native <dialog> + .forma-dialog styles',
    tokenPaths: ['theme.light.background.surface', 'theme.light.background.inverted', 'component.card.radius', 'space.6'],
    styleSelectors: ['.forma-dialog', '.forma-dialog__header', '.forma-dialog__actions'],
    storyTitle: 'Forma / Overlays / Dialog', storyNames: ['Playground'],
    storyFile: 'src/system/Dialog.stories.tsx', guideline: 'dialog'
  },
  {
    id: 'alert', name: 'Alert', family: 'feedback', figmaSet: 'Alert', reactExport: 'Alert',
    angularUsage: '<forma-alert> standalone adapter',
    tokenPaths: ['theme.light.status.info', 'theme.light.status.infoSubtle', 'theme.light.status.successSubtle', 'radius.md'],
    styleSelectors: ['.forma-alert', '.forma-alert--success', '.forma-alert--danger'],
    storyTitle: 'Forma / Feedback', storyNames: ['AlertStates'],
    storyFile: 'src/system/Feedback.stories.tsx', guideline: 'alert'
  },
  {
    id: 'progress', name: 'Progress', family: 'feedback', figmaSet: 'Progress', reactExport: 'Progress',
    angularUsage: 'Native <progress> + .forma-progress styles',
    tokenPaths: ['theme.light.action.primary', 'theme.light.background.subtle', 'radius.full', 'motion.duration.fast'],
    styleSelectors: ['.forma-progress', '.forma-progress__heading', '.forma-progress__bar'],
    storyTitle: 'Forma / Feedback / Progress', storyNames: ['Playground', 'Indeterminate'],
    storyFile: 'src/system/Progress.stories.tsx', guideline: 'progress'
  },
  {
    id: 'tooltip', name: 'Tooltip', family: 'feedback', figmaSet: 'Tooltip', reactExport: 'Tooltip',
    angularUsage: 'Native labelled wrapper + .forma-tooltip styles',
    tokenPaths: ['theme.light.background.inverted', 'theme.light.text.inverse', 'radius.sm', 'space.2'],
    styleSelectors: ['.forma-tooltip', '.forma-tooltip__bubble', '.forma-tooltip__trigger'],
    storyTitle: 'Forma / Overlays / Tooltip', storyNames: ['Playground'],
    storyFile: 'src/system/Tooltip.stories.tsx', guideline: 'tooltip'
  },
  {
    id: 'table', name: 'Table', family: 'feedback', figmaSet: 'Table', reactExport: 'Table',
    angularUsage: 'Native <table> + .forma-table styles',
    tokenPaths: ['theme.light.background.surface', 'theme.light.background.subtle', 'theme.light.border.default', 'space.3'],
    styleSelectors: ['.forma-table-wrap', '.forma-table', '.forma-table th'],
    storyTitle: 'Forma / Data display / Table', storyNames: ['Playground'],
    storyFile: 'src/system/Table.stories.tsx', guideline: 'table'
  }
];

export const componentUsageNotes: Record<string, string> = {
  button: 'Use a verb-led label and keep one primary action per group.',
  'text-field': 'Keep the label visible; connect hint and error copy to the control.',
  select: 'Use for a concise, single-choice list; keep options in a meaningful order.',
  checkbox: 'Use for independent choices; label the setting, not the control type.',
  'radio-group': 'Use when exactly one option must be selected from a small set.',
  switch: 'Use for an immediate on/off setting, not a choice awaiting submission.',
  badge: 'Keep the status understandable without its color or dot.',
  avatar: 'Provide a useful name and keep identity separate from status.',
  card: 'Group related content; avoid wrapping every control in a card.',
  tabs: 'Switch between related panels at the same hierarchy level.',
  accordion: 'Reveal secondary content; keep decision-critical information visible.',
  dialog: 'Keep modal tasks focused, short and easy to dismiss.',
  alert: 'State what happened and the next useful action.',
  progress: 'Label progress and expose a real value when work is measurable.',
  tooltip: 'Keep essential information visible outside the tooltip.',
  table: 'Use real headers and a caption for related row-and-column data.'
};

export const componentCount = componentHandoff.length;
