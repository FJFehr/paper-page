# Step 9 — README and LICENSE

## Goal

Replace the placeholder README with one that documents the real fork→setup→edit→push
workflow Step 8 makes possible, following the structure that already works in
`fjfehr.github.io/README.md`: fork mechanism first, architecture rationale after.
Add the `LICENSE` file the new README's license section needs.

## Depends on

Step 8 (`scripts/setup.py` and `_template/` must exist and work — the README
documents a real command, not an aspirational one).

## Files to create/edit

- `README.md` — restructure into, in order:
  1. Badges (stars/forks/license) + one-line value prop.
  2. "What you get out of the box" bullets.
  3. "Use this template" button + `python3 scripts/setup.py` + the checklist of
     files it prints.
  4. Quick Start: a task→file table (change the title, add an author, add a
     section, add a results table, swap the theme palette), grounded in
     `docs/01-principles.md` §10's scenario list.
  5. Structure: a directory tree (`content/`, `template/`, `scripts/`,
     `_template/`, `docs/`, `tasks/`) with inline comments.
  6. Status: note `scripts/build.py` (generated `<head>` metadata) is still
     unbuilt, so `project.yaml` metadata needs hand-sync into `index.html`'s
     `<head>` for now — don't overclaim readiness.
  7. "Why this exists" — keep the existing links to and rationale involving
     `when-rubrics-fail` and `legal-reward-bench`, moved below the fork mechanism.
  8. License section — MIT for the template code, explicit note that
     `content/`/`assets/` ship as the "Penguin Embeddings" example and must be
     replaced (via `scripts/setup.py`), not reused.
- `LICENSE` — MIT, matching `fjfehr.github.io/LICENSE`.

## Definition of done

- [ ] Every internal link in `README.md` (`docs/*.md`, `tasks/*.md`, `LICENSE`)
      resolves to a real file.
- [ ] The Quick Start table's file references are correct against the actual schema
      in `tasks/01-schema-and-tree.md` (not the sketch in `docs/04-architecture.md`,
      which is explicitly superseded).
- [ ] The README's "Use this template" command and checklist match what
      `scripts/setup.py` actually does and prints.
