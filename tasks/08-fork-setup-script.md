# Step 8 — Fork setup script and blanked template mirror

## Goal

Build the actual fork-and-go reset mechanism named as deferred work in
`tasks/00-overview.md` and sketched in `docs/04-architecture.md`: `scripts/setup.py`
plus a `_template/` blanked mirror, ported from the working pattern in
`fjfehr.github.io`'s `setup.py`/`_template/`. After this step, forking the repo and
running one command replaces the "Penguin Embeddings" demo paper with clean,
self-documenting placeholder files.

## Depends on

Steps 1–7 (the engine and demo content must exist and render before there's anything
meaningful to blank).

## Files to create

- `scripts/setup.py` — two phases, following `fjfehr.github.io/setup.py`'s shape:
  1. Copy every file under `_template/` onto its live counterpart, overwriting
     `project.yaml`, `authors.yaml`, `citation.bib`, and every file under `content/`.
  2. Delete the demo-only assets that have no generic placeholder:
     `assets/figures/pipeline.svg`, `assets/logos/oxu.svg`, `assets/logos/aqi.svg`.
     Leave `assets/favicon.svg` untouched (it's already generic — a plain document
     icon, not penguin-branded). `assets/og-image.svg` **is** replaced (from
     `_template/assets/og-image.svg`), not deleted, since every fork needs some OG
     card.
  - Print a next-steps checklist naming each file to fill in, same style as
    `fjfehr.github.io/setup.py`'s `main()` output.
- `_template/project.yaml` — placeholder `paper:`/`resources:`/`social:`/`theme:`
  fields (e.g. `title: "Your Paper Title"`), and **one** worked example section
  (not the demo's four: overview/method/results/cite) so the `sections[].blocks[]`
  format is demonstrated without forcing a new user to delete penguin-specific
  sections first.
- `_template/authors.yaml` — one placeholder affiliation, one placeholder author,
  matching the real schema (`affiliations:`/`authors:`/`correspondence:`).
- `_template/citation.bib` — one placeholder BibTeX entry.
- `_template/content/tldr.md`, `overview.md`, `method.md`, `results.md` — short
  instructional placeholder prose in the style of
  `fjfehr.github.io/_template/content/site/bio.md` ("Write your ... here").
- `_template/content/takeaways.yaml` — one placeholder item, with a comment noting
  any number of items is supported.
- `_template/content/taxonomy.md` — a 1-row placeholder Markdown table.
- `_template/content/results-table.yaml` — a minimal 1–2 row skeleton matching the
  `results_table` schema in `tasks/01-schema-and-tree.md`.
- `_template/assets/og-image.svg` — a generic "Your Paper Title" placeholder card,
  same viewBox/dimensions as the demo's `assets/og-image.svg`.

## Definition of done

- [ ] Running `python3 scripts/setup.py` against a scratch copy of the repo (not the
      working tree) replaces every live content/config file with its `_template/`
      counterpart, deletes the three demo-only assets, and leaves `favicon.svg`
      untouched.
- [ ] The scratch copy still renders with zero console errors after setup (serve with
      `python3 -m http.server`, confirm no missing-asset/broken-YAML errors) — a
      forker who hasn't edited anything yet should see a working placeholder page,
      not a broken one.
- [ ] The printed checklist names every file a user actually needs to edit next.
