/**
 * ============================================================================
 * MARKDOWN — the inline/block Markdown subset shared by every block renderer
 * (template/js/blocks.js, tables.js, results-table.js). Extracted and
 * extended from when-rubrics-fail's content.js (see
 * tasks/04-engine-js-blocks.md):
 *
 *   - mdInline: the link-support fix from legal-reward-bench's content.js is
 *     folded in here permanently (docs/02-comparison-matrix.md's one real
 *     engine divergence, finally backported).
 *   - mdBlock: unlike the source repos (where a block always rendered into a
 *     pre-existing <h1>/<h2>/<h3> slot element, so a leading "#" was just
 *     stripped), blocks here render into a generic container blocks.js
 *     creates -- so a heading LINE inside a block's raw text must become a
 *     real heading element, not be discarded. A new heading pass does that.
 * ============================================================================
 */

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Inline formatting -- links, then bold/italic/code. Link substitution runs
// first so a URL's own characters (parens aside) can't be mistaken for
// ** / * / ` markers, and the emitted <a> tag can't be corrupted by the
// later substitutions (ported from legal-reward-bench's content.js).
function mdInline(text) {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/`(.+?)`/g, "<code>$1</code>");
  return s;
}

// Strips a leading Markdown heading marker ("#", "##", ...), if any -- used
// where a block's text lands in a target that already carries its own
// heading level (e.g. a takeaway card's title, a figure's caption) rather
// than through mdBlock's own heading pass below.
function stripHeadingMarker(text) {
  return text.replace(/^#{1,6}\s+/, "");
}

// Paragraphs (blank-line separated) or, if every line looks like "1. ..."
// / "- ...", a list. Returns an HTML string of one or more <p>/<ol>/<ul>.
function renderParagraphsOrList(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";

  const lines = trimmed
    .split("\n")
    .map(function (l) { return l.trim(); })
    .filter(Boolean);
  const isOrderedList = lines.length > 0 && lines.every(function (l) { return /^\d+\.\s+/.test(l); });
  const isBulletList = !isOrderedList && lines.length > 0 && lines.every(function (l) { return /^[-*]\s+/.test(l); });
  if (isOrderedList || isBulletList) {
    const tag = isOrderedList ? "ol" : "ul";
    const itemRe = isOrderedList ? /^\d+\.\s+/ : /^[-*]\s+/;
    return (
      "<" + tag + ">" +
      lines.map(function (l) { return "<li>" + mdInline(l.replace(itemRe, "")) + "</li>"; }).join("") +
      "</" + tag + ">"
    );
  }

  const paras = trimmed
    .split(/\n\s*\n/)
    .map(function (p) { return p.trim(); })
    .filter(Boolean);
  return paras.map(function (p) { return "<p>" + mdInline(p.replace(/\s+/g, " ")) + "</p>"; }).join("");
}

// Full block converter: splits `raw` into heading lines (#, ##, ### --
// offset by one level in the emitted tag, h2/h3/h4, since the section
// itself already carries an <h2> from its own title) and everything else,
// which runs through renderParagraphsOrList in between headings.
function mdBlock(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";

  const lines = trimmed.split("\n");
  let html = "";
  let buffer = [];

  function flush() {
    if (!buffer.length) return;
    html += renderParagraphsOrList(buffer.join("\n"));
    buffer = [];
  }

  lines.forEach(function (line) {
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (headingMatch) {
      flush();
      const tag = "h" + Math.min(headingMatch[1].length + 1, 4);
      html += "<" + tag + ">" + mdInline(headingMatch[2].trim()) + "</" + tag + ">";
    } else {
      buffer.push(line);
    }
  });
  flush();
  return html;
}
