# paper-page

A template for building academic project pages — the single-page sites researchers
put up alongside a paper, with a title, authors, abstract, figures, results, and a
citation block. `paper-page` separates that layout/rendering engine from the actual
paper content, so making your own project page is a matter of editing a few config
and content files, not writing HTML/CSS/JS.

> **Status: work in progress.** This repo is being actively built and is **not yet
> ready to use**. The engine (`index.html`, `template/css/`, `template/js/`) and a
> fictional demo paper (`project.yaml`, `content/`, `assets/`) exist and render, but
> the fork-and-go workflow (a reset script, a blanked starter mirror, a generated
> `<head>`) described in [`docs/`](docs/) isn't built yet. See
> [`tasks/00-overview.md`](tasks/00-overview.md) for what's done and what's left.

## Why this exists

Two real paper pages already live as their own repos:

- [`when-rubrics-fail`](https://github.com/FJFehr/when-rubrics-fail) — the original
  hand-built page ([live site](https://fjfehr.github.io/when-rubrics-fail/)).
- [`legal-reward-bench`](https://github.com/FJFehr/legal-reward-bench) — a second
  paper's page, ported from the first
  ([live site](https://fjfehr.github.io/legal-reward-bench/)).

Porting the second page from the first meant copy-pasting HTML/CSS/JS and manually
stripping out the first paper's content — title, authors, figures, results tables —
wherever it was tangled into the markup. Both repos also duplicate the same
title/author/description across six different places (the visible page, `<title>`,
OpenGraph tags, Twitter card tags, Scholar citation meta tags, `citation.bib`), which
drifts out of sync easily.

`paper-page` is meant to fix that by generalizing what those two repos have in
common into a proper template: a generic rendering engine that any paper can drive
by editing config and content files, with no copy-paste porting step and one source
of truth per fact. Once it's ready, the workflow is meant to be:

**Fork → edit `project.yaml`, `authors.yaml`, `content/` → push → your paper has a
GitHub Pages site.**

See [`docs/01-principles.md`](docs/01-principles.md) for the full rationale, and
[`docs/02-comparison-matrix.md`](docs/02-comparison-matrix.md) for the concrete
comparison between the two source repos that the design is grounded in.

## What's in this repo right now

- **`index.html` + `template/css/` + `template/js/`** — the rendering engine. Reads
  YAML config and Markdown/YAML content, renders the page client-side, no build step.
- **`project.yaml`, `authors.yaml`, `citation.bib`, `content/`, `assets/`** — a
  fictional demo paper ("Penguin Embeddings") used to exercise every block type the
  engine supports (callouts, tables, figures, results tables, citations, etc.).
- **`docs/`** — the design docs: principles, a comparison of `when-rubrics-fail` vs.
  `legal-reward-bench`, the component vocabulary, the architecture, and the migration
  plan. Read these first if you want to understand a design decision.
- **`tasks/`** — the ordered build plan this repo is being implemented against, one
  file per step.

Not yet built: the fork-reset script, the blanked starter mirror, the static
metadata generator (so `<head>` tags are generated from `project.yaml` instead of
hand-synced), and a user-facing "how to fork this" guide.

## Using it today

You can't fork this yet and expect a working page out of the box — that workflow is
still being built. If you want to see the engine in action, serve the repo root with
any static file server and open it in a browser; it renders the demo paper's content.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Contributing / picking this up

Read [`AGENTS.md`](AGENTS.md) for the editing boundaries (docs/content vs.
engine/scripts) and [`tasks/00-overview.md`](tasks/00-overview.md) for the current
step in the build sequence.
