# Forma — your integrated Figma plugin project

**Designed and created by Lulamile Mkhungela · MIT · Version 1.0.0.**

**Tagline:** One system. From Figma to code.

Forma generates native variables, aliases, Light/Dark semantics, text styles, 16 visual component sets and composed patterns. Import Forma DTCG tokens and export actual edited variables for a reviewed React/Angular/Storybook handoff. It runs locally, without external network access. It does not automatically turn arbitrary frames into code, publish files or synchronise accounts.

This project replaces your TypeScript starter's five orange rectangles and the throwing `code.js` placeholder. It includes all source dependencies and an already-built plugin, not imports into a missing Forma checkout.

## Where these files came from

**This ZIP was prepared in the Forma coding workspace; it is not Figma's generated starter.** The starter files must be replaced with this project's complete contents before you can run Forma. Creating/publishing a Figma listing does not copy this code into your original starter folder.

Extract the ZIP and open the inner `forma-plugin` folder in VS Code. The files are already complete: no copy/paste is required. If copying manually, replace every source/config file, then choose **File → Save All** and run `npm run build` after installing the tools with `npm ci`.

For the first local test, the included compiled `code.js` needs no npm command. In Figma Desktop, import this exact folder's `manifest.json` and run the **Development** entry. If your old starter is still registered at another path, replace that folder's contents or remove only the old Development registration before importing the new path. Do not delete/unpublish the Community resource.

**Save → build → restart the local development plugin** is the editing loop. Ctrl+S writes local disk files, not a Community release. Figma reads `code.js`/`ui.html` from the registered manifest's folder when you start it. Publishing updated code is a separate step; Community review does not replace this local test.

The full repository also supplies `docs/FIGMA-PLUGIN-SETUP.md`. The conversation deliverables include `forma-plugin-setup.md` (Windows/VS Code/CMD/Figma steps) and `forma-plugin-full-source.md` (every file, including compiled JavaScript, in copy-ready sections).

## Community plugin

Lulamile Mkhungela has confirmed the plugin is published: [Open Forma on Figma Community](https://www.figma.com/community/plugin/1690885096816846170). This is the plugin listing, not the generated design-file link. Publication and the uploaded runtime have not been independently verified in this workspace.

This project remains the local development source. Adding the Community reference does not change the runtime, require a new plugin release or change the assigned ID. Generate/review the native library before sharing its separate design-file URL.

## Run immediately — no npm required

1. Unzip the project and open the inner `forma-plugin` folder. Back up your old starter before replacing its files. If updating its existing folder, replace the full contents and remove obsolete starter ESLint configurations; do not merge them with `eslint.config.cjs`.
2. In Figma Desktop, import this folder's `manifest.json` using **Plugins → Development → Import plugin from manifest**. The supplied assigned ID is kept in that file, and `ui.html` is included.
3. If the ID already exists locally, update the existing development-plugin folder with these files rather than creating another ID.
4. Open an empty design file, run **Forma Design System · Lulamile Mkhungela** and choose **Build design library**.
5. Review the generated pages, variables, fonts, modes and component sets. A plan-limited file reports the one-page stack instead of four pages; the completion summary says which was built. Name the file **Forma · Lulamile Mkhungela**.
6. Use **File → Save local copy** for a genuine `.fig` backup. Set the online file's Share permissions yourself, then test a public view link signed out.

A supplied plugin ID is a non-secret identifier, not account/editor access. This bundle is not proof of native execution or publication. Other account owners must use their own Figma-assigned ID.

## Edit in VS Code

Use **Node 22.13+**, then run these commands in this project folder:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
```

For editing:

```sh
npm run watch
```

Watch type-checks and bundles the local source/token JSON, and observes UI and manifest changes. Restart the development plugin in Figma to load the changed files. Stop watch with Ctrl+C. Invalid source does not overwrite the last good bundle.

**Do not restore the starter's `tsc -p tsconfig.json` build script.** Figma needs one bundled script; the build uses esbuild with IIFE output, without `require` or ESM imports at runtime. `tsc --noEmit` still checks the source's types. A global TypeScript installation is unnecessary.

The ESLint flat configuration is named **`eslint.config.cjs`**, so `npm run lint` discovers it. It adapts your CommonJS configuration while the build script uses `.mjs`.

## Files

- `code.ts` — native generator and Figma UI message handlers.
- `code.js` — generated, already-built Figma entry point; do not edit by hand.
- `ui.html` — original offline plugin UI, token import/export and build feedback.
- `manifest.json` — assigned ID, `main`, required `ui`, dynamic page access and offline policy.
- `tokens.ts` / `forma.tokens.json` — local token resolver/validator and canonical source.
- `variable-codec.ts` — aliases, native values and units preserved on the variable round trip.
- `placement.ts` — page reservation, the one-page fallback for plan-limited files and the board stacking order.
- `scripts/build.mjs` — strict checks, bundling and watch.
- `tsconfig.json`, `eslint.config.cjs`, `package.json`, `package-lock.json` — reproducible local tooling.
- `LICENSE` — Lulamile Mkhungela's MIT notice; retain it when distributing the source.

This npm package is private to prevent accidental npm publication; that does not prevent publishing the plugin through your own Figma account.

## Limits and safe use

Use a clean design file or a duplicate first. The generator does not delete existing pages: reruns create numbered pages and update owned variables. A failure can leave partial output, so inspect before retrying. **Where to build** decides where the boards land: `Auto` reserves the four pages and, when Figma refuses (Starter files hold three pages), stacks the same four labelled boards on the page you have open instead.

DM Sans is used when available, with an explicit Inter fallback. If your plan restricts a second semantic mode, review the separate Dark collection fallback. Figma prototype interactions remain manual.

The bundle can be compiled and smoke-tested without Figma. Native layout, font rendering, variable mode inheritance and file sharing still require your Desktop review. If there is an error, send its text or a screenshot—never credentials.

**Video/audio stays last**, after native-file generation and implementation review.
