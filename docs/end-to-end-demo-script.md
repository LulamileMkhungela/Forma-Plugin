# Forma end-to-end video demonstration

**A recording-ready long-form script for Forma Design System by Lulamile Mkhungela**

**Target runtime:** approximately 14 minutes

**Status:** script and shot list prepared; no video or audio recording has been rendered.

## Before recording

Start the React guide and React Storybook together from the repository root:

```bash
npm install
npm run workbench
```

For the Angular example, use a second terminal in `examples/angular` and start its app; start its Storybook too only for the dedicated Angular chapter:

```bash
cd examples/angular
npm install
npm start
# optional, in another terminal from examples/angular:
npm run storybook
```

Use a Figma draft or duplicate file for the plugin walkthrough. Keep the repository checkout, browser preview, React Storybook, Angular demo and Figma file free of private product data. Set browser zoom to about 100–110%, use a readable editor font size, and check every on-screen creator credit.

**Persistent lower third:** `Forma Design System · Created by Lulamile Mkhungela · v1.0.0`

---

## 00:00–00:45 — Opening: one shared language

**On screen:** Fade in to the Forma overview. Hold on the forest-green and lime mark and title.

**Say:**

> “Welcome to Forma, a living design system by Lulamile Mkhungela. In the next fourteen minutes, we’ll follow one design decision across the whole toolchain: from an authored token source, through a local Figma library, into React and Angular, and on to Storybook. The goal is a system people can inspect, use and adapt—not just a set of polished screens.”

**Action:** Hover the creator credit and pause on the navigation groups.

---

## 00:45–02:00 — Overview: design with intention

**On screen:** Overview hero, system metrics, the visible “What next?” component trail, foundation cards and the component playground.

**Say:**

> “The overview sets the visual direction: a shared language for thoughtful products, with forest, sage, lime and grounded neutrals. The system at a glance is deliberately factual: sixteen native Figma component sets, one hundred and seventy design tokens, two implementation paths and two theme modes. The new ‘What next?’ trail makes the lifecycle visible—Figma, tokens, code and styles, Storybook, then usage guidance—instead of asking people to guess which page to open.”

**Action:** Open the light/dark playground control, type a short sample project name, use the primary and secondary action buttons, then open the component library and the form pattern.

**Say:**

> “The overview is built from the same React primitives as the rest of the guide. Even this small preview is interactive. Next we’ll inspect the foundations that keep it consistent.”

---

## 02:00–03:15 — Foundations: colour, type, space and iconography

**On screen:** Colour palettes, semantic Light and Dark comparison, typography scale, spacing and shape, then iconography search.

**Say:**

> “The colour page separates primitive palettes from semantic intent. Forest, neutral, lime, blue, amber and red provide the range; Light and Dark roles express how those values should be used. Clicking a swatch copies its DTCG reference, not an unrelated one-off color.”

**Action:** Copy a forest token reference, compare the two theme cards, inspect a font size and a spacing value, then search for an icon.

**Say:**

> “Typography names the DM Sans and DM Mono stacks with practical fallbacks. Spacing, radius and border weights are inspectable too. The icon catalog uses consistent line icons, and the page reminds us to pair meaning with a label rather than ask a symbol to explain itself.”

---

## 03:15–04:20 — Components and patterns

**On screen:** Open Components; show the compact coverage map. Open the Buttons family, inspect its Figma/token/React/CSS/Storybook/guide trail, then show the component-specific documentation list.

**Say:**

> “The map now connects all sixteen Figma sets to real React exports, canonical token paths, shared selectors, story files and usage guidance. Angular is described honestly: seven core standalone adapters are provided, while other patterns use semantic Angular markup with the shared CSS. TextAreaField is an additional React form primitive, not a seventeenth Figma set.”

**Action:** Change a button’s variant and size. Return to the component map, open a radio group or dialog story reference, then open the form playground, submit an empty form, correct the errors and submit the valid state.

**Say:**

> “Each component card shows its next action and exact artifacts. The playbook moves from a component family to its real Storybook story and the full usage notes. In the form, the label stays visible, errors say what to fix, and the success state closes the loop.”

---

## 04:20–06:30 — Figma bridge: native variables and component sets

**On screen:** Show the Figma bridge page and reference screenshot, then the local Figma plugin panel.

**Say:**

> “There is no attached or published Figma library in this repository, so the handoff is local and explicit. The ready-to-import ZIP means we do not need a build command just to try the plugin. We import its manifest into a file we control and use the bundled DTCG source—or import a local draft. The plugin declares no network access and needs no Figma API token.”

**Action:** Click **Download plugin package** in the Figma bridge, extract it, then in Figma import the extracted `manifest.json`. Open **Forma Design System · Lulamile Mkhungela**, and show the source count, placement choices and optional Storybook URL field. Mention that maintainers can rebuild the package from source when needed.

**Say:**

> “The Storybook URL is a description link only; the plugin does not fetch it. We can let Forma choose a page layout, keep everything on the current page, or require four new pages. That matters because some starter files have page or mode limits.”

**Action:** Click **Build design library**. Let the progress finish. Show the native variables, Light and Dark modes, text styles, foundations board, component board and sample pattern. Select one variant and inspect its name or description. Then use **Export edited Figma variables** and show the downloaded snapshot.

**Say:**

> “The plugin creates or updates Forma-owned variables and lays out a cover, foundations, component library and pattern board. It creates sixteen variant sets. Existing non-Forma pages are not deleted. The export is a review snapshot: we compare it with the source and intentionally apply approved changes rather than silently replacing the canonical file.”

---

## 06:30–07:40 — Token explorer: one source, portable outputs

**On screen:** Open Design tokens. Search for `theme.light.action.primary`; inspect its value, CSS variable and DTCG reference. Download DTCG, Tokens Studio, CSS or Sass.

**Say:**

> “The token explorer is the browser view of the same one hundred and seventy-token source. It groups color, spacing, shape, typography, motion, themes and component values. The inspector shows the source path, a copyable CSS custom property and a CSS declaration.”

**Action:** Use the category tabs and search. Point to `tokens/forma.tokens.json`, then show the generated CSS and the Tokens Studio `core`, `light` and `dark` sets in the editor.

**Say:**

> “We edit the DTCG file, not these generated outputs. Running `npm run tokens` refreshes the CSS, Sass, Tokens Studio export and public downloads together.”

---

## 07:40–08:40 — Review lab: explore without mutating the source

**On screen:** Open Review lab, change the color picker, inspect the contrast ratio and save a browser snapshot.

**Say:**

> “The Review Lab makes a design decision visible before it ships. Choose a light semantic color, try a draft value and see it in a simple interface preview. The contrast reading is a quick signal for that text/surface pair—not an accessibility certification.”

**Action:** Change the color, save a snapshot, inspect its local list, then delete it or explain how browser storage controls it.

**Say:**

> “The draft stays in this preview, and saved snapshots live only in this browser’s local storage. The canonical DTCG source, Figma file and generated CSS remain untouched until someone deliberately changes them.”

---

## 08:40–10:00 — React: reusable, typed building blocks

**On screen:** Open `src/system/components.tsx`, one React story and the developer handoff page.

**Say:**

> “The React library now has a typed export for every Figma set, plus the multiline TextAreaField extension. Native semantics, shared CSS and the canonical token variables keep the names and states aligned across the handoff.”

**Action:** From the component map, find the Button, Radio group and Dialog stories. Open React Storybook, change props, try keyboard focus, inspect the docs and accessibility panel, then return to the guide.

**Say:**

> “Eleven focused Storybook files contain real stories for all sixteen sets. A designer and developer can inspect each component without a full product page around it. Controls make variants visible and the accessibility addon helps catch issues early; human keyboard and assistive-technology testing still matters.”

---

## 10:00–11:15 — Angular: the same foundation, familiar idioms

**On screen:** Open `examples/angular/src/` and show the Angular demo in a browser at port 4200.

**Say:**

> “Angular includes seven standalone adapters: Button, Text field, Select, Checkbox, Switch, Badge and Alert. For Tabs, Dialog, Table and other patterns, the handoff map gives semantic Angular markup plus shared CSS instead of pretending every pattern has a dedicated Angular wrapper. Both paths consume the same generated tokens.”

**Action:** Submit the Angular form with missing fields, correct the email and team size, toggle the checkbox and switch, then submit successfully.

**Say:**

> “We keep validation close to each control, preserve keyboard interaction, and use a success message to confirm the result. That is the same product promise implemented with Angular’s own API.”

---

## 11:15–12:20 — Angular Storybook: inspect framework-specific states

**On screen:** Switch to Angular Storybook on port 6007. Open the Button and field stories.

**Say:**

> “The Angular adapter has a separate Storybook because its stories should render the Angular implementation, not a React substitute. Both workbenches share the Forma token CSS. That gives the team an isolated place to review framework-specific behavior before it reaches a product screen.”

**Action:** Change a state, focus a field, and show the accessibility addon.

---

## 12:20–13:20 — Accessibility, docs and release notes

**On screen:** Open Accessibility, run the contrast quick check, then Documentation and Changelog.

**Say:**

> “Accessibility is contextual. This contrast check helps compare two hex values, but it cannot replace a review of actual size, focus, disabled states, imagery, keyboard flow or assistive technology. The checklist keeps those questions close to implementation.”

**Action:** Open Documentation, expand a component-specific usage guide and inspect its tokens, styles and story link. Return to the component map, then open Changelog.

**Say:**

> “The usage guide links intent to implementation for all sixteen components, and the changelog records what the current release actually contains. The resource library is a shelf of references, not an endorsement list. The system should keep learning from the people who use it.”

---

## 13:20–14:00 — Closing: keep the language shared

**On screen:** Return to the overview and hold on the visual mark, four metrics and creator credit.

**Say:**

> “That is Forma end to end: a portable token source, an offline Figma bridge, React and Angular building blocks, and two Storybook workbenches. It is ready to adapt to a real product, a real team library and the feedback of real users. I’m Lulamile Mkhungela. Thank you for building with Forma.”

**End card:** `Forma Design System` · `One source. A shared language.` · `Created by Lulamile Mkhungela`

## Capture and edit notes

- Use chapter titles: **Overview · Guided path · Foundations · Component map · Figma · Tokens · Review · React Storybook · Angular · Accessibility & usage guide**.
- Keep terminal output and file paths legible. Show only the relevant code lines rather than scrolling through whole files.
- Show the Figma build and generated variables in the same take when possible; avoid implying that an unpublished library was attached or remotely synced.
- Keep test and contrast claims precise. The browser contrast helper is a ratio calculator, and addon results are not a certification.
- Blur account names or private work in Figma. Use a draft file and sample content.
- Add captions and a transcript. Publish the final video only after verifying the author credit, token count, plugin state and branch.
