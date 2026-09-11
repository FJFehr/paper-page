/**
 * ============================================================================
 * THEME APPLICATION
 * ============================================================================
 * Adapts when-rubrics-fail/legal-reward-bench's applyTheme(mode) (which read
 * a single hardcoded global THEME const) into a parameterized
 * applyTheme(themeConfig, mode), driven by project.yaml's theme: block
 * instead: { palette: "sage"|"gold", mode: "auto"|"light"|"dark",
 * overrides: {} }. See tasks/03-engine-js-foundation.md.
 *
 * Called twice, same as the source repos: once from index.html's pre-paint
 * THEME BOOTSTRAP script (before project.yaml has loaded -- uses a fixed
 * default palette, see that script's own comment for the accepted
 * flash-of-unconfigured-palette tradeoff), and again from
 * template/js/render.js once project.yaml has loaded (with the *real*
 * configured palette) and again on every theme-toggle click.
 *
 * Only palette (colours) is configurable this pass -- fonts/layout stay CSS
 * defaults in template/css/style.css, not part of themeConfig. See
 * tasks/03-engine-js-foundation.md's scope note.
 * ============================================================================
 */

function applyTheme(themeConfig, mode) {
  themeConfig = themeConfig || {};
  const palette = PALETTES[themeConfig.palette] || PALETTES.sage;
  const c = palette[mode] || palette.light;

  const root = document.documentElement.style;
  const set = function (name, value) {
    root.setProperty(name, value);
  };

  set("--color-bg", c.background);
  set("--color-surface", c.surface);
  set("--color-text", c.text);
  set("--color-text-muted", c.textMuted);
  set("--color-border", c.border);
  set("--color-rule", c.rule);
  set("--color-link", c.primary.text);
  set("--color-link-hover", c.linkHover);
  set("--color-focus", c.primary.text);

  set("--green-dark", c.primary.dark);
  set("--green-mid", c.primary.mid);
  set("--green-light", c.primary.light);
  set("--green-text", c.primary.text);
  set("--purple-dark", c.secondary.dark);
  set("--purple-mid", c.secondary.mid);
  set("--purple-light", c.secondary.light);
  set("--purple-text", c.secondary.text);
  set("--orange-dark", c.accent.dark);
  set("--orange-mid", c.accent.mid);
  set("--orange-light", c.accent.light);
  set("--orange-text", c.accent.text);

  // project.yaml's theme.overrides wins over the named palette -- applied
  // last, one raw CSS-custom-property name/value pair at a time.
  const overrides = themeConfig.overrides || {};
  Object.keys(overrides).forEach(function (name) {
    set(name, overrides[name]);
  });
}
