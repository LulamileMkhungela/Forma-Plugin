# Forma component usage guidelines

Created by **Lulamile Mkhungela**. This guide is the usage layer of the Forma component handoff: the Figma set, semantic tokens, React export, shared styles and Storybook story for each component are indexed in `src/data/component-handoff.ts`.

## Follow the same trail for every component

1. Start with the native component set in the Forma Figma plugin.
2. Keep visual choices connected to the token paths listed below. `tokens/forma.tokens.json` is canonical; generated CSS and Sass are outputs, not edit targets.
3. Prefer the named React export from `src/system/components.tsx`. Angular teams can use the standalone adapters where listed in the handoff map, or compose semantic HTML with the same `.forma-*` styles.
4. Review the component’s story in the React Storybook. Stories are the source of truth for interactive examples and tested states.
5. Apply the usage notes below, then check keyboard, focus, contrast and reduced-motion behavior in context.

Shared styles are loaded by `src/styles/global.css`; component rules live in `components.css` and `advanced-components.css`. Keep any product-specific styling additive and avoid replacing semantic tokens with copied hex values.

## Actions

### Button {#button}

Use a button for an action that changes state or submits work. Choose one primary action for a group; use secondary or tertiary actions for alternatives. Keep labels short and verb-led. Do not use a button to navigate to another page—use a link.

- Figma set: `Button`
- React: `Button` · Angular: `<forma-button>`
- Tokens: `component.button.height.md`, `component.button.radius`, `theme.light.action.primary`, `theme.light.focus.ring`
- Styles: `.forma-button`, `.forma-button--primary`, `.forma-button--secondary`
- Story: `Forma / Actions / Button` — `Playground`, `AllVariants`, icon examples

Provide a visible label while loading, disable duplicate submission, and never rely on color alone to communicate a destructive action.

## Forms and selection

### Text field {#text-field}

Use for a single-line value. Keep the label visible, connect hint/error copy to the field, and explain how to fix invalid input. Use `TextAreaField` when the expected answer is longer than one line; it shares the text-field foundation and is covered by the same story file.

- Figma set: `Text field`
- React: `TextField` (or `TextAreaField` for multiline) · Angular: `<forma-text-field>`
- Tokens: `component.field.height`, `component.field.radius`, `theme.light.border.default`, `theme.light.focus.ring`
- Styles: `.forma-field`, `.forma-control`, `.forma-field__hint`, `.forma-field__error`
- Story: `Forma / Forms / Text field` — `Playground`, `Error`, `Disabled`, `TextArea`

### Select {#select}

Use when someone chooses one option from a known list. Keep option labels concise and in a meaningful order. Prefer radio buttons when all choices should be visible and the list is short; do not use a select for navigation.

- Figma set: `Select`
- React: `SelectField` · Angular: `<forma-select>`
- Tokens: `component.field.height`, `component.field.radius`, `theme.light.border.default`, `theme.light.focus.ring`
- Styles: `.forma-select-wrap`, `.forma-select`, `.forma-select__icon`
- Story: `Forma / Forms / Text field` — `Select`

### Checkbox {#checkbox}

Use for an independent yes/no choice, or one item in a set where multiple selections are allowed. The label should describe the setting or action; keep explanatory copy adjacent and programmatically associated.

- Figma set: `Checkbox`
- React: `Checkbox` · Angular: `<forma-checkbox>`
- Tokens: `radius.sm`, `theme.light.action.primary`, `theme.light.focus.ring`, `space.2`
- Styles: `.forma-choice`, `.forma-choice__indicator`, `.forma-choice__input`
- Story: `Forma / Forms / Selection controls` — `CheckboxPlayground`, `Checked`

### Radio group {#radio-group}

Use when exactly one option must be chosen from a small set. Group related choices in a fieldset with a clear legend; include descriptions only when they help distinguish options. Preserve native arrow-key behavior.

- Figma set: `Radio group`
- React: `RadioGroup` · Angular: native radio inputs with `.forma-radio-*` styles
- Tokens: `radius.full`, `theme.light.action.primary`, `theme.light.border.strong`, `theme.light.focus.ring`
- Styles: `.forma-radio-group`, `.forma-radio`, `.forma-radio__indicator`
- Story: `Forma / Forms / Radio group` — `Playground`, `Horizontal`, `WithDisabledOption`

### Switch {#switch}

Use for an immediate on/off setting, not for a choice that requires a separate submit action. State the setting in the label and expose the checked state to assistive technology; the control uses the native `switch` role.

- Figma set: `Switch`
- React: `Switch` · Angular: `<forma-switch>`
- Tokens: `radius.full`, `theme.light.action.primary`, `theme.light.border.strong`, `motion.duration.fast`
- Styles: `.forma-switch-row`, `.forma-switch__track`, `.forma-switch__thumb`
- Story: `Forma / Forms / Selection controls` — `SwitchControl`

## Feedback and surfaces

### Badge {#badge}

Use a compact badge for a short status or category. Keep the text meaningful without the dot or color, and avoid using badges as buttons unless an explicit interactive pattern is provided.

- Figma set: `Badge`
- React: `Badge` · Angular: `<forma-badge>`
- Tokens: `theme.light.status.successSubtle`, `theme.light.status.warningSubtle`, `radius.full`, `font.size.xs`
- Styles: `.forma-badge`, `.forma-badge--success`, `.forma-badge__dot`
- Story: `Forma / Feedback` — `BadgePlayground`

### Avatar {#avatar}

Use an avatar to identify a person or team near their work. Provide a useful accessible name; treat decorative images as empty-alt images, and use initials as the fallback when no image is available. Do not encode access or status in the avatar color alone.

- Figma set: `Avatar`
- React: `Avatar` · Angular: image/initials with `.forma-avatar` styles
- Tokens: `theme.light.action.subtle`, `theme.light.action.text`, `radius.full`, `font.weight.semibold`
- Styles: `.forma-avatar`, `.forma-avatar--sm`, `.forma-avatar--lg`
- Story: `Forma / Feedback` — `AvatarExample`

### Card {#card}

Use a card to group related content, not as decoration around every control. Keep heading structure meaningful. Make the whole surface interactive only when the card represents one clear action, and provide a visible focus state for interactive cards.

- Figma set: `Card`
- React: `Card` and its header/content/footer subcomponents · Angular: native surface with `.forma-card` styles
- Tokens: `component.card.radius`, `component.card.padding`, `theme.light.background.surface`, `theme.light.border.default`
- Styles: `.forma-card`, `.forma-card__header`, `.forma-card__content`
- Story: `Forma / Feedback` — `CardExample`

### Alert {#alert}

Use an alert for important status or feedback that belongs in the current flow. Write a specific title and a useful next step. Reserve assertive announcement behavior for urgent errors; do not use alerts for routine, rapidly changing updates.

- Figma set: `Alert`
- React: `Alert` · Angular: `<forma-alert>`
- Tokens: `theme.light.status.info`, `theme.light.status.infoSubtle`, `theme.light.status.successSubtle`, `radius.md`
- Styles: `.forma-alert`, `.forma-alert--success`, `.forma-alert--danger`
- Story: `Forma / Feedback` — `AlertStates`

### Progress {#progress}

Use progress when the amount of completed work can be measured. Give the progress indicator an accessible label and expose determinate values; omit the value only when the task is genuinely indeterminate. Do not make progress the only signal that a long task is still active.

- Figma set: `Progress`
- React: `Progress` · Angular: native `<progress>` with `.forma-progress` styles
- Tokens: `theme.light.action.primary`, `theme.light.background.subtle`, `radius.full`, `motion.duration.fast`
- Styles: `.forma-progress`, `.forma-progress__heading`, `.forma-progress__bar`
- Story: `Forma / Feedback / Progress` — `Playground`, `Indeterminate`

### Tooltip {#tooltip}

Use a tooltip for brief, supplementary information that is not essential to complete the task. The trigger must remain understandable without it; make the tooltip available on hover and keyboard focus, and never put interactive content inside it.

- Figma set: `Tooltip`
- React: `Tooltip` · Angular: labelled wrapper with `.forma-tooltip` styles
- Tokens: `theme.light.background.inverted`, `theme.light.text.inverse`, `radius.sm`, `space.2`
- Styles: `.forma-tooltip`, `.forma-tooltip__bubble`, `.forma-tooltip__trigger`
- Story: `Forma / Overlays / Tooltip` — `Playground`

### Table {#table}

Use a data table for relationships that are easier to compare in rows and columns. Give it a concise caption, use real header cells, preserve a logical reading order, and provide a responsive overflow region when necessary. Use a list instead when there is no meaningful row/column relationship.

- Figma set: `Table`
- React: `Table` · Angular: semantic `<table>` with `.forma-table` styles
- Tokens: `theme.light.background.surface`, `theme.light.background.subtle`, `theme.light.border.default`, `space.3`
- Styles: `.forma-table-wrap`, `.forma-table`, `.forma-table th`
- Story: `Forma / Data display / Table` — `Playground`

## Navigation and composition patterns

### Tabs {#tabs}

Use tabs to switch between related panels at the same hierarchy level. Keep the number of tabs small, use concise labels, and maintain a stable tab order. The component supports Left/Right Arrow, Home and End keys and exposes tab/panel relationships.

- Figma set: `Tabs`
- React: `Tabs` · Angular: native buttons and panels with `.forma-tabs` styles
- Tokens: `theme.light.action.primary`, `theme.light.border.default`, `theme.light.focus.ring`, `space.3`
- Styles: `.forma-tabs`, `.forma-tabs__list`, `.forma-tabs__panel`
- Story: `Forma / Navigation / Tabs` — `Playground`, `WithFormField`

### Accordion {#accordion}

Use an accordion to reveal secondary content while preserving the page’s overall context. Make each heading action a real button with an expanded state; keep essential information visible when it is needed to make a decision.

- Figma set: `Accordion`
- React: `Accordion` · Angular: native disclosure buttons with `.forma-accordion` styles
- Tokens: `theme.light.background.surface`, `theme.light.border.default`, `space.4`, `motion.duration.fast`
- Styles: `.forma-accordion`, `.forma-accordion__trigger`, `.forma-accordion__panel`
- Story: `Forma / Navigation / Accordion` — `Playground`, `SingleOpenAtATime`

### Dialog {#dialog}

Use a dialog for a focused task that needs a response before continuing. Provide a clear title, a meaningful initial focus target and a visible way out. Keep the task short; use a full page for complex workflows. The React component uses the native modal dialog and supports Escape dismissal.

- Figma set: `Dialog`
- React: `Dialog` · Angular: native `<dialog>` with `.forma-dialog` styles
- Tokens: `theme.light.background.surface`, `theme.light.background.inverted`, `component.card.radius`, `space.6`
- Styles: `.forma-dialog`, `.forma-dialog__header`, `.forma-dialog__actions`
- Story: `Forma / Overlays / Dialog` — `Playground`

## Related guidance

- Accessibility: `src/app/ReferencePages.tsx` → Accessibility, plus `docs/design-system-principles.md`.
- Figma setup: `docs/figma-workflow.md`; the in-product Figma bridge links these component sets to the plugin.
- Tokens: browse the **Components** category in the token explorer or inspect `tokens/forma.tokens.json`.
- Live states: the React Storybook is configured with the accessibility addon; the one-command workbench is `npm run workbench`.
- Authorship: retain the **Lulamile Mkhungela** credit when you adapt or redistribute Forma under the MIT license.
