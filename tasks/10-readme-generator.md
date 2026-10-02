# Step 10 — README generator

## Goal

A forked repo shouldn't keep shipping this template's own long README (the one
with "Why this exists" / "Quick Start" / etc. below) — that documents
`paper-page` itself, not the paper. `when-rubrics-fail` and `legal-reward-bench`
already converged on a short paper-specific format (title, one-line
description of the paper + authors, live link, resource links, citation,
footer credit) by hand; this step makes that format generated instead of
hand-maintained.

## Depends on

Steps 8–9 (`scripts/setup.py`, `_template/`, and the polished root README must
exist — this hooks into `setup.py` and documents itself alongside that README).

## Files created

- `scripts/yaml_lite.py` — Python port of `template/js/yaml-lite.js`'s parser
  (same subset: 2-space indent, block-style lists only, no flow style). Kept in
  lockstep with that file.
- `scripts/generate_readme.py` — reads `project.yaml` / `authors.yaml` /
  `citation.bib`, writes a `when-rubrics-fail`-style `README.md`. Runnable
  standalone (`python3 scripts/generate_readme.py`) any time those files change.
- `scripts/setup.py` — now calls `generate_readme.write_readme()` after
  blanking, so a fresh fork's `README.md` is the short placeholder-filled
  format from the start, not the template's own long README.

## Definition of done

- [ ] Running `scripts/generate_readme.py` against the demo paper's
      `project.yaml`/`authors.yaml`/`citation.bib` produces a well-formed
      short README (verified in a scratch copy, per `AGENTS.md`).
- [ ] Running `scripts/setup.py` against a scratch copy produces a placeholder
      README in the same format from the `_template/` blanked files.
- [ ] Feeding it `when-rubrics-fail`'s actual `project.yaml`/`authors.yaml`/
      `citation.bib` data reproduces that repo's real README byte-for-byte
      (confirms the format match, not just "renders something").
