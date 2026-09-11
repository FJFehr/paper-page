# Architecture

This is a sketch to fix the boundaries and schema shape the principles require — it is
**not** the implementation. Field names and the exact repo tree may still shift once
templating actually starts; what should not shift without a deliberate decision is the
three-layer split and the specific gaps it closes (metadata duplication, per-author
affiliations, hand-edited JS theming).

## The three layers

```
┌──────────────────────────────┐
│           CONTENT            │   Markdown / YAML / BibTeX / figures / video
│  what the paper actually     │   — a paper author edits this and nothing else
│  says                        │   for the common case (principle 1)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│        CONFIGURATION         │   One project config: metadata, section list,
│  what the page is             │   resource links, design tokens
│  structurally                │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│           ENGINE             │   HTML/CSS/JS (+ a small setup/build script)
│  how it's rendered            │   — touched only when template *behavior*
│                               │   changes, per AGENTS.md
└──────────────────────────────┘
```

This differs from the current repos mainly in *where the line is drawn*: today,
`theme.js` (design tokens) sits in the engine layer even though users are expected to
edit it, and adding a new section/slot pair requires an engine edit even though it's
conceptually a content-layer change. Both move up a layer here.

## Proposed repo tree

```
paper-page/
├── AGENTS.md
├── README.md
├── docs/                     # this folder — design rationale, not consumed at runtime
├── tasks/                    # bite-sized build steps, see tasks/00-overview.md
├── index.html                # the engine shell — stays at repo root (see below), "don't touch"
├── project.yaml               # the control panel — see schema sketch below
├── authors.yaml
├── content/
│   ├── overview.md
│   ├── method.md
│   ├── results.md
│   ├── takeaways.yaml
│   ├── results-table.yaml    # the new results/leaderboard primitive's data
│   └── ...                   # one file per block source, named by section
├── assets/
│   ├── figures/
│   ├── logos/
│   ├── favicon.svg
│   └── og-image.png
├── citation.bib
├── template/                 # the rest of the engine — css/js, "don't touch"
│   ├── css/
│   └── js/
├── scripts/                  # deferred — see tasks/00-overview.md's "out of scope"
│   └── setup.py              # blanks content/ from _template/, per fjfehr.github.io
└── _template/                # blanked mirror of content/, authors.yaml, project.yaml
    └── ...                   # setup.py's source of truth for "a clean fork"
```

`index.html` sits at the repo **root**, not nested under `template/` — GitHub Pages
serves it from there, and every relative `fetch()` in the engine (`content/*.md`,
`project.yaml`, `assets/*`) resolves against the page's own location, so it can't be
nested a level deeper. It's still conceptually engine ("don't touch by default" per
`AGENTS.md`) despite its location — only `template/css/` and `template/js/` are
physically grouped under `template/`. This corrects an earlier draft of this tree
that nested `index.html` under `template/`, caught once schema/tree work moved from
sketch to `tasks/01-schema-and-tree.md`'s concrete implementation spec.

The `content/` vs `template/` naming directly mirrors what worked in
`fjfehr.github.io` (`content/` vs `index.html`/`css/`/`js/`) rather than inventing new
naming — principle 9 argues against novelty where an exemplar already works.

## `project.yaml` schema sketch

The sketch below is superseded in its exact field list by
[`tasks/01-schema-and-tree.md`](../tasks/01-schema-and-tree.md), written once
implementation actually needed a final answer (e.g. `social.favicon`, `footer.note`,
`theme.overrides`, and the named palettes being `sage`/`gold` — real values pulled
from the two source repos rather than the placeholder `indigo` below). Kept here for
the *shape*/rationale; treat the task file as authoritative for exact fields.

```yaml
paper:
  title: "Do Penguins Dream of Embeddings?"
  short_title: "Penguin Embeddings"
  description: "A fictional research project demonstrating the template."
  year: 2026
  venue: null
  doi: null
  arxiv: null

# One entry drives: visible page, <title>, OpenGraph, Twitter card,
# Scholar/Highwire meta, and citation UI — closing the six-way duplication
# documented in 01-principles.md #2.

resources:
  paper: null
  code: null
  dataset: null
  demo: null
  slides: null
  # engine infers icon/label per known key; unknown keys still render generically

social:
  image: assets/og-image.png
  canonical_url: null   # was a recurring unresolved TODO in both source repos

theme:
  palette: indigo        # named palette, following fjfehr.github.io's active_palette
  mode: auto
  fonts:
    serif: null           # falls back to engine default if unset
    sans: null

sections:
  - id: overview
    title: Overview
    nav: true
    blocks:
      - type: markdown
        source: content/overview.md
      - type: takeaways
        source: content/takeaways.yaml   # N items, not hardcoded at 3 — see component doc

  - id: results
    title: Results
    blocks:
      - type: results_table              # the net-new primitive
        source: content/results-table.yaml
      - type: markdown
        source: content/results.md

  - id: cite
    title: Citation
    blocks:
      - type: citation
        source: citation.bib
```

`sections`/`blocks` is what actually closes the "adding a new section requires an
`index.html` edit" gap: the engine renders whatever `sections[].blocks[]` describes,
generically, rather than expecting a matching hardcoded `<section
data-section-group="...">` to already exist in the markup.

## `authors.yaml` schema sketch — fixing the per-author-affiliation gap

```yaml
affiliations:
  - id: oxford
    name: University of Oxford
  - id: devoteam
    name: Devoteam
  - id: oxai
    name: Oxford Artificial Intelligence Society (OxAI)

authors:
  - name: Jane Smith
    url: https://...
    affiliations: [oxford, oxai]
    equal_contribution: true
    corresponding: false

correspondence:
  name: Jane Smith
  email: jane@example.com
```

This is the direct fix for the limitation `legal-reward-bench`'s own header comment
flags: affiliations become a lookup table, and each author references one or more by
id, instead of one shared `affiliation:` block for the whole list.

## Design tokens: YAML, not JS

`theme.js`'s object shape (`title`, `fonts`, `fontSizes`, `layout`, `colors.light`/
`.dark`) is sound — it's the file format that's the risk (principle 2/9). Move it
into `project.yaml`'s `theme:` block (or a separate `content/design.yaml` if it grows
large enough to warrant its own file), following `fjfehr.github.io`'s `design:` block
with a swappable named palette rather than requiring hex values to be re-entered per
paper.

## Metadata generation

Static crawler-readable metadata (OpenGraph, Twitter card, Scholar/Highwire meta,
`<title>`) cannot be produced by client-side JS alone (crawlers don't execute it —
both source repos' READMEs already say this). `scripts/setup.py`'s sibling — a small
`scripts/build.py` — reads `project.yaml` once and materializes those tags into
`index.html` (or a generated `index.html` from a template), consistent with principle
9's "no build-tool dependency, not necessarily no generation at all."

## Open items — resolved

These were open when this doc was first written; all three are now settled in
[`tasks/01-schema-and-tree.md`](../tasks/01-schema-and-tree.md) and
[`tasks/03-engine-js-foundation.md`](../tasks/03-engine-js-foundation.md):

- **`template/` vs `engine/`**: kept `template/`, holding only `css/`/`js/` now that
  `index.html`'s root-level placement is settled (see above).
- **`results_table` schema**: `columns[].{id, label, type, better}` + `rows[]`,
  best-per-column (not per-row) highlighting via each numeric column's own
  `better: higher|lower` — full spec in `tasks/01-schema-and-tree.md`.
- **`content/design.yaml` split**: not needed — `theme:` stays a small block inside
  `project.yaml` (`palette`/`mode`/`overrides` only; fonts/layout stay CSS-only
  defaults for this pass, per `tasks/03-engine-js-foundation.md`'s scope reduction).

## Open items for a future pass

- Fonts/layout as a configurable `theme:` surface, if a real ported paper needs to
  override them (deferred per principle 9 — no speculative config surface until a
  paper actually needs it).
- `scripts/build.py`'s exact metadata-generation mechanics (currently just named as
  a future step in `tasks/00-overview.md`, not designed).
