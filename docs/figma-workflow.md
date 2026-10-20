# Figma handoff: tokens → Forma → code

**Forma Design System · designed and built by Lulamile Mkhungela**

There is no attached Figma library in this repository and no cloud sync. The local plugin gives you a repeatable way to build Forma — variables, type styles, component sets and review boards — inside a file you control.

## 1. Edit the one source

- Token changes happen in [`tokens/forma.tokens.json`](../tokens/forma.tokens.json).
- `npm run tokens` regenerates CSS, Sass, the browser downloads, [`tokens/figma-tokens.json`](../tokens/figma-tokens.json) for Tokens Studio, and the copy the plugin bundles at `figma-plugin/forma.tokens.json`.
- The plugin can also load another local DTCG JSON from its panel (2 MB max) if you want to try a draft before committing it.

Never hand-edit generated files. Review the diff in the source, then rebuild.

## 2. Import the plugin

Grab [`public/downloads/forma-figma-plugin.zip`](../public/downloads/forma-figma-plugin.zip) — or **Download plugin package** on the guide's Figma bridge page — extract it somewhere stable, then **Plugins → Development → Import plugin from manifest** and select the extracted `manifest.json`. Run **Forma Design System · Lulamile Mkhungela**.

`code.js` is already compiled, so there is nothing to install just to try it. To rebuild it from the repository root:

```bash
npm run build:figma
```

That one command type-checks the plugin sources, bundles `code.ts` → `code.js`, mirrors them into [`src/figma-plugin/`](../src/figma-plugin/) so the repository type-check covers the same code, and repackages the ZIP without images. `npm test` fails if the ZIP and the project differ, if `code.js` drifts from `code.ts`, or if the mirror is stale. The manifest keeps `networkAccess.allowedDomains: ["none"]` — no API key, no token, no sync service.

## 3. Build the library

1. **Use bundled tokens** or **Import token JSON**. The panel counts the typed tokens it found.
2. Optionally paste a published Storybook base URL. It is only written into component descriptions; no request is made.
3. Choose where to build:
   - **Auto** — reserve the four Forma pages, and when the file's page limit refuses, keep the pages that were created and share all four boards across them under headings. Only with no page available does it fall back to the page you had open.
   - **This page** — stack all four boards on the current page.
   - **Four new pages only** — refuse and roll back rather than build somewhere else.
4. Press **Build design library** and watch the status line.

The source is validated before your file is touched. Then Forma creates or updates:

- **170 variables** across *Primitives*, *Components* and *Semantics*, with real Light / Dark modes (separate collections if a plan will not allow a second mode).
- **8 text styles** taken from the `font.size` and `font.lineHeight` tokens, each size bound to its variable.
- **16 component sets** with variants, auto layout, bound fills / radii / heights and a `Label` property where it is useful. Descriptions name the React export, the Angular path and the Storybook story id — all real files in this repository.
- **Four boards**: *00 Start here*, *01 Foundations* (every token drawn once, including the semantic Light and Dark panels), *02 Components*, *03 Patterns* built from real instances in both modes.

Your own pages are never deleted. Plan limits are reported in the completion summary instead of failing quietly.

## 4. Export, review, return to code

**Export edited Figma variables** downloads a DTCG JSON snapshot of the variables as they stand in your file, aliases and units intact. It is a review artifact:

1. Diff it against `tokens/forma.tokens.json`.
2. Apply only what you actually want to the source.
3. `npm run tokens` to rebuild CSS, Sass and the Tokens Studio export.
4. `npm test`, then check the guide, Storybook and — if shared styles or component APIs moved — the Angular example.
5. Commit source and generated output together.

## Tokens in Figma, in practice

- Primitive paths map to grouped collections and readable variable names.
- `theme.light` and `theme.dark` stay as modes wherever the file allows them.
- Figma numbers are unitless; the token path and generated code keep the units for dimensions and durations.
- Colour aliases resolve to native variable values while their names stay recognisable in the collection.
- Font families and weights are applied when a local font supports them, and the summary names the fallback if it did not.

The guide's **Figma bridge** page carries the plugin ZIP plus the DTCG, Tokens Studio, CSS and Sass downloads.
