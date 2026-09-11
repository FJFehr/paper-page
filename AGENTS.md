# AGENTS.md

## What this repo is

`paper-page` is a **template**, not a paper page. Nobody browses to a live site backed
by this repo directly — it exists to be forked ("Use this template"), have its example
content replaced with a real paper's content, and deployed as that paper's GitHub Pages
site. Every decision here should be judged by: *does this stay generic enough for a
stranger's paper, or does it quietly assume it's still `when-rubrics-fail`?*

This repo is currently in its **documentation phase**: the files under `docs/` define
the principles, vocabulary, and architecture the template will implement. No `content/`,
`template/`, or `scripts/` directories exist yet. Until they do, treat the plans in
`docs/` as the spec to implement against, not as history to preserve.

## Instruction precedence

1. A direct request from the user in the current conversation.
2. This file.
3. `docs/01-principles.md` (the constitutional rules — "content describes, engine
   renders," "one obvious source of truth," etc.).
4. The rest of `docs/`.
5. `README.md`, once it exists.

## Editable-by-default vs. touch-with-care

Once the template's directory structure exists (see `docs/04-architecture.md`), the
same boundary that the template imposes on a *paper author* also governs how an agent
should edit *this* repo:

- **Safe to edit freely**: anything under `docs/`, `content/` (example/placeholder
  content), `AGENTS.md`, `README.md`.
- **Touch only when the task is explicitly about template behavior**: `template/`
  (or `engine/`) and `scripts/` — the HTML/CSS/JS/Python that every forked paper page
  inherits. A change here affects every future fork, so it needs a real reason, not a
  drive-by tidy-up.

Until those directories exist, the equivalent rule is: changes to `docs/*.md` that
alter the *agreed* architecture (the three-layer model, the component vocabulary, the
config schema sketch) should be flagged as a design change, not folded in silently
alongside an unrelated edit.

## Working rules

- Follow the existing style of whichever file you're editing (heading depth, table
  formatting, tone) rather than introducing a new convention per file.
- Make the smallest change that solves the problem. Don't restructure a doc's section
  order while fixing one paragraph.
- No speculative additions — don't add a new principle, component, or schema field
  that wasn't asked for or grounded in an actual finding from the two source repos
  (`when-rubrics-fail`, `legal-reward-bench`) or the exemplar (`fjfehr.github.io`).
- Ground claims in evidence. If a doc asserts "X is duplicated in six places" or "Y is
  a known limitation," that claim should trace back to something actually read in the
  source repos — cite the file, not just the pattern.
- State which files you expect to change before editing multiple docs at once.
- If the task is proposal-only or asks for a plan, don't make file edits — use plan
  mode.

## Verification

There's no build or test suite while this is documentation-only. The check is a
read-through: for each of the scenarios in `docs/01-principles.md` §10 ("change the
title," "add an author," "add a results section," ...), confirm the architecture in
`docs/04-architecture.md` gives that scenario exactly one place to make the change.

## Follow-up

This file is principles-level and will need a second pass once `template/`, `content/`,
and `scripts/` actually exist with real file names — replace the generic descriptions
above with concrete paths at that point.
