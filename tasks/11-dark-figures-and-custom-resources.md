# Step 11 — Dark-mode figures and custom resource buttons

## Goal

Close the two engine gaps that stop `when-rubrics-fail` and `legal-reward-bench`
being ported onto this template without losing anything they show today. Both
are grounded in what those repos already do (per `AGENTS.md`'s "no speculative
additions" rule), not new ideas.

## Depends on

Steps 1–10. Must land before Steps 12 and 13.

## Gap 1: dark-mode figure variants

Both live pages swap a figure for a dark-theme version:
- `when-rubrics-fail/content.md` image slots take an optional
  `dark: static/images/...-dark.gif` line (e.g. `figure-1-blind-spot-dark.gif`).
- `legal-reward-bench/index.html` hardwires a second `<img class="theme-only-dark">`
  for `legal-reward-pipeline-dark.gif`.

The `figure` renderer in `template/js/blocks.js` takes one `src` only.

**Change**: add an optional `src_dark` to the `figure` block. When it's present,
render both images and let CSS show the one that matches the active theme (same
`theme-only-*` approach as the source repos). Document it in `project.yaml`'s
comments, `docs/03-component-vocabulary.md`, and `_template/project.yaml`.

## Gap 2: resource buttons with a custom label, icon and tooltip

`legal-reward-bench/links.yaml` has `venue:` (ICML 2026 AI4Law Workshop) and
`talk:` (Hack the Law, Cambridge) entries, each a map of `label`, `title`
(hover tooltip) and `url`. `static/js/main.js` renders them as resource buttons
with their own icons (`ICON_ICML`, `ICON_HACK_THE_LAW`).

In this template, `project.yaml`'s `resources:` values are plain URLs, and unknown
keys get a generic label and icon.

**Change**: let a `resources:` value be either a URL (unchanged behaviour) or a
map with `url` and optional `label`, `title` and `icon` (a path under
`assets/`). Update `scripts/generate_readme.py` to read `url` from either form.

## Definition of done

- [ ] The demo paper uses both features at least once (one `src_dark` figure, one
      map-style resource), so the demo still covers every block option.
- [ ] Existing string-only `resources:` entries render exactly as before.
- [ ] Serving the repo shows zero console errors in light and dark mode
      (`tasks/07-verification.md`).
- [ ] `scripts/setup.py` on a scratch copy still produces a clean placeholder page,
      and `_template/` documents both options in comments.
