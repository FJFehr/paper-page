# paper-page

[![Licence: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A GitHub Pages template for academic project pages: the single-page site you put
up alongside a paper. No build tools, no Node, no framework. You fork it, edit a
few YAML and Markdown files, and push.

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/FJFehr/paper-page/generate)

## What you get

- A hero with title, authors (each with their own affiliations and superscripts)
  and resource buttons for paper, code, dataset, demo and slides
- Building blocks you stack into sections: callouts, Markdown prose, tables,
  figures, a results or leaderboard table that highlights the best values, and a
  citation box with a copy button
- Dark mode and a choice of named colour palettes
- A fictional demo paper ("Do Penguins Dream of Embeddings?") that shows every
  block in use, and a script that clears it out when you're ready

## Make a page for your paper

**1. Create your repo.** Click **Use this template** above, name the new repo
after your paper and clone it.

**2. Clear out the demo.**

```bash
python3 scripts/setup.py
```

This swaps the Penguin demo for blank starter files, removes its figures and
logos, resets the page metadata in `index.html` and writes a short README for
your paper. It then prints a checklist of what to fill in next.

**3. Fill in your paper.**

| File | What goes in it |
| --- | --- |
| `project.yaml` | Title, links, colour palette, and the order of sections on the page |
| `authors.yaml` | Authors and affiliations |
| `citation.bib` | Your BibTeX entry |
| `content/` | Your text, takeaways and tables, one file per block |
| `assets/figures/` | Your figures |
| `index.html` (between `meta:start` and `meta:end` only) | Title, description and authors for search engines and link previews |

Preview it locally as you go:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` straight from disk won't work, because browsers block the
page from loading its YAML and Markdown files over `file://`.

**4. Publish it.** Push to GitHub, then go to **Settings → Pages**, choose
**Deploy from a branch**, and pick `main` and `/ (root)`. Your page will appear at
`https://<your-username>.github.io/<repo-name>/`.

Whenever you change `project.yaml`, `authors.yaml` or `citation.bib`, run
`python3 scripts/generate_readme.py` to bring your README up to date.

## Quick reference

| I want to... | Edit |
| --- | --- |
| Change the title | `project.yaml` → `paper.title` |
| Add or remove an author | `authors.yaml` → `authors:` list |
| Give an author two affiliations | `authors.yaml` → list both ids under that author's `affiliations:` |
| Add a section | `project.yaml` → `sections:` list, plus a new file in `content/` |
| Add a results or leaderboard table | `project.yaml` → a `results_table` block, plus a `content/*.yaml` file (see `content/results-table.yaml`) |
| Change the colour palette | `project.yaml` → `theme.palette` (`sage` or `gold`) |
| Replace a figure | Add the image under `assets/figures/`, then update the `figure` block's `src` |
| Reorder sections | Reorder the `sections:` list in `project.yaml` |

None of these need you to touch `index.html`'s body or anything in `template/`.

## Pages built with paper-page

- **When Rubrics Fail** ([site](https://fjfehr.github.io/when-rubrics-fail/),
  [repo](https://github.com/FJFehr/when-rubrics-fail))
- **Building Legal Reward Models for Grounding and Abstention**
  ([site](https://fjfehr.github.io/legal-reward-bench/),
  [repo](https://github.com/FJFehr/legal-reward-bench))

These two came first: paper-page was built by generalising them. They still run on
their original hand-built code. Moving them onto this template is planned in
[`tasks/11`](tasks/11-dark-figures-and-custom-resources.md) to
[`tasks/13`](tasks/13-port-legal-reward-bench.md).

Built a page with this template? Add it to the list.

## Status

Everything above works. The one known gap is that the metadata in `index.html`'s
`<head>` (page title, link previews and Google Scholar tags) has to be copied
from `project.yaml` by hand. A small script to generate it is planned. Until it
exists, `setup.py` at least resets these tags so a new page never ships the demo's
details.

## What's in the repo

```
project.yaml        # paper details, links, theme, and section layout
authors.yaml        # authors and affiliations
citation.bib        # BibTeX, shown with a copy button
content/            # your text and structured content, one file per block
assets/             # figures, logos, favicon, link-preview image
index.html          # the page shell (only edit the <head> metadata)
template/           # the engine's CSS and JS (no need to edit)
scripts/
  setup.py            # clears the demo paper (run once after forking)
  generate_readme.py  # rebuilds README.md from your YAML and BibTeX
  yaml_lite.py        # small YAML reader used by generate_readme.py
_template/          # the blank starter files setup.py copies in
docs/               # design notes: why the template works the way it does
tasks/              # the step-by-step log this repo was built from
```

## Why this exists

The first two pages above were built by hand, and the second was made by copying
the first and stripping out its content. Each fact (title, authors, description)
also had to be typed in six places, which kept drifting out of sync. paper-page
pulls out what the two pages had in common, so a new page is just config and
content, with no copying step. The design reasoning is in
[`docs/01-principles.md`](docs/01-principles.md), and the comparison of the two
original repos is in [`docs/02-comparison-matrix.md`](docs/02-comparison-matrix.md).

## Contributing

To work on the template itself, see [`AGENTS.md`](AGENTS.md), which sets out which
files are content and which are engine, and [`tasks/00-overview.md`](tasks/00-overview.md).

## Licence

The engine and template code are MIT licensed (see [`LICENSE`](LICENSE)). The demo
paper's content (`content/`, `authors.yaml`, `citation.bib`, `assets/`) is example
material only, and `scripts/setup.py` replaces it.
