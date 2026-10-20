# Forma system principles

- **Creator:** Lulamile Mkhungela
- **Release:** 1.0.0
- **Visual reference:** [Lulamile Mkhungela’s Forma repository](https://github.com/LulamileMkhungela/Forma)

Forma is a focused design system for thoughtful product workflows. It is compact enough for a small team to understand, with a portable token source and component contracts that can grow with a product.

## Product intent

**Make complex work feel clear, calm and human.** Forms are moments where people share information, make decisions or encounter a confusing error. Forma puts legibility, useful feedback and clear next steps ahead of decoration.

### Experience principles

1. **Meaning before memorization** — use semantic theme roles for interface decisions and primitive scales for palette work.
2. **Visible labels, helpful feedback** — keep a field’s label in view and make errors explain what to fix.
3. **One primary action at a time** — establish hierarchy through placement, color and copy.
4. **Accessibility is a baseline** — native semantics, keyboard behavior, visible focus and reduced-motion support belong in the component contract.
5. **Small, composable building blocks** — compose real patterns without forcing a rigid page template.
6. **One vocabulary across tools** — Figma names, DTCG paths, CSS variables and component APIs should be easy to map.
7. **Credit the maker** — retain attribution to Lulamile Mkhungela when adapting or redistributing the reference work.

## Visual language

- **Forest** is the primary action color and signature system tone.
- **Sage and neutral** keep surfaces calm and support readable text.
- **Lime** adds a distinct accent for highlights and moments of focus.
- **Blue, amber and red** serve information, warning and danger roles.
- **DM Sans Variable** is the preferred interface family, with Inter and system-sans fallbacks. **DM Mono** is preferred for code and token values, with a monospace fallback.
- **Spacing** follows a four-point base rhythm; named steps provide a consistent progression from compact control gaps to larger section spacing.
- **Shape** uses a restrained radius scale. The source includes default and focus border widths.
- **Motion** uses three durations and a standard cubic Bézier curve. Respect `prefers-reduced-motion`.

## Token contract

[`tokens/forma.tokens.json`](../tokens/forma.tokens.json) is the canonical DTCG source. It contains **170 typed tokens**:

| Token family | Contents | Example |
| --- | --- | --- |
| `color.forest`, `color.neutral`, `color.lime`, `color.blue`, `color.amber`, `color.red` | Six eleven-step primitive palettes | `color.forest.700` |
| `theme.light`, `theme.dark` | Background, text, action, border, focus and status roles for each mode | `theme.light.action.primary` |
| `space` | Thirteen named spacing values | `space.4` |
| `radius` | Seven corner values, including none and full | `radius.md` |
| `border.width` | Default and focus widths | `border.width.focus` |
| `font.family`, `font.weight`, `font.size`, `font.lineHeight` | Two family stacks, four weights, nine sizes and three line heights | `font.size.display` |
| `motion.duration`, `motion.ease` | Three duration values and one standard easing curve | `motion.duration.normal` |
| `breakpoint` | Four responsive checkpoints | `breakpoint.md` |
| `component.button`, `component.field`, `component.card` | Component radius, height and padding roles | `component.button.height.md` |

The color roles are DTCG aliases to the primitive palette. Light and Dark are explicit in the source; the plugin binds each mode to Figma’s native variables where the destination file permits it. Style Dictionary generates CSS and Sass; the same script writes the Tokens Studio-compatible sets and browser downloads.

The source does not currently define shadow/elevation or composite transition tokens. Use the available border, radius and motion values rather than assuming those token groups exist.

### Type counts

- 114 colors: 66 primitive palette entries and 48 semantic theme values.
- 43 dimensions, including spacing, radius, borders, component heights and padding.
- 4 font weights, 3 numbers (line heights), 3 durations, 2 font families and 1 cubic Bézier value.

## Component contract

React primitives live in [`src/system/`](../src/system/), and standalone Angular adapters live in [`examples/angular/src/`](../examples/angular/src/). Both consume the shared CSS variable layer.

The React library exports Button, TextField, TextAreaField, SelectField, Checkbox, Switch, Badge, Alert, Card and Avatar, plus Card subcomponents. The Figma plugin creates **16 native component sets** (including tabs, accordion, dialog, progress, tooltip and table); not every Figma set has a one-to-one React primitive in this starter.

- **Button:** action intent, size, loading and disabled state.
- **Text field / textarea:** persistent label, optional hint, required and error state.
- **Select:** native single-choice control, clear empty option and field messaging.
- **Checkbox / switch:** native inputs, visible label, optional description and controlled state.
- **Badge / alert:** text-first status; color is not the only cue.
- **Card / avatar:** small, composable visual primitives.

Prefer native browser semantics. Add custom interaction only when it has a usability benefit and a documented keyboard contract.

## Accessibility baseline

Accessibility is ongoing product work, not a one-time certification. Forma aims to make the better path the easier path:

- Associate every field label, hint and error with its control.
- Prefer native `<button>`, `<input>`, `<select>` and `<textarea>` elements.
- Preserve visible focus and communicate checked, disabled and invalid states.
- Keep status understandable without color alone.
- Honor reduced-motion preferences.
- Use Storybook’s accessibility addon to surface issues early, then test keyboard and assistive-technology behavior directly.
- Check text and focus-indicator contrast in the actual theme, size, state and surrounding context. The Review Lab contrast check is a quick signal, not a conformance claim.

## Privacy and review

The Figma plugin declares no network domains and works against the current document. An optional Storybook URL is stored only as a description link on generated Figma component sets; it is never fetched. The browser Review Lab stores its snapshots in local `localStorage` and does not mutate the token source, generated CSS or Figma file.

## Contribution and change management

1. **Start with a problem** — link a user observation, interface inconsistency or implementation friction.
2. **Propose intent first** — describe the job and accessibility constraints before adding a token or variant.
3. **Check reuse** — compare against the current component API and community references.
4. **Update the source** — edit DTCG tokens or the canonical component, then regenerate outputs.
5. **Review in context** — check the React app and Storybook; when affected, check Angular and Angular Storybook as well.
6. **Communicate impact** — explain what changed and whether consumers need to migrate.
7. **Version intentionally** — patch for fixes, minor for compatible additions, major for incompatible public API or token renames.

### Definition of done

- Important default and interactive states are demonstrated in a story.
- Keyboard semantics and focus are reviewed.
- Token references replace unexplained literals where practical.
- React/Angular parity is considered; platform-specific differences are documented.
- Documentation explains when to use a pattern and how to compose it.
- A human reviews visual quality, code quality and user impact.

## References

The resource library gathers references for DTCG, Style Dictionary, Tokens Studio, Figma workflows, Storybook, accessibility, design systems and component libraries. These are learning materials, not endorsements. Local user research remains the decision source.
