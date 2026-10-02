# paper-page

A simple GitHub Pages template for academic project pages.

**Just your paper, not a frontend project.** Fork the template, edit YAML and Markdown, and push. No Node, no framework, no build step.

[**Use this template →**](https://github.com/FJFehr/paper-page/generate)

<!-- Add a screenshot or GIF of the demo page here. -->

## What you get

- Paper title, authors, affiliations and resource links
- Markdown, figures, callouts and tables
- Results tables with automatic best-value highlighting
- Copyable BibTeX
- Dark mode and colour palettes
- A responsive static site that works on GitHub Pages

paper-page ships with a very serious demo paper, *Do Penguins Dream of Embeddings?*, so you can see every component before replacing it with your own work.

## Quick start

### 1. Create your repository

Click **Use this template**, give the repository a name, and clone it.

### 2. Evict the penguins

```bash
python3 scripts/setup.py
```

This removes the demo content and gives you clean starter files.

### 3. Add your paper

Most of the time, these are the only places you'll touch:

| File | What goes there |
| --- | --- |
| `project.yaml` | Title, links, theme and section order |
| `authors.yaml` | Authors and affiliations |
| `citation.bib` | BibTeX |
| `content/` | Text, callouts and tables |
| `assets/figures/` | Figures |

Preview locally with:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

> Don't open `index.html` directly: browsers won't load the YAML and Markdown files over `file://`.

### 4. Publish

Push to GitHub, then open **Settings → Pages** and choose:

**Deploy from a branch → `main` → `/ (root)`**

Your project page will be available at:

```text
https://<username>.github.io/<repo>/
```

That's it.

## Common changes

| I want to… | Edit |
| --- | --- |
| Change the title | `project.yaml` → `paper.title` |
| Add an author | `authors.yaml` |
| Add a section | `project.yaml` + a file in `content/` |
| Add a results table | A `results_table` block + `content/*.yaml` |
| Change the colours | `project.yaml` → `theme.palette` |
| Replace a figure | `assets/figures/` + the figure's `src` |
| Reorder sections | Reorder `sections:` in `project.yaml` |

You shouldn't need to touch the body of `index.html` or anything in `template/`.

## Pages built with paper-page

- **When Rubrics Fail** — [site](https://fjfehr.github.io/when-rubrics-fail/) · [repo](https://github.com/FJFehr/when-rubrics-fail)
- **Building Legal Reward Models for Grounding and Abstention** — [site](https://fjfehr.github.io/legal-reward-bench/) · [repo](https://github.com/FJFehr/legal-reward-bench)


## How it works

Your paper lives in YAML, Markdown, BibTeX and ordinary image files. paper-page turns those files into a single static project page in the browser.

The separation is intentional: your content stays in `project.yaml`, `authors.yaml`, `citation.bib`, `content/` and `assets/`; the reusable page engine stays in `template/`.

The template grew out of two project pages that had originally been built by hand. Copying one to make the next meant keeping the same title, authors and metadata in several different places. paper-page makes those things data instead.

For the design decisions behind the template, see [`docs/01-principles.md`](docs/01-principles.md).


## License

The template and engine are [MIT licensed](LICENSE).

The demo paper and its assets are example material only and are removed by `scripts/setup.py`.