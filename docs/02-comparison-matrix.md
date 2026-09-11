# Comparison matrix

This is the evidence base for [01-principles.md](01-principles.md): what is actually
identical, data-only-different, structurally different, or stylistically different
between `when-rubrics-fail` and `legal-reward-bench`, plus what `fjfehr.github.io`
contributes that neither paper repo has. Everything below was read directly from the
repos at `~/Projects/`, not inferred.

`legal-reward-bench`'s own README states it was **ported from the When Rubrics Fail
project-page template** — this is not two independent designs converging, it's one
engine forked once. That makes the diff between them an unusually clean signal for
"what varies by paper" vs. "what's accidentally frozen into one paper's assumptions."

## File-by-file

| File | Status across the two repos | Notes |
|---|---|---|
| `static/js/main.js` | **Identical** (byte-for-byte) | Orchestrator: theme toggle, nav/scroll-spy, loads authors/links/citation/content/tables. |
| `static/js/tables.js` | **Identical** (byte-for-byte) | Generic GFM Markdown-table → styled `<table>` renderer. Genuinely paper-agnostic already. |
| `static/js/yaml-lite.js` | **Identical** (byte-for-byte) | Hand-rolled restricted YAML parser used for `authors.yaml`/`links.yaml`. |
| `static/js/content.js` | **Structurally diverged** | `legal-reward-bench` added inline Markdown link support (`[text](url)` → `<a>`) that `when-rubrics-fail`'s copy lacks. A real, additive engine improvement made in the fork and never backported. |
| `static/js/theme.js` | **Same structure, different values** | Same `THEME` object shape (`title`, `fonts`, `fontSizes`, `layout`, `colors.light`/`.dark`). `legal-reward-bench`'s palette (gold/steel-blue/brown-orange) was independently re-derived for WCAG AA from the paper's own LaTeX color definitions; neutrals were deliberately kept identical to `when-rubrics-fail`'s "for cross-site consistency," per that repo's README. |
| `index.html` | **Same skeleton, content-level diff** | ~530 diff lines, but same THEME TOKENS block, same head-meta categories, same `data-section-group`/`data-md`/`data-md-img`/`data-md-table` attribute conventions. The diff is copy, not architecture. |
| `content.md` | **Data only** | Same slot/section HTML-comment convention (`<!-- slot: name -->`, `<!-- section: name -->`). `legal-reward-bench`'s header comments additionally document an ordering nuance: within a section, slot order follows `index.html`'s DOM order, not `content.md`'s top-to-bottom order — an implementation detail both repos share but only one documents clearly. |
| `authors.yaml` | **Same schema, different adequacy** | Identical shape (`authors: [{name, url, equalContribution}]`, one shared `affiliation: {institution, groupName}`, one `correspondence`). `legal-reward-bench` needs 3 affiliations across its author list and flags this as an unresolved limitation in its own header comment — the schema fits `when-rubrics-fail`'s single-affiliation case and doesn't generalize. |
| `links.yaml` | **Data only** | Same flat `{arxiv, code, dataset, ogImage}` shape; `null`-able fields render a "coming soon" disabled state in both. |
| `citation.bib` | **Data only** | Both are raw BibTeX fetched and inserted verbatim, no parsing. Both currently hold placeholder `@misc` entries pending real venue info. |
| `taxonomy.md` | **Data only, different scale** | Both are plain GFM tables consumed by the same `tables.js`. `when-rubrics-fail`: 13 rows (clinical error taxonomy). `legal-reward-bench`: 4 rows (failure-type examples), explicitly noted as "shorter by design" in its own header comment. Neither repo has attempted a *quantitative results* table through this mechanism — see the results-table gap below. |
| `README.md` | **Data only, near-duplicate structure** | `legal-reward-bench`'s README is "largely re-derived" from `when-rubrics-fail`'s, restructured for its own paper. Both serve as the de facto `AGENTS.md`-equivalent since neither repo has one. |
| Build step | **Identical: none** | No `build.py`/`setup.py`/`package.json`/bundler in either. Pure static files, `fetch()`-based client-side rendering, served via `python3 -m http.server` locally (fails under `file://`). |

## The two genuine engine divergences

1. **Markdown link support in `content.js`** (`legal-reward-bench` has it,
   `when-rubrics-fail` doesn't). Should be backported into the generic engine as a
   baseline feature, not left as a one-off improvement in one fork.
2. **Palette values in `theme.js`** are correctly paper-specific (this is expected
   variation, not drift) — but the *mechanism* (hand-edited JS object) is the thing
   to fix, per principle 3/9 in [01-principles.md](01-principles.md): move to a YAML
   design-token block, following the `fjfehr.github.io` pattern below.

## The two unresolved gaps (present in both repos, self-documented in at least one)

1. **Per-author affiliations.** `authors.yaml`'s one-shared-affiliation shape doesn't
   fit a paper with multiple institutions attached to different authors —
   `legal-reward-bench` needs this today and doesn't have it.
2. **No results/leaderboard table primitive.** `legal-reward-bench` is a benchmark
   paper (15 reward models across multiple benchmarks) with real quantitative results,
   but represents them as prose + static spider-chart PNGs rather than structured,
   sortable, best-per-column data — because the only table primitive available
   (`tables.js`) was designed for small qualitative example tables like `taxonomy.md`,
   and nothing else exists.

## What `fjfehr.github.io` contributes that neither paper repo has

| Capability | `when-rubrics-fail` / `legal-reward-bench` | `fjfehr.github.io` |
|---|---|---|
| Design tokens | `theme.js`, hand-written JS | `design:` block in `content/site/config.yaml`, plain YAML, swappable `active_palette` |
| Reset/fork workflow | None — the repo *is* a specific paper's content | `setup.py` + `_template/` blanked mirror, run once after "Use this template" |
| Agent-editing contract | None — README doubles as the only guidance | `.agents/AGENTS.md`: instruction precedence, working rules, out-of-scope files |
| Design rationale docs | None | `.guides/*.md` (colour system, typography, layout rules) — the direct precedent for this `docs/` folder |

`cv-template` is noted only as a cautionary counter-example: it states "decoupled
template and content" as intent, but content is LaTeX macros with no config file,
theme is hardcoded in the engine `.tex`, and there's no reset script or `AGENTS.md` —
i.e., the split isn't actually enforced anywhere. Nothing from it is being adopted
directly; it's evidence for *why* principle 9's "no configuration surface for every
CSS property" still needs an actual enforced boundary, not just a stated one.
