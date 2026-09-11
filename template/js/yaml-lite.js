/**
 * ============================================================================
 * YAML-LITE PARSER
 * ============================================================================
 * parseYamlLite(text) -> a plain JS object/array tree. Used to read
 * project.yaml and authors.yaml (see template/js/render.js). This is NOT a
 * full YAML parser -- it supports exactly the subset those two files need,
 * in the same "nothing fancier" spirit as template/js/markdown.js's
 * Markdown subset. Ported verbatim from when-rubrics-fail/legal-reward-bench
 * (see docs/02-comparison-matrix.md) -- already generic, no changes needed
 * for project.yaml's sections[]/blocks[] nesting.
 *
 *   - 2-space indentation per nesting level. Blank lines are ignored.
 *   - `#` outside quotes starts a comment, to the end of the line (whole-
 *     line or trailing). Wrap a value in quotes if it needs a literal `#`.
 *   - `key: value` -- the separator is a colon *followed by a space* (or
 *     end of line, for `key:` with no inline value), so a bare colon
 *     inside a value (e.g. a `https://...` URL) is safe.
 *   - Scalars: `null` / `~` / empty -> `null`; `true` / `false` -> a
 *     boolean; `'...'` / `"..."` -> a string with the quotes stripped (no
 *     escape processing); anything else -> the trimmed text, as a string.
 *   - A `key:` with no inline value starts a nested block on the following
 *     more-indented lines -- either another mapping (`key: value` lines)
 *     or a list (`- ` lines).
 *   - A `- key: value` list item, followed by further `key: value` lines
 *     indented 2 spaces past the `-`, is a list of mappings (this is what
 *     `authors:`/`sections:`/`blocks:` use, e.g. one `- id: ...` /
 *     `title: ...` / `blocks: ...` per section). A bare `- value` is a
 *     scalar list item.
 *   - NOT supported: flow style (`[a, b]`, `{a: b}`), multiline block
 *     scalars (`|` / `>`), anchors/aliases, multi-document `---`.
 *
 * Malformed input is handled defensively (never throws) rather than
 * validated -- a mis-indented file will just parse into something odd
 * instead of crashing the page; the fetch layer in render.js is what
 * decides how a failure is surfaced.
 * ============================================================================
 */

function parseYamlLite(text) {
  const lines = tokenize(text);
  let pos = 0;

  // A file like content/takeaways.yaml is a bare root-level list ("- title:
  // ..." with no enclosing key) rather than a mapping. parseMapping(0)
  // alone would see the first line is a list item and return {} immediately
  // -- detect that case up front and parse a root list instead. Mapping-
  // rooted files (project.yaml, authors.yaml, everything else) are
  // unaffected.
  if (lines.length && lines[0].indent === 0 && lines[0].isItem) {
    return parseList(0);
  }

  function peek() {
    return pos < lines.length ? lines[pos] : null;
  }

  // Parses zero or more plain "key: value" lines at exactly `indent` into
  // an object -- stops at the first line that's a list item or at a
  // shallower/deeper indent.
  function parseMapping(indent) {
    const obj = {};
    while (peek() && peek().indent === indent && !peek().isItem) {
      const content = lines[pos].content;
      pos++;
      assignKeyValue(obj, content, indent + 2);
    }
    return obj;
  }

  // Parses zero or more "- ..." lines at exactly `indent` into an array.
  function parseList(indent) {
    const arr = [];
    while (peek() && peek().indent === indent && peek().isItem) {
      const rest = lines[pos].content;
      pos++;

      if (rest === "") {
        // Bare "-" -- a nested block (map or list) may follow, indented.
        if (peek() && peek().indent === indent + 2) {
          arr.push(peek().isItem ? parseList(indent + 2) : parseMapping(indent + 2));
        } else {
          arr.push(null);
        }
        continue;
      }

      const sep = findSeparator(rest);
      if (sep === -1) {
        // Bare scalar item: "- value".
        arr.push(parseScalar(rest.trim()));
        continue;
      }

      // "- key: value" (or "- key:" + nested) starts a list item that's a
      // mapping; further "key: value" lines at indent+2 continue this same
      // item (parseMapping handles exactly that).
      const item = {};
      assignKeyValue(item, rest, indent + 2);
      Object.assign(item, parseMapping(indent + 2));
      arr.push(item);
    }
    return arr;
  }

  // Parses one already-dequeued "key: value" / "key:" line's content into
  // `obj`, consuming a following nested block at `childIndent` if the
  // value was left blank.
  function assignKeyValue(obj, content, childIndent) {
    const sep = findSeparator(content);
    const key = (sep === -1 ? content : content.slice(0, sep)).trim();
    const rawVal = sep === -1 ? "" : content.slice(sep + 1).trim();

    if (rawVal !== "") {
      obj[key] = parseScalar(rawVal);
      return;
    }
    if (peek() && peek().indent === childIndent) {
      obj[key] = peek().isItem ? parseList(childIndent) : parseMapping(childIndent);
    } else {
      obj[key] = null;
    }
  }

  return parseMapping(0);
}

// Splits `text` into { indent, isItem, content } lines: comment-stripped,
// blank lines dropped, and a leading "- "/"-" already peeled off (with
// `isItem` recording that this line is a list entry).
function tokenize(text) {
  const lines = [];
  text.split(/\r?\n/).forEach(function (rawLine) {
    const stripped = stripComment(rawLine).replace(/\s+$/, "");
    if (stripped.trim() === "") return;

    const indent = stripped.length - stripped.replace(/^ */, "").length;
    let content = stripped.slice(indent);
    let isItem = false;
    if (content === "-") {
      isItem = true;
      content = "";
    } else if (content.slice(0, 2) === "- ") {
      isItem = true;
      content = content.slice(2);
    }
    lines.push({ indent: indent, isItem: isItem, content: content });
  });
  return lines;
}

// Cuts a raw line at the first unquoted "#" (a comment runs to end of
// line). Quote-tracking is simple single-line toggling, matching the "no
// multiline scalars" limitation documented above.
function stripComment(rawLine) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < rawLine.length; i++) {
    const ch = rawLine[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "#" && !inSingle && !inDouble) return rawLine.slice(0, i);
  }
  return rawLine;
}

// Finds the "key" / "value" split point in a line's content: a colon
// that's either followed by a space or is the last character (bare
// "key:"), ignoring colons inside quotes (so "url: https://..." is safe).
// Returns -1 if the line has no such colon (a bare scalar list item).
function findSeparator(content) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === ":" && !inSingle && !inDouble) {
      if (i + 1 === content.length || content[i + 1] === " ") return i;
    }
  }
  return -1;
}

// Coerces a trimmed scalar token to its JS value.
function parseScalar(raw) {
  if (raw === "" || raw === "null" || raw === "~") return null;
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw.length >= 2 && raw[0] === '"' && raw[raw.length - 1] === '"') {
    return raw.slice(1, -1);
  }
  if (raw.length >= 2 && raw[0] === "'" && raw[raw.length - 1] === "'") {
    return raw.slice(1, -1);
  }
  return raw;
}
