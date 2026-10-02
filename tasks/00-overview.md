# Build sequence overview

This folder breaks "build the generic engine + demo paper" into ordered, individually
executable steps. Each file below is self-contained enough to execute without
re-reading this whole research pass — but do read [`docs/`](../docs/) first if the
*why* behind a decision isn't obvious from the task file alone.

## Scope of this pass

**In scope**: the rendering engine (`index.html` + `template/css/` + `template/js/`)
and a complete fictional demo paper's content (`project.yaml`, `authors.yaml`,
`citation.bib`, `content/`, `assets/`) that exercises every block type.

**Covered by `tasks/08-09`**: `scripts/setup.py` (the fork-reset script), `_template/`
(the blanked mirror `setup.py` copies from), and the final polished README.

**Still out of scope, deferred beyond `tasks/09`**: `scripts/build.py` (the
static-metadata generator) and the GitHub Action that would run it. Until those
exist, `project.yaml`'s metadata is only reflected in `index.html`'s `<head>` by
hand — this is a known, accepted gap (see [`docs/01-principles.md`](../docs/01-principles.md)
§2 and §9's "no framework, but a tiny generation step is fine" distinction; the
generation step just isn't built yet).

## Sequence

Execute one at a time. Each ends with its own "Definition of done" — confirm that
before starting the next step; don't batch multiple steps into one sitting.

1. **[01-schema-and-tree.md](01-schema-and-tree.md)** — finalize `project.yaml` /
   `authors.yaml` schemas field-by-field; fix `docs/04-architecture.md`'s repo tree
   (`index.html` at root, not nested under `template/`). Produces no engine code —
   this is the contract every later step codes against.
2. **[02-engine-shell.md](02-engine-shell.md)** — `index.html` shell + `template/css/style.css`.
   Depends on Step 1's schema (element ids, class names referenced by later JS).
3. **[03-engine-js-foundation.md](03-engine-js-foundation.md)** — `yaml-lite.js`,
   `palettes.js`, `theme.js`. Depends on Step 2 (the CSS custom-property names it sets).
4. **[04-engine-js-blocks.md](04-engine-js-blocks.md)** — `markdown.js`, `tables.js`,
   `results-table.js`, `blocks.js`. Depends on Step 1 (block schemas) and Step 2
   (the CSS classes each renderer targets).
5. **[05-engine-js-render.md](05-engine-js-render.md)** — `people.js`, `render.js`
   (the orchestrator). Depends on Steps 2–4 — this is where everything gets wired
   together and the page actually becomes interactive.
6. **[06-demo-content.md](06-demo-content.md)** — the fictional paper's actual content
   files. Depends on Step 1's schema being final; can be drafted in parallel with
   Steps 2–5 but can't be *verified* until Step 5 is done (nothing renders it before then).
7. **[07-verification.md](07-verification.md)** — serve it, click through it, fix what's
   broken. Depends on everything above.
8. **[08-fork-setup-script.md](08-fork-setup-script.md)** — `scripts/setup.py` +
   `_template/` blanked mirror, porting the working pattern from
   `fjfehr.github.io`. Depends on Step 7 (there must be a real demo to blank).
9. **[09-readme-and-license.md](09-readme-and-license.md)** — the polished README
   documenting the fork→setup→edit→push workflow, plus `LICENSE`. Depends on Step 8
   (documents a real command, not an aspirational one).
10. **[10-readme-generator.md](10-readme-generator.md)** — `scripts/generate_readme.py`
    (+ `scripts/yaml_lite.py`), wired into `scripts/setup.py`, so a fork's own
    `README.md` becomes the short `when-rubrics-fail`-style format instead of staying
    this template's long explanatory one. Depends on Step 9.

## Why this order

Schema first because every other step codes against it — changing a field name after
the JS is written means editing multiple files instead of one. Shell (HTML/CSS) before
JS because the JS targets specific ids/classes that need to exist first. Foundation
(YAML parsing, theming) before blocks (content rendering) because blocks don't need to
know about theming, but rely on the CSS tokens Step 3 wires up being in place.
Rendering/orchestration last among the code steps because it's the integration point —
nothing is testable end-to-end until it exists.
