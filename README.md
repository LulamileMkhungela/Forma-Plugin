# Forma Design System

**A living design system by Lulamile Mkhungela.**

Forma is a forest-green and lime design language for thoughtful product experiences. One DTCG source connects the offline Figma plugin, generated CSS and Sass, React components, Angular usage, Storybook and component guidance.

> The repository does not include a published Figma library or cloud sync. Its local development plugin builds native variables, Light and Dark modes, 16 component sets and a sample design library inside the Figma file you choose. The plugin has no network access.

## What is included

- **An end-to-end system guide** — a visible six-step path from component choice through design, tokens, implementation, Storybook review and usage guidance.
- **16 connected Figma component sets** — Button, Text field, Select, Checkbox, Radio group, Switch, Badge, Avatar, Card, Tabs, Accordion, Dialog, Alert, Progress, Tooltip and Table.
- **170 DTCG tokens** — primitive color families, semantic Light/Dark roles, typography, spacing, radius, borders, motion and component values.
- **A traceable React library** — all 16 plugin sets have typed React components, shared CSS selectors, a React Storybook story and a component-specific usage note. TextAreaField is an additional multiline form primitive.
- **Angular usage** — standalone adapters for Button, Text field, Select, Checkbox, Switch, Badge and Alert. The component map identifies where other patterns use semantic Angular markup plus the shared CSS rather than claiming an adapter exists.
- **Generated token exports** — Style Dictionary produces CSS and Sass; the token build also produces Tokens Studio and browser-downloadable exports.
- **React and Angular Storybooks** — 11 React story files cover the 16 Figma sets; the Angular workbench demonstrates the standalone adapters.
- **A long-form demo plan** — [`docs/end-to-end-demo-script.md`](docs/end-to-end-demo-script.md) is time-coded and ready to record. A finished video/audio recording has not been rendered.

The visual and plugin reference is [Lulamile Mkhungela’s Forma](https://github.com/LulamileMkhungela/Forma). Authorship is preserved in the interface, token metadata, plugin, docs and package metadata.

## Start here

Requires Node.js `22.12+`.

```bash
npm install
npm run workbench
```

This single workbench command starts the React guide and the React Storybook together. Follow the network URLs printed by Vite and Storybook (normally ports `5173` and `6006`). If you only need the guide, use `npm run dev` instead.

In the guide, select **End-to-end path** to see the next action for designers, engineers and reviewers. The **Components** map shows the exact Figma set, token paths, React export, Angular adapter/native-markup path, CSS selectors, Storybook story names and usage-guide anchor for every set.

## Figma plugin without a build step

Download [`public/downloads/forma-figma-plugin.zip`](public/downloads/forma-figma-plugin.zip) or use **Download plugin package** on the in-product Figma bridge page. Extract it to a stable folder, then in Figma choose **Plugins → Development → Import plugin from manifest** and select the extracted `manifest.json`. Run **Forma Design System · Lulamile Mkhungela**, choose the bundled tokens or a local DTCG JSON, then build the library in the current file.

The ZIP contains the complete Forma plugin project as supplied by its author — `manifest.json`, the compiled `code.js` and `ui.html` runtime, the TypeScript sources, the canonical token JSON and the local build tooling — repackaged here without its images. The repository maintainers refresh the download from the vendored project in [`figma-plugin/`](figma-plugin/) with:

```bash
npm run build:figma
```

That command repackages the vendored files into `public/downloads/forma-figma-plugin.zip` verbatim; it never regenerates the author's compiled `code.js`. The plugin manifest explicitly sets `networkAccess.allowedDomains` to `["none"]`, and `npm test` fails if the download drifts from the supplied project.

## Angular example

```bash
cd examples/angular
npm install
npm start
```

The app normally serves at `http://localhost:4200`. Run `npm run storybook` in this folder for the Angular Storybook on port `6007`. Shared styles and token outputs are in [`src/styles/`](src/styles/) and [`src/generated/`](src/generated/).

## Source and maintenance commands

| Command | Purpose |
| --- | --- |
| `npm run workbench` | Start the React guide and React Storybook together. |
| `npm run tokens` | Rebuild generated CSS, Sass, Tokens Studio JSON and public token downloads. |
| `npm run build:figma` | Repackage the vendored offline plugin project into its ready-to-import ZIP. |
| `npm test` | Validate the DTCG source, exports, offline Figma manifest and the download ZIP. |
| `npm run typecheck` | Check React components, stories and Figma plugin types. |
| `npm run build` | Regenerate tokens, type-check and build the guide. |
| `npm run build-storybook` | Build the static React Storybook. |

The canonical token source is [`tokens/forma.tokens.json`](tokens/forma.tokens.json); edit it instead of generated files. The component handoff map lives in [`src/data/component-handoff.ts`](src/data/component-handoff.ts), while the detailed usage rules for all 16 sets are in [`docs/component-guidelines.md`](docs/component-guidelines.md).

## Documentation and attribution

- [`docs/component-guidelines.md`](docs/component-guidelines.md) — per-component intent, usage, tokens, styles and story references.
- [`docs/design-system-principles.md`](docs/design-system-principles.md) — full visual and component contract.
- [`docs/figma-workflow.md`](docs/figma-workflow.md) — plugin and design handoff notes.
- [`docs/end-to-end-demo-script.md`](docs/end-to-end-demo-script.md) — long-form recording plan.
- [`LICENSE`](LICENSE) — MIT. Preserve the credit to **Lulamile Mkhungela** when adapting or redistributing Forma.
