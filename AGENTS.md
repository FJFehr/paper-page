# AGENTS.md

## What this repo is

`paper-page` is a **template**, not a paper page. Nobody browses to a live site backed
by this repo directly — it exists to be forked ("Use this template"), have its example
content replaced with a real paper's content, and deployed as that paper's GitHub Pages
site. Every decision here should be judged by: *does this stay generic enough for a
stranger's paper, or does it quietly assume it's still `when-rubrics-fail`?*

The engine (`index.html`, `template/css/`, `template/js/`), a fictional demo paper
(`project.yaml`, `authors.yaml`, `citation.bib`, `content/`, `assets/`), and the
fork-reset mechanism (`scripts/setup.py`, `_template/`) all exist and work — see
`tasks/00-overview.md` for what's done. The files under `docs/` still define the
principles, vocabulary, and architecture this template implements; treat them as the
spec to check new work against, not as history to preserve.

## Instruction precedence

1. A direct request from the user in the current conversation.
2. This file.
3. `docs/01-principles.md` (the constitutional rules — "content describes, engine
   renders," "one obvious source of truth," etc.).
4. The rest of `docs/`.
5. `README.md`.

## Editable-by-default vs. touch-with-care

The same boundary the template imposes on a *paper author* also governs how an agent
should edit *this* repo:

- **Safe to edit freely**: anything under `docs/`, `content/` (example/placeholder
  content), `AGENTS.md`, `README.md`, `LICENSE`.
- **Touch only when the task is explicitly about template behavior**: `template/`
  (the HTML/CSS/JS every forked paper page inherits), `scripts/` (`setup.py`,
  `generate_readme.py`, `yaml_lite.py`), and `_template/` (the blanked mirror
  `setup.py` copies from — it must stay in lockstep with `content/`'s schema, so a
  `content/` field-name change needs a matching `_template/` edit). A change here
  affects every future fork, so it needs a real reason, not a drive-by tidy-up.

Changes to `docs/*.md` that alter the *agreed* architecture (the three-layer model,
the component vocabulary, the config schema) should be flagged as a design change,
not folded in silently alongside an unrelated edit.

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

There's no build step, but there are two real checks:
- **Engine/content changes**: serve the repo (`python3 -m http.server`) and confirm
  it renders with zero console errors, per `tasks/07-verification.md`'s procedure.
- **`scripts/setup.py` / `_template/` changes**: run the script against a scratch
  copy of the repo (never the working tree — it's destructive), confirm every live
  file matches its `_template/` counterpart, then serve that scratch copy and check
  it still renders cleanly.

For any change, the read-through check still applies: for each scenario in
`docs/01-principles.md` §10 ("change the title," "add an author," "add a results
section," ...), confirm it resolves in exactly one place.
