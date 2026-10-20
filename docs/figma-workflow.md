# Figma handoff: variables → Forma → code

**Forma Design System · created by Lulamile Mkhungela**

This repository does not contain an attached or published Figma library. The local development plugin gives a team a repeatable way to create Forma variables, typography and component sets inside a Figma file they control.

## 1. Edit the canonical source

- Make token changes in [`tokens/forma.tokens.json`](../tokens/forma.tokens.json).
- Run `npm run tokens` to regenerate CSS, Sass, browser downloads and [`tokens/figma-tokens.json`](../tokens/figma-tokens.json).
- The Figma JSON has `core`, `light` and `dark` token sets plus `$themes` metadata, so it can be imported into Tokens Studio.
- The plugin also bundles the DTCG source. You can import another local DTCG JSON draft from its UI (maximum 2 MB).

Do not hand-edit generated files. Review the value and alias changes in the source before updating outputs.

## 2. Download and import the local plugin

The ready-to-import package is [`public/downloads/forma-figma-plugin.zip`](../public/downloads/forma-figma-plugin.zip). Extract it to a stable folder, open the destination Figma file, then choose **Plugins → Development → Import plugin from manifest** and select the extracted `manifest.json`. Run **Forma Design System · Lulamile Mkhungela** from the Development menu.

The ZIP is the Forma plugin project exactly as supplied by its author, repackaged without images: `manifest.json`, the compiled `code.js`, `ui.html`, the TypeScript sources, `forma.tokens.json`, `LICENSE` and the local tooling. Everything it needs sits at the package root, so the extracted folder is also the folder you can open in an editor.

No local plugin build is required to try Forma. The supplied project is vendored in [`figma-plugin/`](../figma-plugin/) so the download stays reproducible; maintainers repackage it from the repository root with:

```bash
npm run build:figma
```

That command copies the vendored files into the download ZIP byte for byte — it never regenerates the author's compiled `code.js` — and `npm test` fails if the ZIP and the vendored project differ. The packaging step rejects images, so the download stays text-only. The manifest declares `networkAccess.allowedDomains: ["none"]`; no API key, personal access token or remote sync service is required.

Because the packaged plugin is the supplied project itself, the descriptions it writes onto generated component sets name the layout of that project. This repository's own component map and code guide remain the handoff reference for Forma React exports, `forma-*` Angular adapters and Storybook stories; compare the two before copying generated descriptions into documentation.

## 3. Build the Figma design library

In the plugin UI:

1. Choose **Use bundled tokens** or **Import token JSON**. The UI reports how many typed tokens it found.
2. Optionally enter a published Storybook base URL. The value is only written into descriptions on generated component sets—there is no network request.
3. Choose a placement:
   - **Auto** — prefer separate Forma pages, but adapt when the file’s page limits require shared pages.
   - **This page** — place all generated boards in a vertical stack on the current page.
   - **Four new pages only** — require four generated pages and stop if Figma will not allow them.
4. Click **Build design library** and follow the progress messages.

The plugin validates the source before changing the file. It creates or updates native Forma variables and Light/Dark semantic modes where supported, applies available text styles and variable bindings, and builds four review boards: cover, foundations, component library and a sample pattern. The component board contains **16 native component sets** with variants and documentation properties.

Existing non-Forma pages are not deleted. Some Figma starter files limit pages or modes; the plugin reports those constraints and uses a supported fallback layout where possible. Review the resulting page placement, variable aliases, typography and variants before sharing or publishing the library.

## 4. Export, review and return to code

Use **Export edited Figma variables** to download a JSON snapshot of the current Forma variables. The export is a review artifact, not a replacement for the source of truth:

1. Compare the export with `tokens/forma.tokens.json`.
2. Intentionally apply approved changes to the DTCG source.
3. Run `npm run tokens` to rebuild CSS, Sass and the Tokens Studio export.
4. Run `npm test`, review the React app and Storybook, and check the Angular example if shared styles or component APIs changed.
5. Commit reviewed source and generated outputs together.

## Token types and naming

- Primitive token paths map to grouped Figma collections and variable names.
- Semantic paths preserve `theme.light` and `theme.dark` modes where the Figma file permits them.
- Figma numeric values are unitless; the token path and generated code retain units for dimensions and durations.
- Color aliases are resolved for native variable values while their names remain recognizable in the collection.
- Font families and weights are applied to text styles when an available local font supports them; the plugin reports a fallback if the preferred font is unavailable.

The browser’s **Figma bridge** page offers the ready-to-import plugin ZIP and downloadable DTCG, Tokens Studio, CSS and Sass outputs. The source-build command is tucked under maintainer details. The page also includes the supplied reference screenshot for the integration flow.
