# Step 7 — Verification

## Goal

Confirm the engine + demo content actually work end-to-end, and that the
architecture delivers on `docs/01-principles.md` §10's test: every listed change
resolves in exactly one place.

## Depends on

Steps 1–6 all complete.

## Procedure

1. **Serve locally.** From the repo root: `python3 -m http.server 8000`, open
   `http://localhost:8000/`. (Opening `index.html` directly via `file://` will fail —
   `fetch()` is blocked there, same limitation as the source repos.)
2. **Console check.** Open devtools console. Zero errors on load. Any `console.warn`
   should be traceable to a deliberately-missing/unsupported case (there shouldn't
   be any in the demo content itself, since Step 6 cross-checked every reference).
3. **Visual walk of every block type**, confirming against Step 6's checklist:
   - Hero: title, 5 authors with correct affiliation superscripts (verify the
     multi-affiliation author shows *two* superscript numbers, in the right order),
     equal-contribution note visible, 2 affiliation logos, resource buttons (set
     links clickable and open in a new tab; `null` links render disabled/inert, not
     missing).
   - `overview` section: TL;DR callout renders styled distinctly from plain prose;
     the `[link](url)` in `overview.md` renders as a working link; the `##`
     sub-heading renders as a real heading, not literal `##` text; 4 takeaway cards
     render (not 3), the ones with an `anchor` are clickable jump-links, the one
     without isn't.
   - `method` section: the qualitative table renders with zebra striping and correct
     inline formatting (bold/italic/strikethrough visible, not literal `**`/`~~`);
     the figure renders on the right with text wrapping beside it (not centered).
   - `results` section: the results table renders with the best value correctly
     bolded/colored per column, independently in the `higher`-is-best and
     `lower`-is-best columns, and not always in the same row.
   - `cite` section: BibTeX renders, copy button copies the exact `citation.bib`
     text (paste-check), button shows the "✓ Copied" confirmation state.
4. **Interaction check**: theme toggle switches the whole page's palette (not just
   background/text — check the accent-colored elements too) and persists across a
   reload; scroll-spy nav highlights the section currently in view; resizing to
   below 600px/768px/480px triggers the documented responsive behavior (figure
   un-floats, table drops a column if applicable, header wraps).
5. **Responsive/dark-mode combined check**: toggle dark mode, then resize — confirm
   nothing regresses (e.g. the white-background-behind-transparent-figure fix noted
   in `docs/02-comparison-matrix.md`'s CSS findings isn't needed here since this
   demo's figures aren't transparent-PNG diagrams, but do confirm the SVG figure
   remains legible in dark mode).
6. **Run the `docs/01-principles.md` §10 test** explicitly, one row at a time,
   confirming each is a single-place edit with no code touched:
   - Change the title → one field (`project.yaml`'s `paper.title`).
   - Add an author → one file (`authors.yaml`), one list entry.
   - Add a results section with a new block → `project.yaml`'s `sections[]` +
     one new `content/` file, no engine edit.
   - Change the color palette → one field (`theme.palette`).
   - Replace a figure → one asset file + one `src` reference.
   - Reorder two sections → reorder `project.yaml`'s `sections[]` list.
   - Add a benchmark leaderboard → the `results_table` block, populated from a
     `content/*.yaml` file.
   For each, actually make the edit against a scratch copy, reload, confirm it
   worked, then revert — don't just reason about it, verify it.

## Definition of done

- [x] Steps 1-3 (serve, console/load-path check, block-by-block correctness) and
      step 6 (the §10 test) verified without a browser: every `fetch()`-ed path
      (`project.yaml`, `authors.yaml`, every `content/*` source, `citation.bib`,
      every `assets/*` reference) returns 200 when served locally; `template/js/*`
      was read block-by-block against the actual demo content (hero
      affiliations/superscripts, 4 takeaway cards with/without `anchor`, taxonomy
      table's zebra/bold/italic/strikethrough, results-table best-value-per-column
      spread across three different rows, citation copy wiring) and matches; the
      §10 single-place-edit test holds for all 7 scenarios by inspecting the
      `sections[].blocks[]` indirection.
- [ ] Steps 4-5 (theme persistence across reload, scroll-spy, responsive
      breakpoints at 600/768/480px, dark-mode + resize combined, and an actual
      clipboard paste-check) need a live browser and were **not** verified this
      pass (no browser tool was available in that session) — still open, do this
      manually via `python3 -m http.server 8000` before treating this step as
      fully closed.
- [x] One bug found and fixed in the relevant Step-1/3 file: `project.yaml`'s
      `theme.overrides: {}` used flow-style YAML, which `yaml-lite.js` doesn't
      support (documented in its own header), so it silently parsed to the
      string `"{}"` instead of an empty object — harmless today (invalid
      CSS-custom-property names are no-ops) but would silently no-op any real
      override a paper author wrote the natural way. Fixed to a blank
      `overrides:` line, which `theme.js`'s `|| {}` fallback already handles.
- [ ] This closes out the "engine + demo content" pass — pending the Steps 4-5
      manual browser pass above. Deferred work (`scripts/setup.py`,
      `scripts/build.py`, the metadata-generation GitHub Action, migrating
      `when-rubrics-fail`/`legal-reward-bench` onto this template per
      `docs/05-migration-plan.md`) becomes its own future `tasks/08+` sequence,
      planned separately. (README polish, also listed as deferred here
      originally, was drafted and committed ahead of schedule.)
