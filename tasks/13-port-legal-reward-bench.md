# Step 13 — Port `legal-reward-bench` onto paper-page

## Goal

Rebuild the live `legal-reward-bench` page on this engine, and fix the two
problems the template was designed around: per-author affiliations and a real
results table. See `docs/05-migration-plan.md`.

## Depends on

Steps 11 and 12 (the WRF port shakes out any porting issues first).

## Work, in the `legal-reward-bench` repo

- Do everything Step 12 does (engine in, `theme.js`/`links.yaml`/`content.md`
  converted, `<head>` tags copied, footer kept).
- **Affiliations**: three `affiliations:` entries (University of Oxford, Devoteam,
  OXAI). Each author lists their own. Valentin Noël is Devoteam only. Check the
  others against `Legal_Reward_Modelling/arxiv_release.tex`. Delete the "KNOWN
  LIMITATION" comment once this is done.
- **Venue and talk**: `links.yaml`'s `venue:` and `talk:` become map-style
  `resources:` entries (Step 11) with the ICML and Hack the Law icons.
- **Results**: add a `results_table` block built from the paper's numbers in
  `arxiv_release.tex`. Keep the spider charts as supporting figures, with
  `src_dark` for their dark versions.
- Keep the TL;DR `description` as `paper.description` (it already drives the
  OG text).

## Definition of done

- [ ] Side by side with https://fjfehr.github.io/legal-reward-bench/, nothing
      visible is lost, and the affiliations are now correct per author.
- [ ] Every number in the results table traces back to `arxiv_release.tex`.
- [ ] Zero console errors, light and dark.
- [ ] Merged only after the user has reviewed a preview.
