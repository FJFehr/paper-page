# Migration plan

This is a future-work outline, not something executed as part of the documentation
phase. It exists so the architecture in
[04-architecture.md](04-architecture.md) is checked against a real requirement
(porting two actual papers) before it's built, and so the eventual porting work has a
checklist instead of starting from scratch.

## Prerequisite: backport the engine divergence, either direction, before porting

`legal-reward-bench`'s `content.js` added inline Markdown link support
(`[text](url)`) that `when-rubrics-fail`'s copy lacks (see
[02-comparison-matrix.md](02-comparison-matrix.md)). Whichever repo is ported first,
this fix should land in the shared `template/js/content.js` so it isn't lost or
re-diverged during the port.

## Per-repo changes needed to sit on the new template

### `when-rubrics-fail`

- Move `theme.js`'s palette/fonts/title values into `project.yaml`'s `theme:` block.
- Convert `content.md`'s slot/section markers into `project.yaml`'s `sections[].blocks[]`
  + one `content/*.md` file per block source.
- Convert the hardcoded 3-item `takeaways` section into the generalized `takeaways`
  block type (still 3 items for this paper — no content change, only structural).
- `authors.yaml` → new schema with an `affiliations:` lookup table. This paper has a
  single shared affiliation today, so the port is mechanical (one affiliation entry,
  every author references it) — no data is currently missing, unlike
  `legal-reward-bench`.
- `taxonomy.md` stays a plain `table` block — no change in kind, just wrapped in the
  new `sections[].blocks[]` reference.
- Resolve the metadata TODOs already flagged in this repo (citation PDF URL, DOI, etc.)
  while `project.yaml`'s single-entry metadata makes that a one-field fix instead of a
  six-place edit.

### `legal-reward-bench`

- Same mechanical changes as above (theme → YAML, content.md → sections/blocks,
  takeaways → generalized block), plus:
- **`authors.yaml` → new schema, and this time it's not mechanical**: populate the
  `affiliations:` lookup table with the three real affiliations (Oxford, Devoteam,
  OxAI) and assign each author their actual subset — this is the fix for the
  limitation the repo's own header comment already flags, not just a reformat.
- **Add the `results_table` block** (once its schema is finalized per the "open items"
  in the architecture doc) and re-express the 15-model × multiple-benchmark comparison
  currently only in prose/spider-chart-PNG form as structured data. The spider charts
  can stay as supplementary figures; the table becomes the primary, accessible,
  crawlable representation of the actual numbers.
- Resolve this repo's own open "porting status" TODOs (canonical hosting org/URL,
  missing `og-image.png`) using `project.yaml`'s `social.canonical_url`/`social.image`
  fields as the single place those get set.

## Sequencing

1. Build the template's `template/` engine + `scripts/setup.py`/`_template/` reset
   flow against the example/placeholder paper (principle 7), independent of either
   real repo.
2. Port `when-rubrics-fail` first — it's the mechanical case (no schema gaps to fill),
   so it validates the engine without also debugging a new component.
3. Build the `results_table` block against `legal-reward-bench`'s real data as the
   forcing function, then port that repo.
4. Only after both ports succeed, consider whether `when-rubrics-fail` or
   `legal-reward-bench` should become the "live" example in `paper-page` itself, or
   whether the fictional example paper (principle 7) stays as the shipped default.
