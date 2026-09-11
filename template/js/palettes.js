/**
 * ============================================================================
 * NAMED PALETTES
 * ============================================================================
 * project.yaml's theme.palette picks one of these by name (see
 * tasks/03-engine-js-foundation.md). Real, already-WCAG-AA-checked values
 * pulled directly from the two source repos -- not invented colours:
 *
 *   - "sage"  ported from when-rubrics-fail/static/js/theme.js
 *   - "gold"  ported from legal-reward-bench/static/js/theme.js
 *
 * Each palette has a light/dark pair; each of those has the base neutrals
 * (background/surface/text/textMuted/border/rule/linkHover) plus three
 * {dark, mid, light, text} tone quads -- primary/secondary/accent -- mapped
 * by template/js/theme.js onto the --green-, --purple- and --orange-
 * prefixed CSS custom properties (the property names stay fixed regardless
 * of which palette is active; only the values change). Both source repos kept their
 * neutrals identical "for cross-site consistency" -- carried over here too.
 * ============================================================================
 */

const PALETTES = {
  sage: {
    light: {
      background: "#F5F0E6",
      surface: "#FBF7EF",
      text: "#2A2521",
      textMuted: "#6E6759",
      border: "#DED4C0",
      rule: "#C9BC9E",
      linkHover: "#16350F",
      primary: { dark: "#328132", mid: "#61CA53", light: "#DCF5DC", text: "#256025" },
      secondary: { dark: "#75639B", mid: "#B7A9D6", light: "#EEEAF5", text: "#5F5085" },
      accent: { dark: "#D98A45", mid: "#F1C38F", light: "#FBF1E6", text: "#8C4E1C" },
    },
    dark: {
      background: "#1E1A16",
      surface: "#28231E",
      text: "#EDE6D8",
      textMuted: "#A79C8A",
      border: "#3A332B",
      rule: "#453D33",
      linkHover: "#86B77B",
      primary: { dark: "#61CA53", mid: "#61CA53", light: "#26301F", text: "#6E9C64" },
      secondary: { dark: "#B7A9D6", mid: "#B7A9D6", light: "#2A2733", text: "#C6BADF" },
      accent: { dark: "#D98A45", mid: "#F1C38F", light: "#332822", text: "#E2A468" },
    },
  },
  gold: {
    light: {
      background: "#F5F0E6",
      surface: "#FBF7EF",
      text: "#2A2521",
      textMuted: "#6E6759",
      border: "#DED4C0",
      rule: "#C9BC9E",
      linkHover: "#57450F",
      primary: { dark: "#A5831C", mid: "#DEB73F", light: "#FAF3E0", text: "#826816" },
      secondary: { dark: "#648DC0", mid: "#6F95C4", light: "#E8EEF6", text: "#436EA4" },
      accent: { dark: "#C87736", mid: "#D08A52", light: "#F7ECE3", text: "#9C5D2A" },
    },
    dark: {
      background: "#1E1A16",
      surface: "#28231E",
      text: "#EDE6D8",
      textMuted: "#A79C8A",
      border: "#3A332B",
      rule: "#453D33",
      linkHover: "#E5C565",
      primary: { dark: "#DEB73F", mid: "#DEB73F", light: "#584922", text: "#C8AC55" },
      secondary: { dark: "#6F95C4", mid: "#6F95C4", light: "#363F4A", text: "#7B96B8" },
      accent: { dark: "#D08A52", mid: "#D08A52", light: "#533C28", text: "#BE8C64" },
    },
  },
};
