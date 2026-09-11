# Step 6 — Demo paper content

## Goal

A complete, obviously-fictional example paper that exercises every block type and
schema feature — per `docs/01-principles.md` §7, this repo's default state should
look finished, not like a wireframe.

## Depends on

Step 1's schema being final. Can be drafted in parallel with Steps 2–5, but can't be
verified rendering correctly until Step 5 exists (that's Step 7).

## The paper

**"Do Penguins Dream of Embeddings? A Benchmark for Latent Aquatic Reasoning"** —
the example from `docs/01-principles.md` §7. A benchmark paper (so it can exercise
`results_table`, the net-new component this whole build exists partly to prove out),
with enough qualitative content to exercise every other block type too.

## Files to create

- `project.yaml` (repo root) — following `tasks/01-schema-and-tree.md`'s schema
  exactly, with real (fictional) values: title, description, 5 resource links (mix
  of set and `null` to demonstrate the disabled-button state), `social.favicon`/
  `social.image` pointing at the assets below, `theme.palette: sage`, and the 4
  sections from the Step 1 example (`overview`, `method`, `results`, `cite`).
- `authors.yaml` — **5 authors across 2 affiliations** (not 1), specifically to
  exercise the per-author-affiliation fix from `docs/02-comparison-matrix.md`: e.g.
  3 authors at "University of Oxford," 2 at "Aquatic Intelligence Institute," with
  at least one author listing *both* (to prove the multi-affiliation-per-author
  case, not just multi-affiliation-per-list). Include at least one
  `equal_contribution: true` pair and one `corresponding: true` author.
- `citation.bib` — one real-shaped (fictional) BibTeX entry matching `project.yaml`'s
  title/authors/year.
- `content/tldr.md` — a 2-3 sentence TL;DR for the `callout` block.
- `content/overview.md` — a couple of paragraphs, includes at least one
  `[link](url)` to verify the link-support fix from Step 4, and at least one
  `## ` sub-heading to verify `markdown.js`'s new heading pass.
- `content/takeaways.yaml` — **4 items** (not 3, to prove the count is no longer
  hardcoded), at least one with an `anchor` pointing at a `results` subsection, at
  least one with `anchor: null`.
- `content/method.md` — prose describing the (fictional) method.
- `content/taxonomy.md` — a qualitative GFM table (e.g. failure modes of "aquatic
  reasoning"), 4-6 rows, at least one cell using `**bold**`/`*italic*`/`~~strike~~`
  to verify `tables.js`'s inline formatting still works unchanged.
- `content/results.md` — prose discussing the results table below.
- `content/results-table.yaml` — a `results_table` with **at least 3 columns** (one
  `text` model-name column + two `number` columns, one `better: higher` and one
  `better: lower`, to verify both highlight directions) and **at least 5 rows**, with
  the "best" value in each numeric column deliberately not in the same row, so the
  highlight logic is visibly exercised rather than trivially always-first-row.
- `assets/figures/pipeline.svg` — a simple hand-authored schematic (boxes + arrows,
  plain SVG shapes and `<text>`, no external tools needed) illustrating the
  fictional method's pipeline, referenced by a `figure` block in the `method`
  section with `position: right` (to exercise the float behavior, not just center).
- `assets/logos/oxu.svg`, `assets/logos/aqi.svg` — simple placeholder monogram/shape
  logos for the two fictional affiliations (hand-authored SVG, not real institution
  marks).
- `assets/favicon.svg` — a small, simple SVG icon (works directly as a favicon in
  modern browsers via `<link rel="icon" type="image/svg+xml">`).
- `assets/og-image.svg` — a placeholder social-card image at a 1200×630 viewBox
  (title + short author line on the `sage` palette's surface color), noted in a
  comment as a placeholder a real fork should replace with an exported PNG (SVG OG
  images have inconsistent crawler support — fine for local verification, flagged
  as a known limitation of this placeholder, not presented as production-ready).

## Definition of done

- [ ] Every block type from `docs/03-component-vocabulary.md`'s "in scope" list has
      at least one real instance in this content: `markdown`, `figure` (both
      `position: right` and default/center), `takeaways` (4 items, mixed
      anchor/no-anchor), `table` (qualitative, with inline formatting),
      `results_table` (both `better` directions), `callout`, `citation`.
- [ ] `authors.yaml` has an author with 2 affiliations, at least one
      `equal_contribution: true`, and a `correspondence` block.
- [ ] No file references an asset or content path that doesn't exist — cross-check
      every `source`/`src`/`logo`/`favicon`/`image` value in `project.yaml`/
      `authors.yaml` against the actual files created.
