# Step 5 — People rendering + the orchestrator

## Goal

Wire everything from Steps 2–4 together into a working page: fetch the three config
files, render the hero (title/authors/affiliations/resources), build `<main>` from
`sections[]`, and carry over the proven interactivity (theme toggle, scroll-spy nav,
citation copy) from the current `main.js`.

## Depends on

Steps 2, 3, 4 — this is the integration point; nothing here is testable until those
exist.

## Files to create

- `template/js/people.js`
- `template/js/render.js`

## `people.js`

Adapts `renderAuthors`/`renderAffiliation`/`renderCorrespondence` from the current
`main.js`, generalized per `tasks/01-schema-and-tree.md`'s `authors.yaml` schema:

- `renderAuthors(authors, affiliations)` — same `<li class="author">` structure as
  today (linked name or plain `author-noLink` span, comma separators via
  `author-sep`), **plus**: for each author, a `<sup>` per entry in
  `author.affiliations`, showing that affiliation's 1-based index (in first-seen
  order across the whole list) with a `title` attribute set to the affiliation's
  `name` for hover/accessible context. The existing `equalContribution` `*`
  superscript still appends after the affiliation superscripts. Toggle
  `#equal-contribution-note`'s `hidden` exactly as today (`hidden = !authors.some(a
  => a.equal_contribution)`).
- `renderAffiliationLogos(affiliations)` — replaces the current hardcoded
  `#oxford-logo`/`#oxai-logo-wrap` handling: loop over `affiliations[]` in order,
  append an `<img>` into `#affiliation-logos` for each entry that has a `logo` field
  (skip entries without one — no broken-image icon), `alt` set to that affiliation's
  `name`.
- `renderCorrespondence(correspondence)` — unchanged from today's logic (falls back
  to `[CORRESPONDING AUTHOR]`/`[EMAIL]` placeholder text if fields are missing,
  toggles the `#correspondence` wrapper's `hidden` — note: today's markup doesn't
  hide this block; check whether the Step 2 skeleton needs a `hidden` default and
  an unhide-on-data call here, since the schema allows `correspondence` to be a
  small block rather than always-present).

## `render.js`

The orchestrator, replacing `main.js`. Same overall shape (an IIFE, a
`DOMContentLoaded` listener), reusing these functions from the current `main.js`
**near-verbatim** (only the parts that read the old global `THEME`/hardcoded slot
DOM change):

- `initThemeToggle()` — unchanged, except its `applyTheme(next)` call becomes
  `applyTheme(currentProjectConfig.theme, next)` (needs the fetched `project.yaml`
  in closure scope — restructure slightly so `initThemeToggle` runs, or is
  re-armed, after `project.yaml` has loaded, OR store the fetched config in a
  module-level variable set once and read by the toggle handler each click; the
  latter is simpler — do that).
- `updateHeaderHeightVar()`, `initScrolling()` — unchanged, except `initScrolling`'s
  nav-link collection (`#site-nav a[href^='#']`) now runs **after** the nav itself
  is built (see below), not against static markup.
- `renderBibtex(bibtex)`, `copyText(text)`, `legacyCopy(text)` — unchanged; called
  by the `citation` block case from Step 4's `blocks.js` (coordinate exact element
  ids between the two steps as noted there).

New orchestration logic specific to this step:

```js
document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    fetch("project.yaml").then(r => r.text()).then(parseYamlLite),
    fetch("authors.yaml").then(r => r.text()).then(parseYamlLite),
  ]).then(([project, authorsData]) => {
    window.__PROJECT__ = project; // read by the theme-toggle handler, per above

    // Hero
    document.title = project.paper.title;
    document.getElementById("hero-title").textContent = project.paper.title;
    document.getElementById("wordmark").textContent = project.paper.short_title;
    renderAuthors(authorsData.authors, authorsData.affiliations);
    renderAffiliationLogos(authorsData.affiliations);
    renderCorrespondence(authorsData.correspondence);
    renderResourceButtons(project.resources); // icon map from tasks/01

    // Re-apply the *configured* palette now that project.yaml has loaded (see
    // Step 2's accepted pre-paint tradeoff).
    const mode = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(project.theme, mode);

    // Nav + <main>, built entirely from sections[]
    const nav = document.getElementById("site-nav");
    const main = document.getElementById("main");
    project.sections.forEach(section => {
      if (section.nav) {
        const a = document.createElement("a");
        a.href = "#" + section.id;
        a.textContent = section.title;
        nav.appendChild(a);
      }
      const el = document.createElement("section");
      el.id = section.id;
      if (section.title) {
        const h2 = document.createElement("h2");
        h2.textContent = section.title;
        el.appendChild(h2);
      }
      main.appendChild(el);
      section.blocks.forEach(block => {
        const container = document.createElement("div");
        el.appendChild(container);
        renderBlock(container, block); // from blocks.js, Step 4
      });
    });
    nav.appendChild(themeToggleButtonMoveOrKeepInHeaderInline); // see note below

    // Footer
    if (project.footer && project.footer.note) {
      document.getElementById("footer-note").textContent = project.footer.note;
    }

    // Now that the nav exists, wire up scrolling/theme-toggle/etc.
    initThemeToggle();
    initScrolling();
  }).catch(err => {
    console.error("Failed to load project.yaml/authors.yaml:", err);
    document.getElementById("main").textContent =
      "Content failed to load. If you're previewing locally, serve this folder " +
      "over http:// (not file://).";
  });

  fetch("citation.bib").then(r => r.text()).then(renderBibtex).catch(err => {
    console.error("Failed to load citation.bib:", err);
  });
});
```

The pseudocode above is a **structural sketch**, not final code — resolve during
implementation: (a) whether the theme-toggle `<button>` stays statically in
`index.html`'s header (simpler — keep it there per Step 2's skeleton, don't move it
via JS; the line above referencing "themeToggleButtonMoveOrKeepInHeaderInline" is a
reminder to delete that line and confirm the button just stays put), (b) whether
`project.sections` heading level should be `<h2>` unconditionally or vary — keep
`<h2>` for all top-level sections, matching `markdown.js`'s block-level heading
offset assumption from Step 4.

## Definition of done

- [ ] Loading `index.html` over `python3 -m http.server` (not `file://`) renders the
      full hero (title, authors with correct affiliation superscripts, affiliation
      logos, resource buttons) and every section from a real `project.yaml`.
- [ ] Nav links are generated in `sections[]` order, only for `nav: true` entries,
      and scroll-spy highlighting works against them.
- [ ] Theme toggle switches palette correctly using the *configured* palette (not
      just the pre-paint default), and persists via `localStorage` across a reload.
- [ ] Citation copy button works (clipboard or the `execCommand` fallback).
- [ ] A missing/malformed `project.yaml` or `authors.yaml` fails gracefully (visible
      message in `<main>`, console error), not a blank white page.
