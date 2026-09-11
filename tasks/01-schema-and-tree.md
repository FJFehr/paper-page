# Step 1 — Schema and repo tree

## Goal

Lock the `project.yaml` and `authors.yaml` field-by-field schemas, and fix the repo
tree in `docs/04-architecture.md` (`index.html` belongs at the repo root, not nested
under `template/`). Every later step codes against what's decided here — no engine
code is written in this step.

## Depends on

Nothing — this is the first step.

## Files to create/edit

- Edit `docs/04-architecture.md`: replace the proposed repo tree with the corrected
  one below, and add a short note explaining why `index.html` sits at root (GitHub
  Pages serves it from there; every relative `fetch()` — `content/*.md`,
  `project.yaml`, `assets/*` — resolves against the page's own location, so it can't
  be nested). No other section of that doc needs to change.
- No other files this step — `project.yaml`/`authors.yaml` themselves are written as
  real data in Step 6; this step only fixes the doc and fixes the schema in this task
  file for later steps to reference.

## Corrected repo tree

```
paper-page/
├── AGENTS.md
├── README.md                 # exists already if written; minimal for now (see tasks/00)
├── docs/
├── tasks/
├── index.html                 # engine shell — stays at root (GitHub Pages requirement)
├── project.yaml
├── authors.yaml
├── citation.bib
├── content/
│   ├── tldr.md
│   ├── overview.md
│   ├── takeaways.yaml
│   ├── method.md
│   ├── taxonomy.md
│   ├── results.md
│   └── results-table.yaml
├── assets/
│   ├── figures/
│   ├── logos/
│   ├── favicon.svg
│   └── og-image.svg
├── template/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── yaml-lite.js
│       ├── palettes.js
│       ├── theme.js
│       ├── markdown.js
│       ├── tables.js
│       ├── results-table.js
│       ├── blocks.js
│       ├── people.js
│       └── render.js
└── scripts/                   # deferred — not created this pass
```

## `project.yaml` schema (final for this pass)

```yaml
paper:
  title: "Do Penguins Dream of Embeddings? A Benchmark for Latent Aquatic Reasoning"
  short_title: "Penguin Embeddings"       # nav wordmark; keep brief
  description: "..."                      # meta description / OG / Twitter description
  year: 2026
  venue: null
  doi: null
  arxiv: null

resources:                                 # order here = render order
  paper: null
  code: https://github.com/...
  dataset: https://huggingface.co/...
  demo: null
  slides: null
  # Any key not in the built-in icon map below still renders as a labeled
  # button with a generic link icon — unknown keys are never dropped.

social:
  image: assets/og-image.svg               # OG/Twitter card image
  favicon: assets/favicon.svg               # <link rel="icon"> href
  canonical_url: null                       # left null until the repo has a real Pages URL

theme:
  palette: sage                             # "sage" | "gold" (see palettes.js, Step 3)
  mode: auto                                # "auto" | "light" | "dark" (initial only; visitor can still toggle)
  overrides: {}                             # optional: any CSS custom-property name -> value,
                                             # e.g. { "--green-dark": "#123456" }

footer:
  note: null                                # optional plain string; renders as-is in the footer, no Markdown

sections:
  - id: overview
    title: Overview
    nav: true
    blocks:
      - type: callout
        style: tldr
        source: content/tldr.md
      - type: markdown
        source: content/overview.md
      - type: takeaways
        source: content/takeaways.yaml

  - id: method
    title: Method
    nav: true
    blocks:
      - type: markdown
        source: content/method.md
      - type: table
        source: content/taxonomy.md
      - type: figure
        src: assets/figures/pipeline.svg
        alt: "Pipeline diagram"
        caption: "..."
        position: center        # left | right | center

  - id: results
    title: Results
    nav: true
    blocks:
      - type: results_table
        source: content/results-table.yaml
      - type: markdown
        source: content/results.md

  - id: cite
    title: Cite
    nav: true
    blocks:
      - type: citation
        source: citation.bib
```

Notes:
- `sections[].blocks[]` order is render order within that section — no separate
  DOM-order caveat like the current repos have, since blocks are generated in the
  order listed (this removes the "content.md order doesn't match render order"
  footgun documented in `docs/02-comparison-matrix.md`).
- A section with `nav: false` (or omitted) still renders on the page, just isn't
  linked from the header nav — useful for a section reachable only by an anchor
  link elsewhere (e.g. from a `takeaways` card).
- Hero (title/authors/affiliations/resource buttons) is **not** part of `sections[]`
  — it's engine-owned and always renders first, exactly as documented in
  `docs/03-component-vocabulary.md`. Footer is engine-owned and always last.

### Resource icon map (built into `blocks.js`/`render.js`, not configurable this pass)

| Resource key | Icon | Label default |
|---|---|---|
| `paper` | generic document icon | "Paper" |
| `arxiv` | arXiv wordmark | "arXiv" |
| `code` | GitHub mark | "Code" |
| `dataset` | Hugging Face mark | "Dataset" |
| `demo` | generic play/link icon | "Demo" |
| `slides` | generic document icon | "Slides" |
| *(any other key)* | generic link icon | key, title-cased |

A `null` value for any key renders that button as the existing disabled/inert state
(`.btn-disabled`, `aria-disabled="true"`), not omitted — consistent with
`docs/01-principles.md` §5 ("optional everything," absence as first-class state).

## `authors.yaml` schema (final for this pass — fixes the per-author-affiliation gap)

```yaml
affiliations:
  - id: oxu
    name: University of Oxford
    logo: assets/logos/oxu.svg          # optional; omitted -> no logo rendered for this affiliation
  - id: aqi
    name: Aquatic Intelligence Institute
    logo: assets/logos/aqi.svg

authors:
  - name: Jane Smith
    url: https://...
    affiliations: [oxu]
    equal_contribution: true
    corresponding: false
  - name: Kofi Mensah
    url: null
    affiliations: [oxu, aqi]
    equal_contribution: true
    corresponding: false
  - name: Priya Shah
    url: https://...
    affiliations: [aqi]
    equal_contribution: false
    corresponding: true

correspondence:
  name: Priya Shah
  email: priya@example.com
```

**Gotcha found during implementation**: `yaml-lite.js` does not support flow-style lists
(`affiliations: [oxu]`) — only block style (`affiliations:` on its own line, then
`- oxu` indented beneath it), even for a single-item list. Writing flow style throws
`TypeError: ... .forEach is not a function` at render time, not a parse error, so it's
easy to miss. Worth a callout in the eventual README.

Rendering rules for `people.js` (spec only — implemented in Step 5):
- Each author's affiliation superscripts are the 1-based index of each referenced
  `affiliations[]` entry (in the order that entry first appears across the whole
  author list), rendered as `<sup>` after the name, before the equal-contribution `*`.
- Affiliation logos render once each, in `affiliations[]` order, in the existing
  logo-row area of the hero — replacing the two hardcoded `#oxford-logo`/
  `#oxai-logo-wrap` ids with a generic loop over `affiliations[]`. An affiliation with
  no `logo` field renders no image but still contributes its superscript number and
  its `name` as an accessible label if a visitor hovers/inspects (use `title`
  attribute on the superscript, not a visible institution name row — matches the
  current "logos only" convention documented in `docs/02-comparison-matrix.md`).
- `equal_contribution` and `corresponding` behave as today: an equal-contribution
  note renders (existing `#equal-contribution-note`-style behavior) only if at least
  one author has it; `corresponding: true` feeds `correspondence` fallback display
  but `correspondence:` block's own `name`/`email` remain the authoritative source
  if both are present (avoids ambiguity if `corresponding: true` is set on more than
  one author by mistake — the block, not the flag, wins for the actually-displayed
  name/email).

## `results_table` block source schema (`content/results-table.yaml`)

```yaml
caption: "Benchmark comparison across reward models"
columns:
  - id: model
    label: Model
    type: text
  - id: lrb
    label: LRB
    type: number
    better: higher       # "higher" | "lower" — which extreme gets the .best highlight
  - id: cjb
    label: CJB
    type: number
    better: higher
rows:
  - model: "Model A"
    lrb: 0.82
    cjb: 0.75
  - model: "Model B"
    lrb: 0.88
    cjb: 0.79
```
`type: number` columns render right-aligned; the max (`better: higher`) or min
(`better: lower`) value in each numeric column gets a `.best` class (bold + accent
color, per Step 2's CSS). `type: text` columns (always including at least one, the
row label) render left-aligned, no highlighting.

## `takeaways` block source schema (`content/takeaways.yaml`)

```yaml
- title: "Grounded reasoning beats scale."
  body: "..."
  anchor: "#finding-1"     # optional; card becomes a jump-link if present
- title: "..."
  body: "..."
  anchor: null
```
N items, not fixed at 3 — the existing `.takeaway`/`.takeaways-grid` CSS is already a
flex column stack, so no CSS change is needed for a different count (confirmed in
`docs/03-component-vocabulary.md`).

## Definition of done

- [ ] `docs/04-architecture.md`'s tree diagram matches the corrected tree above, with
      the root-`index.html` rationale noted.
- [ ] This file's schemas are what Steps 2–6 build against — no further schema
      decisions should be needed mid-implementation; if one comes up, resolve it here
      first, then continue.
