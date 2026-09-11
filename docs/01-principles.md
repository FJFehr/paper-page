# Principles

`paper-page` is not a generic website builder. It is a **small, opinionated
project-page system for research papers** — a fixed vocabulary of primitives
(paper, authors, resources, sections, blocks, assets, citation, theme) that a paper
author assembles by editing content and config files, never by editing HTML/CSS/JS.

"Generic" here doesn't mean "a blank clone of `when-rubrics-fail`." A blanked clone
still carries that paper's assumptions (a specific `takeaways` widget wired to exactly
three findings, a specific set of `data-section-group` values). A true template knows
about the *primitives*, and leaves the assembly to the paper.

These principles are grounded in what was actually found in `when-rubrics-fail`,
`legal-reward-bench`, and `fjfehr.github.io` (see
[02-comparison-matrix.md](02-comparison-matrix.md)) — not asserted in the abstract.

## 1. Zero-code happy path

**Fork → run setup → edit config/content → push.** A user should never need to open
`template/`'s HTML/CSS/JS to produce a polished page.

`fjfehr.github.io` already does this: `setup.py` copies blanked files from a
`_template/` mirror over the live `content/` directory, clears personal content, and
the README walks through "edit these 5 files, replace this image, push." That
mechanism — a reset script plus a blanked mirror directory — is the concrete pattern
this template adopts, not a vague aspiration.

## 2. One obvious source of truth

Both `when-rubrics-fail` and `legal-reward-bench` duplicate title/author/description
across **six places**: the visible page (rendered client-side from `theme.js`), the
`<title>` tag, OpenGraph tags, Twitter card tags, Google Scholar/Highwire citation
meta tags, and `citation.bib`. Each repo has open `TODO`s from this drifting out of
sync (an unresolved canonical URL, a missing OG image). This is the single clearest
failure mode observed in the current repos, and the template must design it away:
one field entered once should drive every rendering of it, static-crawler-readable
metadata included.

## 3. Progressive complexity

A beginner should encounter a handful of files: a project config, an authors file,
a `content/` directory, an `assets/` directory. Not the engine, not build scripts,
not two dozen edge-case config knobs. The current repos already get this partway —
`content.md`/`authors.yaml`/`links.yaml`/`citation.bib` vs. `index.html` +
`static/js/*.js` — but the boundary should be a directory, not a convention someone
has to already know: content/config on one side, engine on the other, visibly.

## 4. Convention over configuration

Don't make a user configure what the engine can infer. A `resources.code` URL implies
a GitHub icon and a "Code" label without being told so. An author entry with two
affiliation references implies rendering two superscripts, not a manual "how do I
show two affiliations" question — which is exactly the gap `legal-reward-bench` hit:
`authors.yaml`'s schema supports only one shared `affiliation:` block for the whole
list, and that repo's own header comment flags this as an unresolved limitation
because the paper actually has three affiliations attached to specific authors. The
schema needs to support per-author affiliations by convention, not require a
workaround.

## 5. Optional everything

Presence and absence are both first-class. `links.yaml` already treats `null` fields
correctly (a `null` `arxiv` link renders as a disabled "coming soon" state rather than
a broken link) — that pattern generalizes: no dataset, no problem; two authors or
seventy, no problem; a section with no figures, no problem. The template must never
render a visibly empty slot.

## 6. Components, not page layouts

Offer a small vocabulary of research-communication primitives (see
[03-component-vocabulary.md](03-component-vocabulary.md)) that a paper composes,
rather than a menu of whole-page layouts to pick between. The current engine
already proves this works for prose, figures, and simple tables (`tables.js` is a
genuinely generic Markdown-table renderer, reused as-is across both repos). It does
**not** yet work for one real, common case: `legal-reward-bench` is a benchmark paper
comparing 15 models across several benchmarks, and has no way to express that as a
structured results/leaderboard table — it falls back to prose and static PNG spider
charts. A results-table primitive (numeric columns, best-per-column emphasis,
many-row model comparison) is the concrete gap this principle needs to close.

## 7. Sensible defaults should look finished

The template's default state should not look like a wireframe with "Hero goes here."
It should be a complete, obviously-fictional example paper — full author list,
affiliations, resource buttons, figures, a takeaways section, a results table,
citation — so the repo is simultaneously template, documentation, and component
gallery. `setup.py` (per principle 1) then replaces the example with clean
placeholders. This is a stronger default than either source repo currently ships,
since both start from a specific real paper rather than a demonstrative fake one.

## 8. Agent-readable architecture

An agent should be able to open this repo and know, without guessing, where a given
change belongs — this is formalized in [AGENTS.md](../AGENTS.md), not left to be
inferred from a README. Neither `when-rubrics-fail` nor `legal-reward-bench` has an
`AGENTS.md`; their README doubles as the only editing contract, described in prose
rather than as an explicit rule set. `fjfehr.github.io`'s `.agents/AGENTS.md` (working
rules, out-of-scope files, "state which files you expect to change") is the pattern
to carry over.

## 9. What this template deliberately does not do

- No JS framework, bundler, or Node build step. The appeal of the current repos is
  that they're legible: fetch a file, parse it, fill a slot. A single Python
  standard-library-ish `setup.py`/`build.py` is acceptable (principle 2 may need a
  small generation step to eliminate metadata duplication); a framework is not.
- No page-layout picker (see principle 6).
- No configuration surface for every CSS property. Design tokens live in one place
  (see [04-architecture.md](04-architecture.md)), not scattered across the engine.
- No silent scope creep in the component vocabulary — a new primitive is added
  because a real paper needs it (as the results table is, per principle 6), not
  because it's conceivable.

## 10. The test for every architectural decision

*Could a researcher — or an agent with no prior knowledge of this repo — correctly
figure out where to make this change within 30 seconds?*

- Change the title → one field.
- Add an author → one file, one list entry, affiliations included.
- Add a results section with a new table → content/config only, no engine edit.
- Change the color palette → one field.
- Replace a figure → one asset + one reference.
- Reorder two sections → config only.
- Add a benchmark leaderboard → the results-table primitive, populated from content.

If any answer is "go edit a specific line of the engine," that's a signal the
architecture in [04-architecture.md](04-architecture.md) needs to close that gap.
