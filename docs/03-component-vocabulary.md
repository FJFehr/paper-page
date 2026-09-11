# Component vocabulary

Per [01-principles.md](01-principles.md) §6, the template offers a fixed vocabulary of
blocks that a paper composes into sections, rather than a menu of whole-page layouts.
This doc inventories that vocabulary against what the current engine actually does —
each entry is marked **exists**, **exists but paper-specific (needs generalizing)**,
or **missing (net-new)** — so the architecture doc only has to design what isn't
already proven to work.

A section is a named group (`overview`, `method`, `results`, ...); a block is one
piece of content within it. `content.md`'s `section:` markers already let a paper
reorder *whole sections* without touching the engine (see
[02-comparison-matrix.md](02-comparison-matrix.md)); the open question the
architecture doc resolves is how a paper adds a **block type it doesn't already have**
without that requiring an `index.html` edit — currently even reordering *within* a
section is DOM-order-dependent, and adding a wholly new section/slot pair does require
touching the engine in both current repos.

| Component | Status | Evidence |
|---|---|---|
| `markdown` (prose) | **Exists** | `content.js`'s slot mechanism: `<!-- slot: name -->` blocks of plain Markdown filled into `data-md="name"` elements. Core mechanism, already generic. |
| `figure` | **Exists** | `![alt](src)` inside an image-suffixed slot (`data-md-img`), optional `position: left/right/center` line parsed by `content.js`. Already generic; asset path convention (`static/images/`) is the only paper-specific part. |
| `table` (qualitative) | **Exists, already generic** | `tables.js`: any `<table data-md-table="file.md">` fetches and renders a plain GFM table with zebra striping and bold-first-column emphasis. Proven to be paper-agnostic already — reused byte-identical across both repos. |
| `takeaways` | **Exists but paper-specific** | Currently a hardcoded `<section id="takeaways">` with exactly three `<a class="takeaway" data-md="takeaway-N">` anchors wired to jump-link specific Results subsections. Needs generalizing to N items (principle 5: optional/variable count), not fixed at three. |
| `results / leaderboard table` | **Missing (net-new)** | The clearest gap. `legal-reward-bench` needs a structured comparison of 15 models across multiple benchmark dimensions and has no primitive for it — falls back to prose + static spider-chart PNGs through the generic `tables.js`, which has no concept of numeric columns, best-per-column emphasis, or many-row model comparison. This is the one component the architecture doc must actually design, not just wire up. |
| `cards` | **Missing (net-new)** | Named in the original brief for datasets/models/tasks-style groupings; not present in either current repo. Lower priority than the results table — no evidence yet that a real paper needs it. |
| `callout` | **Missing (net-new)** | Not present. Existing precedent is close: the `**TL;DR.**` convention at the top of `content.md`'s overview slot is effectively a manual callout. Worth formalizing as a real block type rather than a Markdown-bold convention. |
| `metrics` | **Missing (net-new)** | Not present. Could plausibly be absorbed into the results-table primitive (a single-row/headline case) rather than built as a separate component — flag for the architecture doc to decide, don't build twice. |
| `video` | **Missing (net-new)** | Not present in either repo. No embed mechanism exists at all currently. |
| `embed` (interactive demo) | **Missing (net-new)** | Same as video — no mechanism exists. Lower priority unless a real paper needs it (principle 9: no speculative additions). |
| `code` | **Missing (net-new)** | Not present. |
| `citation` | **Exists** | `citation.bib` fetched and inserted verbatim into a `<pre>` with a copy button (`main.js`). Already generic — no per-paper engine logic. |
| `people` (extended contributor list) | **Exists, adequate for one case** | `authors.yaml` → `renderAuthors()`. Covers name/URL/equal-contribution/one shared affiliation/one correspondence contact. The per-author-affiliation gap (see comparison matrix) lives here, not in a separate component. |
| `custom` (escape hatch) | **Missing (net-new)** | Named in the original brief: a `type: custom` block pointing at raw HTML for the rare case the vocabulary doesn't cover. Deliberately last-resort per principle 9 — exists so the vocabulary doesn't have to try to model every possible page.

## Priority for the architecture doc

Given principle 9 ("no speculative additions" — build what a real paper needs), the
ranked list for [04-architecture.md](04-architecture.md) to actually design is:

1. **Results/leaderboard table** — a real, current need (`legal-reward-bench`).
2. **Generalized `takeaways`** — fixing the hardcoded-3 assumption is low effort and
   directly serves principle 5.
3. **Per-author affiliations** within the `people`/`authors.yaml` component — a real,
   current need, not a new component but a schema fix to an existing one.
4. **`callout`** — formalizing an existing informal convention (`**TL;DR.**`), cheap
   to add.
5. Everything else in the "missing" column stays a named slot in the vocabulary but
   is not designed in detail until a real paper needs it.
