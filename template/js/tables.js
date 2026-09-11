/**
 * ============================================================================
 * TABLES — turns a standard Markdown table into a styled <table> (the
 * `table` block type). Ported near-verbatim from when-rubrics-fail's
 * tables.js (already generic, reused byte-identical across both source
 * repos — see docs/02-comparison-matrix.md). The one change: renderTable()
 * is now called by template/js/blocks.js on a <table> element it just
 * created, not one already sitting in index.html with a data-md-table
 * attribute — so the old loadTables()/querySelectorAll orchestration is
 * dropped; everything else is unchanged. See tasks/04-engine-js-blocks.md.
 *
 * Source format is a standard GFM table:
 *
 *   | Failure mode | Description | Example |
 *   | --- | --- | --- |
 *   | Evidence fabrication | The model cites ... | A recent study ... |
 *
 * Cell formatting: **bold**, *italic*, ~~strikethrough~~, `code` -- the same
 * subset as markdown.js's mdInline, plus strikethrough (tables need it for
 * "superseded value" style examples; block prose hasn't needed it so far).
 * A literal "|" inside a cell must be escaped as "\|".
 * ============================================================================
 */

(function () {
  "use strict";

  // Same inline subset as markdown.js's mdInline, plus ~~strikethrough~~.
  function tableInline(text) {
    let s = escapeHtml(text);
    s = s.replace(/~~(.+?)~~/g, "<s>$1</s>");
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
    s = s.replace(/`(.+?)`/g, "<code>$1</code>");
    return s;
  }

  // Splits one "| a | b |" row into ["a", "b"], honouring "\|" as a literal
  // pipe rather than a column break.
  function splitRow(line) {
    let s = line.trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|")) s = s.slice(0, -1);
    const cells = [];
    let current = "";
    for (let i = 0; i < s.length; i++) {
      if (s[i] === "\\" && s[i + 1] === "|") {
        current += "|";
        i++;
        continue;
      }
      if (s[i] === "|") {
        cells.push(current.trim());
        current = "";
        continue;
      }
      current += s[i];
    }
    cells.push(current.trim());
    return cells;
  }

  // header row, then a "---" separator row, then one data row per line.
  function parseMarkdownTable(raw) {
    const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, "");
    const lines = withoutComments
      .split("\n")
      .map(function (l) { return l.trim(); })
      .filter(function (l) { return l.length > 0; });
    if (lines.length < 2) return null;

    const headers = splitRow(lines[0]);
    const separator = splitRow(lines[1]);
    const looksLikeSeparator = separator.every(function (c) { return /^:?-{1,}:?$/.test(c); });
    if (!looksLikeSeparator) return null;

    const rows = lines.slice(2).map(splitRow);
    return { headers: headers, rows: rows };
  }

  function renderTable(el, markdown) {
    const parsed = parseMarkdownTable(markdown);
    if (!parsed) {
      console.error("tables.js: source doesn't look like a Markdown table (header row + \"---\" row + data rows).");
      return;
    }

    el.classList.add("md-table");
    el.innerHTML = "";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    parsed.headers.forEach(function (h) {
      const th = document.createElement("th");
      th.scope = "col";
      th.innerHTML = tableInline(h);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    el.appendChild(thead);

    const tbody = document.createElement("tbody");
    parsed.rows.forEach(function (cells) {
      const tr = document.createElement("tr");
      cells.forEach(function (cell, i) {
        const td = document.createElement("td");
        if (i === 0) td.className = "md-table-key";
        td.innerHTML = tableInline(cell);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    el.appendChild(tbody);
  }

  // Exposed for blocks.js.
  window.renderMarkdownTable = renderTable;
})();
