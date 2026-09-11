# Step 4 — Block renderers

## Goal

The content-rendering layer: one module per concern (inline Markdown, qualitative
tables, results tables) plus a dispatcher that turns a `blocks[]` entry from
`project.yaml` into DOM.

## Depends on

Step 1 (block schemas), Step 2 (CSS classes each renderer must apply: `.md-table`,
`.results-table`, `.callout`, `.takeaways-grid`/`.takeaway`, `.fig-left`/`.fig-right`).

## Files to create

- `template/js/markdown.js`
- `template/js/tables.js`
- `template/js/results-table.js`
- `template/js/blocks.js`

## `markdown.js`

Extracted from `when-rubrics-fail`'s `content.js`, **with the `legal-reward-bench`
link-support fix folded in** (this is the one genuine engine improvement found in
`docs/02-comparison-matrix.md` that never made it back upstream):

- `escapeHtml(str)` — unchanged.
- `mdInline(text)` — port verbatim from `legal-reward-bench`'s version (the one with
  link support), not `when-rubrics-fail`'s: escape → `[text](url)` →
  `<a href="url" target="_blank" rel="noopener">text</a>` (regex
  `/\[([^\]]+)\]\(([^)\s]+)\)/g`, run **first**, before `**bold**`/`*italic*`/`` `code` ``,
  for the exact reason documented in that repo's own comment — a URL's characters
  can't be misread as those markers, and the emitted `<a>` tag can't be re-mangled by
  the later substitutions).
- `mdBlock(raw)` — port the existing paragraph/list-detection logic (blank-line-
  separated paragraphs, or an ordered/bulleted list if every line matches), **plus a
  new heading pass**: since blocks now render into a generic container (a `<div>`
  the dispatcher creates), not a pre-existing `<h1>`/`<h2>`/`<h3>` slot element, a
  line starting with `#`/`##`/`###` inside a markdown block's raw text must become
  a real heading element in the output, not stripped. Extend `mdBlock` to split the
  trimmed input on heading lines first (`/^(#{1,3})\s+(.+)$/m`), emitting
  `<h2>`/`<h3>`/`<h4>` (offset by one from the `#` count, since the section itself
  already has an `<h2>` from its `title` — see `blocks.js` below) for matched lines
  and running the existing paragraph/list logic on everything between them.
- `stripHeadingMarker` becomes unnecessary in the block-rendering path (headings are
  now handled by the new pass in `mdBlock`) but keep it if `blocks.js`'s `figure`
  caption or `takeaways` title still want a plain-text heading strip — check when
  wiring `blocks.js`; drop the function only if genuinely unused.

## `tables.js`

Port `parseMarkdownTable`/`splitRow`/`renderTable` **verbatim** from
`when-rubrics-fail`'s `static/js/tables.js` — already confirmed generic and reused
byte-identical across both source repos. The only change: `renderTable(el, markdown)`
is now called by `blocks.js` on a `<table>` element **it just created**, not one
already sitting in `index.html` with a `data-md-table` attribute — so drop the
`loadTables()`/`querySelectorAll("[data-md-table]")` orchestration function (that
responsibility moves to `blocks.js`/`render.js`), keep everything else.

## `results-table.js`

New module implementing the `results_table` schema from `tasks/01-schema-and-tree.md`:

```js
function renderResultsTable(el, data) {
  // data = { caption, columns: [{id, label, type, better}], rows: [{...}] }
  el.classList.add("md-table", "results-table");
  // <caption> if data.caption is set.
  // <thead>: one <th> per column, from columns[].label.
  // For each numeric column, precompute the best value across rows:
  //   Math.max(...) if better === "higher", Math.min(...) if "lower".
  // <tbody>: one <tr> per row; for each column, a <td> with
  //   data-col-type="number"|"text" (drives the CSS from Step 2), and a `.best`
  //   class on the cell whose value === that column's precomputed best.
  // Cell text for number columns: render the raw numeric value as-is (no forced
  // decimal-place rounding this pass -- author controls precision in the YAML).
}
```

Reuses `mdInline` from `markdown.js` for any `**bold**`/`*italic*` inside text-type
cells (e.g. a model name with a footnote marker), same as `tables.js` does.

## `blocks.js`

The dispatcher — one function per `type`, all with the signature
`(container, blockConfig) => Promise<void> | void`:

| `type` | Behavior |
|---|---|
| `markdown` | `fetch(blockConfig.source)` → `mdBlock()` → set `container.innerHTML`. |
| `figure` | No fetch — `src`/`alt`/`caption`/`position` are inline in `blockConfig` (per Step 1's schema). Build `<figure><img></figure>` (+ `<figcaption>` via `mdInline` if `caption` set); apply `.fig-left`/`.fig-right` per `position`, same rule as the current `parseImage`/`applySlots` logic (`center` or unset removes both modifier classes). |
| `takeaways` | `fetch(blockConfig.source)` → parse YAML list → build `.takeaways-grid` of N `.takeaway` cards (`<a href="anchor">` if `anchor` set, else a non-link `<div>`), each with a bold lead (`title`) + `mdInline(body)`. |
| `table` | Create an empty `<table>`, append to container, call `renderTable()` from `tables.js` with the fetched markdown. |
| `results_table` | `fetch(blockConfig.source)` → parse YAML → create `<table>`, call `renderResultsTable()` from `results-table.js`. |
| `callout` | `fetch(blockConfig.source)` → `mdBlock()` → wrap in `<div class="callout callout-{style}">`. |
| `citation` | `fetch(blockConfig.source)` (raw text, no parsing) → build the `<pre id="bibtex-block">` + copy button markup (same DOM shape `render.js`'s `renderBibtex` from Step 5 expects — coordinate the exact element ids between this step and Step 5 when implementing, since `citation` needs the copy-button wiring that lives in `render.js`). |

`blocks.js` exposes one entry point, `renderBlock(container, blockConfig)`, that
switches on `blockConfig.type` and calls the matching case above. An unrecognized
`type` (one of the "named but unbuilt" vocabulary entries — `cards`, `metrics`,
`video`, `embed`, `code`, `custom`) renders a visible, clearly-labeled placeholder
(`<div class="block-unsupported">Block type "X" isn't implemented yet.</div>`) and
`console.warn`s — never silently drops the block, so a typo or an aspirational block
type in `project.yaml` is easy to spot rather than mysteriously missing.

## Definition of done

- [ ] Each block type renders correctly against a hand-written test `blockConfig`
      object in a browser console, independent of `render.js` existing yet (stub the
      container as a detached `<div>`).
- [ ] `results-table.js`'s best-per-column highlighting is verified against both
      `better: higher` and `better: lower` columns with a small hand-written dataset.
- [ ] The link-support fix in `markdown.js`'s `mdInline` is verified: a
      `[text](url)` in a markdown block source renders as a working `target="_blank"`
      link, and doesn't break adjacent `**bold**`/`*italic*` in the same sentence.
- [ ] An unrecognized block `type` renders the placeholder + console warning, not a
      silent no-op or a thrown error that stops the rest of the page rendering.
