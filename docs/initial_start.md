Yes. I think the useful framing is that you are **not really making a generic academic website**. You are making a small **project-page system for research papers**.

Looking through the repos, you have already discovered most of the right architectural ideas. The work now is to turn the accidental commonality between individual projects into an explicit contract.

Your personal-site template is particularly relevant because it already embodies the philosophy you want: content/config separated from implementation, YAML/Markdown for normal editing, no complicated build chain, and an architecture deliberately optimized for both human and agentic editing. ([GitHub][1]) Your CV does something analogous in another medium: content is separated from the template so reuse doesn't mean reconstructing the document. ([GitHub][2])

And `when-rubrics-fail` is already surprisingly close to the academic-page version of this: prose in `content.md`, authors in `authors.yaml`, resources in `links.yaml`, citation in a real `.bib`, tables in Markdown, figures as assets, while JS/HTML acts as the engine. ([GitHub][3])

So I would formalize that philosophy rather than start over.

## 1. What does "generic template" actually mean?

I wouldn't define generic as:

> "A blank version of When Rubrics Fail."

I'd define it as:

> **A reusable system that can express most academic project pages without requiring the user to modify its implementation.**

That distinction matters.

A blanked-out clone still has assumptions such as "this project has a taxonomy", "there are four figures", "there is a section called Beyond Fixed Rubrics", etc. A true template instead knows about **generic primitives**:

**paper → authors → links → sections → blocks → assets → citation → theme**

The individual paper decides how those primitives are assembled.

So the abstraction isn't:

```text
When Rubrics Fail
├── TLDR
├── taxonomy
├── method
├── results
└── implications
```

It's closer to:

```text
Academic Project Page
├── metadata
├── authors
├── resources
├── sections[]
│   └── blocks[]
├── citation
├── assets
└── design
```

And a block might be:

```text
text
figure
takeaways
table
cards
quote/callout
video
code/demo
```

That gives you something generic without turning it into a giant website framework.

---

# 2. The central principle: content describes; engine renders

You have this already, but I'd make it the **constitutional rule of the repo**:

> **A normal user should never need to edit HTML, CSS, or JavaScript to create a paper page.**

I'd go one step further than the current `when-rubrics-fail` implementation.

Right now, section ordering is driven from `content.md`, but adding a genuinely new section can still require adding matching markup/attributes in `index.html`. ([GitHub][3]) That's fine for a project page, but it is exactly the coupling I'd eliminate in the generic version.

Ideally:

```yaml
sections:
  - id: overview
    title: Overview
    nav: true
    blocks:
      - type: markdown
        source: content/overview.md

      - type: takeaways
        source: content/takeaways.yaml

  - id: method
    title: Method
    blocks:
      - type: figure
        src: assets/pipeline.png
        caption: ...
      - type: markdown
        source: content/method.md

  - id: results
    title: Results
    blocks:
      - type: table
        source: content/results.md
```

Now `index.html` doesn't know what a "Method" section is.

It only knows:

> render sections → render blocks according to their types.

That is the point at which it becomes genuinely generic.

---

# 3. I'd establish eight design principles

### 1. Zero-code happy path

The README should be able to say:

**Fork → run setup → edit `project.yaml` → replace content/assets → push.**

Your personal website already has essentially this workflow, including a setup script that removes your personal content and leaves starter templates. ([GitHub][1]) I'd carry that pattern straight across.

Something like:

```bash
python setup.py
```

Then:

```text
1. Edit project.yaml
2. Edit content/*.md
3. Put figures in assets/
4. Push
```

Someone should be able to make a polished page without understanding the engine.

### 2. One obvious source of truth

This is one area where I'd improve on the current page.

At the moment, SEO/Scholar metadata has to be manually synchronized with the visible title/authors and citation because crawlers don't execute the JavaScript. Your README explicitly warns that title information consequently exists in several places. ([GitHub][3])

For a reusable template, that's a footgun—especially for agents.

Ideally:

```yaml
paper:
  title: "My Excellent Paper"
  short_title: "Excellent Paper"
  year: 2026
  venue: null
  doi: null
  arxiv: null
  description: "..."
```

should drive:

* visible title
* `<title>`
* OpenGraph
* Twitter metadata
* Google Scholar/Highwire metadata
* canonical URL
* citation UI
* maybe generated BibTeX where appropriate

The user enters something **once**.

Static crawler metadata may mean introducing a tiny generation step. I think that's worth considering even though you like the no-build philosophy. A `setup.py`/`build.py` that materializes `index.html` is considerably better than requiring humans to maintain duplicated metadata manually.

The distinction I'd preserve is:

> **No framework/build-tool dependency**, rather than necessarily **no generation whatsoever**.

A single Python standard-library-ish script is still extremely simple.

### 3. Progressive complexity

A beginner should encounter maybe five things:

```text
project.yaml
authors.yaml
content/
assets/
citation.bib
```

Not twenty-seven configuration files.

Advanced customization can exist, but it shouldn't be sitting in the user's path.

Think:

```text
content/        ← edit me
assets/         ← replace me
project.yaml    ← edit me

template/       ← probably don't touch
scripts/        ← probably don't touch
```

That boundary is extremely useful for humans and agents alike.

### 4. Convention over configuration

Don't make people configure things the template can infer.

For example:

```yaml
resources:
  paper: https://arxiv.org/...
  code: https://github.com/...
  dataset: https://huggingface.co/...
```

The engine should infer the appropriate icons, labels, and styling.

Likewise:

```yaml
authors:
  - name: Jane Smith
    url: https://...
    affiliations: [oxford, oxai]
```

rather than making users specify presentation information repeatedly.

### 5. Optional everything

Academic projects vary enormously.

A project might have:

* paper only
* paper + code
* paper + dataset
* demo
* Hugging Face model
* benchmark leaderboard
* video
* poster
* slides
* BibTeX
* 2 authors or 70 authors

So absence should be a first-class state.

If `dataset: null`, don't render Dataset.

If there are no takeaways, don't render a blank takeaways section.

If there are 40 authors, the author component should gracefully collapse/wrap them.

This is especially important given your "lots of people" case.

### 6. Components, not page layouts

This is probably the biggest conceptual shift I'd make.

Don't offer:

> Layout A / Layout B / Layout C.

Offer a small vocabulary of **research communication components**:

| Primitive   | Purpose                    |
| ----------- | -------------------------- |
| `markdown`  | prose                      |
| `figure`    | paper figure + caption     |
| `takeaways` | 2–5 headline findings      |
| `table`     | benchmark/taxonomy/results |
| `cards`     | datasets/models/tasks/etc. |
| `callout`   | important result or caveat |
| `metrics`   | headline numbers           |
| `video`     | talk/demo                  |
| `embed`     | interactive demo           |
| `code`      | example/API usage          |
| `citation`  | BibTeX/citation            |
| `people`    | extended contributor list  |

Then users compose a page from them.

That's much more reusable than trying to anticipate every paper structure.

### 7. Sensible defaults should look finished

This is crucial if you want other academics to use it.

The default template shouldn't look like a wireframe that says:

> Hero goes here.

It should contain a **fictional but complete example paper** demonstrating the system.

Something obviously fake like:

**Do Penguins Dream of Embeddings?
A Benchmark for Latent Aquatic Reasoning**

Then populate it with:

* 5 authors
* affiliations
* paper/code/data buttons
* hero figure
* TL;DR
* three takeaway cards
* method
* results table
* several figures
* citation
* dark/light mode

The repo therefore serves simultaneously as:

1. template,
2. documentation,
3. component gallery,
4. visual demo.

Then `setup.py` replaces the example with clean placeholders.

That is much better than shipping an empty page.

### 8. Agent-readable architecture

This deserves to be an explicit design objective rather than an incidental benefit.

Your personal-site README already explicitly describes its consolidated architecture as being optimized for "Agentic Editing." ([GitHub][1])

For this template I'd formalize that further.

An agent should be able to inspect the repo and immediately understand:

```text
AGENTS.md
README.md
project.yaml
content/
template/
```

And `AGENTS.md` can say something like:

```text
# Editing rules

Normal project edits:
- project metadata → project.yaml
- authors → authors.yaml
- prose → content/*.md
- figures → assets/figures/
- tables → content/tables/*.md
- citation → citation.bib
- colours/fonts → project.yaml > theme

DO NOT modify:
- template/*
- scripts/*
unless changing template behaviour.
```

That makes a prompt like:

> "Here's my paper PDF. Turn this repo into its project page."

much more reliable.

And that's potentially one of the template's strongest differentiators.

---

# 4. I think you want three layers

I'd architect it explicitly as:

```text
┌──────────────────────────────┐
│          CONTENT             │
│ Markdown / YAML / BibTeX     │
│ figures / videos / assets    │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│        CONFIGURATION         │
│ project.yaml                 │
│ sections / theme / metadata  │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│           ENGINE             │
│ HTML / CSS / JS / scripts    │
│ users normally don't touch   │
└──────────────────────────────┘
```

That is cleaner than the current split because `theme.js`, for example, is technically implementation code even though you're asking users to edit it. In the generic repo, colors/fonts/layout should move into config. The current project already centralizes those settings, so this would mainly be moving the boundary rather than inventing new functionality. ([GitHub][3])

---

# 5. The config file becomes the control panel

I'd aim for one primary file:

```yaml
project:
  title: "Do Penguins Dream of Embeddings?"
  short_title: "Penguin Embeddings"
  description: "A fictional research project demonstrating the template."
  status: "preprint"

authors:
  source: authors.yaml

affiliations:
  show_logos: true

resources:
  paper: null
  code: null
  dataset: null
  demo: null
  slides: null

social:
  image: assets/og-image.png

theme:
  palette: indigo
  mode: auto
  serif: ...
  sans: ...

sections:
  - overview
  - method
  - results
  - discussion
  - citation
```

Then separate files hold *content*, not configuration.

That creates a useful mental model:

> **Want to change what the site is? → `project.yaml`**
> **Want to change what the paper says? → `content/`**
> **Want to replace something visual? → `assets/`**

Very hard to get lost.

---

# 6. Optimize specifically for academic-project realities

This shouldn't just be a nice generic landing-page template. There are several things academia makes unusually important.

**Author handling** should be excellent. Multiple affiliations, equal contribution, corresponding authors, ORCID/personal links, long author lists, institutional logos, and perhaps collapsible affiliations should all be supported without special HTML.

**Citation correctness** should be unusually strong. BibTeX, DOI, arXiv, venue, dates, Google Scholar metadata and citation-copy behavior should all come from authoritative fields rather than duplicated strings.

**Figures should be first-class.** Caption, alt text, optional width/layout, source link, and perhaps light/dark variants.

**Tables should remain extremely easy.** I like your existing Markdown-table approach a lot: the current engine takes an ordinary Markdown table and turns it into a styled responsive table without requiring JS changes. ([GitHub][3]) Keep that.

**Research resources should be extensible.** Don't hardcode "arXiv / GitHub / Hugging Face" as the conceptual model. Those are merely defaults. Let someone add Project PDF, Demo, Colab, Zenodo, OSF, benchmark, model, etc.

---

# 7. There should be an explicit escape hatch

"Never edit HTML" is the happy path, not a prison.

Something like:

```yaml
- type: custom
  source: content/custom/my-widget.html
```

could let advanced users break out.

That means the template covers 90% beautifully without becoming a monster trying to declaratively model every webpage humans could possibly invent.

---

# 8. What I would *not* do

I would resist turning this into React/Next/Astro/Jekyll unless you discover a compelling reason.

The appeal of what you have is precisely that it is understandable.

Your website's proposition is already basically "edit YAML, push, done," with no Node or build-tool complexity. ([GitHub][1]) The academic template should feel like its sibling:

> **Edit Markdown/YAML. Add your figures. Push. Done.**

I'd also avoid dozens of micro-files, a complicated plugin system, configuration for every CSS property, or clever abstractions that make an agent traverse ten layers before discovering where the title lives.

---

# 9. So the product proposition becomes very simple

I think the repo's README should ultimately be able to communicate something approximately like:

> **Academic Project Page**
>
> A clean, reusable GitHub Pages template for research papers.
>
> No frontend knowledge required. Write your content in Markdown, configure your paper in YAML, add your figures, and push.
>
> **Human-friendly. Agent-friendly. No framework required.**

And then:

```text
Use this template
      ↓
python setup.py
      ↓
Edit project.yaml
      ↓
Add content + figures
      ↓
git push
      ↓
Your project page is live
```

That is a very comprehensible product.

---

## 10. The test for every architectural decision

I'd use one question relentlessly:

> **Could a researcher—or an AI agent with no prior knowledge of this repository—correctly figure out where to make this change within 30 seconds?**

"Change the title." One place.

"Add an author." One obvious file.

"Add another result section." Content/config only.

"Change purple to blue." One field.

"Replace Figure 2." One asset + one reference.

"Add a benchmark table." Markdown.

"Add a Hugging Face model button." Config.

"Reorder Method and Results." Config.

"Make a project page from this paper." Agent reads `AGENTS.md`, extracts metadata/content, populates the defined schema.

If any of those answers are "go edit line 612 of `index.html`," that's a template smell.

---

I think the **next step should actually be architectural rather than coding**: take `when-rubrics-fail` and the real version of `legal-reward-bench` (the public GitHub repo currently appears empty, so I couldn't compare its implementation) and make a small **commonality/variation matrix**: what is identical between them, what differs only in data, what differs structurally, and what differs stylistically. ([GitHub][4])

From that we can derive the actual schema instead of guessing it. The output I'd want from that exercise is roughly **(1) design principles → (2) component vocabulary → (3) proposed repo tree → (4) `project.yaml` schema → (5) setup/reset workflow → (6) agent instructions → (7) migration plan for both existing pages**. That would give us a fairly crisp specification before touching the implementation.

[1]: https://github.com/FJFehr/fjfehr.github.io "GitHub - FJFehr/fjfehr.github.io: A personal website & template entirely created through vibe-coding. A lovely sunday afternoon coding adventure. · GitHub"
[2]: https://github.com/FJFehr/cv-template "GitHub - FJFehr/cv-template: An Applicant Tracking Systems (ATS) friendly minimalist CV template for easy use and reuse. · GitHub"
[3]: https://github.com/FJFehr/when-rubrics-fail "GitHub - FJFehr/when-rubrics-fail · GitHub"
[4]: https://github.com/FJFehr/legal-reward-bench "FJFehr/legal-reward-bench · GitHub"
