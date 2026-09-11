# Step 2 — Engine shell: `index.html` + `template/css/style.css`

## Goal

Build the static shell every later JS module targets: a `<head>` with placeholder
metadata, a hero skeleton with fixed element ids, an empty `<main id="main">` that
`render.js` (Step 5) populates entirely from `project.yaml`, a footer skeleton, and
the full CSS token/layout/component system.

## Depends on

Step 1 (schema — this step's ids/classes must match what Steps 3–5 target).

## Files to create

- `index.html` (repo root)
- `template/css/style.css`

## `index.html` — head

Ported pattern from `when-rubrics-fail`/`legal-reward-bench` (see
`docs/02-comparison-matrix.md`), with two additions (favicon; a default-palette
pre-paint bootstrap) and one explicit acknowledgment (placeholder metadata, since
`build.py` isn't built yet this pass):

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Favicon -- set once, matches project.yaml's social.favicon by hand until
     scripts/build.py exists to generate this from project.yaml directly. -->
<link rel="icon" href="assets/favicon.svg">

<!-- Metadata below is PLACEHOLDER, hand-authored to match this demo paper's own
     project.yaml. Forking this template today means updating project.yaml AND
     these tags by hand -- see docs/01-principles.md #2 and tasks/00-overview.md's
     "out of scope" note. scripts/build.py (future) removes this duplication. -->
<title>Do Penguins Dream of Embeddings? A Benchmark for Latent Aquatic Reasoning</title>
<meta name="description" content="...">
<link rel="canonical" href="TODO">
<meta property="og:type" content="article">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="TODO -- absolute URL to assets/og-image.svg">
<meta property="og:url" content="TODO">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="assets/og-image.svg">
<meta name="citation_title" content="...">
<meta name="citation_author" content="Smith, Jane">
<!-- one citation_author per author, same pattern as the source repos -->

<!-- Engine scripts, in dependency order -->
<script src="template/js/palettes.js"></script>
<script src="template/js/theme.js"></script>

<!-- THEME BOOTSTRAP -- applies a default palette + light/dark mode before first
     paint (no flash of unstyled content). render.js re-applies the *configured*
     palette once project.yaml loads (Step 5) -- a brief palette swap is possible,
     not a layout flash. See tasks/00-overview.md's accepted tradeoff. -->
<script>
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      var mode = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", mode);
      if (typeof applyTheme === "function") applyTheme({ palette: "sage", overrides: {} }, mode);
    } catch (e) { /* falls back to the static :root/[data-theme="dark"] CSS below */ }
  })();
</script>
```

## `index.html` — body skeleton

```html
<a class="skip-link" href="#main">Skip to content</a>
<div id="scroll-progress" aria-hidden="true"></div>

<header class="site-header">
  <div class="nav-inner">
    <a class="wordmark" id="wordmark" href="#top"></a>
    <nav id="site-nav" aria-label="Section"></nav> <!-- built entirely by render.js from sections[].nav -->
    <button id="theme-toggle" type="button" aria-label="Switch to dark theme" aria-pressed="false">☾</button>
  </div>
</header>

<section id="top" class="hero">
  <div class="wrap">
    <h1 id="hero-title"></h1>
    <ul id="author-list"></ul>
    <p id="equal-contribution-note" hidden>* Equal contribution</p>
    <div id="affiliation-logos"></div>
    <div id="resource-buttons"></div>
    <p id="correspondence" hidden>
      Correspondence: <span id="correspondence-name"></span>
      (<a id="correspondence-email" href="#"></a>)
    </p>
  </div>
</section>

<main id="main"></main> <!-- entirely built by render.js from project.yaml's sections[] -->

<footer class="site-footer">
  <div class="wrap">
    <div id="footer-note"></div>
    <a href="#top">Back to top ↑</a>
  </div>
</footer>
```

Note the shift from the current repos' approach: there is no pre-existing
`<section data-section-group="...">` markup for each paper section — `render.js`
creates those elements at runtime from `sections[]`. This is the actual mechanism
that closes the "adding a new section requires an `index.html` edit" gap from
`docs/01-principles.md` §6.

## `template/css/style.css`

Port directly (values and structure) from `when-rubrics-fail`'s `<style>` block —
confirmed proven and paper-agnostic in `docs/02-comparison-matrix.md`:

- **Token groups** under `:root` and `[data-theme="dark"]`: `--color-bg`,
  `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`,
  `--color-rule`, `--color-link`, `--color-link-hover`, `--color-focus`, the
  `--green-*`/`--purple-*`/`--orange-*` triads (`dark`/`mid`/`light`/`text` each —
  kept as the variable *names* even though the demo's default palette is `sage`;
  `palettes.js`, Step 3, maps a named palette's semantic `primary`/`secondary`/
  `accent` onto these same three triads so the CSS never needs to know which named
  palette is active), `--font-serif`/`--font-sans`/`--font-mono`,
  `--font-size-hero-title`/`--font-size-body`/`--font-size-body-mobile`,
  `--content-width`/`--prose-width`/`--radius`/`--radius-pill`.
- **Layout**: `.wrap` (max-width `--content-width`, centered, `flow-root`), `.prose`
  (max-width `--prose-width`, centered), generic `section { padding: 56px 0;
  border-top: 1px solid var(--color-border); }` rhythm (no more `#overview`/
  `#problem`/`#takeaways`-specific zero-padding rule — since sections are now
  dynamically generated and grouped by `project.yaml`, give the *first* block within
  a rendered section the zero-top-padding treatment via a `:first-child` rule
  instead of hardcoded ids, so multiple blocks in one section still read as one
  continuous flow).
- **Reused as-is**: `.md-table` (zebra striping, `.md-table-key` bold first column,
  responsive column-drop below 600px), `.takeaways-grid`/`.takeaway` (card styling,
  hover/focus states), `.fig-left`/`.fig-right` (float behavior, `max-width: 45%`,
  600px breakpoint fallback to centered).
- **New: `.callout`** — box styling reusing the existing `.tldr` visual treatment
  (surface background, bold lead sentence in accent color) but as a generic,
  reusable class with style modifiers: `.callout-tldr` (default accent), room to add
  `.callout-note`/`.callout-warning` later without new markup (not built this pass —
  only `tldr` style is used by the demo content, per Step 1's schema having a
  `style:` field already).
- **New: `.results-table`** — extends `.md-table`'s base look: numeric columns
  (`td[data-col-type="number"]`) get `text-align: right`, `font-variant-numeric:
  tabular-nums`; the best-per-column cell gets `.best` (bold + `color:
  var(--orange-text)`, matching the existing convention of using the accent triad
  for "this is the important value" per `.md-table`'s `em` styling).
- **Dark mode**: `[data-theme="dark"]` attribute selector pattern throughout, not
  `prefers-color-scheme` media queries (that's consulted once, in the bootstrap
  script, same as today).
- **Responsive breakpoints**: keep the three existing ones (600px figure/table,
  768px header wrap, 480px body font/hero-padding/button-gap shrink), unchanged.

## Definition of done

- [ ] `index.html` validates (no unclosed tags), loads `template/css/style.css` and
      the two bootstrap `<script>` tags in the head, and its body skeleton has every
      id `people.js`/`render.js` (Steps 3–5) will target.
- [ ] Opening the file directly shows the default `sage` palette applied (light
      mode) with no console errors about missing `applyTheme`/`palettes.js` — this
      is checkable even before Step 3's real palette data exists, using a stub.
- [ ] `template/css/style.css` defines every token name listed above in both
      `:root` and `[data-theme="dark"]`.
