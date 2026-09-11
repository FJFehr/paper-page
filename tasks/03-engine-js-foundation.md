# Step 3 — Engine JS foundation: YAML parsing + theming

## Goal

The two things every other JS module depends on: a YAML parser, and a theming system
driven by named palettes instead of one hardcoded `THEME` object.

## Depends on

Step 2 (the CSS custom-property names `theme.js` sets must already exist in
`template/css/style.css`).

## Files to create

- `template/js/yaml-lite.js`
- `template/js/palettes.js`
- `template/js/theme.js`

## `yaml-lite.js`

Port **verbatim** from `when-rubrics-fail`'s `static/js/yaml-lite.js` (full source
captured during this session's research). No changes needed: its grammar already
handles everything `project.yaml`/`authors.yaml` need —

- 2-space-indented nested mappings and lists (confirmed: a mapping-list-item's own
  key with a blank value, followed by a further-indented list, recurses correctly —
  this is exactly `sections[].blocks[]`'s shape).
- Lists of mappings (`authors:`, `sections:`, `blocks:`, `affiliations:`,
  `columns:`, `rows:`).
- `#` comments, `null`/`~`/empty → `null`, `true`/`false` → boolean, quoted and bare
  string scalars.

Confirmed **not** needed for this pass's schema: flow style (`[a, b]`), multiline
block scalars, anchors/aliases — the schema in `tasks/01-schema-and-tree.md` was
written to stay inside yaml-lite's supported grammar deliberately.

Single entry point: `parseYamlLite(text)` → object/array tree, exposed as a global
function (not wrapped in an IIFE, matching the source file, since `main.js`/
`render.js` calls it directly).

## `palettes.js`

New file. Exposes a global `PALETTES` object with two named palettes, using the
**real, already-WCAG-checked hex values** found in this session's research —
not invented colors:

```js
const PALETTES = {
  sage: { // ported from when-rubrics-fail/static/js/theme.js
    light: {
      background: "#F5F0E6", surface: "#FBF7EF", text: "#2A2521",
      textMuted: "#6E6759", border: "#DED4C0", rule: "#C9BC9E", linkHover: "#16350F",
      primary:   { dark: "#328132", mid: "#61CA53", light: "#DCF5DC", text: "#256025" },
      secondary: { dark: "#75639B", mid: "#B7A9D6", light: "#EEEAF5", text: "#5F5085" },
      accent:    { dark: "#D98A45", mid: "#F1C38F", light: "#FBF1E6", text: "#8C4E1C" },
    },
    dark: {
      background: "#1E1A16", surface: "#28231E", text: "#EDE6D8",
      textMuted: "#A79C8A", border: "#3A332B", rule: "#453D33", linkHover: "#86B77B",
      primary:   { dark: "#61CA53", mid: "#61CA53", light: "#26301F", text: "#6E9C64" },
      secondary: { dark: "#B7A9D6", mid: "#B7A9D6", light: "#2A2733", text: "#C6BADF" },
      accent:    { dark: "#D98A45", mid: "#F1C38F", light: "#332822", text: "#E2A468" },
    },
  },
  gold: { // ported from legal-reward-bench/static/js/theme.js -- neutrals kept
          // identical to `sage`'s per that repo's own "cross-site consistency"
          // note (docs/02-comparison-matrix.md); re-derive exact dark/text tones
          // from that file's source during implementation if any value here needs
          // double-checking against the original.
    light: {
      background: "#F5F0E6", surface: "#FBF7EF", text: "#2A2521",
      textMuted: "#6E6759", border: "#DED4C0", rule: "#C9BC9E", linkHover: "#16350F",
      primary:   { dark: "#DEB73F", mid: "#DEB73F", light: "#FBF1D6", text: "TODO-verify-against-source" },
      secondary: { dark: "#6F95C4", mid: "#6F95C4", light: "#E6EDF6", text: "TODO-verify-against-source" },
      accent:    { dark: "#D08A52", mid: "#D08A52", light: "#F6E9DD", text: "TODO-verify-against-source" },
    },
    dark: {
      background: "#1E1A16", surface: "#28231E", text: "#EDE6D8",
      textMuted: "#A79C8A", border: "#3A332B", rule: "#453D33", linkHover: "#86B77B",
      primary:   { dark: "TODO", mid: "TODO", light: "TODO", text: "TODO" },
      secondary: { dark: "TODO", mid: "TODO", light: "TODO", text: "TODO" },
      accent:    { dark: "TODO", mid: "TODO", light: "TODO", text: "TODO" },
    },
  },
};
```

The `gold` entries marked `TODO` should be read directly from
`/home/fabio/Projects/legal-reward-bench/static/js/theme.js` at implementation time
(this session's research quoted the light-mode identity — gold/steel-blue/brown-orange
— but not every exact dark-mode hex) rather than guessed. `sage`'s values above are
already the exact, verified source values — use them as-written.

## `theme.js`

Adapts the current `applyTheme(mode)` (which reads a global `THEME` const) into a
parameterized `applyTheme(themeConfig, mode)`:

```js
function applyTheme(themeConfig, mode) {
  const palette = (PALETTES[themeConfig.palette] || PALETTES.sage)[mode] || PALETTES.sage.light;
  const root = document.documentElement.style;
  const set = (name, value) => root.setProperty(name, value);

  set("--color-bg", palette.background);
  set("--color-surface", palette.surface);
  // ...same 12 base/triad properties as the current applyTheme, reading `palette`
  // instead of `THEME.colors[mode]`...

  // Fonts/layout/font-sizes: NOT part of themeConfig for this pass (project.yaml's
  // theme: block only has palette/mode/overrides per tasks/01) -- these stay as
  // CSS defaults in template/css/style.css directly, no JS-set override. Revisit
  // if a future paper needs a font override; not needed by the demo content.

  // Apply project.yaml's theme.overrides last, so they win over the named palette.
  Object.entries(themeConfig.overrides || {}).forEach(([name, value]) => set(name, value));
}
```

Note the scope reduction from the current `theme.js`: no `fonts`/`fontSizes`/`layout`
keys in `themeConfig`, since those aren't part of this pass's `theme:` schema (see
Step 1) — only `palette`/`mode`/`overrides`. Font/layout tokens stay CSS-only
defaults for now; adding a config surface for them is a candidate for a future task
if a real paper needs it (principle 9: no speculative additions).

## Definition of done

- [ ] `parseYamlLite` correctly parses a hand-written test snippet shaped like
      `project.yaml`'s `sections:` (list of mappings, each with a nested `blocks:`
      list of mappings) — check in a browser console before moving on.
- [ ] `applyTheme({palette: "sage", overrides: {}}, "light")` and `"dark"` both set
      all CSS custom properties from Step 2 with no `undefined` values.
- [ ] `applyTheme({palette: "gold", ...}, ...)` works once the `TODO` values are
      filled from the real `legal-reward-bench/static/js/theme.js` source.
- [ ] `theme.overrides` demonstrably wins over the named palette (test with one
      override key).
