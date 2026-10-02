# paper-page

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A GitHub Pages template for academic project pages — the single-page sites
> researchers put up alongside a paper. No build tools, no Node, no config hell.
> Fork it, edit YAML/Markdown, push.

> **Status: work in progress.** The engine, the demo paper, and the fork-reset
> workflow below all exist and work. Still missing: a script that generates
> `<head>` metadata (OpenGraph/Twitter/Scholar tags) from `project.yaml` — until
> that lands, those tags are hand-synced in `index.html`. See
> [`tasks/00-overview.md`](tasks/00-overview.md) for the full status.

**What you get out of the box:**
- Hero, authors (with per-author affiliations and superscripts), and resource
  buttons (paper/code/dataset/demo/slides) — all driven from two YAML files
- A composable section/block system: callouts, Markdown prose, tables, figures,
  a results/leaderboard table with best-value highlighting, and a citation block
  with copy-to-clipboard BibTeX
- Dark mode + a swappable named colour palette
- One field entered once drives the visible page *and* the page `<title>`,
  OpenGraph, Twitter card, and Scholar citation meta tags — no six-place sync

## Use This Template

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/FJFehr/paper-page/generate)

Then run the setup script to blank the demo paper:

```bash
python3 scripts/setup.py
```

This replaces the fictional "Penguin Embeddings" demo with blank starter files,
removes the demo's figures/logos, and regenerates this README as a short,
paper-specific one (title, authors, links, citation — the format
[`when-rubrics-fail`](https://github.com/FJFehr/when-rubrics-fail) and
[`legal-reward-bench`](https://github.com/FJFehr/legal-reward-bench) use). Then
fill in:
- `project.yaml` — title, resource links, theme palette
- `authors.yaml` — your name, affiliation(s)
- `citation.bib` — your paper's real citation
- `content/*.md` / `content/*.yaml` — your prose, takeaways, results table
- Add your own figures under `assets/figures/`

Re-run `python3 scripts/generate_readme.py` any time afterward to keep
README.md in sync with those files.

## Quick Start

| I want to... | Edit |
| --- | --- |
| Change the title | `project.yaml` → `paper.title` |
| Add or remove an author | `authors.yaml` → `authors:` list |
| Give an author two affiliations | `authors.yaml` → list both ids under that author's `affiliations:` |
| Add a new section | `project.yaml` → `sections:` list + a new `content/` file |
| Add a results/leaderboard table | `project.yaml` → a `results_table` block + `content/*.yaml` (see `content/results-table.yaml`) |
| Change the colour palette | `project.yaml` → `theme.palette` (`sage` or `gold`) |
| Replace a figure | Add the asset under `assets/figures/`, update the `figure` block's `src` |
| Reorder sections | Reorder `project.yaml`'s `sections:` list |
| Sync README.md after editing the above | `python3 scripts/generate_readme.py` |

Every one of these is a config/content edit — never an `index.html`/`template/`
change. See [`docs/01-principles.md`](docs/01-principles.md) §10 for the full
rationale.

## Structure

```
project.yaml          # paper metadata, resources, theme, section/block layout
authors.yaml           # authors + affiliations
citation.bib           # BibTeX, rendered with a copy button
content/               # your prose and structured content, one file per block
  tldr.md
  overview.md
  method.md
  results.md
  takeaways.yaml
  taxonomy.md
  results-table.yaml
assets/                 # figures, logos, favicon, OG image
index.html              # the engine shell — don't edit for a normal paper page
template/               # engine CSS/JS — don't edit for a normal paper page
  css/
  js/
scripts/
  setup.py              # blanks the demo paper from _template/, regenerates README.md
  generate_readme.py    # (re)builds README.md from project.yaml/authors.yaml/citation.bib
  yaml_lite.py          # Python port of template/js/yaml-lite.js, used by generate_readme.py
_template/               # blanked mirror scripts/setup.py copies from
docs/                    # design rationale — read if you're curious why
tasks/                   # the ordered build log this repo was implemented against
```

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

`paper-page` generalizes what those two repos have in common into a proper template:
a generic rendering engine any paper can drive by editing config/content files, with
no copy-paste porting step and one source of truth per fact. See
[`docs/01-principles.md`](docs/01-principles.md) for the full rationale, and
[`docs/02-comparison-matrix.md`](docs/02-comparison-matrix.md) for the concrete
comparison between the two source repos the design is grounded in.

## View Locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` won't work — the engine `fetch()`s
`project.yaml`/`authors.yaml`/`content/*`, which browsers block from `file://`.

## Contributing / picking this up

Read [`AGENTS.md`](AGENTS.md) for the editing boundaries (docs/content vs.
engine/scripts) and [`tasks/00-overview.md`](tasks/00-overview.md) for the build
log this repo was implemented against.

## License

MIT for the engine and template — see [`LICENSE`](LICENSE). The demo paper's
content (`content/`, `authors.yaml`, `citation.bib`, `assets/`) is example content
only; `scripts/setup.py` replaces it, don't reuse it as-is.
