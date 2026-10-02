<p align="center">
  <img src="assets/favicon.svg" alt="paper-page logo" width="96">
</p>

<p align="center"><em>Everyone wants to have a pretty PP.</em></p>

# paper-page

A simple GitHub Pages template for academic project pages.

**Just your paper, not a frontend project.** Fork the template, edit YAML and Markdown, and push. No Node, no framework, no build step.

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/FJFehr/paper-page/generate)

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

### 1. Create your repository from the template

On GitHub, click **Use this template** → **Create a new repository**. Pick an owner and a name (for example `my-paper`), then click **Create repository**.

You now have your own copy of paper-page on GitHub, still showing the demo paper.

### 2. Clone it to your computer

```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
```

### 3. Clean up the demo paper

Inside the cloned folder, run the setup script. You only need to do this once:

```bash
python scripts/setup.py
```

This:

- replaces the demo's config and content with blank starter files
- deletes the demo's figures and logos
- resets the page metadata in `index.html`
- replaces this README with a short one for your paper

It then prints a checklist of what to fill in. Commit and push the clean slate:

```bash
git add -A
git commit -m "Clear out demo paper"
git push
```

### 4. Add your paper

Most of the time, these are the only places you'll touch:

| File | What goes there |
| --- | --- |
| `project.yaml` | Title, links, theme and section order |
| `authors.yaml` | Authors and affiliations |
| `citation.bib` | BibTeX |
| `content/` | Text, callouts and tables |
| `assets/figures/` | Figures |
| `index.html` (between `meta:start` and `meta:end` only) | Title, description and authors for search engines and link previews |

Preview locally as you go:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

> Don't open `index.html` directly: browsers won't load the YAML and Markdown files over `file://`.

When you change `project.yaml`, `authors.yaml` or `citation.bib`, run `python3 scripts/generate_readme.py` to update your README.

### 5. Publish

Commit and push your changes:

```bash
git add -A
git commit -m "Add paper content"
git push
```

Then, on GitHub, open **Settings → Pages** and choose:

**Deploy from a branch → `main` → `/ (root)`**

After a minute or two your project page will be live at:

```text
https://<username>.github.io/<repo>/
```

That's it. From now on, every push updates the page.

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

- **When Rubrics Fail**: [site](https://fjfehr.github.io/when-rubrics-fail/) · [repo](https://github.com/FJFehr/when-rubrics-fail)
- **Building Legal Reward Models for Grounding and Abstention**: [site](https://fjfehr.github.io/legal-reward-bench/) · [repo](https://github.com/FJFehr/legal-reward-bench)


## How it works

Your paper lives in YAML, Markdown, BibTeX and ordinary image files. paper-page turns those files into a single static project page in the browser.

The separation is intentional: your content stays in `project.yaml`, `authors.yaml`, `citation.bib`, `content/` and `assets/`; the reusable page engine stays in `template/`.

The template grew out of two project pages that had originally been built by hand. Copying one to make the next meant keeping the same title, authors and metadata in several different places. paper-page makes those things data instead.

For the design decisions behind the template, see [`docs/01-principles.md`](docs/01-principles.md).


## License

The template and engine are [MIT licensed](LICENSE).

The demo paper and its assets are example material only and are removed by `scripts/setup.py`.