# Forma — the Figma plugin

**Designed and built by Lulamile Mkhungela · MIT · v1.0.0**

One token source in, a whole design library out. Forma builds native variables, Light and Dark modes, text styles, 16 component sets and four review boards inside the Figma file you already have open. It runs offline: `networkAccess.allowedDomains` is `["none"]`, so there is no API key, no account link and no request leaving your machine.

Forma is also listed on [Figma Community](https://www.figma.com/community/plugin/1690885096816846170) under the same plugin ID. This folder is the development build — the one you edit, test and repackage.

## Run it — no build step

`code.js` is already compiled and sits next to `manifest.json`.

1. Extract the plugin package somewhere stable.
2. In Figma Desktop: **Plugins → Development → Import plugin from manifest**, then pick that `manifest.json`.
3. Open a design file (a spare draft is a good first run) and start **Forma Design System · Lulamile Mkhungela**.
4. Keep **Use bundled tokens** or import a local DTCG JSON, then press **Build design library**.

The panel tells you how many typed tokens it loaded, and the summary afterwards tells you exactly what was created and where it landed.

## What gets built

| | |
| --- | --- |
| Variables | 170, in **Forma · Primitives**, **Forma · Components** and **Forma · Semantics** (Light / Dark modes) |
| Text styles | 8, from `font.size` + `font.lineHeight` tokens, with each size bound to its variable |
| Component sets | 16, with variants, auto layout, bound fills / radii / heights and a `Label` property where it helps |
| Boards | **00 Start here**, **01 Foundations** (every token drawn once), **02 Components**, **03 Patterns** |
| Descriptions | Each set names its React export, its Angular path and its Storybook story id |

Nothing of yours is deleted. Re-running updates the Forma variables and adds new boards alongside the old ones.

### Where to build

- **Auto** — asks for the four Forma pages. Starter files are capped at three pages, so when Figma refuses, Forma keeps the pages it did create and shares all four boards across them under headings. Only when no page is available does it use the page you had open.
- **This page** — all four boards stacked on the current page, each under its own heading.
- **Four new pages only** — refuses and rolls back its own pages rather than building somewhere you did not ask for.

Plan limits are reported in the summary instead of failing quietly. If a file will not allow a second semantic mode, Light and Dark become separate collections.

### Fonts

Forma wants **DM Sans** and falls back to **Inter** when a file cannot load it; the summary says which was used. Text sizes stay bound to the same variables either way.

## Export back to code

**Export edited Figma variables** downloads a DTCG JSON snapshot of the variables as they are in your file right now — aliases and units preserved. It is a review artifact, not a new source of truth: diff it against `tokens/forma.tokens.json`, apply what you actually want, then run `npm run tokens` at the repository root.

## Edit the plugin

From the repository root — type-checks, bundles `code.ts` → `code.js`, mirrors the sources into `src/figma-plugin/` and repackages the download ZIP:

```bash
npm run build:figma
```

Or work inside this folder (Node `22.13+`):

```bash
npm ci
npm run typecheck
npm run lint
npm run build      # or: npm run watch
```

Save → build → restart the development plugin in Figma. A failed type-check never overwrites the last good bundle. Figma needs one bundled IIFE script, so the build uses esbuild — do not swap it back to `tsc` emit. `npm test` at the root fails if `code.js` drifts from `code.ts`, if the ZIP differs from this folder, or if the mirror in `src/figma-plugin/` is out of date.

## Files

- `code.ts` — the generator: variables, text styles, components, boards, export.
- `code.js` — compiled entry point. Generated; do not hand-edit.
- `ui.html` — the offline panel: token import, placement, build, export, status.
- `manifest.json` — assigned ID, entry points, dynamic page access, offline policy.
- `tokens.ts` / `forma.tokens.json` — token resolver and validator, and the canonical source (mirrored from `tokens/` by `npm run tokens`).
- `variable-codec.ts` — keeps aliases, units and value types intact across the round trip.
- `placement.ts` — page reservation, sharing and stacking rules, unit-testable without a design file.
- `scripts/build.mjs` — strict checks, bundling, watch.
- `tsconfig.json`, `eslint.config.cjs`, `package.json`, `package-lock.json` — reproducible local tooling.
- `LICENSE` — MIT, in my name. Keep it if you redistribute.

The package is private on npm so it cannot be published by accident; that has nothing to do with publishing the plugin through your own Figma account.

## Good practice

Try it on a duplicate first. A failure can leave partial output, so look at the file before retrying — the plugin will not clean up pages it did not create. Prototype interactions are deliberately left to you. And if something breaks, send the error text; never credentials.
