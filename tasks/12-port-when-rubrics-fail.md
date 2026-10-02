# Step 12 — Port `when-rubrics-fail` onto paper-page

## Goal

Rebuild the live `when-rubrics-fail` page on this engine, following
`docs/05-migration-plan.md`. It goes first because it's the mechanical case: one
affiliation and no results table, so it tests the engine without also needing
new features.

## Depends on

Step 11 (its figures use dark-mode variants).

## Work, in the `when-rubrics-fail` repo

- Start a branch. Bring in `index.html`, `template/`, and `scripts/` from
  paper-page. Remove `static/js/`.
- `theme.js` palette, fonts and title → `project.yaml`'s `theme:` and `paper:`
  (add a named palette in `template/js/palettes.js` if `sage`/`gold` don't
  match).
- `links.yaml` → `project.yaml`'s `resources:` / `paper.arxiv`.
- `content.md` slots and sections → `project.yaml`'s `sections[].blocks[]`, with
  one `content/*.md` per block. The three findings become a `takeaways` block.
- `authors.yaml` → new schema: one `affiliations:` entry that every author
  references, plus `equal_contribution` for the three marked authors.
- `taxonomy.md` → `content/taxonomy.md` as a `table` block.
- Image slots with `dark:` → `figure` blocks with `src_dark`.
- Copy the hand-filled `<head>` tags (canonical, OG, `citation_*`) between the
  `meta:start` / `meta:end` markers.
- Keep the footer credit.

## Definition of done

- [ ] Side by side with https://fjfehr.github.io/when-rubrics-fail/, nothing
      visible is lost (text, figures, links, dark mode).
- [ ] Zero console errors, light and dark.
- [ ] `scripts/generate_readme.py` reproduces the repo's current README (allowing
      for whitespace differences in `citation.bib`).
- [ ] Merged only after the user has reviewed a preview.
